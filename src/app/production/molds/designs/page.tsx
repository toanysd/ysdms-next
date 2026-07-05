import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function MoldDesignCenterPage() {
  redirect('/production/molds')
}
