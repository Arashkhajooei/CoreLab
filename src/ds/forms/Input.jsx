import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const FS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-md)' };

export function Input({ size = 'md', icon, prefix, suffix, unit, invalid = false, mono = false, multiline = false, rows = 3, align, disabled = false, readOnly = false, style, onFocus, onBlur, ...rest }) {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const ring = invalid ? 'var(--color-danger)' : 'var(--color-focus)';
  const border = invalid ? 'var(--color-danger)' : focus ? ring : hover ? 'var(--color-border-input-hover)' : 'var(--color-border-input)';
  const Control = multiline ? 'textarea' : 'input';
  const muted = { color: 'var(--color-text-3)', fontSize: FS[size], flex: 'none', fontFamily: mono || unit ? 'var(--font-mono)' : undefined };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: multiline ? 'stretch' : 'center', gap: 'var(--space-2)',
        minHeight: H[size] || H.md, padding: multiline ? '8px 10px' : '0 10px',
        background: disabled ? 'var(--color-surface)' : 'var(--color-surface-2)',
        border: '1px solid ' + border, borderRadius: 'var(--radius-md)',
        boxShadow: focus ? '0 0 0 1px ' + ring : 'none',
        opacity: disabled ? 0.55 : 1,
        transition: 'border-color var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={16} color="var(--color-text-3)" /> : null}
      {prefix ? <span style={muted}>{prefix}</span> : null}
      <Control
        rows={multiline ? rows : undefined}
        disabled={disabled}
        readOnly={readOnly}
        {...rest}
        onFocus={(e) => { setFocus(true); if (onFocus) onFocus(e); }}
        onBlur={(e) => { setFocus(false); if (onBlur) onBlur(e); }}
        style={{
          flex: 1, minWidth: 0, width: '100%', padding: 0, border: 0, outline: 'none', background: 'transparent', resize: multiline ? 'vertical' : undefined,
          color: 'var(--color-text)', fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: FS[size] || FS.md, lineHeight: multiline ? 1.5 : 1,
          textAlign: align, fontFeatureSettings: 'var(--font-numeric)', cursor: disabled ? 'not-allowed' : undefined,
        }}
      />
      {unit ? <span style={{ ...muted, fontSize: 'var(--text-xs)' }}>{unit}</span> : null}
      {suffix ? <span style={muted}>{suffix}</span> : null}
    </div>
  );
}
