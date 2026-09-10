import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

const SIZES = { sm: { box: 'var(--control-h-sm)', icon: 14 }, md: { box: 'var(--control-h-md)', icon: 16 }, lg: { box: 'var(--control-h-lg)', icon: 18 } };

export function IconButton({ icon, label, variant = 'ghost', size = 'md', active = false, disabled = false, tone = 'neutral', style, onClick, ...rest }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const fg = tone === 'danger' ? 'var(--color-danger-text)' : active ? 'var(--color-accent-text)' : variant === 'primary' ? 'var(--color-on-accent)' : hover ? 'var(--color-text)' : 'var(--color-text-2)';
  const base = variant === 'primary' ? 'var(--color-accent)' : active ? 'var(--color-accent-tint)' : 'transparent';
  const bg = disabled ? base : pressed ? (variant === 'primary' ? 'var(--color-accent-active)' : 'var(--color-pressed)') : hover ? (variant === 'primary' ? 'var(--color-accent-hover)' : 'var(--color-hover)') : base;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        width: s.box, height: s.box, padding: 0,
        color: fg, background: bg,
        border: variant === 'secondary' ? '1px solid var(--color-border-input)' : '1px solid transparent',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
        transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={s.icon} />
    </button>
  );
}
