import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';
import { Edit2, Calendar, Eye, Mail, Settings } from 'lucide-react';
import { format } from 'date-fns';
import EditProfileModal from '@/components/EditProfileModal';

export default function ProfilePage() {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user, page]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/posts/my-posts', {
        params: {
          page,
          size: 10,
          sort: 'createdAt,desc',
        },
      });
      setPosts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2">
              {/* Profile Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {user.displayName}
                  </h1>
                  
                  <Button
                    onClick={() => setShowEditModal(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`${
                      activeTab === 'home'
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`${
                      activeTab === 'about'
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
                  >
                    About
                  </button>
                </nav>
              </div>

              {/* Content */}
              {activeTab === 'home' ? (
                <div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">You haven't written any stories yet.</p>
                      <Link to="/write">
                        <Button>Write Your First Story</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {posts.map((post) => (
                        <article key={post.id} className="border-b border-gray-200 pb-8 last:border-0">
                          <Link to={`/post/${post.slug}`}>
                            <div className="group cursor-pointer">
                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        post.status === 'PUBLISHED'
                                          ? 'bg-green-100 text-green-800'
                                          : post.status === 'DRAFT'
                                          ? 'bg-gray-100 text-gray-800'
                                          : post.status === 'PENDING_REVIEW'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {post.status.replace('_', ' ')}
                                    </span>
                                    {post.categoryName && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                        {post.categoryName}
                                      </span>
                                    )}
                                  </div>

                                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                                    {post.title}
                                  </h2>

                                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <time dateTime={post.createdAt}>
                                        {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                      </time>
                                    </div>
                                    {post.status === 'PUBLISHED' && (
                                      <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{post.views} views</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-2">
                                    <Link to={`/edit/${post.id}`} onClick={(e) => e.stopPropagation()}>
                                      <Button variant="outline" size="sm" className="gap-1">
                                        <Edit2 className="h-3 w-3" />
                                        Edit
                                      </Button>
                                    </Link>
                                    {post.status === 'PUBLISHED' && (
                                      <Link to={`/post/${post.slug}`} onClick={(e) => e.stopPropagation()}>
                                        <Button variant="outline" size="sm">
                                          View
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>

                                {post.coverImageUrl && (
                                  <div className="w-32 h-32 flex-shrink-0">
                                    <img
                                      src={post.coverImageUrl}
                                      alt={post.title}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </article>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8 pt-8 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-4 text-gray-700">
                        {page + 1} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose max-w-none">
                  <h2>About {user.displayName}</h2>
                  {user.about ? (
                    <div className="whitespace-pre-wrap">{user.about}</div>
                  ) : (
                    <p className="text-gray-500">No about section yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="text-center mb-6">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-gray-600">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user.displayName}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4">
                    {posts.length} {posts.length === 1 ? 'Story' : 'Stories'}
                  </p>

                  <Button
                    onClick={() => setShowEditModal(true)}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="space-y-3">
                    {user.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>
                        Joined {format(new Date(user.createdAt || new Date()), 'MMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-2">
                  <Link to="/write">
                    <Button variant="outline" className="w-full justify-start">
                      Write a story
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      Stories
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
