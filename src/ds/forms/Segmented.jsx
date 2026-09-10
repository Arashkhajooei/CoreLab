import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function Segmented({ options = [], value, onChange, size = 'md', tone = 'neutral', block = false, style }) {
  const [hover, setHover] = useState(null);
  const h = size === 'sm' ? 'var(--control-h-sm)' : 'var(--control-h-md)';
  return (
    <div role="radiogroup" style={{ display: block ? 'flex' : 'inline-flex', width: block ? '100%' : undefined, height: h, border: '1px solid var(--color-border-input)', borderRadius: 'var(--radius-md)', overflow: 'hidden', ...style }}>
      {options.map((o, i) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        const on = opt.value === value;
        const accent = tone === 'accent';
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={on}
            title={opt.label}
            onClick={() => onChange && onChange(opt.value)}
            onMouseEnter={() => setHover(opt.value)}
            onMouseLeave={() => setHover(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, flex: block ? 1 : undefined,
              padding: '0 ' + (size === 'sm' ? 10 : 12) + 'px', border: 0, borderLeft: i ? '1px solid var(--color-border-input)' : 0,
              background: on ? (accent ? 'var(--color-accent)' : 'var(--color-surface-3)') : hover === opt.value ? 'var(--color-hover)' : 'transparent',
              color: on ? (accent ? 'var(--color-on-accent)' : 'var(--color-text)') : 'var(--color-text-2)',
              fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)', lineHeight: 1,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background var(--duration-fast) var(--ease-standard)',
            }}
          >
            {opt.icon ? <Icon name={opt.icon} size={size === 'sm' ? 13 : 15} /> : null}
            {opt.label && !opt.iconOnly ? opt.label : null}
          </button>
        );
      })}
    </div>
  );
}
