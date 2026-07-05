import { Client } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim()]
    })
)

async function run() {
  const client = new Client({
    connectionString: envVars.DATABASE_URL
  })
  
  await client.connect()
  const sql = fs.readFileSync(path.resolve('supabase/migrations/20260627190000_auto_status_triggers.sql'), 'utf-8')
  
  try {
    await client.query(sql)
    console.log("Migration executed successfully")
  } catch (err) {
    console.error("Error executing migration:", err)
  } finally {
    await client.end()
  }
}

run()
