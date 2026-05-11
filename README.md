import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { getFiles, uploadFile, incrementDownload, getCourses } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const SUBJECTS = ['math','physique','histoire','info','langues','eco','philo']
const LEVELS   = ['college','seconde','premiere','terminale','prepa','superieur']
const SUBJECT_LABEL = { math:'Maths', physique:'Physique', histoire:'Histoire', info:'Informatique', langues:'Langues', eco:'Économie', philo:'Philosophie' }
const LEVEL_LABEL   = { college:'Collège', seconde:'Seconde', premiere:'Première', terminale:'Terminale', prepa:'Prépa', superieur:'Supérieur' }

const FILE_ICONS = {
  PDF: { emoji:'📕', cls:'badge-red'    },
  DOCX:{ emoji:'📘', cls:'badge-blue'   },
  DOC: { emoji:'📘', cls:'badge-blue'   },
  PPTX:{ emoji:'📊', cls:'badge-amber'  },
  PPT: { emoji:'📊', cls:'badge-amber'  },
  ZIP: { emoji:'📦', cls:'badge-purple' },
  RAR: { emoji:'📦', cls:'badge-purple' },
  PNG: { emoji:'🖼️', cls:'badge-green'  },
  JPG: { emoji:'🖼️', cls:'badge-green'  },
  JPEG:{ emoji:'🖼️', cls:'badge-green'  },
}

