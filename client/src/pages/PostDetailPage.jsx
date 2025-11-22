import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Calendar, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function PostDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/posts/slug/${slug}`);
      setPost(response.data);
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setError(err.response?.data?.message || 'Post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      await apiClient.delete(`/api/posts/${post.id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const isAuthor = user && post && user.id === post.authorId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      {post.coverImageUrl && (
        <div className="w-full h-96 bg-gray-200">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <header className="mb-8 border-b pb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {isAuthor && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/edit/${post.id}`)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-4">
              <Link
                to={`/author/${post.authorUsername}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                {post.authorAvatarUrl ? (
                  <img
                    src={post.authorAvatarUrl}
                    alt={post.authorDisplayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {post.authorDisplayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.authorDisplayName}
                  </p>
                  <p className="text-sm text-gray-500">@{post.authorUsername}</p>
                </div>
              </Link>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
              {post.categoryName && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {post.categoryName}
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-800'
                    : post.status === 'DRAFT'
                    ? 'bg-gray-100 text-gray-800'
                    : post.status === 'PENDING_REVIEW'
                    ? 'bg-yellow-100 text-yellow-800'
                    : post.status === 'ARCHIVED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {post.status.replace('_', ' ')}
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:mb-4
            prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:text-gray-700 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
            prose-img:rounded-lg prose-img:shadow-md
            prose-hr:border-gray-300 prose-hr:my-8
            prose-table:border-collapse prose-table:w-full
            prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-th:text-left
            prose-td:border prose-td:border-gray-300 prose-td:p-2
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Related Posts Section - Placeholder */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More from {post.authorDisplayName}</h2>
          <div className="text-gray-500 text-center py-8">
            Related posts coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}
