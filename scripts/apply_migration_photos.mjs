import fs from 'fs'

// Read env
const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const SUPABASE_URL = envKeys['NEXT_PUBLIC_SUPABASE_URL']
const PROJECT_REF = SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]
console.log('Project ref:', PROJECT_REF)

// Read Supabase access token from CLI config
let accessToken = ''
const homedir = process.env.USERPROFILE || process.env.HOME
const possiblePaths = [
  `${homedir}/AppData/Roaming/supabase/access-token`,
  `${homedir}/.supabase/access-token`,
  `${homedir}/.config/supabase/access-token`
]

for (const p of possiblePaths) {
  try {
    if (fs.existsSync(p)) {
      accessToken = fs.readFileSync(p, 'utf8').trim()
      if (accessToken) break
    }
  } catch (e) {}
}

const sqlContent = fs.readFileSync('supabase/migrations/20260817000000_create_equipment_photos.sql', 'utf8')

async function main() {
  if (!accessToken) {
    console.log('⚠️ No Supabase access token found in local paths.')
    console.log('User can apply supabase/migrations/20260817000000_create_equipment_photos.sql directly in Supabase SQL Editor.')
    return
  }

  console.log('Applying migration via Supabase Management API...')
  const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ query: sqlContent })
  })

  if (!res.ok) {
    const body = await res.text()
    console.log(`❌ Failed: HTTP ${res.status}`)
    console.log(`   ${body.substring(0, 500)}`)
    return
  }

  console.log('✅ Migration 20260817000000_create_equipment_photos.sql APPLIED SUCCESSFULLY!')
}

main().catch(console.error)
