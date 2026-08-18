import { NextRequest, NextResponse } from 'next/server'

interface OCRResponseData {
  product_code: string | null
  product_name_internal: string | null
  customer_code_prefix: string | null
  product_description: string | null
  customer_name: string | null
  customer_product_name: string | null
  designer_name: string | null
  sheet_date: string | null
  revision_number: number | null
  design_length: number | null
  design_width: number | null
  design_height: number | null
  design_depth: number | null
  cutline_length: number | null
  cutline_width: number | null
  pieces_per_cycle: number | null
  pocket_count: number | null
  plastic_type_designed: string | null
  plug_type: string | null
  has_separate_cutter: boolean
  corner_r: string | null
  chamfer_c: string | null
  draft_angle: string | null
  tolerance_info: string | null
  packaging_info: string | null
  quotation_attached: string | null
  quotation_amount: number | null
  cost_amount: number | null
  price_quote_required: boolean | null
  shipping_deadline: string | null
  mold_deadline: string | null
  components: Array<{
    type_code: string
    step_name: string
    material_spec: string | null
    arrangement: string
    condition: string
    manufacture_location: string
    deadline: string | null
    estimated_hours: number | null
  }>
  raw_text?: string
}

function parseNum(v: any): number | null {
  if (v == null) return null
  if (typeof v === 'number') return isNaN(v) ? null : v
  if (typeof v === 'string') {
    const cleaned = v.replace(/[^0-9.-]/g, '')
    const n = parseFloat(cleaned)
    return isNaN(n) ? null : n
  }
  return null
}

