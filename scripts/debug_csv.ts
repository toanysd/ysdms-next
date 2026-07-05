import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const dir = path.resolve(process.cwd(), 'source_data', 'csv-access-data')
const readFile = (name: string) => parse(fs.readFileSync(path.join(dir, name), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })

const moldMaster = readFile('moldmaster.csv')
const moldDesign = readFile('molddesign.csv')

console.log("moldMaster[0] keys:", Object.keys(moldMaster[0]))
console.log("moldDesign[0] keys:", Object.keys(moldDesign[0]))

const sampleMaster = moldMaster[0]
const sampleDesign = moldDesign[0]

console.log("Sample Master:", { id: sampleMaster.MoldMasterID, code: sampleMaster.MoldMasterCode })
console.log("Sample Design:", { id: sampleDesign.MoldDesignID, master: sampleDesign.DesignMasterID, name: sampleDesign.MoldDesignName })

