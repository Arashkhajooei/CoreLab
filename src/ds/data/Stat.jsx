import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TONE = { neutral: 'var(--color-text-2)', success: 'var(--color-success-text)', warning: 'var(--color-warning-text)', danger: 'var(--color-danger-text)', accent: 'var(--color-accent-text)' };

export function Stat({ label, value, unit, delta, deltaTone = 'neutral', hint, icon, size = 'md', plain = false, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, padding: plain ? 0 : '14px 16px', background: plain ? 'transparent' : 'var(--color-surface)', boxShadow: plain ? 'none' : '0 0 0 1px var(--color-hairline)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-2)', fontWeight: 'var(--font-weight-medium)' }}>
        {icon ? <Icon name={icon} size={14} color="var(--color-text-3)" /> : null}<span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-weight-medium)', fontSize: size === 'lg' ? 'var(--text-3xl)' : size === 'sm' ? 'var(--text-xl)' : 'var(--text-2xl)', lineHeight: 1, letterSpacing: 'var(--tracking-tight)', fontFeatureSettings: 'var(--font-numeric)', color: 'var(--color-text)' }}>{value}</span>
        {unit ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-3)' }}>{unit}</span> : null}
      </div>
      {delta || hint ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', whiteSpace: 'nowrap' }}>
          {delta ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: TONE[deltaTone] || TONE.neutral, fontFamily: 'var(--font-mono)', fontFeatureSettings: 'var(--font-numeric)' }}>{deltaTone === 'success' ? <Icon name="trending-up" size={12} /> : deltaTone === 'danger' ? <Icon name="trending-down" size={12} /> : null}{delta}</span> : null}
          {hint ? <span>{hint}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
