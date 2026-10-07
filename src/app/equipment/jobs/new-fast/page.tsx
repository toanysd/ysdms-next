import { FastJobCreateForm } from '../_components/FastJobCreateForm'

export const metadata = {
  title: 'YSDMS | 新規金型・製作指示書 クイック発行 (1-Stop)',
}

export default function FastToolingJobPage() {
  return (
    <div style={{ padding: '16px 20px', overflowY: 'auto', height: '100%' }}>
      <FastJobCreateForm />
    </div>
  )
}
