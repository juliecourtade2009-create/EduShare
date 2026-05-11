import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../lib/supabase'
import { useState } from 'react'

const NAV_LINKS = [
  { to: '/',        label: '🏠 Accueil'  },
  { to: '/courses', label: '📖 Cours'    },
  { to: '/forum',   label: '💬 Forum'    },
  { to: '/files',   label: '📁 Fichiers' },
]

export default function Navbar() {
  const { user, profile } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0.75rem 1.5rem',
      borderBottom:'1px solid var(--border)',
      background:'rgba(10,14,26,0.96)',
      backdropFilter:'blur(12px)',
      position:'sticky', top:0, zIndex:100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ fontSize:'1.25rem', fontWeight:700,
        background:'linear-gradient(135deg,var(--accent),var(--accent2))',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
        📚 EduShare
      </Link>

      {/* Links */}
      <div style={{ display:'flex', gap:'0.25rem' }}>
        {NAV_LINKS.map(({ to, label }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} style={{
              padding:'0.4rem 0.9rem', borderRadius:8,
              fontSize:'0.83rem', fontWeight: active ? 500 : 400,
              color: active ? 'var(--accent)' : 'var(--text2)',
              background: active ? 'rgba(79,156,249,0.1)' : 'none',
              border: active ? '1px solid rgba(79,156,249,0.25)' : '1px solid transparent',
              transition:'all 0.18s',
            }}>
              {label}
            </Link>
          )
        })}
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', position:'relative' }}>
        {user ? (
          <>
            <div
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width:36, height:36, borderRadius:10,
                background:'linear-gradient(135deg,var(--accent),var(--accent2))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:700, fontSize:'0.85rem', cursor:'pointer',
                userSelect:'none',
              }}
            >
              {profile?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            {menuOpen && (
              <div style={{
                position:'absolute', top:44, right:0, minWidth:180,
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:10, padding:'0.5rem', zIndex:200,
              }}>
                <Link to="/profile" onClick={() => setMenuOpen(false)} style={{
                  display:'block', padding:'0.45rem 0.75rem',
                  borderRadius:6, fontSize:'0.85rem', color:'var(--text2)',
                }}>👤 Mon profil</Link>
                <div style={{ height:1, background:'var(--border)', margin:'0.4rem 0' }} />
                <button onClick={handleSignOut} style={{
                  display:'block', width:'100%', textAlign:'left',
                  padding:'0.45rem 0.75rem', borderRadius:6,
                  fontSize:'0.85rem', color:'var(--danger)',
                  background:'none', border:'none',
                }}>🚪 Se déconnecter</button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Connexion</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  )
}
