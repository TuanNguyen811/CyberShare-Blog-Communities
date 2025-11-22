import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';
import { Calendar, Eye, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/posts', {
        params: {
          page,
          size: 10,
          sort: 'publishedAt,desc',
        },
      });
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to CyberShare
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              A modern blogging platform for sharing your ideas with the world
            </p>

            {isAuthenticated ? (
              <div className="flex justify-center space-x-4">
                <Link to="/write">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    Write a Story
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    My Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latest Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Stories</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">No posts yet. Be the first to write!</p>
            {isAuthenticated && (
              <Link to="/write">
                <Button>Write First Story</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <Link to={`/post/${post.slug}`} className="block">
                  <div className="flex flex-col md:flex-row">
                    {/* Cover Image */}
                    {post.coverImageUrl && (
                      <div className="md:w-64 h-48 md:h-auto bg-gray-200">
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {post.categoryName && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {post.categoryName}
                          </span>
                        )}
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
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                        {post.title}
                      </h3>

                      {/* Author */}
                      <Link
                        to={`/author/${post.authorUsername}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 mb-3 hover:opacity-80 w-fit"
                      >
                        {post.authorAvatarUrl ? (
                          <img
                            src={post.authorAvatarUrl}
                            alt={post.authorDisplayName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                            {post.authorDisplayName?.charAt(0) || 'U'}
                          </div>
                        )}
                        <span className="text-sm text-gray-700 font-medium">
                          {post.authorDisplayName}
                        </span>
                      </Link>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.publishedAt}>
                              {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                            </time>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views.toLocaleString()} views</span>
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="mt-4 flex items-center text-blue-600 font-medium hover:text-blue-700">
                        <span>Read more</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-gray-700">
              Page {page + 1} of {totalPages}
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

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Share Your Stories</h3>
              <p className="text-gray-600">
                Create and publish engaging content with our easy-to-use markdown editor
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect with Others</h3>
              <p className="text-gray-600">
                Follow authors, like posts, and engage with the community
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Discover Content</h3>
              <p className="text-gray-600">
                Explore trending posts and find content that interests you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
