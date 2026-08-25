'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Box, Calculator, Plus, Search, Settings, Trash2, CheckCircle2, AlertTriangle, Layers, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AluminumBlanksPage() {
  const t = useTranslations('Equipment.Aluminum');
  const supabase = createClient();
  const [blanks, setBlanks] = useState<any[]>([]);
  const [molds, setMolds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Calc Form State
  const [calcMold, setCalcMold] = useState<any>(null);
  const [manualMode, setManualMode] = useState(true);
  const [manualDimensions, setManualDimensions] = useState({ l: 0, w: 0, h: 0 });
  const [blankType, setBlankType] = useState('切板');
  const [material, setMaterial] = useState('A5052');
  const [calcResult, setCalcResult] = useState<{l: number, w: number, h: number} | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    // Fetch molds for dropdown — dùng equipment (SSOT) thay vì physical_molds (deprecated)
    const { data: eqMoldData } = await supabase
      .from('equipment')
      .select('equipment_id, actual_length_mm, actual_width_mm, actual_height_mm, equipment_code, display_name')
      .eq('equipment_type', 'MOLD');
    if (eqMoldData) setMolds(eqMoldData.map(e => ({
      physical_mold_id: e.equipment_id,
      actual_length_mm: e.actual_length_mm,
      actual_width_mm: e.actual_width_mm,
      actual_height_mm: e.actual_height_mm,
      system_code: e.equipment_code,
      display_name: e.display_name,
    })));

    // Fetch blanks
    const { data: blankData, error } = await supabase
      .from('aluminum_blanks')
      .select('*, physical_molds(system_code)')
      .order('created_at', { ascending: false });
    
    if (!error && blankData) {
      setBlanks(blankData);
    } else {
      console.error(error);
    }
    setIsLoading(false);
  }

  // Calculation Logic
  useEffect(() => {
    let l = 0, w = 0, h = 0;
    let canCalculate = false;

    if (!manualMode && calcMold) {
      l = Number(calcMold.actual_length_mm || 0);
      w = Number(calcMold.actual_width_mm || 0);
      h = Number(calcMold.actual_height_mm || 0);
      canCalculate = true;
    } else if (manualMode && manualDimensions.l > 0 && manualDimensions.w > 0 && manualDimensions.h > 0) {
      l = Number(manualDimensions.l);
      w = Number(manualDimensions.w);
      h = Number(manualDimensions.h);
      canCalculate = true;
    }

    if (canCalculate) {
      // Apply type rules for L, W
      let blankL = l;
      let blankW = w;
      if (blankType === '切板') {
        blankL = l + 1;
        blankW = w + 1;
      }
      
      // Apply height rules: max(25, ceil(h / 5) * 5)
      let blankH = Math.max(25, Math.ceil(h / 5) * 5);

      setCalcResult({ l: blankL, w: blankW, h: blankH });
    } else {
      setCalcResult(null);
    }
  }, [calcMold, manualMode, manualDimensions, blankType]);

  async function handleOrderSubmit() {
    if (!calcResult) return;
    setIsSaving(true);

    try {
      const newBlank = {
        mold_id: manualMode ? null : calcMold?.physical_mold_id,
        blank_type: blankType,
        material_grade: material,
        length_mm: calcResult.l,
        width_mm: calcResult.w,
        thickness_mm: calcResult.h,
        status: 'ORDERED'
      };

      const { error } = await supabase.from('aluminum_blanks').insert([newBlank]);
      if (error) {
        alert(t('errorSave') + error.message);
      } else {
        alert(t('orderSuccess'));
        fetchData();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(t('networkError'));
    }
    setIsSaving(false);
  }

  const filteredBlanks = blanks.filter(b => 
    b.material_grade?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.physical_molds?.system_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}>
            <Layers size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
              {t('title')}
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</span>
          </div>
        </div>
        <button 
          className="btn-primary h-[32px] px-3 text-[12px] font-bold"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} className="mr-1" /> {t('newOrder')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calculator Panel */}
        <div className="lg:col-span-1 card-flat p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Calculator size={18} className="text-accent" />
            <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-jp)' }}>{t('calcSize')}</h2>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] mb-1 font-semibold text-muted">{t('targetMold')}</label>
              <select 
                className="w-full bg-surface-2 border rounded px-2 py-1.5 text-[12px] outline-none" style={{ borderColor: 'var(--border-default)' }}
                onChange={e => {
                  if (e.target.value === '') {
                    setManualMode(true);
                    setCalcMold(null);
                  } else {
                    setManualMode(false);
                    setCalcMold(molds.find(m => m.physical_mold_id === e.target.value) || null);
                  }
                }}
                value={manualMode ? '' : (calcMold?.physical_mold_id || '')}
              >
                <option value="">{t('manualInput')}</option>
                {molds.map(m => (
                  <option key={m.physical_mold_id} value={m.physical_mold_id}>
                    {m.system_code} ({m.actual_length_mm || '-'}x{m.actual_width_mm || '-'}x{m.actual_height_mm || '-'})
                  </option>
                ))}
              </select>
            </div>

            {manualMode && (
              <div className="grid grid-cols-3 gap-2 p-2 rounded bg-surface-2 border" style={{ borderColor: 'var(--border-default)' }}>
                <div>
                  <label className="block text-[10px] text-muted">{t('length')}</label>
                  <input type="number" className="w-full border rounded px-1 py-1 text-[12px]" 
                    value={manualDimensions.l || ''} onChange={e => setManualDimensions({...manualDimensions, l: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] text-muted">{t('width')}</label>
                  <input type="number" className="w-full border rounded px-1 py-1 text-[12px]" 
                    value={manualDimensions.w || ''} onChange={e => setManualDimensions({...manualDimensions, w: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] text-muted">{t('height')}</label>
                  <input type="number" className="w-full border rounded px-1 py-1 text-[12px]" 
                    value={manualDimensions.h || ''} onChange={e => setManualDimensions({...manualDimensions, h: Number(e.target.value)})} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] mb-1 font-semibold text-muted">{t('type')}</label>
                <select 
                  className="w-full bg-surface-2 border rounded px-2 py-1.5 text-[12px] outline-none" style={{ borderColor: 'var(--border-default)' }}
                  value={blankType} onChange={e => setBlankType(e.target.value)}
                >
                  <option value="切板">{t('cutPlate')}</option>
                  <option value="4F">{t('fourF')}</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] mb-1 font-semibold text-muted">{t('material')}</label>
                <select 
                  className="w-full bg-surface-2 border rounded px-2 py-1.5 text-[12px] outline-none" style={{ borderColor: 'var(--border-default)' }}
                  value={material} onChange={e => setMaterial(e.target.value)}
                >
                  <option value="A5052">A5052</option>
                  <option value="A5056">A5056</option>
                </select>
              </div>
            </div>

            {calcResult && (
              <div className="mt-2 p-3 rounded-md bg-surface-2 border border-accent flex flex-col gap-2">
                <div className="text-[11px] text-muted flex items-center gap-1"><CheckCircle2 size={12} className="text-success" /> {t('suggestedSize')}</div>
                <div className="text-[18px] font-mono font-bold text-center text-primary">
                  {calcResult.l} × {calcResult.w} × {calcResult.h}
                </div>
                <div className="text-[10px] text-muted text-center">
                  {t('calcNote', { mod: blankType === '切板' ? '+1mm' : '+0mm' })}
                </div>
                <button 
                  className="btn-secondary w-full mt-2 h-[28px] text-[11px]"
                  onClick={handleOrderSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? t('saving') : t('orderWithSize')}
                </button>
              </div>
            )}
            
            {!calcResult && (
              <div className="mt-2 p-3 rounded-md bg-surface-2 border border-dashed flex flex-col items-center justify-center min-h-[100px]" style={{ borderColor: 'var(--border-default)' }}>
                <span className="text-[11px] text-muted text-center whitespace-pre-line">{t('selectOrInput')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Data Table Panel */}
        <div className="lg:col-span-2 card-flat flex flex-col">
          <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2 bg-surface-2 rounded px-2 py-1">
              <Search size={14} className="text-muted" />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="bg-transparent border-none outline-none text-[12px] w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <span className="badge badge--info">{t('all')} {blanks.length}</span>
              <span className="badge badge--warning">{t('ordered')}</span>
              <span className="badge badge--success">{t('inStock')}</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse data-table">
              <thead className="bg-surface-2 sticky top-0 z-10" style={{ background: 'var(--bg-surface-2)' }}>
                <tr>
                  <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">{t('cols.targetMold')}</th>
                  <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">{t('cols.matType')}</th>
                  <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">{t('cols.dimensions')}</th>
                  <th className="px-3 py-2 text-[10px] uppercase font-semibold text-muted">{t('cols.status')}</th>
                  <th className="px-3 py-2 text-[10px] uppercase font-semibold text-right text-muted">{t('cols.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-[12px] text-muted">{t('loading')}</td></tr>
                ) : filteredBlanks.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-[12px] text-muted">{t('noData')}</td></tr>
                ) : (
                  filteredBlanks.map(b => (
                    <tr key={b.id} className="border-b last:border-0 hover-bg-subtle" style={{ borderColor: 'var(--border-subtle)' }}>
                      <td className="px-3 py-2 text-[12px] font-bold">{b.physical_molds?.system_code || <span className="text-muted font-normal">{t('unspecified')}</span>}</td>
                      <td className="px-3 py-2 text-[12px]">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-accent">{b.material_grade}</span>
                          <span className="text-[10px] text-muted">({b.blank_type})</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[12px] font-mono font-bold">
                        {b.length_mm} × {b.width_mm} × {b.thickness_mm}
                      </td>
                      <td className="px-3 py-2">
                        {b.status === 'ORDERED' && <span className="badge badge--warning">{t('ordered')}</span>}
                        {b.status === 'IN_STOCK' && <span className="badge badge--success">{t('inStock')}</span>}
                        {b.status === 'USED' && <span className="badge badge--neutral">{t('used')}</span>}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button className="p-1 hover-bg-surface-2 rounded text-muted hover-accent transition-colors"><Settings size={14}/></button>
                        <button className="p-1 hover-bg-surface-2 rounded text-muted hover-error transition-colors"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-surface rounded-lg w-full max-w-md shadow-lg overflow-hidden flex flex-col" style={{ background: 'var(--bg-surface)' }}>
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="font-bold text-[14px]">{t('manualOrderTitle')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-primary"><X size={16} /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <p className="text-[12px] text-muted mb-2">{t('manualOrderNote')}</p>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] mb-1 font-semibold text-muted">L (mm)</label>
                  <input type="number" className="w-full border rounded px-2 py-1.5 text-[12px] outline-none" 
                    value={manualDimensions.l || ''} onChange={e => setManualDimensions({...manualDimensions, l: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[11px] mb-1 font-semibold text-muted">W (mm)</label>
                  <input type="number" className="w-full border rounded px-2 py-1.5 text-[12px] outline-none" 
                    value={manualDimensions.w || ''} onChange={e => setManualDimensions({...manualDimensions, w: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[11px] mb-1 font-semibold text-muted">H (mm)</label>
                  <input type="number" className="w-full border rounded px-2 py-1.5 text-[12px] outline-none" 
                    value={manualDimensions.h || ''} onChange={e => setManualDimensions({...manualDimensions, h: Number(e.target.value)})} />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2 bg-surface-2" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-2)' }}>
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary h-[32px] px-4 text-[12px]">{t('cancel')}</button>
              <button 
                className="btn-primary h-[32px] px-4 text-[12px]" 
                disabled={isSaving || manualDimensions.l === 0}
                onClick={async () => {
                  setIsSaving(true);
                  const { error } = await supabase.from('aluminum_blanks').insert([{
                    length_mm: manualDimensions.l,
                    width_mm: manualDimensions.w,
                    thickness_mm: manualDimensions.h,
                    blank_type: blankType,
                    material_grade: material,
                    status: 'ORDERED'
                  }]);
                  if (!error) {
                    fetchData();
                    setIsModalOpen(false);
                  }
                  setIsSaving(false);
                }}
              >
                {isSaving ? t('saving') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
