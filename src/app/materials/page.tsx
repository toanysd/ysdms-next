'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database, Plus, Search, Settings, Trash2 } from 'lucide-react';

export default function MaterialsInventoryPage() {
  const supabase = createClient();
  const [materials, setMaterials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('materials')
      .select('*, material_thicknesses(*)')
      .order('code');
    
    if (!error && data) {
      setMaterials(data);
    }
    setIsLoading(false);
  }

  const filteredMaterials = materials.filter(m => 
    (m.code?.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (m.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}>
            <Database size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
              材料在庫
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Vật liệu & Tồn kho</span>
          </div>
        </div>
        <button className="btn-primary h-[32px] px-3 text-[12px] font-bold">
          <Plus size={16} className="mr-1" /> 新規登録
        </button>
      </div>

      <div className="card-flat p-2 flex items-center gap-2">
        <Search size={16} style={{ color: 'var(--text-muted)', marginLeft: '8px' }} />
        <input 
          type="text" 
          placeholder="コード・名称検索... (Tìm kiếm mã / tên...)"
          className="bg-transparent border-none outline-none flex-1 text-[13px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="text-[11px] px-3 border-l" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
          {filteredMaterials.length} 件
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-[13px]" style={{ color: 'var(--text-muted)' }}>読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(mat => (
            <div key={mat.id} className="card-flat flex flex-col gap-3 group relative">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                 <button className="w-8 h-8 flex items-center justify-center rounded hover-bg-surface-2 text-muted hover-accent">
                   <Settings size={14} />
                 </button>
                 <button className="w-8 h-8 flex items-center justify-center rounded hover-bg-surface-2 text-muted hover-error">
                   <Trash2 size={14} />
                 </button>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold font-mono" style={{ color: 'var(--accent)' }}>{mat.code}</span>
                  {mat.properties && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-surface-2" style={{ color: 'var(--text-secondary)' }}>
                      {mat.properties}
                    </span>
                  )}
                </div>
                <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                  {mat.name}
                </span>
              </div>
              
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-[11px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>利用可能な厚さ (Độ dày)</span>
                <div className="flex flex-wrap gap-2 items-center">
                  {mat.material_thicknesses && mat.material_thicknesses.length > 0 ? (
                    mat.material_thicknesses.map((th: any) => (
                      <div key={th.id} className="px-2 py-1 rounded text-[11px] font-mono border" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                        {th.thickness_mm} mm
                      </div>
                    ))
                  ) : (
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>なし</span>
                  )}
                  <button className="w-6 h-6 flex items-center justify-center rounded-full border border-dashed hover-accent" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
