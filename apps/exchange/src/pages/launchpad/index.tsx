import { useState } from 'react'
import { Rocket, Calendar, ChevronRight, ExternalLink } from 'lucide-react'

type ProjectStatus = 'active' | 'upcoming' | 'completed'

interface Project {
  name: string
  symbol: string
  icon: string
  iconColor: string
  description: string
  progress: number
  price: string
  totalRaise: string
  startDate: string
  endDate: string
  status: ProjectStatus
}

const projects: Project[] = [
  {
    name: 'NovaDeFi',
    symbol: 'NOVA',
    icon: '⭐',
    iconColor: '#9945FF',
    description: 'Next-generation decentralized finance protocol with cross-chain liquidity aggregation.',
    progress: 73,
    price: '$0.045',
    totalRaise: '$4.5M',
    startDate: '2025-04-10',
    endDate: '2025-04-20',
    status: 'active',
  },
  {
    name: 'MetaVault',
    symbol: 'MVT',
    icon: '🔷',
    iconColor: '#627EEA',
    description: 'Institutional-grade digital asset custody and yield generation platform.',
    progress: 41,
    price: '$0.12',
    totalRaise: '$2.0M',
    startDate: '2025-04-15',
    endDate: '2025-04-25',
    status: 'active',
  },
  {
    name: 'ChainBridge',
    symbol: 'CBRG',
    icon: '🔗',
    iconColor: '#F3BA2F',
    description: 'Seamless cross-chain asset bridge enabling frictionless multi-network transfers.',
    progress: 0,
    price: '$0.08',
    totalRaise: '$3.2M',
    startDate: '2025-05-01',
    endDate: '2025-05-10',
    status: 'upcoming',
  },
  {
    name: 'GreenChain',
    symbol: 'GCN',
    icon: '🌿',
    iconColor: '#26A17B',
    description: 'Carbon credit tokenization protocol for verifiable sustainability commitments.',
    progress: 0,
    price: '$0.03',
    totalRaise: '$1.5M',
    startDate: '2025-05-15',
    endDate: '2025-05-25',
    status: 'upcoming',
  },
  {
    name: 'PixelDAO',
    symbol: 'PXD',
    icon: '🎮',
    iconColor: '#FF6B6B',
    description: 'Community-governed gaming DAO with on-chain asset ownership and tournaments.',
    progress: 100,
    price: '$0.02',
    totalRaise: '$800K',
    startDate: '2025-02-01',
    endDate: '2025-02-10',
    status: 'completed',
  },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <span
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${project.iconColor}22` }}
        >
          {project.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[var(--color-text)]">{project.name}</h3>
            <span className="text-xs font-mono bg-[var(--color-bg)] border border-[var(--color-border)] px-2 py-0.5 rounded text-[var(--color-text-muted)]">
              {project.symbol}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">{project.description}</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1.5">
          <span>Progress</span>
          <span className="text-[var(--color-primary)] font-semibold">{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-bg)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[var(--color-text-muted)] text-xs">Token Price</p>
          <p className="font-semibold text-[var(--color-text)]">{project.price}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] text-xs">Total Raise</p>
          <p className="font-semibold text-[var(--color-text)]">{project.totalRaise}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <Calendar size={12} />
        <span>{project.startDate} — {project.endDate}</span>
      </div>

      <button
        disabled={project.status === 'completed' || project.status === 'upcoming'}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
          project.status === 'active'
            ? 'bg-[var(--color-primary)] text-black hover:opacity-90'
            : project.status === 'upcoming'
            ? 'border border-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed'
            : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)] cursor-default'
        }`}
      >
        {project.status === 'active' && <><ExternalLink size={14} /> Participate</>}
        {project.status === 'upcoming' && 'Coming Soon'}
        {project.status === 'completed' && 'Sale Ended'}
      </button>
    </div>
  )
}

export function LaunchpadPage() {
  const [activeTab, setActiveTab] = useState<ProjectStatus>('active')

  const tabs: { key: ProjectStatus; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
  ]

  const filtered = projects.filter((p) => p.status === activeTab)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1000 50%, #0d0d0d 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">Launchpad</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Rocket size={36} className="text-[var(--color-primary)]" />
            <h1 className="text-4xl font-bold text-white">AGCE Launchpad</h1>
          </div>
          <p className="text-[var(--color-text-muted)] text-lg max-w-[560px]">
            Discover and participate in the most promising token launches, vetted and hosted exclusively on the AGCE platform.
          </p>
        </div>
      </div>

      {/* Tabs + grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex gap-1 border-b border-[var(--color-border)] mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === t.key
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]">No projects in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.symbol} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
