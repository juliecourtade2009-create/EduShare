import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Helpers Auth ─────────────────────────────────────────────
export const signUp = (email, password, username) =>
  supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getUser = () => supabase.auth.getUser()

// ── Helpers Cours ────────────────────────────────────────────
export const getCourses = (filters = {}) => {
  let query = supabase
    .from('courses')
    .select(`*, profiles(username, avatar_url), files(count)`)
    .order('created_at', { ascending: false })

  if (filters.subject) query = query.eq('subject', filters.subject)
  if (filters.level)   query = query.eq('level', filters.level)
  if (filters.search)  query = query.ilike('title', `%${filters.search}%`)

  return query
}

export const getCourseById = (id) =>
  supabase
    .from('courses')
    .select(`*, profiles(username, avatar_url), files(*)`)
    .eq('id', id)
    .single()

export const createCourse = (data) =>
  supabase.from('courses').insert(data).select().single()

// ── Helpers Fichiers ─────────────────────────────────────────
export const getFiles = (filters = {}) => {
  let query = supabase
    .from('files')
    .select(`*, profiles(username), courses(title, subject)`)
    .order('created_at', { ascending: false })

  if (filters.subject)  query = query.eq('subject', filters.subject)
  if (filters.search)   query = query.ilike('name', `%${filters.search}%`)
  if (filters.courseId) query = query.eq('course_id', filters.courseId)

  return query
}

export const uploadFile = async (file, courseId, userId, metadata) => {
  // 1. Upload dans le bucket Storage
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('course-files')
    .upload(path, file)

  if (storageError) return { error: storageError }

  // 2. URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('course-files')
    .getPublicUrl(path)

  // 3. Enregistrement en BDD
  return supabase.from('files').insert({
    name: file.name,
    size: file.size,
    type: ext.toUpperCase(),
    url: publicUrl,
    storage_path: path,
    course_id: courseId,
    user_id: userId,
    subject: metadata.subject,
    level: metadata.level,
    download_count: 0,
  }).select().single()
}

export const incrementDownload = (fileId) =>
  supabase.rpc('increment_download', { file_id: fileId })

// ── Helpers Forum ────────────────────────────────────────────
export const getThreads = (filters = {}) => {
  let query = supabase
    .from('threads')
    .select(`*, profiles(username, avatar_url), replies(count)`)
    .order('created_at', { ascending: false })

  if (filters.category) query = query.eq('category', filters.category)
  if (filters.search)   query = query.ilike('title', `%${filters.search}%`)

  return query
}

export const getThreadById = (id) =>
  supabase
    .from('threads')
    .select(`*, profiles(username, avatar_url)`)
    .eq('id', id)
    .single()

export const getReplies = (threadId) =>
  supabase
    .from('replies')
    .select(`*, profiles(username, avatar_url)`)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

export const createThread = (data) =>
  supabase.from('threads').insert(data).select().single()

export const createReply = (data) =>
  supabase.from('replies').insert(data).select().single()

export const markSolved = (threadId) =>
  supabase.from('threads').update({ solved: true }).eq('id', threadId)

// ── Helpers Profil ───────────────────────────────────────────
export const getProfile = (userId) =>
  supabase.from('profiles').select('*').eq('id', userId).single()

export const updateProfile = (userId, data) =>
  supabase.from('profiles').update(data).eq('id', userId)

export const getTopContributors = () =>
  supabase
    .from('profiles')
    .select('*')
    .order('points', { ascending: false })
    .limit(5)
