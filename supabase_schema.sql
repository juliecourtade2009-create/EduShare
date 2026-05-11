import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/supabase'

function AuthForm({ mode }) {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email:'', password:'', username:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password)
        if (error) throw error
        navigate('/')
      } else {
        if (!form.username.trim()) throw new Error('Pseudo requis')
        const { error } = await signUp(form.email, form.password, form.username)
        if (error) throw error
        setSuccess('Compte créé ! Vérifie ton email pour confirmer ton inscription.')
      }
    } catch(err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--bg)', padding:'1rem',
    }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>📚</div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:700,
            background:'linear-gradient(135deg,var(--accent),var(--accent2))',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            EduShare
          </h1>
          <p style={{ color:'var(--text2)', fontSize:'0.9rem', marginTop:'0.25rem' }}>
            {mode === 'login' ? 'Bon retour parmi nous 👋' : 'Rejoins la communauté étudiante'}
          </p>
        </div>

        <div className="card fade-in">
          <h2 style={{ fontSize:'1.1rem', fontWeight:600, marginBottom:'1.25rem' }}>
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>

          {error   && <div className="error-msg"   style={{ marginBottom:'1rem' }}>{error}</div>}
          {success && <div className="success-msg" style={{ marginBottom:'1rem' }}>{success}</div>}

          {!success && (
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize:'0.8rem', color:'var(--text2)', display:'block', marginBottom:'0.35rem' }}>
                    Pseudo
                  </label>
                  <input name="username" placeholder="ex: sophie_maths" value={form.username} onChange={handle} required />
                </div>
              )}
              <div>
                <label style={{ fontSize:'0.8rem', color:'var(--text2)', display:'block', marginBottom:'0.35rem' }}>
                  Email
                </label>
                <input name="email" type="email" placeholder="ton@email.com" value={form.email} onChange={handle} required />
              </div>
              <div>
                <label style={{ fontSize:'0.8rem', color:'var(--text2)', display:'block', marginBottom:'0.35rem' }}>
                  Mot de passe
                </label>
                <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ marginTop:'0.25rem', justifyContent:'center' }}>
                {loading ? <span className="spinner" /> : (mode === 'login' ? 'Se connecter' : "S'inscrire")}
              </button>
            </form>
          )}

          <p style={{ textAlign:'center', marginTop:'1.25rem', fontSize:'0.83rem', color:'var(--text3)' }}>
            {mode === 'login'
              ? <>Pas encore de compte ? <Link to="/signup" style={{ color:'var(--accent)' }}>S'inscrire</Link></>
              : <>Déjà un compte ? <Link to="/login" style={{ color:'var(--accent)' }}>Se connecter</Link></>
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export const LoginPage  = () => <AuthForm mode="login"  />
export const SignupPage = () => <AuthForm mode="signup" />
