'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { apiClient } from '@/lib/api';
import {
  FileText,
  ArrowRight,
  Calendar,
  User,
  BookOpen,
  Home
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
  const [email, setEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setSubscribeMessage('');

    // Simulate subscription (replace with actual API call)
    setTimeout(() => {
      setSubscribeMessage('Thank you for subscribing!');
      setEmail('');
      setSubscribeLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-semibold text-lg">Gettingdocs</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/blog" className="text-sm font-medium text-gray-900">
                Blog
              </Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-sm">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Subscription */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Inside Design: Stories and interviews
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Subscribe to learn about new product features, the latest in technology, and updates.
          </p>

          {/* Email Subscription Form */}
          <form onSubmit={handleSubscribe} className="flex items-center gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 px-6 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={subscribeLoading}
              className="h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium"
            >
              {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          {subscribeMessage && (
            <p className="mt-4 text-sm text-primary font-medium">{subscribeMessage}</p>
          )}
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Recent blog posts</h2>

          {error && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-700 font-medium">{error}</p>
              </CardContent>
            </Card>
          )}

          {posts.length === 0 && !loading ? (
            <Card className="bg-gray-50">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No blog posts yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Check back soon for articles and insights about document management and accounting best practices
                </p>
                <Link href="/">
                  <Button className="gap-2">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {posts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="flex flex-col h-full">
                    {/* Featured Image */}
                    {post.image_url ? (
                      <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="flex-1 flex flex-col">
                      {/* Author and Date */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-medium text-gray-900">
                          {post.author_name}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-600 mb-6 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Tags/Categories - You can add these if available in your data */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50">
                          Design
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50">
                          Research
                        </Badge>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
