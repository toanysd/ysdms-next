'use client'

import React, { useState } from 'react'

type Tab = 'WORKFLOW' | 'DATABASE' | 'TABLE_DICT' | 'GUIDE'

export default function DocsViewer() {
  const [activeTab, setActiveTab] = useState<Tab>('WORKFLOW')

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Tabs Nav */}
      <div className="flex bg-white border-b border-slate-200 px-6 shrink-0 overflow-x-auto custom-scrollbar">
        <TabButton active={activeTab === 'WORKFLOW'} onClick={() => setActiveTab('WORKFLOW')} title="業務フロー (Workflow)" icon="🔄" />
        <TabButton active={activeTab === 'DATABASE'} onClick={() => setActiveTab('DATABASE')} title="データベース構造 (ERD)" icon="🗄️" />
        <TabButton active={activeTab === 'TABLE_DICT'} onClick={() => setActiveTab('TABLE_DICT')} title="テーブル辞書 (Dictionary)" icon="📚" />
        <TabButton active={activeTab === 'GUIDE'} onClick={() => setActiveTab('GUIDE')} title="入力手順ガイド" icon="📝" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'WORKFLOW' && <WorkflowTab />}
          {activeTab === 'DATABASE' && <ERDTab />}
          {activeTab === 'TABLE_DICT' && <TableDictionaryTab />}
          {activeTab === 'GUIDE' && <GuideTab />}
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, title, icon }: { active: boolean, onClick: () => void, title: string, icon: string }) {
  return (
    <button
      onClick={onClick}
      className={`h-12 px-6 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
        active ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      }`}
    >
      <span>{icon}</span>
      <span>{title}</span>
    </button>
  )
}

function WorkflowTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
          YSDMS "Product-Centric" バリューチェーン
        </h2>
        
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <h3 className="font-bold text-blue-700 mb-2">1. 営業段階 (Sales / Orders)</h3>
            <p className="text-sm text-slate-600 mb-4">全データフローは顧客から始まります。営業担当者が新規トレイの作成またはリピート生産の依頼を受けます。</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-white px-3 py-1 rounded-full border border-slate-300 font-mono text-slate-700">トレイ作成 (product_master)</span>
              <span className="bg-white px-3 py-1 rounded-full border border-slate-300 font-mono text-slate-700">顧客選択 (customers)</span>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10"><span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs font-bold">ドキュメント転送</span></div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
            <h3 className="font-bold text-indigo-700 mb-2">2. エンジニアリング設計段階 (Engineering)</h3>
            <p className="text-sm text-slate-600 mb-4">トレイの仕様を受け取り、図面作成および材料計算を行います。金型ベースとリビジョンのパラメータを確定します。</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-mono">金型定義 (mold_base)</span>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-mono">設計図面 (mold_design_revision)</span>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-mono">樹脂BOM (mold_plastic_bom)</span>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10"><span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-bold">承認・指示</span></div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
            <h3 className="font-bold text-teal-700 mb-2">3. 計画 & 準備段階 (Planning & Prep)</h3>
            <p className="text-sm text-slate-600 mb-4">生産計画の作成、マシン割り当て、樹脂在庫の確認を行います。同時に物理金型を製造します。</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200 font-mono">物理金型加工 (mold_physical)</span>
              <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200 font-mono">樹脂確認 (plastic_roll)</span>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">現場実行</span></div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <h3 className="font-bold text-emerald-700 mb-2">4. 成形量産段階 (Mass Production)</h3>
            <p className="text-sm text-slate-600 mb-4">金型をマシンにセットし、樹脂を供給して量産を開始します。OK/NG数量を記録します。</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-mono">実績記録 (production_logs)</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-mono">樹脂消費 (inventory_txn)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ERDTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
          エンティティ関係図 (Core ERD)
        </h2>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Column 1: Product */}
            <div className="flex flex-col gap-4">
              <TableNode name="product_master" type="MASTER" color="indigo" fields={["id (PK)", "code", "customer_part_number", "customer_id", "name"]} />
              <TableNode name="customers" type="MASTER" color="slate" fields={["id (PK)", "customer_code", "name"]} />
            </div>

            {/* Column 2: Bridge */}
            <div className="flex flex-col gap-4 items-center">
              <div className="w-16 border-t-2 border-dashed border-indigo-300"></div>
              <TableNode name="product_mold_map" type="BRIDGE" color="blue" fields={["id (PK)", "product_id (FK)", "revision_id (FK)"]} />
              <div className="w-16 border-t-2 border-dashed border-teal-300"></div>
            </div>

            {/* Column 3: Design / Revisions */}
            <div className="flex flex-col gap-4">
              <TableNode name="mold_base" type="CORE" color="teal" fields={["id (PK)", "code", "customer_id"]} />
              <div className="h-4 border-l-2 border-teal-300 mx-auto"></div>
              <TableNode name="mold_design_revision" type="CORE" color="teal" fields={["id (PK)", "mold_base_id (FK)", "revision_code", "specs..."]} />
              <div className="flex justify-between px-8">
                <div className="h-4 border-l-2 border-teal-300"></div>
                <div className="h-4 border-l-2 border-teal-300"></div>
              </div>
              <div className="flex gap-2">
                <TableNode name="mold_plastic_bom" type="BOM" color="amber" fields={["revision_id", "plastic_id"]} />
                <TableNode name="mold_cutter_config" type="BOM" color="amber" fields={["revision_id", "cutter_id"]} />
              </div>
            </div>

            {/* Column 4: Physical Assets */}
            <div className="flex flex-col gap-4 items-center">
              <div className="w-16 border-t-2 border-dashed border-teal-300"></div>
            </div>

            {/* Column 5: Inventory */}
            <div className="flex flex-col gap-4">
              <TableNode name="mold_physical" type="ASSET" color="emerald" fields={["id (PK)", "revision_id (FK)", "physical_code", "status", "rack_layer_id"]} />
              <div className="h-4 border-l-2 border-slate-300 mx-auto"></div>
              <TableNode name="racks / rack_layers" type="LOCATION" color="slate" fields={["id", "rack_id", "code"]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TableNode({ name, type, color, fields }: { name: string, type: string, color: string, fields: string[] }) {
  const bgHeader = `bg-${color}-600`
  const bgBody = `bg-${color}-50`
  const borderColor = `border-${color}-200`
  const textHeader = `text-white`
  
  return (
    <div className={`border ${borderColor} rounded-lg overflow-hidden shadow-sm min-w-[200px]`}>
      <div className={`${bgHeader} ${textHeader} font-bold p-2 text-[11px] flex justify-between items-center`}>
        <span>{name}</span>
        <span className="opacity-70 text-[9px]">{type}</span>
      </div>
      <div className={`${bgBody} p-2 text-[10px] font-mono text-slate-700 flex flex-col gap-1`}>
        {fields.map((f, i) => <div key={i} className="border-b border-black/5 pb-0.5">{f}</div>)}
      </div>
    </div>
  )
}

function TableDictionaryTab() {
  const tables = [
    { name: 'product_master', role: '製品 (トレイ)', desc: 'トレイの識別情報を格納。顧客が購入する対象を表します。例: IRI-003, JAE-001 Tray。' },
    { name: 'mold_base', role: '金型ベース', desc: '金型セットの概念的ファミリを表します。リビジョン前の共通ベースコード。' },
    { name: 'mold_design_revision', role: '設計リビジョン', desc: 'システムのコア。全技術仕様（寸法、ポケット数、図面）を保持します。' },
    { name: 'product_mold_map', role: 'トレイ・金型マッピング', desc: 'N:Nリレーション。1つのトレイを1つ以上の金型設計に接続します。' },
    { name: 'mold_physical', role: '物理金型 (資産)', desc: 'ラック上の実際の金型。保管場所、テフロンメッキ、状態を管理します。' },
    { name: 'plastic_master', role: '樹脂マスタ', desc: '樹脂タイプ（PS, PET）、厚み、幅を定義します。' },
    { name: 'plastic_roll', role: '実物樹脂ロール', desc: '個々の樹脂ロール（QRコード、正味重量）。WMSで使用。' },
    { name: 'inventory_txn', role: '樹脂入出庫履歴', desc: '成形または出庫ごとの樹脂消費量を記録します。' },
    { name: 'mold_plastic_bom', role: 'BOM (部品表)', desc: '設計リビジョンで使用する樹脂タイプとロス率を定義します。' },
  ]

  return (
    <div className="space-y-4">
      {tables.map((t, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="w-64 font-mono font-bold text-indigo-700 bg-indigo-50 p-2 rounded text-sm shrink-0">
              {t.name}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{t.role}</h4>
              <p className="text-slate-600 text-sm">{t.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function GuideTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
          標準入力ガイド
        </h2>
        
        <div className="space-y-4 text-sm text-slate-700">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <h3 className="font-bold text-blue-800 mb-2">ステップ 1: 営業 (トレイ作成)</h3>
            <p><strong>トレイ管理</strong> メニューでトレイコード、名称、顧客を入力します。この操作により <code>product_master</code> に保存されます。</p>
          </div>
          
          <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg">
            <h3 className="font-bold text-indigo-800 mb-2">ステップ 2: 設計 (金型登録)</h3>
            <p><strong>設計情報</strong> タブで予定金型コードを入力します。保存時に自動的に <code>mold_base</code> と <code>mold_design_revision</code> が作成され、マッピングされます。</p>
          </div>

          <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-lg">
            <h3 className="font-bold text-emerald-800 mb-2">ステップ 3: 加工 (物理金型作成)</h3>
            <p>金型加工が完了したら、金型倉庫で <code>mold_physical</code> を作成し、QRコードを貼り付けてリビジョンに割り当てます。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
