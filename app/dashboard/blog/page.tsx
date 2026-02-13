'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { AuthClient } from '@/lib/auth-client';
import { apiClient } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  Save,
  X,
  Sparkles,
  Copy,
  CheckCircle,
  Calendar
} from 'lucide-react';

const ADMIN_EMAIL = 'macon4001@gmail.com';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  scheduled_publish_at: string | null;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_email: string;
}

const AI_PROMPT_TEMPLATE = `Write a blog post about document collection and accounting best practices with the following structure:

# Structure Requirements:
- **Title**: Create an engaging, SEO-friendly title (60-70 characters)
- **Slug**: Generate a URL-friendly slug (lowercase, hyphens, no special chars)
- **Excerpt**: Write a compelling 2-3 sentence summary (150-160 characters)
- **Content**: Use proper markdown formatting with:
  - H2 (##) for main sections
  - H3 (###) for subsections
  - Bullet points and numbered lists where appropriate
  - Bold and italic for emphasis
  - Code blocks if discussing technical topics

# Content Structure:
1. **Introduction** (2-3 paragraphs)
   - Hook the reader
   - State the problem or topic
   - Preview what the article covers

2. **Main Sections** (3-5 sections with H2 headings)
   - Each section should be 2-4 paragraphs
   - Use examples and practical tips
   - Include actionable advice

3. **Conclusion** (1-2 paragraphs)
   - Summarize key takeaways
   - Call to action

# Topic Ideas:
- Document collection best practices
- How to chase documents efficiently
- Client communication tips
- Automation in accounting workflows
- Time-saving tips for accountants
- WhatsApp for business communication
- GDPR compliance for document handling

Please write about: [YOUR TOPIC HERE]`;

export default function BlogAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    published: false,
    scheduled_publish_at: '',
  });

  useEffect(() => {
    const session = AuthClient.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    if (session.user.email !== ADMIN_EMAIL) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    apiClient.setToken(session.token);
    loadPosts();
  }, [router]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getAdminBlogPosts();
      setPosts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      published: false,
      scheduled_publish_at: '',
    });
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(false);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      published: post.published,
      scheduled_publish_at: post.scheduled_publish_at ? new Date(post.scheduled_publish_at).toISOString().slice(0, 16) : '',
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      published: false,
      scheduled_publish_at: '',
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.slug || !formData.content) {
        setError('Title, slug, and content are required');
        return;
      }

      const dataToSave = {
        ...formData,
        scheduled_publish_at: formData.scheduled_publish_at || null,
      };

      if (editingPost) {
        await apiClient.updateBlogPost(editingPost.id, dataToSave);
      } else {
        await apiClient.createBlogPost(dataToSave);
      }

      await loadPosts();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await apiClient.deleteBlogPost(id);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto mt-12">
          <Card className="border-red-200">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to access the blog admin area.
              </p>
              <Link href="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Blog Management</h2>
            <p className="text-gray-600 mt-1">Create and manage blog posts</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleCopyPrompt}
              variant="outline"
              className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              {promptCopied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Copy AI Prompt
                </>
              )}
            </Button>
            {!isCreating && !editingPost && (
              <Button
                onClick={handleCreateNew}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Editor */}
        {(isCreating || editingPost) && (
          <Card className="mb-8 border-emerald-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (!editingPost) {
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: generateSlug(e.target.value),
                        });
                      }
                    }}
                    placeholder="Enter post title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="post-url-slug"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Will be accessible at: /blog/{formData.slug || 'your-slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Optional)
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Brief summary of the post"
                    className="w-full"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Markdown)
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Write your post content in markdown..."
                    className="w-full font-mono text-sm"
                    rows={20}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => {
                        setFormData({ ...formData, published: e.target.checked });
                        // Clear schedule when publishing immediately
                        if (e.target.checked) {
                          setFormData({ ...formData, published: true, scheduled_publish_at: '' });
                        }
                      }}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700">
                      Publish immediately
                    </label>
                  </div>

                  {!formData.published && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Schedule for later (optional)
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.scheduled_publish_at}
                        onChange={(e) =>
                          setFormData({ ...formData, scheduled_publish_at: e.target.value })
                        }
                        className="w-full"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      {formData.scheduled_publish_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Will publish on {new Date(formData.scheduled_publish_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Save className="w-4 h-4" />
                    Save Post
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        {!isCreating && !editingPost && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No blog posts yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first blog post
                  </p>
                  <Button
                    onClick={handleCreateNew}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {post.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={
                              post.published
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : post.scheduled_publish_at
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }
                          >
                            {post.published
                              ? 'Published'
                              : post.scheduled_publish_at
                              ? `Scheduled ${formatDistanceToNow(new Date(post.scheduled_publish_at), { addSuffix: true })}`
                              : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          /blog/{post.slug}
                        </p>
                        {post.excerpt && (
                          <p className="text-gray-700 mb-3">{post.excerpt}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Created {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          {post.updated_at !== post.created_at && (
                            <> • Updated {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}</>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleEdit(post)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(post.id)}
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
