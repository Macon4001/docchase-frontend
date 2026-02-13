'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { apiClient } from '@/lib/api';
import {
  FileText,
  ArrowRight,
  Calendar,
  Clock,
  Home
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_email: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getBlogPosts();
      setPosts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-2">
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
              <p className="text-gray-600 mt-2">
                Tips, insights, and best practices for document collection
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700 font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {posts.length === 0 && !loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for articles and insights
              </p>
              <Link href="/">
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-none shadow-md"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <time>
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full gap-2 group hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2025 GettingDocs. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-4">
              <Link href="/privacy" className="hover:text-emerald-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-emerald-600">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-emerald-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
