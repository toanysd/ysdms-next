// @ts-nocheck
import { Client } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim()]
    })
)

const url = envVars['DATABASE_URL'] || process.env.DATABASE_URL
if (!url) {
  console.log("No DATABASE_URL found. Please run this script with it.")
  process.exit(1)
}

async function main() {
  const client = new Client({ connectionString: url })
  await client.connect()
  const sql = fs.readFileSync(path.resolve(process.cwd(), 'supabase', 'migrations', '20260512_055_expand_mold_design_and_product.sql'), 'utf-8')
  await client.query(sql)
  console.log("Migration 055 applied!")
  await client.end()
}
main()
