// temp_ai/run_scan.mjs — wrapper để tránh lỗi encoding khi truyền path tiếng Nhật qua PowerShell
import { spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Đường dẫn Server — sửa tại đây nếu cần
const SERVER_PATH = '\\\\SERVER\\ysd-folder\\\u6307\u793a\u66f8' // \\SERVER\ysd-folder\指示書

// Ghi path vào temp file để script chính đọc
const configPath = path.join(__dirname, '_scan_config.json')
fs.writeFileSync(configPath, JSON.stringify({ rootPath: SERVER_PATH }))
console.log('Config written, launching scanner...')

// Import và chạy trực tiếp
const { default: run } = await import('./01_folder_scanner_inner.mjs')
