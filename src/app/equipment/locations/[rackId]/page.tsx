import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRackDetailWithLayers } from '../actions'
import VisualShelfView from './_components/VisualShelfView'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: {
    rackId: string
  }
}

export default async function RackDetailPage({ params }: Props) {
  const data = await getRackDetailWithLayers(params.rackId)

  if (!data) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-[18px] font-bold text-slate-800 mb-2">ラックが見つかりません / Không tìm thấy giá kệ</h2>
        <p className="text-[13px] text-slate-500 mb-4">
          指定されたラックコードまたはID「{params.rackId}」のデータが存在しません。
        </p>
        <Link href="/equipment/locations" className="btn btn-secondary flex items-center gap-1.5 text-[13px]">
          <ArrowLeft size={14} />
          <span>保管位置一覧へ戻る (Quay lại)</span>
        </Link>
      </div>
    )
  }

  return <VisualShelfView data={data} />
}
