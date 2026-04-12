import { Calendar, ChevronRight, Bell } from 'lucide-react'

type AnnouncementCategory = 'All' | 'New Listings' | 'Maintenance' | 'Promotions' | 'Updates' | 'Delistings'

interface Announcement {
  id: string
  title: string
  excerpt: string
  date: string
  category: Exclude<AnnouncementCategory, 'All'>
}

const announcements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'AGCE Listing: NovaDeFi (NOVA) Now Available for Spot Trading',
    excerpt: 'We are pleased to announce the listing of NovaDeFi (NOVA) on AGCE Spot. Trading pairs NOVA/USDT and NOVA/BTC will open on April 20, 2025 at 12:00 UTC.',
    date: 'April 15, 2025',
    category: 'New Listings',
  },
  {
    id: 'ann-002',
    title: 'Scheduled Maintenance — April 18, 2025 (2:00–4:00 AM UTC)',
    excerpt: 'AGCE will undergo scheduled maintenance to upgrade core matching engine infrastructure. Trading, deposits, and withdrawals will be temporarily unavailable during this window.',
    date: 'April 14, 2025',
    category: 'Maintenance',
  },
  {
    id: 'ann-003',
    title: 'Spring Trading Competition: Win Up to $50,000 in AGCE Tokens',
    excerpt: 'Join our Spring Trading Competition running April 15–30. Top 100 traders by volume compete for a $50,000 prize pool paid in AGCE tokens. Register now to participate.',
    date: 'April 12, 2025',
    category: 'Promotions',
  },
  {
    id: 'ann-004',
    title: 'New Feature: One-Click Portfolio Rebalancer Now Live',
    excerpt: 'Automatically rebalance your AGCE portfolio to your target allocation with one click. Available to all verified users from today. Find it in your Portfolio section.',
    date: 'April 10, 2025',
    category: 'Updates',
  },
  {
    id: 'ann-005',
    title: 'Fee Reduction: Spot Trading Fees Lowered for All VIP Tiers',
    excerpt: 'Effective April 1, 2025, spot trading maker fees for VIP 2 and above have been reduced by up to 20%. See the updated fee schedule on our Fees page.',
    date: 'March 30, 2025',
    category: 'Updates',
  },
  {
    id: 'ann-006',
    title: 'Delisting Notice: SampleCoin (SMP) — April 25, 2025',
    excerpt: 'Due to low liquidity and failure to meet listing standards, SMP will be delisted on April 25, 2025. Users are advised to withdraw SMP funds before this date.',
    date: 'March 25, 2025',
    category: 'Delistings',
  },
  {
    id: 'ann-007',
    title: 'AGCE Referral Programme: Earn 30% Commission on Every Trade',
    excerpt: 'Our referral programme has been upgraded — earn up to 30% lifetime commission on trading fees from users you refer. Log in to find your unique referral link.',
    date: 'March 20, 2025',
    category: 'Promotions',
  },
]

const categoryColors: Record<Exclude<AnnouncementCategory, 'All'>, string> = {
  'New Listings': 'bg-green-400/10 text-green-400',
  'Maintenance': 'bg-yellow-400/10 text-yellow-400',
  'Promotions': 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
  'Updates': 'bg-blue-400/10 text-blue-400',
  'Delistings': 'bg-red-400/10 text-red-400',
}

const categories: AnnouncementCategory[] = ['All', 'New Listings', 'Maintenance', 'Promotions', 'Updates', 'Delistings']

export function AnnouncementPage() {
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
            <span className="text-[var(--color-primary)]">Announcements</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <Bell size={32} className="text-[var(--color-primary)]" />
            <h1 className="text-4xl font-bold text-white">Announcements</h1>
          </div>
          <p className="text-[var(--color-text-muted)] text-lg">
            Stay up to date with the latest news, listings, and platform updates from AGCE.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Categories
            </h2>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    cat === 'All'
                      ? 'bg-[var(--color-primary)] text-black'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {cat}
                  <ChevronRight size={14} className="opacity-50" />
                </button>
              ))}
            </nav>
          </div>

          {/* Announcements list */}
          <div className="lg:col-span-3 space-y-4">
            {announcements.map((ann) => (
              <article
                key={ann.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-primary)]/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[ann.category]}`}>
                        {ann.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                        <Calendar size={11} /> {ann.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[var(--color-text)] text-base group-hover:text-[var(--color-primary)] transition-colors mb-1.5">
                      {ann.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                      {ann.excerpt}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-[var(--color-text-muted)] flex-shrink-0 mt-1 group-hover:text-[var(--color-primary)] transition-colors"
                  />
                </div>
              </article>
            ))}

            {/* Load more */}
            <div className="text-center pt-4">
              <button className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-8 py-3 rounded-xl text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
