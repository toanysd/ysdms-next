import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const dir = path.resolve(process.cwd(), 'source_data', 'csv-access-data')
const readFile = (name: string) => parse(fs.readFileSync(path.join(dir, name), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })

const molds = readFile('molds.csv')
const trays = readFile('tray.csv')

let moldsSkippedByCode = 0
for (const m of molds) {
    const code = m.MoldCode?.trim() || m.MoldName?.trim()
    if (!code) moldsSkippedByCode++
}

let traysSkippedByCode = 0
for (const t of trays) {
    const code = t.TrayCode?.trim() || t.TrayName?.trim()
    if (!code) traysSkippedByCode++
}
let traysSkippedByMoldTrayName = 0
for (const t of trays) {
    const code = t.MoldTrayName?.trim()
    if (!code) traysSkippedByMoldTrayName++
}

console.log("Molds skipped by code:", moldsSkippedByCode, "out of", molds.length)
console.log("Trays skipped by code:", traysSkippedByCode, "out of", trays.length)
console.log("Trays skipped by MoldTrayName:", traysSkippedByMoldTrayName, "out of", trays.length)
