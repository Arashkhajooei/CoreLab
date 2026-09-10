import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function Sidebar({ brand = 'CoreLab', org, sections = [], active, onSelect, footer, collapsed = false, style }) {
  const [hover, setHover] = useState(null);
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', flex: 'none', width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)', height: '100%', minHeight: 0, background: 'var(--color-surface)', borderRight: '2px solid var(--color-divider)', ...style }}>
      <div style={{ height: 'var(--topbar-h)', flex: 'none', display: 'flex', alignItems: 'center', padding: collapsed ? '0 12px' : '0 16px', borderBottom: '2px solid var(--color-divider)', overflow: 'hidden' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-bold)', fontSize: collapsed ? 'var(--text-sm)' : 'var(--text-lg)', letterSpacing: '-0.02em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{collapsed ? String(brand).slice(0, 2) : brand}</div>
          {org && !collapsed ? <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>{org}</div> : null}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-2) 0' }}>
        {sections.map((sec, i) => (
          <div key={i} style={{ padding: 'var(--space-2) 0' }}>
            {sec.title && !collapsed ? <div style={{ padding: '4px 16px 6px', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 'var(--font-weight-medium)' }}>{sec.title}</div> : null}
            {sec.items.map(it => {
              const on = it.key === active;
              return (
                <button
                  key={it.key}
                  type="button"
                  title={collapsed ? it.label : undefined}
                  aria-current={on ? 'page' : undefined}
                  onClick={() => onSelect && onSelect(it.key)}
                  onMouseEnter={() => setHover(it.key)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%', height: 34, padding: collapsed ? '0 0 0 18px' : '0 16px 0 14px',
                    border: 0, borderLeft: '2px solid ' + (on ? 'var(--color-accent)' : 'transparent'),
                    background: on ? 'var(--color-accent-tint)' : hover === it.key ? 'var(--color-hover)' : 'transparent',
                    color: on ? 'var(--color-text)' : 'var(--color-text-2)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: on ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    textAlign: 'left', cursor: 'pointer', transition: 'background var(--duration-fast) var(--ease-standard)',
                  }}
                >
                  <Icon name={it.icon} size={16} color={on ? 'var(--color-accent-text)' : undefined} />
                  {!collapsed ? <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span> : null}
                  {!collapsed && it.count != null ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: on ? 'var(--color-accent-text)' : 'var(--color-text-3)' }}>{it.count}</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {footer ? <div style={{ flex: 'none', borderTop: '1px solid var(--color-hairline)', padding: collapsed ? '10px 8px' : '10px 12px' }}>{footer}</div> : null}
    </nav>
  );
}
