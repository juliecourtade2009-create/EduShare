import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import { ThreadList, ThreadDetail } from './pages/ForumPages'
import FilesPage from './pages/FilesPage'
import ProfilePage from './pages/ProfilePage'
import { LoginPage, SignupPage } from './pages/AuthPages'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/courses"   element={<CoursesPage />} />
          <Route path="/forum"     element={<ThreadList />} />
          <Route path="/forum/:id" element={<ThreadDetail />} />
          <Route path="/files"     element={<FilesPage />} />
          <Route path="/profile"   element={<ProfilePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/signup"    element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
