import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const apiKey = url.searchParams.get('key') || ''

  if (!apiKey) {
    return NextResponse.json({ error: 'Provide ?key=YOUR_API_KEY' }, { status: 400 })
  }

  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro', 
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
  ]

  const results: Record<string, string> = {}

  // First: try listing models
  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    const listJson = await listRes.json()
    if (listRes.ok && Array.isArray(listJson.models)) {
      const available = listJson.models
        .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m: any) => m.name.replace(/^models\//, ''))
      results['_available_models'] = available.join(', ')
    } else {
      results['_list_error'] = JSON.stringify(listJson).slice(0, 300)
    }
  } catch (e: any) {
    results['_list_error'] = e.message
  }

  // Then: try a simple generateContent call on each model
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Say hello in 3 words' }] }]
        })
      })

      if (res.ok) {
        const json = await res.json()
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '(empty)'
        results[model] = `✅ OK: ${text.slice(0, 50)}`
      } else {
        const errText = await res.text()
        results[model] = `❌ ${res.status}: ${errText.slice(0, 200)}`
      }
    } catch (e: any) {
      results[model] = `❌ Error: ${e.message}`
    }
  }

  return NextResponse.json(results, { status: 200 })
}
