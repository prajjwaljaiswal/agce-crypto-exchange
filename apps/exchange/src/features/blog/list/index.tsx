import { Calendar, ArrowRight, ChevronRight } from 'lucide-react'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  readTime: string
  thumbnailColor: string
  thumbnailIcon: string
}

const posts: BlogPost[] = [
  {
    slug: 'understanding-defi-liquidity',
    title: 'Understanding DeFi Liquidity Pools: A Complete Guide',
    excerpt: 'Liquidity pools are the backbone of decentralised finance. In this guide, we break down how they work, the risks involved, and how to maximise your yield.',
    date: 'April 8, 2025',
    author: 'AGCE Research Team',
    category: 'Education',
    readTime: '8 min read',
    thumbnailColor: '#627EEA',
    thumbnailIcon: '🔷',
  },
  {
    slug: 'bitcoin-halving-2024-impact',
    title: 'Bitcoin Halving 2024: What It Means for Your Portfolio',
    excerpt: 'The Bitcoin halving event has historically preceded major bull runs. We analyse the on-chain data and what traders should watch in the months ahead.',
    date: 'March 28, 2025',
    author: 'Sarah Al-Mansouri',
    category: 'Market Analysis',
    readTime: '6 min read',
    thumbnailColor: '#F7931A',
    thumbnailIcon: '₿',
  },
  {
    slug: 'agce-launchpad-overview',
    title: 'Introducing the AGCE Launchpad: Your Gateway to Early-Stage Tokens',
    excerpt: 'The AGCE Launchpad gives vetted projects a platform to launch to a global audience of crypto-native investors. Here is everything you need to know.',
    date: 'March 15, 2025',
    author: 'AGCE Product Team',
    category: 'Announcements',
    readTime: '4 min read',
    thumbnailColor: '#D1AA67',
    thumbnailIcon: '🚀',
  },
  {
    slug: 'how-to-use-stop-limit-orders',
    title: 'How to Use Stop-Limit Orders to Protect Your Trades',
    excerpt: 'Stop-limit orders are a powerful risk management tool that every trader should master. This tutorial walks you through real-world examples and best practices.',
    date: 'March 5, 2025',
    author: 'Trading Academy',
    category: 'Education',
    readTime: '5 min read',
    thumbnailColor: '#26A17B',
    thumbnailIcon: '📊',
  },
  {
    slug: 'top-altcoins-q2-2025',
    title: 'Top Altcoins to Watch in Q2 2025',
    excerpt: 'From layer-2 scaling solutions to AI-integrated blockchains, we spotlight the projects with the strongest fundamentals heading into Q2 2025.',
    date: 'February 22, 2025',
    author: 'AGCE Research Team',
    category: 'Market Analysis',
    readTime: '7 min read',
    thumbnailColor: '#9945FF',
    thumbnailIcon: '⭐',
  },
  {
    slug: 'kyc-why-it-matters',
    title: "KYC in Crypto: Why It Matters and What to Expect",
    excerpt: "Know Your Customer verification is a legal requirement on regulated exchanges. We explain the process, why it protects you, and how AGCE keeps your data safe.",
    date: 'February 10, 2025',
    author: 'Compliance Team',
    category: 'Compliance',
    readTime: '5 min read',
    thumbnailColor: '#FF6B6B',
    thumbnailIcon: '🔐',
  },
]

const categories = ['All', 'Education', 'Market Analysis', 'Announcements', 'Compliance']

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-primary)]/40 transition-colors group">
      {/* Thumbnail */}
      <div
        className="h-44 flex items-center justify-center text-5xl"
        style={{ background: `linear-gradient(135deg, ${post.thumbnailColor}22, ${post.thumbnailColor}08)` }}
      >
        {post.thumbnailIcon}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-0.5 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">{post.readTime}</span>
        </div>

        <h2 className="font-bold text-[var(--color-text)] text-base leading-snug mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {post.title}
        </h2>

        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Calendar size={12} />
            <span>{post.date}</span>
          </div>
          <a
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:gap-2 transition-all"
          >
            Read More <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </article>
  )
}

export function BlogListPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div
        className="py-14 px-6"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #161210 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">Blog</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">AGCE Blog</h1>
          <p className="text-[var(--color-text-muted)] text-lg">
            Market analysis, educational content, and exchange updates.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {/* Categories filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                cat === 'All'
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-black'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-xl text-sm font-medium border transition-colors ${
                page === 1
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-black'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
