import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function PageHeader({ breadcrumbs = [], kicker, title, badge, meta, actions, tabs, style }) {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', flex: 'none', padding: '0 var(--page-px)', background: 'var(--color-bg)', borderBottom: tabs ? 0 : '2px solid var(--color-divider)', ...style }}>
      {breadcrumbs.length ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <Icon name="chevron-right" size={12} /> : null}
              <span style={{ color: i === breadcrumbs.length - 1 ? 'var(--color-text-2)' : undefined }}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 64, padding: 'var(--space-3) 0' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {kicker ? <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-accent-text)', fontWeight: 'var(--font-weight-medium)', marginBottom: 4 }}>{kicker}</div> : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
            {badge}
          </div>
          {meta ? <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>{meta}</div> : null}
        </div>
        {actions ? <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 'none' }}>{actions}</div> : null}
      </div>
      {tabs || null}
    </header>
  );
}
