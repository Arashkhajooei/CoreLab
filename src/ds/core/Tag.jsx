import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

export function Tag({ children, icon, onRemove, active = false, onClick, style }) {
  const [hover, setHover] = useState(false);
  const clickable = !!onClick;
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, flex: 'none',
        height: 26, padding: onRemove ? '0 4px 0 10px' : '0 10px',
        fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', lineHeight: 1, whiteSpace: 'nowrap',
        color: active ? 'var(--color-accent-text)' : 'var(--color-text)',
        background: active ? 'var(--color-accent-tint)' : hover && clickable ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
        border: '1px solid ' + (active ? 'var(--color-accent-text)' : 'var(--color-hairline)'),
        borderRadius: 'var(--radius-sm)',
        cursor: clickable ? 'pointer' : 'default',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
      {onRemove ? (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, padding: 0, border: 0, background: 'transparent', color: 'var(--color-text-2)', cursor: 'pointer' }}
        >
          <Icon name="x" size={12} />
        </button>
      ) : null}
    </span>
  );
}
