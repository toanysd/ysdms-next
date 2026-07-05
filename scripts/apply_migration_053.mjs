import fs from 'fs'

// Read env
const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const SUPABASE_URL = envKeys['NEXT_PUBLIC_SUPABASE_URL']

// Extract project ref from URL
const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1]
console.log('Project ref:', PROJECT_REF)

// Read Supabase access token from CLI config
let accessToken = ''
try {
    const homedir = process.env.USERPROFILE || process.env.HOME
    const tokenPath = `${homedir}/AppData/Roaming/supabase/access-token`
    accessToken = fs.readFileSync(tokenPath, 'utf8').trim()
} catch (e) {
    try {
        const homedir = process.env.USERPROFILE || process.env.HOME
        const configPath = `${homedir}/.supabase/access-token`
        accessToken = fs.readFileSync(configPath, 'utf8').trim()
    } catch (e2) {
        console.log('❌ Cannot find Supabase access token.')
        process.exit(1)
    }
}

const sqlContent = fs.readFileSync('supabase/migrations/20260509_053_add_mold_job_processes.sql', 'utf8')

async function applyViaMgmtAPI() {
    console.log(`\n═══════════════════════════════════════════`)
    console.log(`  APPLYING MIGRATION 053 via Management API`)
    console.log(`═══════════════════════════════════════════\n`)
    
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
    
    const result = await res.json()
    console.log('✅ MIGRATION 053 APPLIED SUCCESSFULLY!')
    console.log('Result:', JSON.stringify(result).substring(0, 500))
}

applyViaMgmtAPI()
