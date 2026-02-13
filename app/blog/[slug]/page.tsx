'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { apiClient } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  ArrowLeft,
  Calendar,
  User,
  AlertCircle,
  Home,
  Clock,
  Share2
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getBlogPost(slug);
      setPost(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || 'The blog post you are looking for does not exist.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Button>
              </Link>
              <Link href="/">
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Blog</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article>
          {/* Featured Image */}
          {post.image_url && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  {post.title}
                </h1>
              </div>
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            {!post.image_url && (
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-6">
                {post.title}
              </h1>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{post.author_name}</p>
                  <p className="text-xs text-gray-500">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <time>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
              </div>
              {post.updated_at !== post.created_at && (
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <span>Updated {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}</span>
                </div>
              )}
            </div>

            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mt-6 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border-l-4 border-emerald-500">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Post Content */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg prose-emerald max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-10 mb-5 pb-3 border-b border-gray-200" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-gray-700 leading-relaxed mb-5 text-lg" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-outside ml-6 mb-6 space-y-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-outside ml-6 mb-6 space-y-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-gray-700 text-lg leading-relaxed" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-emerald-600 hover:text-emerald-700 underline font-medium transition-colors" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-emerald-500 pl-6 pr-4 py-2 italic text-gray-700 my-6 bg-emerald-50/50 rounded-r-lg"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code
                          className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-mono text-sm border border-emerald-200"
                          {...props}
                        />
                      ) : (
                        <code
                          className="block bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto text-sm font-mono my-6 shadow-lg"
                          {...props}
                        />
                      ),
                    pre: ({ node, ...props }) => (
                      <pre className="my-6" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="my-10 border-gray-300" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-gray-900" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-gray-800" {...props} />
                    ),
                    img: ({ node, ...props }) => (
                      <img className="rounded-xl my-8 shadow-lg w-full" {...props} />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Post Footer */}
          <footer className="mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-100">
              <div>
                <p className="text-sm text-gray-600 mb-1">Enjoyed this article?</p>
                <p className="font-semibold text-gray-900">Share it with others</p>
              </div>
              <div className="flex gap-3">
                <Link href="/blog">
                  <Button variant="outline" className="gap-2 hover:bg-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    More Articles
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg">
                    <Home className="w-4 h-4" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="font-medium">© 2025 GettingDocs. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-4">
              <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-emerald-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-emerald-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
