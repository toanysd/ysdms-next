'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  FileText, Search, Printer, Save, CheckCircle2, 
  AlertTriangle, Settings, RefreshCw, Layers, Sliders, MapPin, Package, DollarSign
} from 'lucide-react';

export default function ProductionOrdersPage() {
  const supabase = createClient();
  const [instructions, setInstructions] = useState<any[]>([]);
  const [selectedPo, setSelectedPo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [machines, setMachines] = useState<any[]>([]);
  const [molds, setMolds] = useState<any[]>([]);
  const [cutters, setCutters] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states for the selected PO
  const [toleranceX, setToleranceX] = useState('±0.5');
  const [toleranceY, setToleranceY] = useState('±0.5');
  const [tolerancePitch, setTolerancePitch] = useState('±0.3');
  const [discardOldStock, setDiscardOldStock] = useState(false);
  const [replaceQcDrawing, setReplaceQcDrawing] = useState(false);
  const [coolingPlateSpec, setCoolingPlateSpec] = useState('EXISTING');
  const [frameSpec, setFrameSpec] = useState('EXISTING');
  const [plugType, setPlugType] = useState('NONE');
  const [hasSeparateCutter, setHasSeparateCutter] = useState(false);

  // Packaging and Samples states
  const [boxType, setBoxType] = useState('PLAIN');
  const [baggingRequired, setBaggingRequired] = useState(true);
  const [packagingInstructions, setPackagingInstructions] = useState('');
  const [freeQuantity, setFreeQuantity] = useState(10);
  const [sampleQuantity, setSampleQuantity] = useState(50);
  const [officeQuantity, setOfficeQuantity] = useState(2);
  const [assignedMachine, setAssignedMachine] = useState('');
  const [assignedMold, setAssignedMold] = useState('');
  const [assignedCutter, setAssignedCutter] = useState('');
  const [cost, setCost] = useState('');

  // Refs for printing
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch production orders
      const { data: poData, error: poErr } = await supabase
        .from('production_orders')
        .select(`
          *,
          order_lines!inner(
            *,
            orders!inner(
              *,
              companies!inner(*)
            ),
            products!inner(
              *,
              design_revisions(*),
              product_material_specs(*)
            ),
            delivery_sites(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (poErr) throw poErr;

      // 2. Fetch lookup data
      const { data: machData } = await supabase.from('machines').select('*');
      const { data: moldData } = await supabase.from('physical_molds').select('*');
      const { data: cutData } = await supabase.from('cutters').select('*');

      setInstructions(poData || []);
      setMachines(machData || []);
      setMolds(moldData || []);
      setCutters(cutData || []);

      if (poData && poData.length > 0) {
        handleSelectPo(poData[0]);
      }
    } catch (err: any) {
      console.error("Error fetching initial data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPo = async (po: any) => {
    setSelectedPo(po);
    
    // Extract design revision specs
    const product = po.order_lines?.products;
    const design = product?.design_revisions?.[0] || {};
    
    setToleranceX(design.tolerance_x || '±0.5');
    setToleranceY(design.tolerance_y || '±0.5');
    setTolerancePitch(design.tolerance_pitch || '±0.3');
    setDiscardOldStock(design.discard_old_stock_on_remake || false);
    setReplaceQcDrawing(design.replace_qc_drawing_on_remake || false);
    setCoolingPlateSpec(design.water_cooling_plate_spec || 'EXISTING');
    setFrameSpec(design.frame_spec || 'EXISTING');
    setPlugType(design.plug_type || 'NONE');
    setHasSeparateCutter(design.has_separate_cutter || false);
    setAssignedMachine(po.machine_id || '');
    setAssignedMold(po.physical_mold_id || '');
    setAssignedCutter(po.cutter_id || '');

    // Fetch sample submission details for this product/job
    const { data: sampleData } = await supabase
      .from('sample_submissions')
      .select('*')
      .eq('product_id', product?.product_id)
      .limit(1);

    if (sampleData && sampleData.length > 0) {
      const sample = sampleData[0];
      setBoxType(sample.box_type || 'PLAIN');
      setBaggingRequired(sample.bagging_required ?? true);
      setPackagingInstructions(sample.packaging_instructions || '');
      setFreeQuantity(sample.free_quantity || 15);
      setSampleQuantity(sample.sample_quantity || 50);
      setOfficeQuantity(sample.office_quantity || 2);
    } else {
      setBoxType('PLAIN');
      setBaggingRequired(true);
      setPackagingInstructions('10枚は無償サンプル、5枚は金型検定用サンプル。袋分けして同梱納入してください。');
      setFreeQuantity(15);
      setSampleQuantity(50);
      setOfficeQuantity(2);
    }

    // Cost (stored in notes or custom metadata, let's parse from legacy_specs or fallback)
    const costVal = design.legacy_specs?.cost || design.notes?.match(/原価:?\s*([\d.]+)/)?.[1] || '';
    setCost(costVal);
  };

  const handleSaveChanges = async () => {
    if (!selectedPo) return;
    setSaving(true);
    setMessage(null);

    try {
      const product = selectedPo.order_lines?.products;
      const design = product?.design_revisions?.[0];

      // 1. Update design_revisions
      if (design?.revision_id) {
        const { error: designErr } = await supabase
          .from('design_revisions')
          .update({
            tolerance_x: toleranceX,
            tolerance_y: toleranceY,
            tolerance_pitch: tolerancePitch,
            discard_old_stock_on_remake: discardOldStock,
            replace_qc_drawing_on_remake: replaceQcDrawing,
            water_cooling_plate_spec: coolingPlateSpec,
            frame_spec: frameSpec,
            plug_type: plugType,
            has_separate_cutter: hasSeparateCutter,
            legacy_specs: { ...(design.legacy_specs || {}), cost: cost }
          })
          .eq('revision_id', design.revision_id);

        if (designErr) throw designErr;
      }

      // 2. Update production_orders
      const { error: poErr } = await supabase
        .from('production_orders')
        .update({
          machine_id: assignedMachine || null,
          physical_mold_id: assignedMold || null,
          cutter_id: assignedCutter || null,
          notes: `原価: ${cost}\n${selectedPo.notes || ''}`
        })
        .eq('po_id', selectedPo.po_id);

      if (poErr) throw poErr;

      // 3. Upsert sample_submissions
      const { data: existingSamples } = await supabase
        .from('sample_submissions')
        .select('submission_id')
        .eq('product_id', product?.product_id);

      if (existingSamples && existingSamples.length > 0) {
        const { error: sampleErr } = await supabase
          .from('sample_submissions')
          .update({
            box_type: boxType,
            bagging_required: baggingRequired,
            packaging_instructions: packagingInstructions,
            free_quantity: freeQuantity,
            sample_quantity: sampleQuantity,
            office_quantity: officeQuantity,
          })
          .eq('submission_id', existingSamples[0].submission_id);

        if (sampleErr) throw sampleErr;
      } else {
        const { error: sampleErr } = await supabase
          .from('sample_submissions')
          .insert({
            product_id: product?.product_id,
            box_type: boxType,
            bagging_required: baggingRequired,
            packaging_instructions: packagingInstructions,
            free_quantity: freeQuantity,
            sample_quantity: sampleQuantity,
            office_quantity: officeQuantity,
          });

        if (sampleErr) throw sampleErr;
      }

      setMessage({ type: 'success', text: '指示書の変更を保存しました！ / Đã lưu thay đổi chỉ thị!' });
      
      // Refresh current data
      await fetchInitialData();
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: `保存に失敗しました: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInstructions = instructions.filter(po => {
    const code = po.po_code?.toLowerCase() || '';
    const internalName = po.order_lines?.products?.product_name_internal?.toLowerCase() || '';
    const company = po.order_lines?.orders?.companies?.company_name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return code.includes(query) || internalName.includes(query) || company.includes(query);
  });

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-64px)] w-full overflow-hidden text-[13px] font-sans bg-[var(--bg-background)]">
      
      {/* Top Banner Control */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3 px-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="text-[var(--accent)] w-5 h-5" />
          <div>
            <h1 className="text-[16px] font-bold text-[var(--text-primary)]">新規金型製造工程票</h1>
            <p className="text-[11px] text-[var(--text-muted)]">Quản lý Chỉ thị Sản xuất & Mẫu thử nghiệm</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-4 h-4 text-[var(--text-muted)]" />
            <input 
              id="search-input"
              type="text" 
              placeholder="検索 / Tìm kiếm..." 
              className="form-input pl-8 w-64 h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            id="refresh-btn"
            className="btn btn-secondary flex items-center gap-1.5 h-8 px-3"
            onClick={fetchInitialData}
          >
            <RefreshCw className="w-3.5 h-3.5" /> <span>更新</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden px-4 gap-4 pb-4">
        
        {/* Left Panel: Instructions List */}
        <div className="w-80 flex flex-col border border-[var(--border-default)] rounded-md bg-white overflow-hidden">
          <div className="p-3 bg-[var(--bg-surface-2)] border-b border-[var(--border-default)] font-bold text-[12px] text-[var(--text-muted)]">
            指示書一覧 ({filteredInstructions.length})
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-[var(--text-muted)]">読み込み中...</div>
            ) : filteredInstructions.length === 0 ? (
              <div className="p-4 text-center text-[var(--text-muted)]">該当するデータがありません</div>
            ) : (
              filteredInstructions.map((po) => {
                const isActive = selectedPo?.po_id === po.po_id;
                const product = po.order_lines?.products;
                const company = po.order_lines?.orders?.companies;
                return (
                  <div
                    key={po.po_id}
                    className={`p-3 border-b border-[var(--border-subtle)] cursor-pointer transition-colors duration-150 ${
                      isActive ? 'bg-[var(--bg-selected)] border-l-4 border-l-[var(--accent)]' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                    onClick={() => handleSelectPo(po)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[var(--text-primary)]">{product?.product_name_internal || 'N/A'}</span>
                      <span className={`badge ${
                        po.po_status === 'COMPLETED' ? 'badge--success' : po.po_status === 'IN_PROGRESS' ? 'badge--warning' : 'badge--neutral'
                      }`}>
                        {po.po_status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] flex justify-between">
                      <span>{company?.company_code || '---'}</span>
                      <span>PO: {po.po_code || '---'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Detailed Form & Sheet View */}
        {selectedPo ? (
          <div className="flex-1 flex flex-col border border-[var(--border-default)] rounded-md bg-white overflow-hidden shadow-sm">
            
            {/* Header Control for Detail View */}
            <div className="p-3 bg-[var(--bg-surface-2)] border-b border-[var(--border-default)] flex justify-between items-center">
              <span className="font-bold text-[var(--text-primary)]">
                詳細編集 / Chi tiết: {selectedPo.order_lines?.products?.product_name_internal}
              </span>
              <div className="flex gap-2">
                <button 
                  id="print-btn"
                  className="btn btn-secondary flex items-center gap-1.5 h-8 px-3"
                  onClick={handlePrint}
                >
                  <Printer className="w-3.5 h-3.5" /> <span>印刷 / Export PDF</span>
                </button>
                <button 
                  id="save-btn"
                  className="btn btn-primary flex items-center gap-1.5 h-8 px-4"
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  <Save className="w-3.5 h-3.5" /> <span>{saving ? '保存中...' : '変更保存'}</span>
                </button>
              </div>
            </div>

            {/* Notification message */}
            {message && (
              <div className={`p-3 text-[12px] flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border-b border-green-200' : 'bg-red-50 text-red-700 border-b border-red-200'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                {message.text}
              </div>
            )}

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-4 flex gap-6">
              
              {/* Interactive Editing Form */}
              <div className="flex-1 max-w-[420px] border-r border-[var(--border-default)] pr-6 flex flex-col gap-4">
                <div className="font-bold text-[12px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> 編集パラメータ / Cấu hình sản xuất
                </div>

                {/* Machine, Mold and Cutter allocation */}
                <div className="flex flex-col gap-2.5">
                  <label className="font-semibold text-[12px]">成形機 / Máy đúc định hình</label>
                  <select 
                    id="machine-select"
                    className="form-input w-full"
                    value={assignedMachine}
                    onChange={(e) => setAssignedMachine(e.target.value)}
                  >
                    <option value="">- 未選択 -</option>
                    {machines.map(m => <option key={m.machine_id} value={m.machine_id}>{m.machine_name} ({m.machine_code})</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="font-semibold text-[12px]">使用金型 / Khuôn vật lý sử dụng</label>
                  <select 
                    id="mold-select"
                    className="form-input w-full"
                    value={assignedMold}
                    onChange={(e) => setAssignedMold(e.target.value)}
                  >
                    <option value="">- 未選択 -</option>
                    {molds.map(m => <option key={m.physical_mold_id} value={m.physical_mold_id}>{m.display_name} ({m.system_code})</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="font-semibold text-[12px]">使用抜型 / Dao cắt sử dụng</label>
                  <select 
                    id="cutter-select"
                    className="form-input w-full"
                    value={assignedCutter}
                    onChange={(e) => setAssignedCutter(e.target.value)}
                  >
                    <option value="">- 未選択 -</option>
                    {cutters.map(c => <option key={c.cutter_id} value={c.cutter_id}>{c.cutter_name} ({c.cutter_no})</option>)}
                  </select>
                </div>

                {/* Tolerances */}
                <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-3">
                  <div className="font-bold text-[12px] text-[var(--text-muted)] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> 寸法公差 / Dung sai kích thước
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">公差 X (Rộng)</label>
                      <input id="tolerance-x-input" type="text" className="form-input w-full mt-1" value={toleranceX} onChange={(e) => setToleranceX(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">公差 Y (Dài)</label>
                      <input id="tolerance-y-input" type="text" className="form-input w-full mt-1" value={toleranceY} onChange={(e) => setToleranceY(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--text-muted)]">ポケットピッチ公差 / Dung sai pitch</label>
                    <input id="tolerance-pitch-input" type="text" className="form-input w-full mt-1" value={tolerancePitch} onChange={(e) => setTolerancePitch(e.target.value)} />
                  </div>
                </div>

                {/* Remake Options */}
                <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-2">
                  <div className="font-bold text-[12px] text-[var(--text-muted)]">金型再作製時の対応 / Phương án khi sửa khuôn</div>
                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <input id="discard-stock-chk" type="checkbox" checked={discardOldStock} onChange={(e) => setDiscardOldStock(e.target.checked)} className="rounded" />
                    <span>旧トレイ在庫廃棄 / Hủy tồn khay cũ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input id="replace-drawing-chk" type="checkbox" checked={replaceQcDrawing} onChange={(e) => setReplaceQcDrawing(e.target.checked)} className="rounded" />
                    <span>検査室旧図面差し替え / Đổi bản vẽ phòng QC</span>
                  </label>
                </div>

                {/* Packaging and Samples Setup */}
                <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-3">
                  <div className="font-bold text-[12px] text-[var(--text-muted)] flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> サンプルの内訳 & 梱包 / Cơ cấu mẫu & Đóng gói
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">無償 (Free)</label>
                      <input id="free-qty-input" type="number" className="form-input w-full mt-1 text-center" value={freeQuantity} onChange={(e) => setFreeQuantity(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">有償 (Charged)</label>
                      <input id="sample-qty-input" type="number" className="form-input w-full mt-1 text-center" value={sampleQuantity} onChange={(e) => setSampleQuantity(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">事務所 (Office)</label>
                      <input id="office-qty-input" type="number" className="form-input w-full mt-1 text-center" value={officeQuantity} onChange={(e) => setOfficeQuantity(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">箱の種類 / Loại thùng</label>
                      <select id="box-type-select" className="form-input w-full mt-1" value={boxType} onChange={(e) => setBoxType(e.target.value)}>
                        <option value="PLAIN">無地箱 (Thùng trơn)</option>
                        <option value="PRINTED">印刷箱 (Thùng in)</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end pb-1.5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input id="bagging-chk" type="checkbox" checked={baggingRequired} onChange={(e) => setBaggingRequired(e.target.checked)} className="rounded" />
                        <span>袋詰め要 / Bọc túi nylon</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[var(--text-muted)]">梱包指示 / Chỉ thị đóng gói</label>
                    <textarea 
                      id="packaging-instructions-textarea"
                      className="form-textarea w-full mt-1 text-[11px] h-16 resize-none"
                      value={packagingInstructions}
                      onChange={(e) => setPackagingInstructions(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)] flex items-center gap-0.5"><DollarSign className="w-3 h-3" /> 原価 (Cost)</label>
                      <input id="cost-input" type="text" className="form-input w-full mt-1" placeholder="e.g. 116.2" value={cost} onChange={(e) => setCost(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">別抜き / Cắt riêng</label>
                      <select id="separate-cutter-select" className="form-input w-full mt-1" value={hasSeparateCutter ? 'true' : 'false'} onChange={(e) => setHasSeparateCutter(e.target.value === 'true')}>
                        <option value="false">不要 (Cắt inline)</option>
                        <option value="true">必要 (別抜き)</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Printable Production Instruction Sheet mock-up */}
              <div className="flex-1 overflow-x-auto bg-gray-100 p-6 flex justify-center items-start rounded-md border border-[var(--border-default)]">
                <div 
                  ref={printAreaRef} 
                  id="print-sheet-area"
                  className="bg-white p-6 shadow-md border border-gray-400 font-serif text-[11px] leading-tight text-black print:shadow-none print:border-none print:p-0"
                  style={{ width: '172mm', minHeight: '240mm' }}
                >
                  {/* Sheet Header */}
                  <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3">
                    <div>
                      <h2 className="text-[18px] font-bold tracking-widest text-center uppercase">新規金型製造工程票</h2>
                      <div className="text-[9px] text-gray-600 mt-1">YOSHIDA PACKAGE CO., LTD.</div>
                    </div>
                    <div className="border border-black p-1 text-center w-20">
                      <div className="border-b border-black pb-0.5 text-[8px]">確認印</div>
                      <div className="h-10 flex items-center justify-center font-bold text-red-600 text-[12px]">小林</div>
                    </div>
                  </div>

                  {/* Top Details Table */}
                  <table className="w-full border-collapse border border-black mb-3">
                    <tbody>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 w-20 font-bold">型番 (Mã khuôn)</td>
                        <td className="border border-black p-1 font-bold text-[12px]">{selectedPo.order_lines?.products?.product_code || '---'}</td>
                        <td className="border border-black bg-gray-100 p-1 w-20 font-bold">記入者</td>
                        <td className="border border-black p-1 w-28">小林 - 弘</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">品名 (Mã khay)</td>
                        <td className="border border-black p-1 font-bold">{selectedPo.order_lines?.products?.product_name_internal || '---'}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">記載日</td>
                        <td className="border border-black p-1">{new Date(selectedPo.created_at).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">材質 (Vật liệu)</td>
                        <td className="border border-black p-1 font-bold" colSpan={3}>
                          {selectedPo.order_lines?.products?.product_material_specs?.[0] ? (
                            `${selectedPo.order_lines.products.product_material_specs[0].material_type} / ${selectedPo.order_lines.products.product_material_specs[0].thickness_mm}mm / Grade: ${selectedPo.order_lines.products.product_material_specs[0].material_grade || '---'} / ${selectedPo.order_lines.products.product_material_specs[0].static_charge || '---'}`
                          ) : 'PS黒 0.8㎜ 【520】 導電練り込み'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">出荷納期</td>
                        <td className="border border-black p-1 text-red-600 font-bold">
                          {selectedPo.order_lines?.due_date ? new Date(selectedPo.order_lines.due_date).toLocaleDateString() : '7/14 (火)'}
                        </td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">出荷サンプル数</td>
                        <td className="border border-black p-1 font-bold text-red-600">
                          {freeQuantity}枚(無償) + {sampleQuantity}枚(有償)
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">型寸法</td>
                        <td className="border border-black p-1">
                          {selectedPo.order_lines?.products?.design_revisions?.[0]?.design_length || 470} × {selectedPo.order_lines?.products?.design_revisions?.[0]?.design_width || 400}
                        </td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">製品寸法</td>
                        <td className="border border-black p-1">
                          {selectedPo.order_lines?.products?.design_revisions?.[0]?.cutline_length || 400} × {selectedPo.order_lines?.products?.design_revisions?.[0]?.cutline_width || 360}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">プラグ (Plug)</td>
                        <td className="border border-black p-1 font-semibold">{plugType !== 'NONE' ? `有 (Type: ${plugType})` : '無'}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">カッター (Cutter)</td>
                        <td className="border border-black p-1">{hasSeparateCutter ? '新規 (別抜き)' : '既存 (インライン)'}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">水冷盤</td>
                        <td className="border border-black p-1">{coolingPlateSpec === 'NEW' ? '新規' : '既存'}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">枠 (Frame)</td>
                        <td className="border border-black p-1">{frameSpec === 'NEW' ? '新規' : '既存'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Arrangements Sections */}
                  <div className="font-bold text-[12px] border-b border-black pb-0.5 mb-1.5 uppercase">手配状況 (Báo cáo sắp xếp vật tư - Yoshida)</div>
                  <table className="w-full border-collapse border border-black mb-3">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black p-1 text-left w-24">手配対象</th>
                        <th className="border border-black p-1 text-center w-20">必要・不要</th>
                        <th className="border border-black p-1 text-center w-28">納期</th>
                        <th className="border border-black p-1 text-center w-20">確認印</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1 font-bold">アルミ材 (Nhôm)</td>
                        <td className="border border-black p-1 text-center">要</td>
                        <td className="border border-black p-1 text-center">6/30 (火)</td>
                        <td className="border border-black p-1 text-center text-red-500 font-bold">小林</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 font-bold">プラグ (Plug gỗ)</td>
                        <td className="border border-black p-1 text-center">{plugType !== 'NONE' ? '要' : '不要'}</td>
                        <td className="border border-black p-1 text-center">{plugType !== 'NONE' ? '7/9 (木)' : '-'}</td>
                        <td className="border border-black p-1 text-center text-red-500 font-bold">{plugType !== 'NONE' ? '小林' : '-'}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 font-bold">カッター (Dao cắt)</td>
                        <td className="border border-black p-1 text-center">{hasSeparateCutter ? '要' : '不要'}</td>
                        <td className="border border-black p-1 text-center">{hasSeparateCutter ? '7/9 (木)' : '-'}</td>
                        <td className="border border-black p-1 text-center text-red-500 font-bold">{hasSeparateCutter ? '小林' : '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Mold Manufacturing Section */}
                  <div className="font-bold text-[12px] border-b border-black pb-0.5 mb-1.5 uppercase">金型製造 (Chế tạo khuôn - Endo)</div>
                  <table className="w-full border-collapse border border-black mb-3">
                    <tbody>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 w-24 font-bold">加工場所</td>
                        <td className="border border-black p-1">社内 (In-house CNC)</td>
                        <td className="border border-black bg-gray-100 p-1 w-24 font-bold">本型納期</td>
                        <td className="border border-black p-1 font-bold">7/9 (木)</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">金型状態</td>
                        <td className="border border-black p-1" colSpan={3}>
                          {assignedMold ? (
                            molds.find(m => m.physical_mold_id === assignedMold)?.display_name || '割り当て済み'
                          ) : '金型製作予定 (Chờ gia công)'}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Molding Section */}
                  <div className="font-bold text-[12px] border-b border-black pb-0.5 mb-1.5 uppercase">成形部指示 (Ép khay định hình - Kohirumaki)</div>
                  <table className="w-full border-collapse border border-black mb-3">
                    <tbody>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 w-24 font-bold">成形機</td>
                        <td className="border border-black p-1 font-bold">
                          {assignedMachine ? (
                            machines.find(m => m.machine_id === assignedMachine)?.machine_name || 'ILLIG'
                          ) : 'ILLIG'}
                        </td>
                        <td className="border border-black bg-gray-100 p-1 w-24 font-bold">出荷予定日</td>
                        <td className="border border-black p-1 font-bold text-red-600">
                          {selectedPo.order_lines?.due_date ? new Date(selectedPo.order_lines.due_date).toLocaleDateString() : '7/14 (火)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">別抜き (Cắt rời)</td>
                        <td className="border border-black p-1 font-bold">{hasSeparateCutter ? '有 (別抜き機使用)' : '無 (In-line)'}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">袋詰め (Bọc túi)</td>
                        <td className="border border-black p-1">{baggingRequired ? '要 (Bọc nylon bảo vệ)' : '否'}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">箱の種類</td>
                        <td className="border border-black p-1">{boxType === 'PLAIN' ? '無地箱 (Thùng trơn)' : '印刷箱 (Thùng in)'}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">原価 (Cost)</td>
                        <td className="border border-black p-1 font-bold">{cost ? `${cost} JPY` : '116.2 JPY'}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">寸法公差</td>
                        <td className="border border-black p-1 font-semibold" colSpan={3}>
                          X: 400 ({toleranceX}) , Y: 360 ({toleranceY}) , Pitch: ({tolerancePitch})
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Exception checks */}
                  <div className="grid grid-cols-2 gap-2 border border-black p-2 mb-3 bg-gray-50">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">旧トレイ在庫廃棄確認:</span>
                      <span>{discardOldStock ? '有 (Tiêu hủy)' : '無 (Không)'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">旧図面差し替え確認:</span>
                      <span>{replaceQcDrawing ? '有 (Đã đổi)' : '無 (Không)'}</span>
                    </div>
                  </div>

                  {/* Delivery & Special Packaging rules */}
                  <div className="font-bold text-[12px] border-b border-black pb-0.5 mb-1.5 uppercase">送り先 & 梱包ルール (Giao hàng & Đóng gói)</div>
                  <div className="border border-black p-2 bg-gray-50 flex flex-col gap-1">
                    <div>
                      <span className="font-bold text-gray-700">納入先 (Địa chỉ nhận):</span>{' '}
                      {selectedPo.order_lines?.delivery_sites ? (
                        `${selectedPo.order_lines.delivery_sites.site_name} / ${selectedPo.order_lines.delivery_sites.site_address}`
                      ) : (
                        `イリソ電子工業株式会社 製造本部 資材課 早坂様 (神奈川県横浜市港北区新横浜2-13-8)`
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-red-600">梱包指示 (Hướng dẫn đóng gói mẫu):</span>{' '}
                      <span className="font-semibold text-red-700">{packagingInstructions || '10枚と5枚は袋分けして同梱納入してください。'}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 italic">
                      ※ 事務所保管サンプルとして別途 各{officeQuantity}枚 を確保してください。
                    </div>
                  </div>

                  {/* Signature block */}
                  <div className="mt-8 flex justify-end gap-1">
                    <div className="border border-gray-400 p-1 text-center w-20 text-[9px]">
                      設計担当
                      <div className="h-6 mt-1 flex items-center justify-center text-red-500 font-bold text-[10px]">クアン</div>
                    </div>
                    <div className="border border-gray-400 p-1 text-center w-20 text-[9px]">
                      金型担当
                      <div className="h-6 mt-1 flex items-center justify-center text-red-500 font-bold text-[10px]">遠藤</div>
                    </div>
                    <div className="border border-gray-400 p-1 text-center w-20 text-[9px]">
                      成形担当
                      <div className="h-6 mt-1 flex items-center justify-center text-red-500 font-bold text-[10px]">谷口</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border border-[var(--border-default)] rounded-md bg-white p-8 text-center">
            <FileText className="w-12 h-12 text-[var(--text-muted)] mb-3" />
            <h3 className="font-bold text-[14px]">指示書が選択されていません</h3>
            <p className="text-[12px] text-[var(--text-muted)] mt-1">左パネルのリストから指示書を選択するか、検索してください。</p>
          </div>
        )}

      </div>

      {/* Hidden print styling */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-sheet-area, #print-sheet-area * {
            visibility: visible;
          }
          #print-sheet-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

    </div>
  );
}
