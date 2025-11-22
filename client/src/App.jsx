import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import WritePage from './pages/WritePage';
import EditPostPage from './pages/EditPostPage';
import PostDetailPage from './pages/PostDetailPage';
import DashboardPage from './pages/DashboardPage';
import AuthorPage from './pages/AuthorPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="explore" element={<ExplorePage />} />
            
            {/* Protected routes */}
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="write" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
            <Route path="edit/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            
            {/* Public post and author pages */}
            <Route path="post/:slug" element={<PostDetailPage />} />
            <Route path="author/:username" element={<AuthorPage />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
