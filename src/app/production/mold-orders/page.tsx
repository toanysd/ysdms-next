'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { 
  FileText, Search, Printer, Save, CheckCircle2, 
  AlertTriangle, Settings, RefreshCw, Layers, Sliders, MapPin, Package, DollarSign, Plus, X, Calendar, UserCheck
} from 'lucide-react';

export default function MoldWorkOrdersPage() {
  const t = useTranslations('MoldOrders');
  const supabase = createClient();
  const [instructions, setInstructions] = useState<any[]>([]);
  const [selectedPo, setSelectedPo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [machines, setMachines] = useState<any[]>([]);
  const [molds, setMolds] = useState<any[]>([]);
  const [cutters, setCutters] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'order' | 'product'>('order');
  const [productsList, setProductsList] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [plannedQuantity, setPlannedQuantity] = useState(1000);
  const [linkedJobId, setLinkedJobId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingOrderLines, setPendingOrderLines] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  
  // Create Form State
  const [selectedLineId, setSelectedLineId] = useState('');
  const [moldSetsToMake, setMoldSetsToMake] = useState(1);
  const [cavitiesPerMold, setCavitiesPerMold] = useState(1);
  const [reqAluminumDate, setReqAluminumDate] = useState('');
  const [reqPlugDate, setReqPlugDate] = useState('');
  const [reqCutterDate, setReqCutterDate] = useState('');
  const [reqMoldDate, setReqMoldDate] = useState('');
  const [reqMoldingDate, setReqMoldingDate] = useState('');

  // Selected PO Form States (Target Deadlines & Config)
  const [toleranceX, setToleranceX] = useState('±0.5');
  const [toleranceY, setToleranceY] = useState('±0.5');
  const [tolerancePitch, setTolerancePitch] = useState('±0.3');
  const [discardOldStock, setDiscardOldStock] = useState(false);
  const [replaceQcDrawing, setReplaceQcDrawing] = useState(false);
  const [coolingPlateSpec, setCoolingPlateSpec] = useState('EXISTING');
  const [frameSpec, setFrameSpec] = useState('EXISTING');
  const [plugType, setPlugType] = useState('NONE');
  const [hasSeparateCutter, setHasSeparateCutter] = useState(false);

  // Form values for selected PO target deadlines
  const [targetAluminumDate, setTargetAluminumDate] = useState('');
  const [targetPlugDate, setTargetPlugDate] = useState('');
  const [targetCutterDate, setTargetCutterDate] = useState('');
  const [targetMoldDate, setTargetMoldDate] = useState('');
  const [targetMoldingDate, setTargetMoldingDate] = useState('');

  // Actual Schedule deadlines (read from linked Job & Steps)
  const [actualAluminumDate, setActualAluminumDate] = useState<string | null>(null);
  const [actualPlugDate, setActualPlugDate] = useState<string | null>(null);
  const [actualCutterDate, setActualCutterDate] = useState<string | null>(null);
  const [actualMoldDate, setActualMoldDate] = useState<string | null>(null);
  const [actualMoldingDate, setActualMoldingDate] = useState<string | null>(null);

  // Stamps (Signatures) states
  const [stampProcurement, setStampProcurement] = useState('');
  const [stampMoldShop, setStampMoldShop] = useState('');
  const [stampMoldingShop, setStampMoldingShop] = useState('');
  const [stampQc, setStampQc] = useState('');
  const [stampManager, setStampManager] = useState('');

  // Packaging and Samples states
  const [boxType, setBoxType] = useState('PLAIN');
  const [baggingRequired, setBaggingRequired] = useState(true);
  const [packagingInstructions, setPackagingInstructions] = useState('');
  const [freeQuantity, setFreeQuantity] = useState(15);
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
      const { data: poData, error: poErr } = await (supabase as any)
        .from('mold_work_orders')
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
      const { data: machData } = await (supabase as any).from('machines').select('*');
      const { data: moldData } = await (supabase as any).from('physical_molds').select('*');
      const { data: cutData } = await (supabase as any).from('cutters').select('*');
      const { data: empData } = await (supabase as any).from('employees').select('*').order('employee_code');

      setInstructions(poData || []);
      setMachines(machData || []);
      setMolds(moldData || []);
      setCutters(cutData || []);
      setEmployees(empData || []);

      // Fetch active products list
      const { data: prodData } = await (supabase as any)
        .from('products')
        .select('*, companies:companies!products_company_id_fkey(company_id, company_name, company_code), design_revisions(*)')
        .order('product_code');
      setProductsList(prodData || []);

      if (poData && poData.length > 0) {
        // If there was a selected PO, keep it selected, else select first
        let currentSelected = selectedPo ? poData.find((p: any) => p.mwo_id === selectedPo.mwo_id) : null;
        handleSelectPo(currentSelected || poData[0]);
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
    
    setMoldSetsToMake(po.mold_sets_to_make || 1);
    setCavitiesPerMold(po.cavities_per_mold || design.cavity_count || 1);

    // Target Deadlines
    setTargetAluminumDate(po.req_aluminum_date || '');
    setTargetPlugDate(po.req_plug_date || '');
    setTargetCutterDate(po.req_cutter_date || '');
    setTargetMoldDate(po.req_mold_date || '');
    setTargetMoldingDate(po.req_molding_date || '');

    // Stamps (Signatures)
    setStampProcurement(po.approved_by_procurement || '');
    setStampMoldShop(po.approved_by_mold_shop || '');
    setStampMoldingShop(po.approved_by_molding_shop || '');
    setStampQc(po.approved_by_qc || '');
    setStampManager(po.approved_by_manager || '');

    setAssignedMachine(po.machine_id || '');
    setAssignedMold(po.physical_mold_id || '');
    setAssignedCutter(po.cutter_id || '');

    // Reset Actual Schedule states
    setActualAluminumDate(null);
    setActualPlugDate(null);
    setActualCutterDate(null);
    setActualMoldDate(null);
    setActualMoldingDate(null);

    // Fetch associated Tooling Job & steps
    const { data: jobData } = await (supabase as any)
      .from('jobs')
      .select('*, job_steps(*)')
      .eq('mold_work_order_id', po.mwo_id)
      .maybeSingle();

    setLinkedJobId(jobData?.job_id || null);

    if (jobData) {
      setActualMoldingDate(jobData.deadline ? jobData.deadline.split('T')[0] : null);
      setActualMoldDate(jobData.mold_deadline ? jobData.mold_deadline.split('T')[0] : null);

      jobData.job_steps?.forEach((step: any) => {
        const stepDeadline = step.deadline ? step.deadline.split('T')[0] : null;
        if (step.track === 'ALUMI') setActualAluminumDate(stepDeadline);
        if (step.track === 'PLUG') setActualPlugDate(stepDeadline);
        if (step.track === 'CUTTER') setActualCutterDate(stepDeadline);
        if (step.track === 'MOLD') setActualMoldDate(stepDeadline);
      });
    }

    // Fetch sample submission details
    const { data: sampleData } = await (supabase as any)
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

    const costVal = design.legacy_specs?.cost || design.notes?.match(/原価:?\s*([\d.]+)/)?.[1] || '';
    setCost(costVal);
  };

  const openCreateModal = async () => {
    setLoadingPending(true);
    setShowCreateModal(true);
    setSelectedLineId('');
    setSelectedProductId('');
    setPlannedQuantity(1000);
    setActiveTab('order');
    setMoldSetsToMake(1);
    setCavitiesPerMold(1);
    setReqAluminumDate('');
    setReqPlugDate('');
    setReqCutterDate('');
    setReqMoldDate('');
    setReqMoldingDate('');

    try {
      // Get all approved order lines
      const { data: lines, error } = await (supabase as any)
        .from('order_lines')
        .select(`
          *,
          orders!inner(order_no, order_date, order_status, companies(company_name, company_code)),
          products!inner(product_id, product_code, product_name_internal, product_name, design_revisions(*), product_material_specs(*))
        `)
        .in('orders.order_status', ['APPROVED', 'IN_PRODUCTION']);

      if (error) throw error;

      // Filter out lines that already have instructions
      const { data: activePos } = await (supabase as any).from('mold_work_orders').select('order_line_id');
      const activeLineIds = new Set((activePos || []).map((p: any) => p.order_line_id));

      const pending = (lines || []).filter((l: any) => !activeLineIds.has(l.line_id));
      setPendingOrderLines(pending);
    } catch (err: any) {
      console.error("Error fetching pending lines:", err.message);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleSelectPendingLine = (lineId: string) => {
    setSelectedLineId(lineId);
    const line = pendingOrderLines.find((l: any) => l.line_id === lineId);
    if (line) {
      const design = line.products?.design_revisions?.[0] || {};
      setCavitiesPerMold(design.cavity_count || 1);
      
      // Default deadlines based on order due date
      if (line.due_date) {
        const dueDate = new Date(line.due_date);
        
        const molding = new Date(dueDate);
        molding.setDate(molding.getDate() - 1); // 1 day before due date
        setReqMoldingDate(molding.toISOString().split('T')[0]);

        const mold = new Date(dueDate);
        mold.setDate(mold.getDate() - 5); // 5 days before due date
        setReqMoldDate(mold.toISOString().split('T')[0]);

        const cutter = new Date(dueDate);
        cutter.setDate(cutter.getDate() - 5);
        setReqCutterDate(cutter.toISOString().split('T')[0]);

        const plug = new Date(dueDate);
        plug.setDate(plug.getDate() - 5);
        setReqPlugDate(plug.toISOString().split('T')[0]);

        const aluminum = new Date(dueDate);
        aluminum.setDate(aluminum.getDate() - 14); // 2 weeks before due date
        setReqAluminumDate(aluminum.toISOString().split('T')[0]);
      }
    }
  };

  const handleCreateInstruction = async () => {
    if (activeTab === 'order' && !selectedLineId) return;
    if (activeTab === 'product' && !selectedProductId) return;
    setSaving(true);
    
    try {
      let lineIdToUse = selectedLineId;
      let finalProduct = null;
      let finalCompanyId = null;
      let finalPlannedQty = 0;
      let finalMaterialType = 'PS黒';
      let finalMaterialThickness = 0.8;
      let finalMaterialWidth = 520;
      let finalPoCode = '';

      if (activeTab === 'product') {
        const product = productsList.find((p: any) => p.product_id === selectedProductId);
        if (!product) throw new Error("Sản phẩm không hợp lệ");
        finalProduct = product;
        finalCompanyId = product.company_id;
        finalPlannedQty = plannedQuantity;

        // Auto create placeholder order
        const tempOrderNo = `TEMP-PO-${product.product_code}-${Date.now().toString().slice(-4)}`;
        const { data: tempOrder, error: orderErr } = await (supabase as any)
          .from('orders')
          .insert({
            order_no: tempOrderNo,
            company_id: product.company_id,
            order_status: 'APPROVED',
            order_date: new Date().toISOString(),
            order_type: 'MOLD_ONLY',
            notes: '自動作成された金型起工用暫定受注 / Đơn tạm sinh cho thiết kế khuôn'
          })
          .select('order_id')
          .single();
        if (orderErr) throw orderErr;

        // Auto create placeholder line
        const { data: tempLine, error: lineErr } = await (supabase as any)
          .from('order_lines')
          .insert({
            order_id: tempOrder.order_id,
            product_id: product.product_id,
            quantity: plannedQuantity,
            line_no: 1,
            due_date: reqMoldingDate || null,
            notes: '自動作成された暫定明細'
          })
          .select('line_id')
          .single();
        if (lineErr) throw lineErr;

        lineIdToUse = tempLine.line_id;
        finalPoCode = `PO-${tempOrderNo}-1`;
      } else {
        const line = pendingOrderLines.find((l: any) => l.line_id === selectedLineId);
        if (!line) throw new Error("Đơn hàng không hợp lệ");
        finalProduct = line.products;
        finalCompanyId = line.orders.companies.company_id;
        finalPlannedQty = line.quantity;
        const materials = finalProduct.product_material_specs?.[0] || {};
        finalMaterialType = materials.material_type || 'PS黒';
        finalMaterialThickness = materials.thickness_mm || 0.8;
        finalMaterialWidth = materials.sheet_width_mm || 520;
        finalPoCode = `PO-${line.orders.order_no}-${line.line_no}`;
      }

      // 1. Insert Production Order
      const { data: newPo, error: poErr } = await (supabase as any)
        .from('mold_work_orders')
        .insert({
          mwo_code: finalPoCode,
          order_line_id: lineIdToUse,
          planned_quantity: finalPlannedQty,
          mwo_status: 'PLANNED',
          material_type: finalMaterialType,
          material_thickness: finalMaterialThickness,
          sheet_width_mm: finalMaterialWidth,
          mold_sets_to_make: moldSetsToMake,
          cavities_per_mold: cavitiesPerMold,
          req_aluminum_date: reqAluminumDate || null,
          req_plug_date: reqPlugDate || null,
          req_cutter_date: reqCutterDate || null,
          req_mold_date: reqMoldDate || null,
          req_molding_date: reqMoldingDate || null
        })
        .select('*')
        .single();

      if (poErr) throw poErr;

      // 2. Query job type NEW
      const { data: jobType } = await (supabase as any)
        .from('job_types')
        .select('job_type_id')
        .eq('job_type_name_ja', 'NEW')
        .maybeSingle();

      const jobTypeId = jobType?.job_type_id || '00000000-0000-0000-0000-000000000000';

      // 3. Create Tooling Job (Linked to PO)
      const { data: newJob, error: jobErr } = await (supabase as any)
        .from('jobs')
        .insert({
          job_code: `JOB-${finalProduct.product_code}`,
          job_name: `Mold Making ${finalProduct.product_name_internal}`,
          job_type_id: jobTypeId,
          mold_work_order_id: newPo.mwo_id,
          company_id: finalCompanyId,
          product_id: finalProduct.product_id,
          deadline: reqMoldingDate ? `${reqMoldingDate}T12:00:00Z` : null,
          mold_deadline: reqMoldDate ? `${reqMoldDate}T12:00:00Z` : null,
          job_status: 'NEW'
        })
        .select('*')
        .single();

      if (jobErr) throw jobErr;

      // 4. Create Job Steps (Level 2 targets: ALUMI, MOLD, PLUG, CUTTER, FINISH)
      const stepsToInsert = [
        { job_id: newJob.job_id, step_no: 1, step_name: 'Aluminum Block Delivery', track: 'ALUMI', deadline: reqAluminumDate ? `${reqAluminumDate}T12:00:00Z` : null, step_status: 'PENDING' },
        { job_id: newJob.job_id, step_no: 2, step_name: 'Plug Manufacturing', track: 'PLUG', deadline: reqPlugDate ? `${reqPlugDate}T12:00:00Z` : null, step_status: 'PENDING' },
        { job_id: newJob.job_id, step_no: 3, step_name: 'Cutter Manufacturing', track: 'CUTTER', deadline: reqCutterDate ? `${reqCutterDate}T12:00:00Z` : null, step_status: 'PENDING' },
        { job_id: newJob.job_id, step_no: 4, step_name: 'Mold CNC Machining', track: 'MOLD', deadline: reqMoldDate ? `${reqMoldDate}T12:00:00Z` : null, step_status: 'PENDING' },
        { job_id: newJob.job_id, step_no: 5, step_name: 'Molding Trial & Sample', track: 'FINISH', deadline: reqMoldingDate ? `${reqMoldingDate}T12:00:00Z` : null, step_status: 'PENDING' }
      ];

      const { error: stepsErr } = await (supabase as any).from('job_steps').insert(stepsToInsert);
      if (stepsErr) throw stepsErr;

      setShowCreateModal(false);
      await fetchInitialData();
      setMessage({ type: 'success', text: t('createSuccess') });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: t('createError') + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedPo) return;
    setSaving(true);
    setMessage(null);

    try {
      const product = selectedPo.order_lines?.products;
      const design = product?.design_revisions?.[0];

      // 1. Update design_revisions specs
      if (design?.revision_id) {
        const { error: designErr } = await (supabase as any)
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

      // 2. Update mold_work_orders Target Deadlines & Stamps
      const { error: poErr } = await (supabase as any)
        .from('mold_work_orders')
        .update({
          machine_id: assignedMachine || null,
          physical_mold_id: assignedMold || null,
          cutter_id: assignedCutter || null,
          mold_sets_to_make: moldSetsToMake,
          cavities_per_mold: cavitiesPerMold,
          req_aluminum_date: targetAluminumDate || null,
          req_plug_date: targetPlugDate || null,
          req_cutter_date: targetCutterDate || null,
          req_mold_date: targetMoldDate || null,
          req_molding_date: targetMoldingDate || null,
          approved_by_procurement: stampProcurement || null,
          approved_by_mold_shop: stampMoldShop || null,
          approved_by_molding_shop: stampMoldingShop || null,
          approved_by_qc: stampQc || null,
          approved_by_manager: stampManager || null,
          notes: `原価: ${cost}\n${selectedPo.notes || ''}`
        })
        .eq('mwo_id', selectedPo.mwo_id);

      if (poErr) throw poErr;

      // 3. Update associated job and steps deadlines (Đồng bộ hai chiều)
      const { data: linkedJob } = await (supabase as any)
        .from('jobs')
        .select('job_id')
        .eq('mold_work_order_id', selectedPo.mwo_id)
        .maybeSingle();

      if (linkedJob) {
        // Update job overall deadlines
        await (supabase as any)
          .from('jobs')
          .update({
            deadline: targetMoldingDate ? `${targetMoldingDate}T12:00:00Z` : null,
            mold_deadline: targetMoldDate ? `${targetMoldDate}T12:00:00Z` : null
          })
          .eq('job_id', linkedJob.job_id);

        // Update steps deadlines
        const stepsToUpdate = [
          { track: 'ALUMI', date: targetAluminumDate },
          { track: 'PLUG', date: targetPlugDate },
          { track: 'CUTTER', date: targetCutterDate },
          { track: 'MOLD', date: targetMoldDate },
          { track: 'FINISH', date: targetMoldingDate }
        ];

        for (const s of stepsToUpdate) {
          if (s.date) {
            await (supabase as any)
              .from('job_steps')
              .update({ deadline: `${s.date}T12:00:00Z` })
              .eq('job_id', linkedJob.job_id)
              .eq('track', s.track);
          }
        }
      }

      // 4. Upsert sample_submissions
      const { data: existingSamples } = await (supabase as any)
        .from('sample_submissions')
        .select('submission_id')
        .eq('product_id', product?.product_id);

      if (existingSamples && existingSamples.length > 0) {
        const { error: sampleErr } = await (supabase as any)
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
        const { error: sampleErr } = await (supabase as any)
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

      setMessage({ type: 'success', text: t('saveSuccess') });
      
      // Refresh current data
      await fetchInitialData();
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: t('saveError') + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getEmployeeNameShort = (id: string) => {
    const emp = employees.find((e: any) => e.employee_id === id);
    if (!emp) return '';
    return emp.employee_name_short || emp.employee_name.split(' ')[0] || '';
  };

  const renderStampCell = (employeeId: string) => {
    if (!employeeId) return null;
    const name = getEmployeeNameShort(employeeId);
    return (
      <div className="inline-flex flex-col items-center justify-center border border-red-500 rounded-full w-8 h-8 text-[8px] text-red-500 font-bold rotate-[-12deg] select-none mx-auto bg-red-50/10">
        <span className="text-[5px] leading-none border-b border-red-300 pb-0.2 scale-[0.8] origin-center">YSD</span>
        <span className="leading-tight scale-[0.9] origin-center">{name.substring(0, 3)}</span>
      </div>
    );
  };

  const filteredInstructions = instructions.filter((po: any) => {
    const code = po.mwo_code?.toLowerCase() || '';
    const internalName = po.order_lines?.products?.product_name_internal?.toLowerCase() || '';
    const company = po.order_lines?.orders?.companies?.company_name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return code.includes(query) || internalName.includes(query) || company.includes(query);
  });

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden text-[13px] font-sans">
      
      {/* PageHeader (flexShrink: 0) */}
      <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FileText size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {t('title')}
            </h1>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button 
            id="create-btn"
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            <Plus className="w-4 h-4" /> <span>{t('createButton')}</span>
          </button>
          <button 
            id="refresh-btn"
            className="btn btn-secondary"
            onClick={fetchInitialData}
          >
            <RefreshCw className="w-3.5 h-3.5" /> <span>{t('refreshButton')}</span>
          </button>
        </div>
      </div>

      {/* FilterBar / TabBar (flexShrink: 0) */}
      <div className="card-flat" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2 w-4 h-4 text-[var(--text-muted)]" />
          <input 
            id="search-input"
            type="text" 
            placeholder={t('searchPlaceholder')} 
            className="form-input form-input-search w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-3 pb-3 min-h-0">
        
        {/* Left Panel: Instructions List */}
        <div className="w-80 flex flex-col border border-[var(--border-default)] rounded-md bg-white overflow-hidden">
          <div className="p-3 bg-[var(--bg-surface-2)] border-b border-[var(--border-default)] font-bold text-[12px] text-[var(--text-muted)]">
            {t('listHeader', { count: filteredInstructions.length })}
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-[var(--text-muted)]">{t('loading')}</div>
            ) : filteredInstructions.length === 0 ? (
              <div className="p-4 text-center text-[var(--text-muted)]">{t('noData')}</div>
            ) : (
              filteredInstructions.map((po: any) => {
                const isActive = selectedPo?.mwo_id === po.mwo_id;
                const product = po.order_lines?.products;
                const company = po.order_lines?.orders?.companies;
                return (
                  <div
                    key={po.mwo_id}
                    className={`p-3 border-b border-[var(--border-subtle)] cursor-pointer transition-colors duration-150 ${
                      isActive ? 'bg-[var(--bg-selected)] border-l-4 border-l-[var(--accent)]' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                    onClick={() => handleSelectPo(po)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[var(--text-primary)]">{product?.product_name_internal || 'N/A'}</span>
                      <span className={`badge ${
                        po.mwo_status === 'COMPLETED' ? 'badge--success' : po.mwo_status === 'IN_PROGRESS' ? 'badge--warning' : 'badge--neutral'
                      }`}>
                        {po.mwo_status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] flex justify-between">
                      <span>{company?.company_code || '---'}</span>
                      <span>PO: {po.mwo_code || '---'}</span>
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
                {t('detailTitle', { name: selectedPo.order_lines?.products?.product_name_internal })}
              </span>
              <div className="flex gap-2">
                <button 
                  id="print-btn"
                  className="btn btn-secondary flex items-center gap-1.5 h-8 px-3"
                  onClick={handlePrint}
                >
                  <Printer className="w-3.5 h-3.5" /> <span>{t('printButton')}</span>
                </button>
                <button 
                  id="save-btn"
                  className="btn btn-primary flex items-center gap-1.5 h-8 px-4"
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  <Save className="w-3.5 h-3.5" /> <span>{saving ? t('savingButton') : t('saveButton')}</span>
                </button>
              </div>
            </div>

            {/* Workflow Links Bar */}
            <div className="flex items-center gap-4 py-1.5 px-4 bg-slate-50 border-b border-[var(--border-default)] text-[11px] text-slate-600 shrink-0 select-none">
              <span className="font-bold text-slate-500">{t('quickLinks')}</span>
              {selectedPo.order_lines?.orders && (
                <a href={`/orders/${selectedPo.order_lines.orders.order_id}`} className="hover:text-blue-600 font-semibold text-blue-500 underline">
                  {t('linkOrder')}: {selectedPo.order_lines.orders.order_no}
                </a>
              )}
              {selectedPo.order_lines?.products && (
                <a href={`/master/products/${selectedPo.order_lines.products.product_id}`} className="hover:text-blue-600 font-semibold text-blue-500 underline">
                  {t('linkProduct')}: {selectedPo.order_lines.products.product_name_internal}
                </a>
              )}
              {linkedJobId && (
                <a href={`/equipment/jobs?search=${selectedPo.order_lines.products.product_code}`} className="hover:text-blue-600 font-semibold text-blue-500 underline">
                  {t('linkJob')}: {selectedPo.order_lines.products.product_code}
                </a>
              )}
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
                  <Sliders className="w-3.5 h-3.5" /> {t('editParams')}
                </div>

                {/* Deadlines Section */}
                <div className="flex flex-col gap-2 border border-orange-200 bg-orange-50/30 p-3 rounded-md">
                  <div className="font-bold text-[12px] text-orange-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {t('targetDeadlines')}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('aluminumDate')}</label>
                      <input type="date" className="form-input w-full mt-0.5" value={targetAluminumDate} onChange={(e) => setTargetAluminumDate(e.target.value)} />
                      {actualAluminumDate && <span className="text-[10px] text-blue-600 font-medium">{t('actual', { date: actualAluminumDate.substring(5) })}</span>}
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('plugDate')}</label>
                      <input type="date" className="form-input w-full mt-0.5" value={targetPlugDate} onChange={(e) => setTargetPlugDate(e.target.value)} />
                      {actualPlugDate && <span className="text-[10px] text-blue-600 font-medium">{t('actual', { date: actualPlugDate.substring(5) })}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('cutterDate')}</label>
                      <input type="date" className="form-input w-full mt-0.5" value={targetCutterDate} onChange={(e) => setTargetCutterDate(e.target.value)} />
                      {actualCutterDate && <span className="text-[10px] text-blue-600 font-medium">{t('actual', { date: actualCutterDate.substring(5) })}</span>}
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('moldDate')}</label>
                      <input type="date" className="form-input w-full mt-0.5" value={targetMoldDate} onChange={(e) => setTargetMoldDate(e.target.value)} />
                      {actualMoldDate && <span className="text-[10px] text-blue-600 font-medium">{t('actual', { date: actualMoldDate.substring(5) })}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[var(--text-muted)]">{t('moldingDate')}</label>
                    <input type="date" className="form-input w-full mt-0.5" value={targetMoldingDate} onChange={(e) => setTargetMoldingDate(e.target.value)} />
                    {actualMoldingDate && <span className="text-[10px] text-blue-600 font-medium">{t('actual', { date: actualMoldingDate.substring(5) })}</span>}
                  </div>
                </div>

                {/* Digital Stamps Section */}
                <div className="flex flex-col gap-2 border border-red-200 bg-red-50/20 p-3 rounded-md">
                  <div className="font-bold text-[12px] text-red-800 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> {t('stampsApproval')}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <label className="text-[11px] text-red-700 font-medium">{t('stampProcurement')}</label>
                      <select className="form-input w-full mt-0.5" value={stampProcurement} onChange={(e) => setStampProcurement(e.target.value)}>
                        <option value="">{t('unapproved')}</option>
                        {employees.map((e: any) => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-red-700 font-medium">{t('stampMoldShop')}</label>
                      <select className="form-input w-full mt-0.5" value={stampMoldShop} onChange={(e) => setStampMoldShop(e.target.value)}>
                        <option value="">{t('unapproved')}</option>
                        {employees.map((e: any) => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-red-700 font-medium">{t('stampMoldingShop')}</label>
                      <select className="form-input w-full mt-0.5" value={stampMoldingShop} onChange={(e) => setStampMoldingShop(e.target.value)}>
                        <option value="">{t('unapproved')}</option>
                        {employees.map((e: any) => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-red-700 font-medium">{t('stampQc')}</label>
                      <select className="form-input w-full mt-0.5" value={stampQc} onChange={(e) => setStampQc(e.target.value)}>
                        <option value="">{t('unapproved')}</option>
                        {employees.map((e: any) => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-red-700 font-medium">{t('stampManager')}</label>
                    <select className="form-input w-full mt-0.5" value={stampManager} onChange={(e) => setStampManager(e.target.value)}>
                      <option value="">{t('unapproved')}</option>
                      {employees.map((e: any) => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Machine, Mold and Cutter allocation */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[12px]">{t('moldingMachine')}</label>
                  <select 
                    id="machine-select"
                    className="form-input w-full"
                    value={assignedMachine}
                    onChange={(e) => setAssignedMachine(e.target.value)}
                  >
                    <option value="">{t('unselected')}</option>
                    {machines.map((m: any) => <option key={m.machine_id} value={m.machine_id}>{m.machine_name} ({m.machine_code})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold">{t('moldSets')}</label>
                    <input type="number" className="form-input w-full mt-0.5" value={moldSetsToMake} onChange={(e) => setMoldSetsToMake(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold">{t('cavities')}</label>
                    <input type="number" className="form-input w-full mt-0.5" value={cavitiesPerMold} onChange={(e) => setCavitiesPerMold(Number(e.target.value))} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[12px]">{t('assignedMold')}</label>
                  <select 
                    id="mold-select"
                    className="form-input w-full"
                    value={assignedMold}
                    onChange={(e) => setAssignedMold(e.target.value)}
                  >
                    <option value="">{t('unselected')}</option>
                    {molds.map((m: any) => <option key={m.physical_mold_id} value={m.physical_mold_id}>{m.display_name} ({m.system_code})</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[12px]">{t('assignedCutter')}</label>
                  <select 
                    id="cutter-select"
                    className="form-input w-full"
                    value={assignedCutter}
                    onChange={(e) => setAssignedCutter(e.target.value)}
                  >
                    <option value="">{t('unselected')}</option>
                    {cutters.map((c: any) => <option key={c.cutter_id} value={c.cutter_id}>{c.cutter_name} ({c.cutter_no})</option>)}
                  </select>
                </div>

                {/* Tolerances */}
                <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-3">
                  <div className="font-bold text-[12px] text-[var(--text-muted)] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> {t('dimensionsTolerance')}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('toleranceX')}</label>
                      <input id="tolerance-x-input" type="text" className="form-input w-full mt-1" value={toleranceX} onChange={(e) => setToleranceX(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('toleranceY')}</label>
                      <input id="tolerance-y-input" type="text" className="form-input w-full mt-1" value={toleranceY} onChange={(e) => setToleranceY(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--text-muted)]">{t('tolerancePitch')}</label>
                    <input id="tolerance-pitch-input" type="text" className="form-input w-full mt-1" value={tolerancePitch} onChange={(e) => setTolerancePitch(e.target.value)} />
                  </div>
                </div>

                {/* Remake Options */}
                <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-2">
                  <div className="font-bold text-[12px] text-[var(--text-muted)]">{t('remakeOptions')}</div>
                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <input id="discard-stock-chk" type="checkbox" checked={discardOldStock} onChange={(e) => setDiscardOldStock(e.target.checked)} className="rounded" />
                    <span>{t('discardOldStock')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input id="replace-drawing-chk" type="checkbox" checked={replaceQcDrawing} onChange={(e) => setReplaceQcDrawing(e.target.checked)} className="rounded" />
                    <span>{t('replaceQcDrawing')}</span>
                  </label>
                </div>

                {/* Packaging and Samples Setup */}
                <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-3">
                  <div className="font-bold text-[12px] text-[var(--text-muted)] flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> {t('packagingSamples')}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('freeQty')}</label>
                      <input id="free-qty-input" type="number" className="form-input w-full mt-1 text-center" value={freeQuantity} onChange={(e) => setFreeQuantity(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('sampleQty')}</label>
                      <input id="sample-qty-input" type="number" className="form-input w-full mt-1 text-center" value={sampleQuantity} onChange={(e) => setSampleQuantity(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('officeQty')}</label>
                      <input id="office-qty-input" type="number" className="form-input w-full mt-1 text-center" value={officeQuantity} onChange={(e) => setOfficeQuantity(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('boxType')}</label>
                      <select id="box-type-select" className="form-input w-full mt-1" value={boxType} onChange={(e) => setBoxType(e.target.value)}>
                        <option value="PLAIN">{t('boxTypePlain')}</option>
                        <option value="PRINTED">{t('boxTypePrinted')}</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end pb-1.5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input id="bagging-chk" type="checkbox" checked={baggingRequired} onChange={(e) => setBaggingRequired(e.target.checked)} className="rounded" />
                        <span>{t('baggingRequired')}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[var(--text-muted)]">{t('packagingInstructions')}</label>
                    <textarea 
                      id="packaging-instructions-textarea"
                      className="form-textarea w-full mt-1 text-[11px] h-16 resize-none"
                      value={packagingInstructions}
                      onChange={(e) => setPackagingInstructions(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)] flex items-center gap-0.5"><DollarSign className="w-3 h-3" /> {t('cost')}</label>
                      <input id="cost-input" type="text" className="form-input w-full mt-1" placeholder="e.g. 116.2" value={cost} onChange={(e) => setCost(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted)]">{t('separateCutter')}</label>
                      <select id="separate-cutter-select" className="form-input w-full mt-1" value={hasSeparateCutter ? 'true' : 'false'} onChange={(e) => setHasSeparateCutter(e.target.value === 'true')}>
                        <option value="false">{t('separateCutterNo')}</option>
                        <option value="true">{t('separateCutterYes')}</option>
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
                      <h2 className="text-[18px] font-bold tracking-widest text-center uppercase">{t('printArea.title')}</h2>
                      <div className="text-[9px] text-gray-600 mt-1">YOSHIDA PACKAGE CO., LTD.</div>
                    </div>
                    <div className="border border-black p-1 text-center w-20">
                      <div className="border-b border-black pb-0.5 text-[8px]">{t('printArea.confirmStamp')}</div>
                      <div className="h-10 flex items-center justify-center">
                        {renderStampCell(stampManager)}
                      </div>
                    </div>
                  </div>

                  {/* Top Details Table */}
                  <table className="w-full border-collapse border border-black mb-3">
                    <tbody>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 w-20 font-bold">{t('printArea.moldCode')}</td>
                        <td className="border border-black p-1 font-bold text-[12px]">{selectedPo.order_lines?.products?.product_code || '---'}</td>
                        <td className="border border-black bg-gray-100 p-1 w-20 font-bold">{t('printArea.recorder')}</td>
                        <td className="border border-black p-1 w-28">小林 - 弘</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.trayCode')}</td>
                        <td className="border border-black p-1 font-bold">{selectedPo.order_lines?.products?.product_name_internal || '---'}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.recordDate')}</td>
                        <td className="border border-black p-1">{new Date(selectedPo.created_at).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.material')}</td>
                        <td className="border border-black p-1 font-bold" colSpan={3}>
                          {selectedPo.order_lines?.products?.product_material_specs?.[0] ? (
                            `${selectedPo.order_lines.products.product_material_specs[0].material_type} / ${selectedPo.order_lines.products.product_material_specs[0].thickness_mm}mm / Grade: ${selectedPo.order_lines.products.product_material_specs[0].material_grade || '---'} / ${selectedPo.order_lines.products.product_material_specs[0].static_charge || '---'}`
                          ) : 'PS黒 / 0.8mm'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.deliveryDate')}</td>
                        <td className="border border-black p-1 text-red-600 font-bold">
                          {targetMoldingDate ? targetMoldingDate.replace(/-/g, '/') : '---'}
                        </td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.sampleCount')}</td>
                        <td className="border border-black p-1 font-bold text-red-600">
                          {freeQuantity} {t('printArea.pieces')} ({t('printArea.free')}) + {sampleQuantity} {t('printArea.pieces')} ({t('printArea.charged')})
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.moldSets')}</td>
                        <td className="border border-black p-1 font-bold">{moldSetsToMake} {t('printArea.sets')}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.cavityCount')}</td>
                        <td className="border border-black p-1 font-bold">{cavitiesPerMold} {t('printArea.cavities')}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.moldSize')}</td>
                        <td className="border border-black p-1">
                          {selectedPo.order_lines?.products?.design_revisions?.[0]?.design_length || 470} × {selectedPo.order_lines?.products?.design_revisions?.[0]?.design_width || 400}
                        </td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.productSize')}</td>
                        <td className="border border-black p-1">
                          {selectedPo.order_lines?.products?.design_revisions?.[0]?.cutline_length || 400} × {selectedPo.order_lines?.products?.design_revisions?.[0]?.cutline_width || 360}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.plug')}</td>
                        <td className="border border-black p-1 font-semibold">{plugType !== 'NONE' ? `${t('printArea.plugYes')} (Type: ${plugType})` : t('printArea.plugNo')}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.cutter')}</td>
                        <td className="border border-black p-1">{hasSeparateCutter ? t('printArea.separateCutter') : t('printArea.inlineCutter')}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.coolingPlate')}</td>
                        <td className="border border-black p-1">{coolingPlateSpec === 'NEW' ? t('printArea.newPlate') : t('printArea.existingPlate')}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.frame')}</td>
                        <td className="border border-black p-1">{frameSpec === 'NEW' ? t('printArea.newFrame') : t('printArea.existingFrame')}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Arrangements Sections */}
                  <div className="font-bold text-[12px] border-b border-black pb-0.5 mb-1.5 uppercase">{t('printArea.procurementSection')}</div>
                  <table className="w-full border-collapse border border-black mb-3">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black p-1 text-left w-24">{t('printArea.procureTarget')}</th>
                        <th className="border border-black p-1 text-center w-16">{t('printArea.procureRequired')}</th>
                        <th className="border border-black p-1 text-center w-24">{t('printArea.procureTargetDeadline')}</th>
                        <th className="border border-black p-1 text-center w-24">{t('printArea.procurePlannedDate')}</th>
                        <th className="border border-black p-1 text-center w-20">{t('printArea.stampCell')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1 font-bold">{t('printArea.aluminum')}</td>
                        <td className="border border-black p-1 text-center font-medium text-green-700">{t('printArea.required')}</td>
                        <td className="border border-black p-1 text-center font-bold text-red-600">{targetAluminumDate ? targetAluminumDate.substring(5).replace(/-/g, '/') : '---'}</td>
                        <td className="border border-black p-1 text-center text-blue-600 font-bold">{actualAluminumDate ? actualAluminumDate.substring(5).replace(/-/g, '/') : t('printArea.unplanned')}</td>
                        <td className="border border-black p-1 text-center">{renderStampCell(stampProcurement)}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 font-bold">{t('printArea.plugLabel')}</td>
                        <td className="border border-black p-1 text-center">{plugType !== 'NONE' ? t('printArea.required') : t('printArea.notRequired')}</td>
                        <td className="border border-black p-1 text-center font-bold text-red-600">{plugType !== 'NONE' && targetPlugDate ? targetPlugDate.substring(5).replace(/-/g, '/') : '---'}</td>
                        <td className="border border-black p-1 text-center text-blue-600 font-bold">{plugType !== 'NONE' && actualPlugDate ? actualPlugDate.substring(5).replace(/-/g, '/') : '---'}</td>
                        <td className="border border-black p-1 text-center">{plugType !== 'NONE' ? renderStampCell(stampProcurement) : null}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 font-bold">{t('printArea.cutterLabel')}</td>
                        <td className="border border-black p-1 text-center">{hasSeparateCutter ? t('printArea.required') : t('printArea.notRequired')}</td>
                        <td className="border border-black p-1 text-center font-bold text-red-600">{hasSeparateCutter && targetCutterDate ? targetCutterDate.substring(5).replace(/-/g, '/') : '---'}</td>
                        <td className="border border-black p-1 text-center text-blue-600 font-bold">{hasSeparateCutter && actualCutterDate ? actualCutterDate.substring(5).replace(/-/g, '/') : '---'}</td>
                        <td className="border border-black p-1 text-center">{hasSeparateCutter ? renderStampCell(stampProcurement) : null}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Mold Manufacturing Section */}
                  <div className="font-bold text-[12px] border-b border-black pb-0.5 mb-1.5 uppercase">{t('printArea.moldMfgSection')}</div>
                  <table className="w-full border-collapse border border-black mb-3">
                    <tbody>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 w-24 font-bold">{t('printArea.mfgLocation')}</td>
                        <td className="border border-black p-1 font-medium">{t('printArea.mfgLocationInHouse')}</td>
                        <td className="border border-black bg-gray-100 p-1 w-24 font-bold">{t('printArea.reqMoldDate')}</td>
                        <td className="border border-black p-1 font-bold text-red-600">{targetMoldDate ? targetMoldDate.replace(/-/g, '/') : '---'}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.moldStatus')}</td>
                        <td className="border border-black p-1 font-bold text-blue-600" colSpan={3}>
                          {actualMoldDate ? `${t('printArea.actualMfgDatePrefix')}${actualMoldDate.replace(/-/g, '/')}` : t('printArea.actualMfgDatePending')}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.mfgStamp')}</td>
                        <td className="border border-black p-1 text-center" colSpan={3}>
                          {renderStampCell(stampMoldShop)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Molding Section */}
                  <div className="font-bold text-[12px] border-b border-black pb-0.5 mb-1.5 uppercase">{t('printArea.moldingSection')}</div>
                  <table className="w-full border-collapse border border-black mb-3">
                    <tbody>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 w-24 font-bold">{t('printArea.moldingMachine')}</td>
                        <td className="border border-black p-1 font-bold">
                          {assignedMachine ? (
                            machines.find(m => m.machine_id === assignedMachine)?.machine_name || 'ILLIG'
                          ) : 'ILLIG'}
                        </td>
                        <td className="border border-black bg-gray-100 p-1 w-24 font-bold">{t('printArea.deliveryDateLabel')}</td>
                        <td className="border border-black p-1 font-bold text-red-600">
                          {targetMoldingDate ? targetMoldingDate.replace(/-/g, '/') : '---'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.separateCutterLabel')}</td>
                        <td className="border border-black p-1 font-bold">{hasSeparateCutter ? t('printArea.separateCutterYes') : t('printArea.separateCutterNo')}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.moldingActualDate')}</td>
                        <td className="border border-black p-1 text-blue-600 font-bold">
                          {actualMoldingDate ? actualMoldingDate.replace(/-/g, '/') : t('printArea.unplanned')}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.bagging')}</td>
                        <td className="border border-black p-1">{baggingRequired ? t('printArea.baggingYes') : t('printArea.baggingNo')}</td>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.costLabel')}</td>
                        <td className="border border-black p-1 font-bold">{cost ? `${cost} JPY` : '--- JPY'}</td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.toleranceLabel')}</td>
                        <td className="border border-black p-1 font-semibold" colSpan={3}>
                          X: 400 ({toleranceX}) , Y: 360 ({toleranceY}) , Pitch: ({tolerancePitch})
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black bg-gray-100 p-1 font-bold">{t('printArea.mfgStamp')}</td>
                        <td className="border border-black p-1 text-center" colSpan={3}>
                          {renderStampCell(stampMoldingShop)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Exception checks */}
                  <div className="grid grid-cols-2 gap-2 border border-black p-2 mb-3 bg-gray-50">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{t('printArea.discardStockConfirm')}</span>
                      <span>{discardOldStock ? t('printArea.yesText') : t('printArea.noText')}</span>
                      {discardOldStock && renderStampCell(stampQc)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{t('printArea.replaceDrawingConfirm')}</span>
                      <span>{replaceQcDrawing ? t('printArea.yesText') : t('printArea.noText')}</span>
                      {replaceQcDrawing && renderStampCell(stampQc)}
                    </div>
                  </div>

                  {/* Delivery & Special Packaging rules */}
                  <div className="font-bold text-[12px] border-b border-black pb-0.5 mb-1.5 uppercase">{t('printArea.deliverySection')}</div>
                  <div className="border border-black p-2 bg-gray-50 flex flex-col gap-1">
                    <div>
                      <span className="font-bold text-gray-700">{t('printArea.deliveryAddress')}:</span>{' '}
                      {selectedPo.order_lines?.delivery_sites ? (
                        `${selectedPo.order_lines.delivery_sites.site_name} / ${selectedPo.order_lines.delivery_sites.site_address}`
                      ) : (
                        t('printArea.defaultDeliveryAddress')
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-red-600">{t('printArea.packagingRule')}:</span>{' '}
                      <span className="font-semibold text-red-700">{packagingInstructions || t('printArea.defaultPackagingRule')}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 italic">
                      {t('printArea.officeSampleNote', { qty: officeQuantity })}
                    </div>
                  </div>

                  {/* Signature block */}
                  <div className="mt-8 flex justify-end gap-1">
                    <div className="border border-gray-400 p-1 text-center w-20 text-[9px]">
                      {t('printArea.designer')}
                      <div className="h-6 mt-1 flex items-center justify-center text-red-500 font-bold text-[10px]">クアン</div>
                    </div>
                    <div className="border border-gray-400 p-1 text-center w-20 text-[9px]">
                      {t('printArea.moldMaker')}
                      <div className="h-6 mt-1 flex items-center justify-center text-red-500 font-bold text-[10px]">遠藤</div>
                    </div>
                    <div className="border border-gray-400 p-1 text-center w-20 text-[9px]">
                      {t('printArea.moldingOperator')}
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
            <h3 className="font-bold text-[14px]">{t('noInstructionSelected')}</h3>
            <p className="text-[12px] text-[var(--text-muted)] mt-1">{t('selectInstructionHint')}</p>
          </div>
        )}

      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in p-4 overflow-y-auto">
          <div className="bg-white rounded-md border border-[var(--border-default)] w-full max-w-[640px] shadow-lg flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--bg-surface-2)]">
              <h2 className="font-bold text-[14px] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[var(--accent)]" /> {t('modalTitle')}
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[var(--text-muted)] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
              {loadingPending ? (
                <div className="p-8 text-center text-[var(--text-muted)]">{t('loading')}</div>
              ) : pendingOrderLines.length === 0 ? (
                <div className="p-8 text-center text-red-600 bg-red-50 rounded-md border border-red-200">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold text-[13px]">{t('noPendingOrdersTitle')}</p>
                  <p className="text-[11px] mt-1 text-gray-500">
                    {t('noPendingOrdersHint')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Select Order Line */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-[12px]">{t('selectOrderLine')}</label>
                    <select 
                      id="line-select"
                      className="form-input w-full"
                      value={selectedLineId}
                      onChange={(e) => handleSelectPendingLine(e.target.value)}
                    >
                      <option value="">{t('selectOrderLineHint')}</option>
                      {pendingOrderLines.map(l => (
                        <option key={l.line_id} value={l.line_id}>
                          {l.orders.companies.company_code} - {l.products.product_name_internal} ({l.quantity} 枚) - PO: {l.orders.order_no}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedLineId && (
                    <div className="border border-orange-200 bg-orange-50/20 p-4 rounded-md flex flex-col gap-4">
                      <div className="font-bold text-[12px] text-orange-800 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4" /> {t('initialParams')}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold">{t('moldSetsToMake')}</label>
                          <input type="number" className="form-input w-full mt-1" value={moldSetsToMake} onChange={(e) => setMoldSetsToMake(Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold">{t('cavitiesPerMold')}</label>
                          <input type="number" className="form-input w-full mt-1" value={cavitiesPerMold} onChange={(e) => setCavitiesPerMold(Number(e.target.value))} />
                        </div>
                      </div>

                      {/* Deadlines inputs */}
                      <div className="flex flex-col gap-2.5">
                        <div className="font-semibold text-[12px] text-gray-700">{t('targetDeadlines')}</div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[var(--text-muted)]">{t('reqAluminumDate')}</label>
                            <input type="date" className="form-input w-full mt-1" value={reqAluminumDate} onChange={(e) => setReqAluminumDate(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[11px] text-[var(--text-muted)]">{t('reqPlugDate')}</label>
                            <input type="date" className="form-input w-full mt-1" value={reqPlugDate} onChange={(e) => setReqPlugDate(e.target.value)} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[var(--text-muted)]">{t('reqCutterDate')}</label>
                            <input type="date" className="form-input w-full mt-1" value={reqCutterDate} onChange={(e) => setReqCutterDate(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[11px] text-[var(--text-muted)]">{t('reqMoldDate')}</label>
                            <input type="date" className="form-input w-full mt-1" value={reqMoldDate} onChange={(e) => setReqMoldDate(e.target.value)} />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-[var(--text-muted)]">{t('reqMoldingDate')}</label>
                          <input type="date" className="form-input w-full mt-1" value={reqMoldingDate} onChange={(e) => setReqMoldingDate(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--border-default)] flex justify-end gap-2 bg-[var(--bg-surface-2)]">
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary h-8 px-4">{t('cancel')}</button>
              <button 
                className="btn btn-primary h-8 px-6" 
                onClick={handleCreateInstruction}
                disabled={saving || !selectedLineId}
              >
                {saving ? t('savingButton') : t('create')}
              </button>
            </div>
          </div>
        </div>
      )}

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
