'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Home,
  User,
  BookOpen
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary mb-3 transition-colors">
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-emerald-800 bg-clip-text text-transparent">
                    Blog
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 max-w-2xl">
                Tips, insights, and best practices for document collection and accounting efficiency
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50/50 backdrop-blur">
            <CardContent className="p-4">
              <p className="text-red-700 font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {posts.length === 0 && !loading ? (
          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Check back soon for articles and insights about document management and accounting best practices
              </p>
              <Link href="/">
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-emerald-700 hover:to-emerald-800 shadow-lg">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none shadow-lg bg-white h-full flex flex-col">
                  {/* Featured Image */}
                  {post.image_url ? (
                    <div className="relative w-full h-48 bg-gradient-to-br from-emerald-100 to-blue-100 overflow-hidden">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-48 bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}

                  <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <time>
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate">{post.author_name}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-primary font-medium text-sm mt-auto">
                      <span>Read article</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t mt-20" style={{ backgroundColor: '#f0fcf4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm" style={{ color: '#4c5663' }}>
                © {new Date().getFullYear()} Gettingdocs. All rights reserved.
              </p>
              <p className="text-sm" style={{ color: '#4c5663' }}>
                Created by Blue Haven Digital
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/privacy"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Terms & Conditions
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
