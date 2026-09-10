import React from 'react';

export function Card({ kicker, title, meta, actions, padding = 16, flush = false, footer, elevation, children, style }) {
  const shadow = elevation === 'lg' ? 'var(--shadow-lg)' : elevation === 'md' ? 'var(--shadow-md)' : elevation === 'sm' ? 'var(--shadow-sm)' : '0 0 0 1px var(--color-hairline)';
  const hasHeader = kicker || title || actions || meta;
  return (
    <section style={{ display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--color-surface)', boxShadow: shadow, borderRadius: 'var(--radius-md)', ...style }}>
      {hasHeader ? (
        <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '12px 16px', borderBottom: '1px solid var(--color-hairline)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {kicker ? <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 'var(--font-weight-medium)', marginBottom: 2 }}>{kicker}</div> : null}
            {title ? <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 1.2 }}>{title}</h3> : null}
            {meta ? <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', marginTop: 2 }}>{meta}</div> : null}
          </div>
          {actions ? <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 'none' }}>{actions}</div> : null}
        </header>
      ) : null}
      <div style={{ padding: flush ? 0 : padding, flex: 1, minWidth: 0 }}>{children}</div>
      {footer ? <footer style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '10px 16px', borderTop: '1px solid var(--color-hairline)', fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>{footer}</footer> : null}
    </section>
  );
}