function formatSize(bytes) {
  if (!bytes) return '?'
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(0)} Ko`
  return `${(bytes/1024/1024).toFixed(1)} Mo`
}

function UploadModal({ onClose, onUploaded }) {
  const { user } = useAuth()
  const [courses, setCourses]   = useState([])
  const [files, setFiles]       = useState([])
  const [meta, setMeta]         = useState({ subject:'math', level:'terminale', courseId:'' })
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState([])
  const [error, setError]         = useState('')

  useEffect(() => {
    getCourses().then(({ data }) => setCourses(data ?? []))
  }, [])

  const onDrop = useCallback(accepted => setFiles(prev => [...prev, ...accepted]), [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024,
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.*': [],
      'application/msword': [],
      'application/zip': [],
      'application/x-rar-compressed': [],
      'image/*': [],
    },
  })

  const removeFile = (i) => setFiles(f => f.filter((_,idx) => idx !== i))

  const upload = async () => {
    if (!files.length) { setError('Ajoutez au moins un fichier'); return }
    setError(''); setUploading(true)
    const results = []
    for (let i = 0; i < files.length; i++) {
      setProgress(p => [...p.slice(0,i), 'uploading', ...p.slice(i+1)])
      const { data, error } = await uploadFile(files[i], meta.courseId || null, user.id, meta)
      if (error) { setError(error.message); setUploading(false); return }
      results.push(data)
      setProgress(p => [...p.slice(0,i), 'done', ...p.slice(i+1)])
    }
    setUploading(false)
    results.forEach(r => onUploaded(r))
    onClose()
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.75)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:500, padding:'1rem',
    }} onClick={onClose}>
      <div className="card fade-in" style={{ width:'100%', maxWidth:520 }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize:'1.1rem', fontWeight:600, marginBottom:'1.25rem' }}>📤 Partager des fichiers</h2>
        {error && <div className="error-msg" style={{ marginBottom:'1rem' }}>{error}</div>}

        {/* Drop zone */}
        <div {...getRootProps()} style={{
          border:`2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border2)'}`,
          borderRadius:10, padding:'1.75rem', textAlign:'center', cursor:'pointer',
          background: isDragActive ? 'rgba(79,156,249,0.04)' : 'transparent',
          marginBottom:'1rem', transition:'all 0.2s',
        }}>
          <input {...getInputProps()} />
          <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>☁️</div>
          <p style={{ fontSize:'0.88rem', color:'var(--text2)' }}>
            {isDragActive ? 'Relâchez ici !' : 'Glissez vos fichiers ou cliquez pour parcourir'}
          </p>
          <p style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:'0.25rem' }}>
            PDF, DOCX, PPTX, ZIP, images — max 50 Mo
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={{ marginBottom:'1rem', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
            {files.map((f, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'0.6rem',
                padding:'0.5rem 0.75rem', background:'var(--bg3)',
                borderRadius:8, border:'1px solid var(--border)',
              }}>
                <span>{FILE_ICONS[f.name.split('.').pop().toUpperCase()]?.emoji ?? '📄'}</span>
                <span style={{ flex:1, fontSize:'0.82rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</span>
                <span style={{ fontSize:'0.72rem', color:'var(--text3)' }}>{formatSize(f.size)}</span>
                {progress[i] === 'uploading' && <div className="spinner" style={{ width:14, height:14 }}/>}
                {progress[i] === 'done'      && <span style={{ color:'var(--accent3)' }}>✓</span>}
                {!progress[i] && <button onClick={() => removeFile(i)} style={{ background:'none', border:'none', color:'var(--text3)', fontSize:'1rem' }}>×</button>}
              </div>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
          <div>
            <label style={{ fontSize:'0.78rem', color:'var(--text2)', display:'block', marginBottom:'0.3rem' }}>Matière</label>
            <select value={meta.subject} onChange={e=>setMeta(m=>({...m,subject:e.target.value}))}>
              {SUBJECTS.map(s => <option key={s} value={s}>{SUBJECT_LABEL[s]}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:'0.78rem', color:'var(--text2)', display:'block', marginBottom:'0.3rem' }}>Niveau</label>
            <select value={meta.level} onChange={e=>setMeta(m=>({...m,level:e.target.value}))}>
              {LEVELS.map(l => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:'1rem' }}>
          <label style={{ fontSize:'0.78rem', color:'var(--text2)', display:'block', marginBottom:'0.3rem' }}>Associer à un cours (optionnel)</label>
          <select value={meta.courseId} onChange={e=>setMeta(m=>({...m,courseId:e.target.value}))}>
            <option value="">— Aucun cours —</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={uploading}>Annuler</button>
          <button className="btn btn-primary" onClick={upload} disabled={uploading || !files.length}>
            {uploading ? <><span className="spinner"/> Envoi...</> : `Partager ${files.length ? `(${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FilesPage() {
  const { user } = useAuth()
  const [files,   setFiles]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [subject, setSubject] = useState('')
  const [showModal, setShowModal] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await getFiles({ subject: subject||undefined, search: search||undefined })
    setFiles(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [subject]) // eslint-disable-line

  const handleDownload = async (file) => {
    await incrementDownload(file.id)
    window.open(file.url, '_blank')
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, download_count: (f.download_count||0)+1 } : f))
  }

  return (
    <div className="page-container fade-in">
      {showModal && <UploadModal onClose={() => setShowModal(false)} onUploaded={f => setFiles(prev => [f, ...prev])} />}

      <div className="page-header">
        <h1 className="page-title">Fichiers <span className="badge badge-blue">{files.length} ressources</span></h1>
        {user && <button className="btn btn-primary" onClick={() => setShowModal(true)}>📤 Partager un fichier</button>}
      </div>

      {/* Filters */}
      <form onSubmit={e=>{e.preventDefault();load()}}
        style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Chercher un fichier..." style={{ flex:1, minWidth:180 }}/>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{ width:'auto', minWidth:150 }}>
          <option value="">Toutes matières</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{SUBJECT_LABEL[s]}</option>)}
        </select>
        <button type="submit" className="btn btn-secondary">Chercher</button>
      </form>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
      ) : files.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--text3)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>📭</div>
          <p>Aucun fichier trouvé.</p>
          {user && <button className="btn btn-primary" style={{ marginTop:'1rem' }} onClick={() => setShowModal(true)}>Partager le premier</button>}
        </div>
      ) : (
        <div className="files-grid">
          {files.map(file => {
            const ext  = (file.type ?? file.name?.split('.').pop())?.toUpperCase() ?? 'FILE'
            const info = FILE_ICONS[ext] ?? { emoji:'📄', cls:'badge-gray' }
            return (
              <div key={file.id} className="card" style={{ cursor:'pointer', transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.transform='translateY(-1px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='';e.currentTarget.style.transform=''}}>
                <div style={{
                  width:46, height:46, borderRadius:10, display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:'1.5rem', background:'rgba(255,255,255,0.04)',
                  marginBottom:'0.75rem',
                }}>{info.emoji}</div>
                <div style={{ fontWeight:500, fontSize:'0.85rem', marginBottom:'0.2rem',
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{file.name}</div>
                <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:'0.25rem' }}>
                  {formatSize(file.size)} · {file.profiles?.username}
                </div>
                <div style={{ fontSize:'0.7rem', color:'var(--text3)', marginBottom:'0.75rem' }}>
                  {formatDistanceToNow(new Date(file.created_at), { locale:fr, addSuffix:true })}
                </div>
                <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.75rem', flexWrap:'wrap' }}>
                  <span className={`badge ${info.cls}`}>{ext}</span>
                  {file.subject && <span className="badge badge-gray">{SUBJECT_LABEL[file.subject] ?? file.subject}</span>}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'0.72rem', color:'var(--text3)' }}>⬇️ {file.download_count ?? 0}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => handleDownload(file)}>Télécharger</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
