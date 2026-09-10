import React, { useState } from 'react';

const POS = {
  top:    { bottom: '100%', left: '50%', transform: 'translate(-50%, -6px)' },
  bottom: { top: '100%', left: '50%', transform: 'translate(-50%, 6px)' },
  left:   { right: '100%', top: '50%', transform: 'translate(-6px, -50%)' },
  right:  { left: '100%', top: '50%', transform: 'translate(6px, -50%)' },
};

export function Tooltip({ content, children, placement = 'top', open, style }) {
  const [show, setShow] = useState(false);
  const visible = open != null ? open : show;
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {visible ? (
        <span role="tooltip" style={{ position: 'absolute', zIndex: 'var(--z-dropdown)', ...(POS[placement] || POS.top), padding: '5px 8px', background: 'var(--color-text)', color: 'var(--color-bg)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', lineHeight: 1.3, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-sm)', pointerEvents: 'none' }}>
          {content}
        </span>
      ) : null}
    </span>
  );
}
