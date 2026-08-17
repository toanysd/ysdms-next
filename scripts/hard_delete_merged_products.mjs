import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function hardDeleteMergedProducts() {
  console.log('🗑️ Bắt đầu Xóa vĩnh viễn các sản phẩm có product_status = MERGED...\n')

  // 1. Check count before deletion
  const { count: countBefore } = await supabase
    .from('products')
    .select('product_id', { count: 'exact', head: true })
    .eq('product_status', 'MERGED')

  console.log(`📌 Số lượng sản phẩm MERGED cần xóa: ${countBefore}`)

  if (!countBefore || countBefore === 0) {
    console.log('✅ Không có sản phẩm nào cần xóa.')
    return
  }

  // 2. Perform deletion
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('product_status', 'MERGED')
    .select('product_id, product_code')

  if (error) {
    console.error('❌ Lỗi khi xóa:', error)
    return
  }

  console.log(`✅ Đã xóa thành công ${data?.length} sản phẩm MERGED vĩnh viễn khỏi Database!`)

  // 3. Verify count after deletion
  const { count: countAfter } = await supabase
    .from('products')
    .select('product_id', { count: 'exact', head: true })
    .eq('product_status', 'MERGED')

  console.log(`📊 Số lượng sản phẩm MERGED còn lại trong DB: ${countAfter}`)
}

hardDeleteMergedProducts().catch(console.error)
