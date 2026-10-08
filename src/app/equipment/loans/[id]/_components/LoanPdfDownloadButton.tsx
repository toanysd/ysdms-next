'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Printer, Download, Stamp, ChevronDown } from 'lucide-react';

export type SealOption = 'BOTH' | 'MARUIN' | 'KAKUIN' | 'NONE';

interface LoanPdfDownloadButtonProps {
  loanId: string;
  loanStatus: string;
  loanType: string;
}

export default function LoanPdfDownloadButton({
  loanId,
  loanStatus,
  loanType,
}: LoanPdfDownloadButtonProps) {
  const t = useTranslations('Loans');
  const [seal, setSeal] = useState<SealOption>('BOTH');
  const [isOpen, setIsOpen] = useState(false);

  const sealLabels: Record<SealOption, string> = {
    BOTH: t('detail.sealSelector.both'),
    MARUIN: t('detail.sealSelector.maruin'),
    KAKUIN: t('detail.sealSelector.kakuin'),
    NONE: t('detail.sealSelector.none'),
  };

  const getPdfUrl = (isDownload: boolean = false) => {
    const base = `/api/equipment/loans/${loanId}/pdf`;
    const params = new URLSearchParams();
    if (isDownload) params.set('download', '1');
    params.set('seal', seal.toLowerCase());
    return `${base}?${params.toString()}`;
  };

  const isReturn = loanStatus === 'RETURNED' || loanType === 'RETURN_TO_CUSTOMER';
  const printTitle = isReturn ? t('printReturnSlip') : t('detail.printDocument');

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Seal Selector Dropdown */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-secondary text-[12px] h-[30px] px-2.5 flex items-center gap-1.5"
          title={t('detail.sealSelector.title')}
          aria-expanded={isOpen}
          data-testid="seal-selector-btn"
        >
          <Stamp size={14} className={seal !== 'NONE' ? 'text-red-600' : 'text-slate-400'} />
          <span className="font-semibold">{sealLabels[seal]}</span>
          <ChevronDown size={12} className="text-slate-500" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 py-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 border-b border-slate-100 flex items-center justify-between">
                <span>{t('detail.sealSelector.title')}</span>
                {seal !== 'NONE' && (
                  <span className="badge badge--error text-[10px] py-0 px-1">
                    {t('detail.sealSelector.badge')}
                  </span>
                )}
              </div>
              {(['BOTH', 'MARUIN', 'KAKUIN', 'NONE'] as SealOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSeal(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between hover:bg-slate-50 ${
                    seal === opt ? 'font-bold text-[var(--accent)] bg-slate-50' : 'text-slate-700'
                  }`}
                  data-testid={`seal-option-${opt.toLowerCase()}`}
                >
                  <span>{sealLabels[opt]}</span>
                  {seal === opt && <span className="text-[var(--accent)] text-[11px]">✓</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Print Direct Link */}
      <a
        href={getPdfUrl(false)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary text-[12px] h-[30px] px-3 flex items-center gap-1.5"
        title={printTitle}
        data-testid="print-pdf-link"
      >
        <Printer size={14} />
        <span>{printTitle}</span>
      </a>

      {/* Download Direct Link */}
      <a
        href={getPdfUrl(true)}
        className="btn btn-secondary text-[12px] h-[30px] px-3 flex items-center gap-1.5"
        title={t('detail.downloadDocument')}
        data-testid="download-pdf-link"
      >
        <Download size={14} />
        <span>{t('detail.downloadDocument')}</span>
      </a>
    </div>
  );
}
