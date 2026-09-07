'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import jsQR from 'jsqr'
import {
  Camera,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  Grid3X3,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

class AudioFeedback {
  private ctx: AudioContext | null = null

  private getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  playBeep(type: 'normal' | 'match' | 'error' = 'normal') {
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'match') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15)
        gain.gain.setValueAtTime(0.18, now)
        gain.gain.linearRampToValueAtTime(0, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
      } else if (type === 'error') {
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(300, now)
        osc.frequency.linearRampToValueAtTime(150, now + 0.15)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.linearRampToValueAtTime(0, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1200, now)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.linearRampToValueAtTime(0, now + 0.08)
        osc.start(now)
        osc.stop(now + 0.08)
      }
    } catch {
      // Audio might fail in unsupported browsers
    }
  }
}

const audioFeedback = new AudioFeedback()

export interface CameraARScannerProps {
  onScan: (payload: string, zoneIndex: number, corners: { x: number; y: number }[]) => void
  targetCode?: string | null
  isMatched?: boolean
  isUnknown?: boolean
  active?: boolean
  isPaused?: boolean
  showGrid?: boolean
  onToggleGrid?: () => void
}

export default function CameraARScanner({
  onScan,
  targetCode = null,
  isMatched = false,
  isUnknown = false,
  active = true,
  isPaused = false,
  showGrid = true,
  onToggleGrid,
}: CameraARScannerProps) {
  const t = useTranslations('EquipmentLocations.scanner')

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const isDecodingRef = useRef(false)
  const animFrameIdRef = useRef<number | null>(null)
  const timerIdRef = useRef<NodeJS.Timeout | null>(null)
  const lastScannedPayloadRef = useRef<string | null>(null)
  const lastScanTimestampRef = useRef<number>(0)

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [hasTorch, setHasTorch] = useState(false)
  const [isTorchOn, setIsTorchOn] = useState(false)
  const [activeZone, setActiveZone] = useState<number | null>(null)

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    // Stop old stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    try {
      setCameraError(null)
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true')
        await videoRef.current.play()
      }

      setHasCameraPermission(true)

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        const capabilities: any = videoTrack.getCapabilities?.() || {}
        setHasTorch(Boolean(capabilities.torch))
      }
    } catch (err: any) {
      console.error('Camera initialization failed:', err)
      setHasCameraPermission(false)
      setCameraError(err.message || t('cameraError'))
    }
  }, [facingMode, t])

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current)
      animFrameIdRef.current = null
    }
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
      timerIdRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    isDecodingRef.current = false
  }, [])

  // Toggle Torch
  const toggleTorch = async () => {
    if (!streamRef.current) return
    const videoTrack = streamRef.current.getVideoTracks()[0]
    if (videoTrack && hasTorch) {
      try {
        const nextState = !isTorchOn
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: nextState }],
        })
        setIsTorchOn(nextState)
      } catch (err) {
        console.warn('Failed to toggle torch:', err)
      }
    }
  }

  // Switch Facing Mode
  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
  }

  // Initialize camera when active changes
  useEffect(() => {
    if (active) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [active, startCamera, stopCamera])

  // Decoding & Canvas AR loop with ~70ms throttling
  useEffect(() => {
    if (!active || isPaused) return

    let isMounted = true

    const drawGridHUD = (ctx: CanvasRenderingContext2D, width: number, height: number, currentZone: number | null) => {
      if (!showGrid) return

      const cellW = width / 2
      const cellH = height / 3

      const zoneNames = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

      ctx.save()
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])

      // Vertical line
      ctx.beginPath()
      ctx.moveTo(cellW, 0)
      ctx.lineTo(cellW, height)
      ctx.stroke()

      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(0, cellH)
      ctx.lineTo(width, cellH)
      ctx.moveTo(0, cellH * 2)
      ctx.lineTo(width, cellH * 2)
      ctx.stroke()

      // Labels and Highlight
      for (let i = 0; i < 6; i++) {
        const col = i % 2
        const row = Math.floor(i / 2)
        const x = col * cellW
        const y = row * cellH

        const isHighlight = currentZone === i

        if (isHighlight) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.12)'
          ctx.fillRect(x, y, cellW, cellH)

          ctx.setLineDash([])
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)'
          ctx.lineWidth = 2
          ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4)
        }

        // Zone Badge
        ctx.fillStyle = isHighlight ? '#06B6D4' : 'rgba(148, 163, 184, 0.5)'
        ctx.font = 'bold 12px monospace'
        ctx.fillText(zoneNames[i], x + 10, y + 20)
      }

      ctx.restore()
    }

    const drawDetectedPolygon = (
      ctx: CanvasRenderingContext2D,
      corners: { x: number; y: number }[],
      color: string,
      glowColor: string
    ) => {
      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 16

      // Polygon
      ctx.beginPath()
      ctx.moveTo(corners[0].x, corners[0].y)
      for (let i = 1; i < corners.length; i++) {
        ctx.lineTo(corners[i].x, corners[i].y)
      }
      ctx.closePath()
      ctx.stroke()

      // Fill transparent tint
      ctx.fillStyle = glowColor.replace('0.6', '0.15').replace('0.8', '0.15')
      ctx.fill()

      // Corner Reticles
      const markerSize = 14
      ctx.lineWidth = 4
      corners.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, markerSize / 2, 0, 2 * Math.PI)
        ctx.stroke()
      })

      ctx.restore()
    }

    const tick = () => {
      if (!isMounted) return

      const video = videoRef.current
      const canvas = canvasRef.current

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        // Sync dimensions
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Only decode if not already busy
          if (!isDecodingRef.current) {
            isDecodingRef.current = true

            // Throttled decode execution (~70ms)
            timerIdRef.current = setTimeout(() => {
              try {
                if (!video || !isMounted) return

                const w = canvas.width
                const h = canvas.height
                if (w > 0 && h > 0) {
                  // Draw frame to grab image data
                  const offscreenCanvas = document.createElement('canvas')
                  offscreenCanvas.width = w
                  offscreenCanvas.height = h
                  const offCtx = offscreenCanvas.getContext('2d')

                  if (offCtx) {
                    offCtx.drawImage(video, 0, 0, w, h)
                    const imgData = offCtx.getImageData(0, 0, w, h)
                    const qrResult = jsQR(imgData.data, w, h, {
                      inversionAttempts: 'dontInvert',
                    })

                    if (qrResult && qrResult.data) {
                      const corners = [
                        qrResult.location.topLeftCorner,
                        qrResult.location.topRightCorner,
                        qrResult.location.bottomRightCorner,
                        qrResult.location.bottomLeftCorner,
                      ]

                      // Calculate center
                      const cx = (corners[0].x + corners[2].x) / 2
                      const cy = (corners[0].y + corners[2].y) / 2

                      // Determine 6-zone matrix index (0 to 5)
                      const col = cx < w / 2 ? 0 : 1
                      const row = cy < h / 3 ? 0 : cy < (2 * h) / 3 ? 1 : 2
                      const zoneIdx = row * 2 + col

                      setActiveZone(zoneIdx)

                      // Determine colors according to PE rule:
                      // Emerald Glow (#10B981) for MATCH FOUND, Red (#EF4444) for unknown, Neon Teal (#06B6D4) for normal
                      let boxColor = '#06B6D4'
                      let glowColor = 'rgba(6, 182, 212, 0.6)'
                      let soundType: 'normal' | 'match' | 'error' = 'normal'

                      const isMatch =
                        targetCode &&
                        qrResult.data.toLowerCase().includes(targetCode.toLowerCase().trim())

                      if (isMatch || isMatched) {
                        boxColor = '#10B981'
                        glowColor = 'rgba(16, 185, 129, 0.7)'
                        soundType = 'match'
                      } else if (isUnknown) {
                        boxColor = '#EF4444'
                        glowColor = 'rgba(239, 68, 68, 0.7)'
                        soundType = 'error'
                      }

                      drawDetectedPolygon(ctx, corners, boxColor, glowColor)

                      // Debounce audio & onScan to avoid sound explosion
                      const now = Date.now()
                      if (
                        qrResult.data !== lastScannedPayloadRef.current ||
                        now - lastScanTimestampRef.current > 1500
                      ) {
                        lastScannedPayloadRef.current = qrResult.data
                        lastScanTimestampRef.current = now

                        audioFeedback.playBeep(soundType)
                        if (typeof navigator !== 'undefined' && navigator.vibrate) {
                          navigator.vibrate(50)
                        }

                        onScan(qrResult.data, zoneIdx, corners)
                      }
                    } else {
                      setActiveZone(null)
                    }
                  }
                }
              } catch (err) {
                console.error('Frame decode error:', err)
              } finally {
                isDecodingRef.current = false
              }
            }, 70)
          }

          // Draw HUD Grid
          drawGridHUD(ctx, canvas.width, canvas.height, activeZone)
        }
      }

      animFrameIdRef.current = requestAnimationFrame(tick)
    }

    animFrameIdRef.current = requestAnimationFrame(tick)

    return () => {
      isMounted = false
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
      isDecodingRef.current = false
    }
  }, [active, isPaused, showGrid, targetCode, isMatched, isUnknown, onScan, activeZone])

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center select-none">
      {/* Hidden/Active Video Feed */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        autoPlay
      />

      {/* AR Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
      />

      {/* Viewfinder Center Reticle (when not detected) */}
      {!activeZone && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-56 h-56 border-2 border-teal-500/30 border-dashed rounded-xl relative flex flex-col items-center justify-center">
            {/* 4 Corner Markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-teal-400" />

            <div className="text-center px-4">
              <Sparkles size={24} className="text-teal-400/60 mx-auto mb-2 animate-pulse" />
              <p className="text-[11px] font-mono text-teal-300/80 font-medium">
                {t('scanningHint')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Floating Bar: Controls & Zone Indicator */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto z-30">
        <div className="flex items-center gap-2">
          {activeZone !== null ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-950/80 text-teal-400 border border-teal-600/50 backdrop-blur-md shadow-lg">
              <CheckCircle2 size={13} className="text-teal-400 animate-pulse" />
              <span>{t('zoneTitle', { zone: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'][activeZone] })}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
              <Camera size={12} className="text-teal-400" />
              <span>AR Live</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-full border border-slate-700/60 backdrop-blur-md shadow-lg">
          {/* Torch toggle */}
          {hasTorch && (
            <button
              type="button"
              onClick={toggleTorch}
              className={`p-1.5 rounded-full transition-colors ${
                isTorchOn
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isTorchOn ? t('flashOff') : t('flashOn')}
            >
              {isTorchOn ? <Flashlight size={15} /> : <FlashlightOff size={15} />}
            </button>
          )}

          {/* Switch Camera */}
          <button
            type="button"
            onClick={switchCamera}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={t('switchCamera')}
          >
            <RotateCcw size={15} />
          </button>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={onToggleGrid}
            className={`p-1.5 rounded-full transition-colors ${
              showGrid
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={t('gridToggle')}
          >
            <Grid3X3 size={15} />
          </button>
        </div>
      </div>

      {/* Permission / Error State */}
      {hasCameraPermission === false && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3 border border-red-500/30">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">{t('cameraError')}</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            {cameraError || t('cameraError')}
          </p>
          <button
            type="button"
            onClick={startCamera}
            className="btn btn-primary text-xs py-1.5 px-4"
          >
            {t('startCamera')}
          </button>
        </div>
      )}
    </div>
  )
}
