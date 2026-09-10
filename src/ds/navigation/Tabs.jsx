import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function Tabs({ items = [], value, onChange, size = 'md', style }) {
  const [hover, setHover] = useState(null);
  return (
    <div role="tablist" style={{ display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--color-divider)', ...style }}>
      {items.map(it => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange && onChange(it.value)}
            onMouseEnter={() => setHover(it.value)}
            onMouseLeave={() => setHover(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: size === 'sm' ? 32 : 38, padding: '0 var(--space-3)', marginBottom: -2,
              border: 0, borderBottom: '2px solid ' + (on ? 'var(--color-accent)' : 'transparent'),
              background: hover === it.value && !on ? 'var(--color-hover)' : 'transparent',
              color: on ? 'var(--color-text)' : 'var(--color-text-2)',
              fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)', lineHeight: 1,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color var(--duration-fast) var(--ease-standard)',
            }}
          >
            {it.icon ? <Icon name={it.icon} size={14} /> : null}
            {it.label}
            {it.count != null ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', padding: '2px 5px', background: on ? 'var(--color-accent-tint)' : 'var(--color-hover)', color: on ? 'var(--color-accent-text)' : 'var(--color-text-3)' }}>{it.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
