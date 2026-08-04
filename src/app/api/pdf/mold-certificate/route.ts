import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const moldId = searchParams.get('mold_id')

  if (!moldId) {
    return NextResponse.json({ error: 'Missing mold_id' }, { status: 400 })
  }

  // Instead of dynamically building PDF via a complex library right now,
  // we return a simple HTML page that the user can print (Ctrl+P) as PDF.
  // This is a standard and robust approach for complex layouts like the Japanese certificate.

  const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>金型使用開始証明書 / 金型預かり証</title>
      <style>
        body { font-family: 'MS Mincho', 'Mincho', serif; padding: 40px; margin: 0; color: #000; background: #fff; }
        .header { text-align: center; margin-bottom: 40px; }
        .title { font-size: 24px; font-weight: bold; border-bottom: 2px solid #000; display: inline-block; padding-bottom: 5px; margin-bottom: 20px; }
        .date { text-align: right; margin-bottom: 20px; }
        .to-company { font-size: 18px; margin-bottom: 30px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th, .table td { border: 1px solid #000; padding: 10px; text-align: left; }
        .table th { background: #f0f0f0; width: 30%; }
        .signature-box { margin-top: 50px; text-align: right; }
        .signature-table { display: inline-block; border-collapse: collapse; }
        .signature-table td { border: 1px solid #000; width: 80px; height: 80px; text-align: center; vertical-align: top; padding-top: 5px; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <button onclick="window.print()" style="position: absolute; top: 20px; right: 20px; padding: 10px 20px; font-size: 14px; cursor: pointer;">Print to PDF</button>
      
      <div class="date">令和 年 月 日</div>
      <div class="to-company">株式会社 山田様</div>
      
      <div class="header">
        <div class="title">金型預かり証</div>
      </div>
      
      <p>下記の金型を確かにお預かりいたしました。</p>
      
      <table class="table">
        <tr>
          <th>金型名称</th>
          <td><strong>SMK-225 (Mock)</strong></td>
        </tr>
        <tr>
          <th>製品名称</th>
          <td>SMK-225</td>
        </tr>
        <tr>
          <th>管理番号</th>
          <td>${moldId}</td>
        </tr>
        <tr>
          <th>数量</th>
          <td>1 面</td>
        </tr>
        <tr>
          <th>状態</th>
          <td>良好</td>
        </tr>
      </table>

      <div class="signature-box">
        <div>株式会社 YSD</div>
        <table class="signature-table" style="margin-top: 10px;">
          <tr>
            <td style="height: 20px;">承認</td>
            <td style="height: 20px;">確認</td>
            <td style="height: 20px;">担当</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
      
      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
        (システムより自動出力)
      </div>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}
