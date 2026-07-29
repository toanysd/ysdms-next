import { Layers, Target, Activity, Wrench, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AuxiliaryEquipmentPage() {
  const t = useTranslations('Equipment.Auxiliary');

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)' }}>
            <Wrench size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
              {t('title')}
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Plugs Section — Now managed as attribute on design_revisions (plug_type) */}
        <div className="card-flat flex flex-col gap-3 justify-center items-center h-[192px]">
          <Zap size={24} style={{ color: 'var(--status-info)', opacity: 0.5 }} />
          <div className="text-center">
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t('plugs')}</h2>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('plugsSub')}</span>
          </div>
          <p className="text-[12px] mt-1 text-center px-4" style={{ color: 'var(--text-muted)' }}>
            {t('plugsNote1')}<br/>
            <span className="text-[10px]">{t('plugsNote2')}</span>
          </p>
        </div>

        {/* Upper Frame Placeholder */}
        <div className="card-flat flex flex-col gap-3 justify-center items-center h-[192px]">
          <Layers size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          <div className="text-center">
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t('upperFrame')}</h2>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('upperFrameSub')}</span>
          </div>
          <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>{t('developing')}</p>
        </div>

        {/* Lower Frame Placeholder */}
        <div className="card-flat flex flex-col gap-3 justify-center items-center h-[192px]">
          <Layers size={24} style={{ color: 'var(--text-muted)', opacity: 0.5, transform: 'rotateX(180deg)' }} />
          <div className="text-center">
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t('lowerFrame')}</h2>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('lowerFrameSub')}</span>
          </div>
          <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>{t('developing')}</p>
        </div>

        {/* Pressure Base Placeholder */}
        <div className="card-flat flex flex-col gap-3 justify-center items-center h-[192px]">
          <Target size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          <div className="text-center">
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t('pressureBase')}</h2>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('pressureBaseSub')}</span>
          </div>
          <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>{t('developing')}</p>
        </div>

        {/* Cooling Base Placeholder */}
        <div className="card-flat flex flex-col gap-3 justify-center items-center h-[192px]">
          <Activity size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          <div className="text-center">
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t('coolingBase')}</h2>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('coolingBaseSub')}</span>
          </div>
          <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>{t('developing')}</p>
        </div>

      </div>
    </div>
  );
}
