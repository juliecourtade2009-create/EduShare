@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg:      #0a0e1a;
  --bg2:     #111827;
  --bg3:     #1a2235;
  --border:  rgba(99,179,237,0.12);
  --border2: rgba(99,179,237,0.28);
  --accent:  #4f9cf9;
  --accent2: #7c3aed;
  --accent3: #10b981;
  --amber:   #f59e0b;
  --danger:  #ef4444;
  --text:    #f0f4ff;
  --text2:   #94a3b8;
  --text3:   #64748b;
  --card:    #111827;
  --radius:  12px;
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
  font-family: 'Sora', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  line-height: 1.6;
}

a { color: inherit; text-decoration: none; }

button { cursor: pointer; font-family: 'Sora', sans-serif; }

input, textarea, select {
  font-family: 'Sora', sans-serif;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
input:focus, textarea:focus, select:focus {
  border-color: var(--accent);
}
input::placeholder, textarea::placeholder { color: var(--text3); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--bg3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text3); }

/* Utilities */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.18s;
}
.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-primary:hover { opacity: 0.87; }

.btn-secondary {
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text2);
}
.btn-secondary:hover { border-color: var(--border2); color: var(--text); }

.btn-ghost {
  background: none;
  border: 1px solid var(--border);
  color: var(--text2);
}
.btn-ghost:hover { background: var(--bg3); }

.btn-danger {
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.3);
  color: var(--danger);
}
.btn-danger:hover { background: rgba(239,68,68,0.25); }

.btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
.btn-lg { padding: 0.7rem 1.6rem; font-size: 1rem; }

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.55rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 500;
}
.badge-blue   { background: rgba(79,156,249,0.15);  color: var(--accent); }
.badge-green  { background: rgba(16,185,129,0.15);  color: var(--accent3); }
.badge-amber  { background: rgba(245,158,11,0.15);  color: var(--amber); }
.badge-purple { background: rgba(124,58,237,0.15);  color: #a78bfa; }
.badge-red    { background: rgba(239,68,68,0.15);   color: var(--danger); }
.badge-gray   { background: rgba(100,116,139,0.15); color: var(--text2); }

.tag {
  display: inline-flex;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  font-size: 0.7rem;
  color: var(--text2);
}

.divider { height: 1px; background: var(--border); margin: 1.25rem 0; }

.spinner {
  width: 22px; height: 22px;
  border: 2px solid var(--border2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-msg {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  color: #fca5a5;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  font-size: 0.82rem;
}

.success-msg {
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.2);
  color: #6ee7b7;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  font-size: 0.82rem;
}

/* Fade-in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fadeIn 0.25s ease forwards; }

/* Grid layouts */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

/* Page layout */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
}

.forum-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .forum-layout { grid-template-columns: 1fr; }
  .forum-sidebar-col { display: none; }
}
@media (max-width: 640px) {
  .page-container { padding: 1rem; }
  .courses-grid { grid-template-columns: 1fr; }
}
