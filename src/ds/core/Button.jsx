import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: { h: 'var(--control-h-sm)', px: 'var(--control-px-sm)', fs: 'var(--text-xs)', icon: 14, gap: 6 },
  md: { h: 'var(--control-h-md)', px: 'var(--control-px-md)', fs: 'var(--text-sm)', icon: 16, gap: 8 },
  lg: { h: 'var(--control-h-lg)', px: 'var(--control-px-lg)', fs: 'var(--text-md)', icon: 18, gap: 8 },
};

const VARIANTS = {
  primary:   { bg: 'var(--color-accent)', hover: 'var(--color-accent-hover)', active: 'var(--color-accent-active)', fg: 'var(--color-on-accent)', border: 'transparent' },
  secondary: { bg: 'transparent', hover: 'var(--color-hover)', active: 'var(--color-pressed)', fg: 'var(--color-text)', border: 'var(--color-border-input)' },
  ghost:     { bg: 'transparent', hover: 'var(--color-accent-tint)', active: 'var(--color-accent-tint-strong)', fg: 'var(--color-accent-text)', border: 'transparent' },
  danger:    { bg: 'var(--color-danger)', hover: 'var(--color-danger-400)', active: 'var(--color-danger-300)', fg: 'var(--color-on-status)', border: 'transparent' },
};

export function Button({ variant = 'primary', size = 'md', icon, iconRight, block = false, disabled = false, type = 'button', children, style, onClick, ...rest }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const bg = disabled ? v.bg : active ? v.active : hover ? v.hover : v.bg;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        gap: s.gap,
        height: s.h,
        padding: '0 ' + (variant === 'ghost' ? 'var(--space-1)' : s.px),
        fontFamily: 'var(--font-heading)',
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: s.fs,
        lineHeight: 1,
        letterSpacing: 0,
        color: v.fg,
        background: bg,
        border: '1px solid ' + v.border,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        whiteSpace: 'nowrap',
        transition: 'background var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={s.icon} /> : null}
      {children ? <span style={{ flex: block ? 1 : undefined }}>{children}</span> : null}
      {iconRight ? <Icon name={iconRight} size={s.icon} /> : null}
    </button>
  );
}
