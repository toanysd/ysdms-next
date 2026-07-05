import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const dir = path.resolve(process.cwd(), 'source_data', 'csv-access-data')
const readFile = (name: string) => parse(fs.readFileSync(path.join(dir, name), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })

const moldMaster = readFile('moldmaster.csv')
const moldDesign = readFile('molddesign.csv')

const accessMasterToCode = new Map()
for(const mm of moldMaster) {
   accessMasterToCode.set(mm.MoldMasterID.toString(), mm.MoldMasterCode)
}

let missing = 0
for(const md of moldDesign) {
   const masterId = md.DesignMasterID?.toString()
   if (!masterId) continue
   if (!accessMasterToCode.has(masterId)) {
      missing++
   }
}

console.log("Total mold designs:", moldDesign.length)
console.log("Missing master IDs:", missing)
console.log("First missing DesignMasterID:", moldDesign.find(md => md.DesignMasterID && !accessMasterToCode.has(md.DesignMasterID.toString()))?.DesignMasterID)
