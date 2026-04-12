import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react'

export function BlogDetailsPage() {
  const post = {
    title: 'Understanding DeFi Liquidity Pools: A Complete Guide',
    date: 'April 8, 2025',
    author: 'AGCE Research Team',
    category: 'Education',
    readTime: '8 min read',
    thumbnailColor: '#627EEA',
    thumbnailIcon: '🔷',
  }

  const sections = [
    {
      heading: 'What Is a Liquidity Pool?',
      body: `A liquidity pool is a smart-contract-based reserve of two or more tokens locked into a decentralised exchange (DEX). Users called liquidity providers (LPs) deposit equal values of two assets — for example, ETH and USDT — and in return receive LP tokens representing their share of the pool. These pools enable automated market makers (AMMs) to quote prices and execute trades without a traditional order book.`,
    },
    {
      heading: 'How Are Prices Determined?',
      body: `Most AMMs use a constant product formula (x × y = k), where x and y are the quantities of the two tokens and k is a fixed constant. As traders buy one token, its price rises relative to the other, keeping the product constant. This mechanism self-adjusts prices continuously without centralised price feeds, making DEXes resilient and censorship-resistant.`,
    },
    {
      heading: 'Risks: Impermanent Loss',
      body: `Impermanent loss (IL) occurs when the price ratio of your deposited assets changes relative to when you deposited them. The greater the price divergence, the larger the potential IL. For example, if ETH doubles in price after you deposited, you would have been better off simply holding ETH rather than providing liquidity — the pool automatically rebalances, leaving you with less ETH and more USDT than you started with. Trading fees collected partially offset this loss.`,
    },
    {
      heading: 'Maximising Yield Safely',
      body: `To maximise yield while managing risk: favour stable-to-stable pools (e.g., USDC/USDT) where IL is minimal; choose pools on reputable, audited protocols; compound rewards regularly; and always account for gas costs when calculating net returns. Concentrated liquidity positions (as offered by Uniswap v3 and similar) can amplify fee earnings but require active management to remain in range.`,
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Back link */}
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </a>

        {/* Category badge */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-[var(--color-text-muted)] mb-8 pb-8 border-b border-[var(--color-border)]">
          <span className="flex items-center gap-1.5">
            <User size={14} /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {post.readTime}
          </span>
          <button className="ml-auto flex items-center gap-1.5 text-[var(--color-primary)] hover:opacity-80 transition-opacity">
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Featured image */}
        <div
          className="h-64 lg:h-80 rounded-2xl flex items-center justify-center text-7xl mb-10"
          style={{
            background: `linear-gradient(135deg, ${post.thumbnailColor}25, ${post.thumbnailColor}08)`,
            border: '1px solid var(--color-border)',
          }}
        >
          {post.thumbnailIcon}
        </div>

        {/* Article body */}
        <article className="space-y-8">
          <p className="text-[var(--color-text-muted)] text-base leading-relaxed">
            Decentralised finance has transformed the way people access financial services, and liquidity pools sit at the very core of this revolution. Whether you are a casual yield-seeker or a sophisticated DeFi strategist, understanding how liquidity pools work is essential for navigating the ecosystem safely and profitably.
          </p>

          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-3">{section.heading}</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">{section.body}</p>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-3">Conclusion</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Liquidity pools have democratised market-making and opened up passive income opportunities to anyone with crypto assets. However, they are not without risk — impermanent loss, smart-contract exploits, and rug pulls remain real concerns. Do your own research, start with small positions, and stick to well-audited protocols to build your DeFi portfolio responsibly.
            </p>
          </section>
        </article>

        {/* Author card */}
        <div className="mt-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex items-center gap-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: 'var(--color-primary)', color: '#000' }}
          >
            A
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text)]">{post.author}</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              The AGCE Research Team publishes in-depth analysis and educational content on crypto markets, regulation, and blockchain technology.
            </p>
          </div>
        </div>

        {/* Back link bottom */}
        <div className="mt-10">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all articles
          </a>
        </div>
      </div>
    </div>
  )
}
