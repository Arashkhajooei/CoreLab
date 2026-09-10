import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../ds/core/Button.jsx'
import { Icon } from '../ds/core/Icon.jsx'
import { Field } from '../ds/forms/Field.jsx'
import { Input } from '../ds/forms/Input.jsx'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    // On success the session listener in App swaps this screen out, so leave `busy` set.
    if (error) {
      setError(error.message)
      setBusy(false)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', color: 'var(--color-text)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <div style={{ width: 32, height: 32, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>
            <Icon name="flask-conical" size={18} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', letterSpacing: '-0.015em', lineHeight: 1.1 }}>CoreLab</div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>Northline Geotechnical</div>
          </div>
        </div>

        <form onSubmit={submit} style={{ background: 'var(--color-surface)', boxShadow: '0 0 0 1px var(--color-hairline)', borderTop: '2px solid var(--color-accent)', padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-md)' }}>Sign in</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', marginTop: 3, marginBottom: 16 }}>
            Staff accounts only. Ask your lab manager for access.
          </div>

          {error ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '9px 11px', marginBottom: 14, background: 'var(--color-danger-tint)', color: 'var(--color-danger-text)', fontSize: 'var(--text-xs)', lineHeight: 1.4 }}>
              <Icon name="alert-circle" size={14} style={{ marginTop: 1 }} />
              <span>{error}</span>
            </div>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Email">
              <Input
                icon="mail"
                type="email"
                autoComplete="username"
                placeholder="you@northline.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password">
              <Input
                icon="lock"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </div>

          <Button type="submit" block icon="log-in" disabled={busy} style={{ marginTop: 18 }}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)', textAlign: 'center', marginTop: 14 }}>
          Accredited testing laboratory · AASHTO re:source
        </div>
      </div>
    </div>
  )
}