function parseDateToISO(val: any, defaultYear?: number): string | null {
  if (!val) return null
  const str = String(val).trim()
  if (!str) return null

  const yr = defaultYear || new Date().getFullYear()

  // 1. Japanese Era Reiwa (R8.8.20, R08.8.20, R8/8/20, 令和8年8月20日)
  const reiwaMatch = str.match(/(?:R|令和)\s*(\d+)[.\/年\s]+(\d+)[.\/月\s]+(\d+)/i)
  if (reiwaMatch) {
    const rYear = 2018 + parseInt(reiwaMatch[1], 10)
    const month = String(parseInt(reiwaMatch[2], 10)).padStart(2, '0')
    const day = String(parseInt(reiwaMatch[3], 10)).padStart(2, '0')
    return `${rYear}-${month}-${day}`
  }

  // 2. Japanese Era Heisei (H30.8.20, 平成30年8月20日)
  const heiseiMatch = str.match(/(?:H|平成)\s*(\d+)[.\/年\s]+(\d+)[.\/月\s]+(\d+)/i)
  if (heiseiMatch) {
    const hYear = 1988 + parseInt(heiseiMatch[1], 10)
    const month = String(parseInt(heiseiMatch[2], 10)).padStart(2, '0')
    const day = String(parseInt(heiseiMatch[3], 10)).padStart(2, '0')
    return `${hYear}-${month}-${day}`
  }

  // 3. 4-digit Year format (2026-08-20, 2026/8/20, 2026.8.20, 2026年8月20日)
  const fullMatch = str.match(/(\d{4})[.\-\/年\s]+(\d{1,2})[.\-\/月\s]+(\d{1,2})/)
  if (fullMatch) {
    const y = fullMatch[1]
    const m = String(parseInt(fullMatch[2], 10)).padStart(2, '0')
    const d = String(parseInt(fullMatch[3], 10)).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // 4. Month/Day only format (8/20, 8/20(木), 8.20, 8月20日)
  const mdMatch = str.match(/(\d{1,2})[.\-\/月\s]+(\d{1,2})/)
  if (mdMatch) {
    const m = String(parseInt(mdMatch[1], 10)).padStart(2, '0')
    const d = String(parseInt(mdMatch[2], 10)).padStart(2, '0')
    return `${yr}-${m}-${d}`
  }

  return null
}

function normalizeExtractedData(raw: any): OCRResponseData {
  const src = raw?.data || raw?.sheet || raw?.result || raw?.new_mold_manufacturing_process_sheet || raw?.manufacturing_sheet || raw || {}
  const prod = src.product_information || src.product_info || src.product || {}
  const specs = src.technical_specifications || src.technical_specs || src.specs || src.dimensions || {}
  const componentsRaw = src.components || src.components_and_work_plan || src.job_components || src.processes || raw?.components || []

  const rawCode = src.product_code || prod.product_code || src.model_code || prod.model_code || src.kata_ban || prod.kata_ban || src['型番'] || ''
  const rawInternal = src.product_name_internal || prod.product_name_internal || src.internal_product_name || prod.internal_product_name || rawCode

  let product_code = rawCode ? String(rawCode).trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : null
  let product_name_internal = rawInternal ? String(rawInternal).trim().toUpperCase() : null

  // Extract revision number if embedded in product code (e.g. "TOW-004 R1", "TOW004-R2", "ADY-071 (Rev 3)")
  let revision_number = Number(src.revision_number || prod.revision_number || src.rev || prod.rev || 0) || 0
  
  if (product_name_internal) {
    const revMatch = product_name_internal.match(/(?:[\s\-_(]|^)(?:R|REV\.?|REVISION\s*)(\d+)\)?$/i)
    if (revMatch) {
      if (revision_number === 0) {
        revision_number = parseInt(revMatch[1], 10)
      }
      // Clean base product internal name
      product_name_internal = product_name_internal.replace(/(?:[\s\-_(]|^)(?:R|REV\.?|REVISION\s*)(\d+)\)?$/i, '').trim()
    }
  }

  if (product_name_internal && !product_code) {
    product_code = product_name_internal.replace(/[^A-Z0-9]/g, '')
  }
  if (product_code && !product_name_internal) {
    product_name_internal = product_code
  }
  if (product_code) {
    product_code = product_code.replace(/R\d+$/i, '')
  }

  // Extract customer code prefix from product code (e.g. TOW from TOW-004)
  let customer_code_prefix = src.customer_code_prefix || prod.customer_code_prefix || null
  if (!customer_code_prefix && product_name_internal) {
    const prefixMatch = product_name_internal.match(/^([A-Z]+)/)
    if (prefixMatch) customer_code_prefix = prefixMatch[1]
  }

  const product_description = src.product_description || prod.product_description || src.product_name || prod.product_name || src.description || prod.description || src['品名'] || null
  const customer_name = src.customer_name || prod.customer_name || src.customer || prod.customer || src['得意先'] || null
  const customer_product_name = src.customer_product_name || prod.customer_product_name || src.customer_part_no || prod.customer_part_no || src['客先品番'] || null
  const designer_name = src.designer_name || prod.designer_name || src.designer || prod.designer || src['設計担当'] || null

  const currentYear = new Date().getFullYear()
  const rawSheetDate = src.sheet_date || prod.sheet_date || src.issue_date || prod.date || src['作成日'] || src['発行日'] || null
  const rawShipping = src.shipping_deadline || src['出荷納期'] || null
  const rawMoldDl = src.mold_deadline || src['金型納期'] || null

  const sheet_date = parseDateToISO(rawSheetDate, currentYear)
  const shipping_deadline = parseDateToISO(rawShipping, currentYear)
  const mold_deadline_val = parseDateToISO(rawMoldDl, currentYear)

  const baseYear = (mold_deadline_val ? parseInt(mold_deadline_val.slice(0, 4), 10) : (shipping_deadline ? parseInt(shipping_deadline.slice(0, 4), 10) : currentYear)) || currentYear

  const normalizeComponentDate = (dStr?: any) => {
    if (!dStr) return null
    const iso = parseDateToISO(dStr, baseYear)
    if (!iso) return null
    const m = iso.match(/^(\d{4})-(\d{2}-\d{2})$/)
    if (m && parseInt(m[1], 10) !== baseYear) {
      return `${baseYear}-${m[2]}`
    }
    return iso
  }

  const design_length = parseNum(src.design_length ?? specs.design_length ?? specs.mold_length ?? src.mold_length ?? specs.length ?? src.length)
  const design_width = parseNum(src.design_width ?? specs.design_width ?? specs.mold_width ?? src.mold_width ?? specs.width ?? src.width)
  const design_height = parseNum(src.design_height ?? specs.design_height ?? specs.mold_height ?? src.mold_height ?? specs.height ?? src.height)
  const design_depth = parseNum(src.design_depth ?? specs.design_depth ?? specs.depth ?? src.depth ?? specs['絞り深さ'] ?? src['絞り深さ'])
  const cutline_length = parseNum(src.cutline_length ?? specs.cutline_length ?? specs.product_length ?? src.product_length ?? specs['抜寸法_長'] ?? src['抜寸法_長'])
  const cutline_width = parseNum(src.cutline_width ?? specs.cutline_width ?? specs.product_width ?? src.product_width ?? specs['抜寸法_幅'] ?? src['抜寸法_幅'])

  // pieces_per_cycle (取数) — NOT cavity/pocket
  const pieces_per_cycle = parseNum(
    src.pieces_per_cycle ?? specs.pieces_per_cycle ??
    src.cavity_count ?? specs.cavity_count ?? specs.cavities ?? src.cavities ??
    src['取数'] ?? specs['取数']
  )
  // pocket_count — separate from pieces_per_cycle
  const pocket_count = parseNum(
    src.pocket_count ?? specs.pocket_count ?? src.pockets ?? specs.pockets ??
    src['ポケット数'] ?? specs['ポケット数']
  )

  const plastic_type_designed = src.plastic_type_designed || specs.plastic_type_designed || src.material || specs.material || src.plastic_type || specs.plastic_type || src['材質'] || null
  const plug_type = src.plug_type || specs.plug_type || src.plug || specs.plug || src['プラグ仕様'] || null
  
  const rawSeparate = src.has_separate_cutter ?? specs.has_separate_cutter ?? src.separate_cutting ?? specs.separate_cutting ?? src['別抜き']
  const has_separate_cutter = rawSeparate === true || rawSeparate === 'true' || rawSeparate === '有' || rawSeparate === 'YES' || rawSeparate === 1

  const corner_r = src.corner_r || specs.corner_r || src['コーナーR'] || null
  const chamfer_c = src.chamfer_c || specs.chamfer_c || src['面取りC'] || null
  const draft_angle = src.draft_angle || specs.draft_angle || src['勾配'] || null

  // New fields
  const tolerance_info = src.tolerance_info || specs.tolerance_info || src['公差'] || specs['寸法公差'] || null
  const packaging_info = src.packaging_info || specs.packaging_info || src['荷姿'] || src['梱包'] || null
  const cost_amount = parseNum(src.cost_amount ?? src['原価'])
  const quotation_attached = src.quotation_attached || src['見積添付'] || src.price_quote_required || src['見積要'] || null

  const components = Array.isArray(componentsRaw) ? componentsRaw.map((c: any) => {
    const typeCode = (c.type_code || c.type || 'MOLD').toUpperCase()
    // Standard YSD business rule:
    // WATER_BASE, FRAME, PRESSURE_BASE, STACKING are shared assets by CAV standard -> default to EXISTING
    // MOLD and CUTTER are project-specific -> default to NEW
    const isSharedType = ['WATER_BASE', 'FRAME', 'PRESSURE_BASE', 'STACKING'].includes(typeCode)
    const rawCond = String(c.condition || '').toUpperCase()
    let condition = isSharedType ? 'EXISTING' : 'NEW'
    if (rawCond === 'NEW' || rawCond === '新規' || rawCond === '新') condition = 'NEW'
    else if (rawCond === 'EXISTING' || rawCond === '既存' || rawCond === '有' || rawCond === '流用') condition = 'EXISTING'

    return {
      type_code: typeCode,
      step_name: c.step_name || c.name || c.item_name || (typeCode === 'MOLD' ? '本型' : typeCode === 'CUTTER' ? '抜型' : typeCode === 'WATER_BASE' ? '水冷盤' : typeCode === 'FRAME' ? 'フレーム' : typeCode),
      material_spec: c.material_spec || c.material || null,
      arrangement: (c.arrangement === 'NOT_REQUIRED' || c.arrangement === '不要') ? 'NOT_REQUIRED' : 'REQUIRED',
      condition,
      manufacture_location: (c.manufacture_location === 'OUTSOURCED' || c.manufacture_location === '外注') ? 'OUTSOURCED' : 'IN_HOUSE',
      deadline: normalizeComponentDate(c.deadline) || null,
      estimated_hours: parseNum(c.estimated_hours || c.hours)
    }
  }) : []

  return {
    product_code: product_code || null,
    product_name_internal: product_name_internal || null,
    customer_code_prefix: customer_code_prefix || null,
    product_description: product_description || null,
    customer_name: customer_name || null,
    customer_product_name: customer_product_name || null,
    designer_name: designer_name || null,
    sheet_date: sheet_date || null,
    revision_number: revision_number ?? 0,
    design_length,
    design_width,
    design_height,
    design_depth,
    cutline_length,
    cutline_width,
    pieces_per_cycle,
    pocket_count,
    plastic_type_designed,
    plug_type,
    has_separate_cutter,
    corner_r,
    chamfer_c,
    draft_angle,
    tolerance_info: tolerance_info ? String(tolerance_info) : null,
    packaging_info: packaging_info ? String(packaging_info) : null,
    quotation_attached: quotation_attached ? String(quotation_attached) : null,
    quotation_amount: null,
    cost_amount,
    price_quote_required: quotation_attached ? ['有', '要', '✓', 'true', '添付済'].includes(String(quotation_attached).trim()) : null,
    shipping_deadline: shipping_deadline || null,
    mold_deadline: mold_deadline_val || null,
    components
  }
}

export async function POST(request: NextRequest) {
  try {
    let base64Image = ''
    let mimeType = 'image/jpeg'
    let customApiKey = request.headers.get('x-gemini-key') || ''
    let requestedModel = 'gemini-2.5-flash'

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      const keyFromForm = formData.get('apiKey') as string | null
      const modelFromForm = formData.get('model') as string | null
      if (keyFromForm) customApiKey = keyFromForm
      if (modelFromForm) requestedModel = modelFromForm

      if (!file) {
        return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
      }

      mimeType = file.type || 'image/jpeg'
      const arrayBuffer = await file.arrayBuffer()
      base64Image = Buffer.from(arrayBuffer).toString('base64')
    } else {
      const body = await request.json()
      base64Image = body.imageBase64 || ''
      mimeType = body.mimeType || 'image/jpeg'
      if (body.apiKey) customApiKey = body.apiKey
      if (body.model) requestedModel = body.model
    }

    if (!base64Image) {
      return NextResponse.json({ error: 'Image data is empty' }, { status: 400 })
    }

    const apiKey = customApiKey || process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GOOGLE_GEMINI_API_KEY is not configured. Please provide an API key in settings or .env.local.'
        },
        { status: 401 }
      )
    }

    const systemPrompt = `You are an expert AI OCR system for YSD (ヨシダパッケージ, Japanese plastic thermoforming tray manufacturer).
Extract ALL fields accurately from this Japanese "新規金型製造工程票" (New Mold Manufacturing Process Sheet).

Carefully read handwriting and stamp seals across the document:

1. Product Header:
   - 型番 (Model code): Extract product_name_internal (e.g. "TOW-009", "JAE-036") and product_code (compact without hyphens: "TOW009", "JAE036").
   - customer_code_prefix: The alphabetic prefix of the model code (e.g. "TOW" from "TOW-004", "JAE" from "JAE-036"). This is the customer company code.
   - 品名 (Description/Name of tray): product_description (e.g. "VARANUS向け 梱包 トレイ 321×254 10個入", "リード板").
   - 得意先 (Customer company): customer_name.
   - 客先品番 (Customer Part No): customer_product_name.
   - 作成日 / 発行日: sheet_date (YYYY-MM-DD).
   - 設計担当: designer_name.
   - Rev / 版数: revision_number (number, default 0). Default is STRICTLY 0 (first initial edition / 初版, no suffix). Only set to 1, 2, 3 if the sheet explicitly states "R1", "R2", "Rev.1", "改修1", etc.

2. Technical Specs:
   - 型寸法 (Mold Dimensions in mm): design_length, design_width, design_depth.
   - 抜寸法 / 製品寸法 (Cutline/Product Dimensions in mm): cutline_length, cutline_width.
   - 取数 (Pieces per mold cycle / 取り数): pieces_per_cycle (integer, e.g. 2 = 2 trays per press cycle). NOT pocket count.
   - ポケット数 (Pocket count per tray): pocket_count (integer, number of compartments in one tray).
   - 材質 (Plastic Material): plastic_type_designed (e.g. "PP ナチュラル 0.8mm [640] 帯電防止付 シリコン無"). Copy exact text.
   - プラグ仕様 (Plug Type): plug_type (e.g. "ベニヤ木板", "なし").
   - 別抜き (Separate cutting): has_separate_cutter (boolean: true if 有/別抜き, false if 無/インライン).
   - コーナーR: corner_r (e.g. "R5").
   - 面取りC: chamfer_c (e.g. "C2").
   - 勾配: draft_angle (e.g. "5°").
   - 公差 / 寸法公差: tolerance_info (any tolerance specifications found).
   - 荷姿 / 梱包: packaging_info (packaging specifications, box spec, pieces per box).

3. Cost & Quotation (見積添付・原価):
   - 見積添付 (Quotation Attached): quotation_attached (e.g. "有", "無", "✓", "添付済" or null). Note: This is an attachment/check status, NOT an amount!
   - 原価 (Cost / Quoted Unit Price): cost_amount (number or null, e.g. 84.7). This is the quoted unit price in yen.

4. Deadlines (納期):
   - CRITICAL: Carefully distinguish the 3 different types of dates on the sheet:
     a) 出荷納期 (Shipping/Trial deadline): shipping_deadline (e.g. 8/28 -> YYYY-08-28). Located in 成形/出荷 section or top summary.
     b) 金型納期 / 本型納期 (Final mold completion deadline): mold_deadline (e.g. 8/26 -> YYYY-08-26). Located in 金型製造 section.
     c) 手配納期 / 材料納期 (Component material procurement dates in the 手配 table):
        - Look at each row in the 手配 (Arrangement/Procurement) section:
        - Example: "8/6(木)" means August 6th (YYYY-08-06).
        - DO NOT confuse handwritten "8/6" (single digit 6 after slash) with "8/26" (Aug 26)!
        - Put this exact individual material date (e.g. 8/6) on each component's deadline field.

5. Components & Work Plan:
   Extract each component row from the table (本型 MOLD, プラグ PLUG, 抜型 CUTTER, 水冷盤 WATER_BASE, フレーム FRAME, スタッキング STACKING, 圧空盤 PRESSURE_BASE).
   NOTE ON CONDITIONS:
   - 本型 (MOLD) and 抜型 (CUTTER) default to condition: "NEW" (新規) unless marked 流用/既存.
   - 水冷盤 (WATER_BASE), フレーム (FRAME), 圧空盤 (PRESSURE_BASE), スタッキング (STACKING) are shared CAV standards -> default to condition: "EXISTING" (流用/既存/有) unless explicitly marked 新規/新.
   For EACH component extract ALL of these:
   - type_code: 'MOLD', 'PLUG', 'CUTTER', 'WATER_BASE', 'FRAME', 'STACKING', 'PRESSURE_BASE'
   - step_name: Name of the component (e.g. "本型(アルミ材)", "プラグ", "カッター", "フレーム", "水冷盤")
   - material_spec: Material (e.g. "アルミ材", "SKD11", "ベニヤ12mm")
   - arrangement: "REQUIRED" if 要, "NOT_REQUIRED" if 不要
   - condition: "NEW" if 新規/新, "EXISTING" if 既存/有/流用
   - manufacture_location: "IN_HOUSE" if 内製, "OUTSOURCED" if 外注
   - deadline: Component-specific material/procurement date from the 手配 table (e.g. "YYYY-08-06" for 8/6, NOT the 8/26 mold deadline)
   - estimated_hours: Estimated hours (number or null)

Respond ONLY with a valid JSON object:
{
  "product_code": "TOW004",
  "product_name_internal": "TOW-004",
  "customer_code_prefix": "TOW",
  "product_description": "品名テキスト",
  "customer_name": "得意先名",
  "customer_product_name": null,
  "designer_name": null,
  "sheet_date": null,
  "revision_number": 0,
  "design_length": 590,
  "design_width": 350,
  "design_depth": null,
  "cutline_length": 321,
  "cutline_width": 254,
  "pieces_per_cycle": 2,
  "pocket_count": 10,
  "plastic_type_designed": "PP ナチュラル 0.8mm [640] 帯電防止付 シリコン無",
  "plug_type": null,
  "has_separate_cutter": false,
  "corner_r": null,
  "chamfer_c": null,
  "draft_angle": null,
  "tolerance_info": null,
  "packaging_info": null,
  "quotation_attached": "有",
  "cost_amount": 84.7,
  "shipping_deadline": null,
  "mold_deadline": null,
  "components": [
    {
      "type_code": "MOLD",
      "step_name": "本型(アルミ材)",
      "material_spec": "アルミ材",
      "arrangement": "REQUIRED",
      "condition": "NEW",
      "manufacture_location": "IN_HOUSE",
      "deadline": null,
      "estimated_hours": null
    }
  ]
}`

    const promptPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    }

    // Direct fast sequence — models verified via ListModels API (Aug 2026)
    const modelCandidates = Array.from(
      new Set([requestedModel, 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest', 'gemini-3.5-flash'])
    )

    let lastError = ''
    let parsedData: OCRResponseData | null = null
    let successfulModel = ''

    for (const model of modelCandidates) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promptPayload)
        })

        if (!response.ok) {
          const errorText = await response.text()
          lastError = `Model ${model} failed (${response.status}): ${errorText}`
          console.warn(lastError)
          continue
        }

        const result = await response.json()
        let rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
        rawText = rawText.replace(/```json\s*|\s*```/gi, '').trim()

        try {
          const rawParsed = JSON.parse(rawText)
          parsedData = normalizeExtractedData(rawParsed)
          successfulModel = model
          break
        } catch (parseErr) {
          lastError = `Failed to parse JSON response from ${model}: ${rawText.slice(0, 200)}`
          console.warn(lastError)
        }
      } catch (callErr: any) {
        lastError = `Call error on ${model}: ${callErr.message}`
        console.warn(lastError)
      }
    }

    if (!parsedData) {
      return NextResponse.json(
        { error: `Tất cả các model Gemini đều không phản hồi thành công. Lỗi gần nhất: ${lastError}` },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      modelUsed: successfulModel,
      data: parsedData
    })
  } catch (err: any) {
    console.error('OCR Extract API Route Error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
