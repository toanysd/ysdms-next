import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ShipmentPDFDocument, type ShipmentPDFDocumentData } from '@/lib/pdf/ShipmentPDFDocument';
import QRCode from 'qrcode';
import React from 'react';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const wantSignedUrl = searchParams.get('signed') === '1' || searchParams.get('format') === 'json';

    const supabase = createServerSupabaseClient();

    // 1. Query shipment data via approved RPC fn_get_shipment_delivery_note
    const { data: shipmentData, error: qErr } = await (supabase.rpc as any)(
      'fn_get_shipment_delivery_note',
      { p_shipment_id: id }
    );

    if (qErr) {
      console.error('[Shipment PDF] RPC Error:', qErr);
      return NextResponse.json({ error: 'Failed to fetch shipment details' }, { status: 500 });
    }

    if (!shipmentData) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const data = shipmentData as unknown as ShipmentPDFDocumentData;
    const deliveryNoteNo = data.delivery_note_no || `DN-${id.slice(0, 8)}`;

    // 2. Generate QR Code for delivery note verification
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl?.origin || 'https://ysdms.yoshidamold.co.jp';
    const qrTargetUrl = data.work_order_id
      ? `${origin}/production/work-orders/${data.work_order_id}`
      : `${origin}/shipments?search=${deliveryNoteNo}`;

    let qrCodeDataUrl: string | undefined = undefined;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(qrTargetUrl, {
        width: 120,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
    } catch (qrErr) {
      console.warn('[Shipment PDF] QR code generation skipped:', qrErr);
    }

    // 3. Render PDF buffer
    const buffer = await renderToBuffer(
      React.createElement(ShipmentPDFDocument, {
        data,
        qrCodeDataUrl,
      }) as any
    );

    // 4. Upload to delivery-docs bucket in storage
    const storagePath = `${id}/${deliveryNoteNo}.pdf`;
    try {
      const { error: uploadErr } = await supabase.storage
        .from('delivery-docs')
        .upload(storagePath, buffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadErr) {
        console.warn('[Shipment PDF] Storage upload warning:', uploadErr.message);
      } else {
        // 5. Update or insert into shipment_required_docs
        const { data: existingDocs } = await supabase
          .from('shipment_required_docs')
          .select('doc_id')
          .eq('shipment_id', id)
          .eq('doc_type', 'delivery_note')
          .maybeSingle();

        if (existingDocs?.doc_id) {
          await supabase
            .from('shipment_required_docs')
            .update({
              file_path: storagePath,
              is_attached: true,
            })
            .eq('doc_id', existingDocs.doc_id);
        } else {
          await supabase
            .from('shipment_required_docs')
            .insert({
              shipment_id: id,
              doc_type: 'delivery_note',
              doc_label: `納品書 (${deliveryNoteNo})`,
              file_path: storagePath,
              is_attached: true,
            });
        }
      }
    } catch (storageErr) {
      console.warn('[Shipment PDF] Storage background task skipped:', storageErr);
    }

    // 6. Return response: Signed URL JSON OR PDF Buffer stream
    if (wantSignedUrl) {
      const { data: signedData, error: signErr } = await supabase.storage
        .from('delivery-docs')
        .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 days

      return NextResponse.json({
        success: true,
        shipment_id: id,
        delivery_note_no: deliveryNoteNo,
        storage_path: storagePath,
        signed_url: signedData?.signedUrl || null,
        error: signErr?.message || null,
      });
    }

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${deliveryNoteNo}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    console.error('[Shipment PDF] Unexpected error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate Delivery Note PDF' },
      { status: 500 }
    );
  }
}
