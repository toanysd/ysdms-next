'use client'

import React from 'react'
import { X, MapPin, ClipboardCheck, Sparkles, Printer, Camera, QrCode, Truck, Scale, Trash2, ArrowRightLeft } from 'lucide-react'
import { ActionDialogType, EquipmentDetailData } from './types'
import CheckInOutModule from './modules/CheckInOutModule'
import InventoryAuditModule from './modules/InventoryAuditModule'
import TeflonCoatingModule from './modules/TeflonCoatingModule'
import PrintLabelModule from './modules/PrintLabelModule'
import PhotoManagerModule from './modules/PhotoManagerModule'
import QRCodeViewerModule from './modules/QRCodeViewerModule'
import LocationMoveModule from './modules/LocationMoveModule'
import WeightAuditModule from './modules/WeightAuditModule'
import ScrapDisposalModule from './modules/ScrapDisposalModule'
import TransportModule from './modules/TransportModule'

interface Props {
  activeAction: ActionDialogType
  onCloseAction: () => void
  data: EquipmentDetailData
  onSuccess: () => void
  onSelectAction?: (action: ActionDialogType) => void
}

export default function ActionDialogManager({ activeAction, onCloseAction, data, onSuccess, onSelectAction }: Props) {
  if (!activeAction) return null

  // Dialog Titles & Icons
  const dialogConfig: Record<string, { title: string; icon: any }> = {
    CHECKIN_OUT: { title: '入出庫・返却登録 (Check-in / Check-out)', icon: MapPin },
    INVENTORY_AUDIT: { title: '棚卸実査確認 (Inventory Audit)', icon: ClipboardCheck },
    TEFLON_COATING: { title: 'テフロン再加工履歴 (Teflon Coating)', icon: Sparkles },
    PRINT_LABEL: { title: '設備ラベル・QR印刷 (Print Label)', icon: Printer },
    PHOTO_MANAGER: { title: '写真管理 (Photo Manager)', icon: Camera },
    QR_VIEW: { title: 'QRコード表示 (QR Code View)', icon: QrCode },
    TRANSPORT: { title: '出荷・会社間移動 (Transport / Company Move)', icon: Truck },
    RACK_MOVE: { title: '棚位置変更 (Rack Position Change)', icon: ArrowRightLeft },
    WEIGHT_AUDIT: { title: '実測重量更新 (Weight Audit)', icon: Scale },
    SCRAP_DISPOSAL: { title: '設備廃棄処理 (Scrap / Disposal)', icon: Trash2 }
  }

  const cfg = dialogConfig[activeAction] || { title: 'Thao tác', icon: MapPin }
  const DialogIcon = cfg.icon

  const isWideDialog = activeAction === 'CHECKIN_OUT' || activeAction === 'TEFLON_COATING' || activeAction === 'PHOTO_MANAGER' || activeAction === 'RACK_MOVE' || activeAction === 'TRANSPORT'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
      onClick={onCloseAction}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: isWideDialog ? 1080 : 540,
          height: isWideDialog ? 630 : undefined, maxHeight: '90vh',
          borderRadius: 10, overflow: 'hidden',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--bg-surface-2)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
            <DialogIcon size={18} />
            <span>{cfg.title}</span>
          </div>
          <button
            onClick={onCloseAction}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Dialog Body - Independent Modules */}
        <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeAction === 'CHECKIN_OUT' && (
            <CheckInOutModule
              data={data}
              onClose={onCloseAction}
              onSuccess={onSuccess}
            />
          )}

          {activeAction === 'INVENTORY_AUDIT' && (
            <InventoryAuditModule data={data} onClose={onCloseAction} onSuccess={onSuccess} />
          )}

          {activeAction === 'TEFLON_COATING' && (
            <TeflonCoatingModule
              data={data}
              onClose={onCloseAction}
              onSuccess={onSuccess}
              onRequestRackMove={() => onSelectAction && onSelectAction('RACK_MOVE')}
            />
          )}

          {activeAction === 'PRINT_LABEL' && (
            <PrintLabelModule data={data} onClose={onCloseAction} />
          )}

          {activeAction === 'PHOTO_MANAGER' && (
            <PhotoManagerModule data={data} onClose={onCloseAction} />
          )}

          {activeAction === 'QR_VIEW' && (
            <QRCodeViewerModule data={data} onClose={onCloseAction} />
          )}

          {activeAction === 'TRANSPORT' && (
            <TransportModule data={data} onClose={onCloseAction} onSuccess={onSuccess} />
          )}

          {activeAction === 'RACK_MOVE' && (
            <LocationMoveModule data={data} onClose={onCloseAction} onSuccess={onSuccess} />
          )}

          {activeAction === 'WEIGHT_AUDIT' && (
            <WeightAuditModule data={data} onClose={onCloseAction} onSuccess={onSuccess} />
          )}

          {activeAction === 'SCRAP_DISPOSAL' && (
            <ScrapDisposalModule data={data} onClose={onCloseAction} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </div>
  )
}
