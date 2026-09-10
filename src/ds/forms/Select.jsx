import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const FS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-md)' };

export function Select({ options = [], value, onChange, placeholder, size = 'md', invalid = false, disabled = false, icon, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const items = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
  const ring = invalid ? 'var(--color-danger)' : 'var(--color-focus)';
  const border = invalid ? 'var(--color-danger)' : focus ? ring : hover ? 'var(--color-border-input-hover)' : 'var(--color-border-input)';
  const empty = value == null || value === '';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', height: H[size] || H.md, paddingLeft: icon ? 10 : 0,
        background: disabled ? 'var(--color-surface)' : 'var(--color-surface-2)', border: '1px solid ' + border, borderRadius: 'var(--radius-md)',
        boxShadow: focus ? '0 0 0 1px ' + ring : 'none', opacity: disabled ? 0.55 : 1, ...style,
      }}
    >
      {icon ? <Icon name={icon} size={16} color="var(--color-text-3)" /> : null}
      <select
        value={empty ? '' : value}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', flex: 1, minWidth: 0, height: '100%', padding: '0 32px 0 10px', border: 0, outline: 'none',
          background: 'transparent', color: empty ? 'var(--color-text-3)' : 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: FS[size] || FS.md, cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {items.map(o => <option key={o.value} value={o.value} style={{ color: 'var(--color-text)', background: 'var(--color-surface-2)' }}>{o.label}</option>)}
      </select>
      <Icon name="chevron-down" size={14} color="var(--color-text-3)" style={{ position: 'absolute', right: 10, pointerEvents: 'none' }} />
    </div>
  );
}
