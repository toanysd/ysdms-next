'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  Maximize2,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Printer,
  Sparkles,
  Ruler,
} from 'lucide-react';
import { uploadLoanPhoto, deleteLoanPhoto } from '../../actions';
import PlacardModal from './PlacardModal';
import type { EquipmentLoanItem } from '../../types';

interface LoanPhotoCaptureSectionProps {
  loan: EquipmentLoanItem;
  onPhotoUpdated: () => void;
}

export default function LoanPhotoCaptureSection({
  loan,
  onPhotoUpdated,
}: LoanPhotoCaptureSectionProps) {
  const [uploadingType, setUploadingType] = useState<'overall' | 'nameplate' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);
  const [isPlacardOpen, setIsPlacardOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const overallInputRef = useRef<HTMLInputElement>(null);
  const nameplateInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    photoType: 'overall' | 'nameplate'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    e.target.value = '';

    setErrorMsg(null);
    setUploadingType(photoType);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadLoanPhoto(loan.loan_id, photoType, formData);
      if (res.success) {
        onPhotoUpdated();
      } else {
        setErrorMsg(res.error || 'Tải ảnh thất bại');
      }
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      setErrorMsg(err.message || 'Lỗi kết nối khi tải ảnh');
    } finally {
      setUploadingType(null);
    }
  };

  const handleDelete = async (photoType: 'overall' | 'nameplate') => {
    const typeLabel = photoType === 'overall' ? 'Ảnh toàn cảnh' : 'Ảnh mác tên/biển';
    if (!confirm(`Bạn có chắc chắn muốn xóa ${typeLabel} không?`)) return;

    setErrorMsg(null);
    try {
      const res = await deleteLoanPhoto(loan.loan_id, photoType);
      if (res.success) {
        onPhotoUpdated();
      } else {
        setErrorMsg(res.error || 'Xóa ảnh thất bại');
      }
    } catch (err: any) {
      console.error('Error deleting photo:', err);
      setErrorMsg(err.message || 'Lỗi khi xóa ảnh');
    }
  };

  return (
    <div className="card-flat p-4 flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded"
            style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
          >
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              固定資産撮影・現品証拠写真 (Asset Audit Photos)
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              J-SOX会計監査基準: メジャー（スケール）及び撮影看板を配置して撮影
            </p>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlacardOpen(true)}
            className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            title="撮影用看板を表示またはA4印刷"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>撮影看板 (Placard)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            title="撮影基準ガイド"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      {showGuide && (
        <div className="p-3 rounded-lg bg-[var(--tint-blue-bg)] border border-blue-200 text-xs flex flex-col gap-1.5 text-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Ruler className="w-4 h-4 text-blue-600" />
            <span>J-SOX 日本会計監査 撮影基準ガイド:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-700">
            <li>
              <strong>① 全体写真:</strong> Đặt thước cuộn/thước đo (メジャー) chạy dọc mép khuôn và đặt biển Placard hiển thị mã khuôn để chứng minh kích thước thực tế.
            </li>
            <li>
              <strong>② Mác tên & biển Placard:</strong> Chụp cận cảnh rõ nét mác nhôm/khắc số kim loại thể hiện rõ Mã YSD và Tên tài sản khách hàng.
            </li>
          </ul>
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Dual Photo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Photo 1: Overall with Scale */}
        <div className="rounded-lg border border-[var(--border-subtle)] p-3 flex flex-col gap-2 bg-[var(--bg-canvas)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                ① 全体写真 (スケール・メジャー付)
              </span>
            </div>
            {loan.photo_overall_url && (
              <span className="badge badge--success text-[10px] inline-flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                登録済
              </span>
            )}
          </div>

          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Ảnh toàn cảnh khuôn kèm thước đo kích thước và biển tên
          </p>

          {/* Photo Display / Upload Area */}
          {loan.photo_overall_url ? (
            <div className="relative group rounded-md overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
              <img
                src={loan.photo_overall_url}
                alt="Overall Mold View"
                className="w-full h-full object-cover"
              />
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewZoomUrl(loan.photo_overall_url)}
                  className="p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow"
                  title="拡大表示"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => overallInputRef.current?.click()}
                  className="p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow"
                  title="再撮影 / 変更"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('overall')}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => overallInputRef.current?.click()}
              className="rounded-md border-2 border-dashed border-slate-300 hover:border-[var(--accent)] hover:bg-slate-50 transition-colors cursor-pointer aspect-video flex flex-col items-center justify-center gap-2 text-slate-500 p-4"
            >
              {uploadingType === 'overall' ? (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Đang tải ảnh toàn cảnh...</span>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-slate-100 text-slate-600">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold block text-slate-800">
                      撮影またはファイル選択
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Mobile: Mở camera trực tiếp / Desktop: Chọn ảnh
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={overallInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileChange(e, 'overall')}
          />
        </div>

        {/* Photo 2: Nameplate / Placard Close-up */}
        <div className="rounded-lg border border-[var(--border-subtle)] p-3 flex flex-col gap-2 bg-[var(--bg-canvas)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                ② 銘板・刻印・看板 (Close-up)
              </span>
            </div>
            {loan.photo_nameplate_url && (
              <span className="badge badge--success text-[10px] inline-flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                登録済
              </span>
            )}
          </div>

          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Ảnh cận cảnh mác tên, mác kim loại khắc số hoặc biển Placard
          </p>

          {/* Photo Display / Upload Area */}
          {loan.photo_nameplate_url ? (
            <div className="relative group rounded-md overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
              <img
                src={loan.photo_nameplate_url}
                alt="Nameplate View"
                className="w-full h-full object-cover"
              />
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewZoomUrl(loan.photo_nameplate_url)}
                  className="p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow"
                  title="拡大表示"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => nameplateInputRef.current?.click()}
                  className="p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow"
                  title="再撮影 / 変更"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('nameplate')}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => nameplateInputRef.current?.click()}
              className="rounded-md border-2 border-dashed border-slate-300 hover:border-[var(--accent)] hover:bg-slate-50 transition-colors cursor-pointer aspect-video flex flex-col items-center justify-center gap-2 text-slate-500 p-4"
            >
              {uploadingType === 'nameplate' ? (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Đang tải ảnh mác tên...</span>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-slate-100 text-slate-600">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold block text-slate-800">
                      撮影またはファイル選択
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Mobile: Mở camera trực tiếp / Desktop: Chọn ảnh
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={nameplateInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileChange(e, 'nameplate')}
          />
        </div>
      </div>

      {/* Placard Modal Popup */}
      <PlacardModal
        loan={loan}
        isOpen={isPlacardOpen}
        onClose={() => setIsPlacardOpen(false)}
      />

      {/* Fullscreen Photo Zoom Modal */}
      {previewZoomUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setPreviewZoomUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg">
            <button
              onClick={() => setPreviewZoomUrl(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
              aria-label="Close Zoom"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewZoomUrl}
              alt="Zoomed Mold Inspection"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
