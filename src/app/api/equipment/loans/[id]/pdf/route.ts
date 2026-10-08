import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { MoldLoanPDFDocument } from '@/components/pdf/MoldLoanPDFDocument';
import type { LoanType } from '@/app/equipment/loans/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: loanId } = await params;
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get('type');

    const supabase = await createClient();

    // 1. Fetch loan detail from view
    const { data: loan, error: loanErr } = await supabase
      .from('v_equipment_loans_summary')
      .select('*')
      .eq('loan_id', loanId)
      .maybeSingle();

    if (loanErr || !loan) {
      return new NextResponse('Loan record not found', { status: 404 });
    }

    // 2. Validate loan type
    const validTypes: LoanType[] = [
      'CUSTOMER_LOAN',
      'RETURN_TO_CUSTOMER',
      'OUTSOURCE_PROCESSING',
    ];
    let selectedType: LoanType = (loan.loan_type as LoanType) || 'CUSTOMER_LOAN';
    if (typeParam && validTypes.includes(typeParam as LoanType)) {
      selectedType = typeParam as LoanType;
    }

    // 3. Fetch equipment detailed dimensions and specs
    let equipmentSpecs = {
      dimensions: null as string | null,
      actual_weight: null as string | null,
      material_spec: null as string | null,
      piece_count: null as number | null,
    };

    if (loan.equipment_id) {
      const { data: eq } = await supabase
        .from('equipment')
        .select('dimensions, actual_weight, material_spec, piece_count')
        .eq('equipment_id', loan.equipment_id)
        .maybeSingle();

      if (eq) {
        equipmentSpecs = {
          dimensions: eq.dimensions,
          actual_weight: eq.actual_weight,
          material_spec: eq.material_spec,
          piece_count: eq.piece_count,
        };
      }
    }

    // 4. Render PDF to buffer
    const buffer = await renderToBuffer(
      React.createElement(MoldLoanPDFDocument as React.ComponentType<any>, {
        loan: loan as any,
        equipmentSpecs,
        type: selectedType,
      }) as any
    );

    // 5. Determine Disposition and Filenames (RFC 5987 compliant)
    const isDownload = searchParams.get('download') === '1' || searchParams.get('download') === 'true';
    const dispositionType = isDownload ? 'attachment' : 'inline';

    let docTitle = '金型借用書';
    if (selectedType === 'RETURN_TO_CUSTOMER') {
      docTitle = '金型返却書';
    } else if (selectedType === 'OUTSOURCE_PROCESSING') {
      docTitle = '金型外注加工依頼書';
    }

    const companyName =
      (selectedType === 'CUSTOMER_LOAN' ? loan.from_company_name : loan.to_company_name) || '客先';
    const cleanCompany = companyName.replace(/[/\\?%*:|"<>]/g, '_').trim();
    const loanCode = loan.loan_code || loanId;

    const japaneseFilename = `${docTitle}_${loanCode}_${cleanCompany}.pdf`;
    const asciiFilename = `${selectedType}_${loanCode}.pdf`;

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${dispositionType}; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(japaneseFilename)}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err: unknown) {
    console.error('Error generating mold loan PDF:', err);
    const msg = err instanceof Error ? err.message : String(err);
    return new NextResponse(`Error generating PDF: ${msg}`, { status: 500 });
  }
}
