import type { AnnouncementCategory, AnnouncementItem } from './types.js'

export const MOCK_CATEGORIES: AnnouncementCategory[] = [
  {
    _id: 'cat-1',
    title: 'New Crypto Listings',
    description: 'Stay updated with the latest token and coin listings on AGCE.',
  },
  {
    _id: 'cat-2',
    title: 'Latest News',
    description: 'Breaking news, partnerships, and product announcements from AGCE.',
  },
  {
    _id: 'cat-3',
    title: 'Latest Activities',
    description: 'Trading competitions, airdrops, giveaways, and platform campaigns.',
  },
  {
    _id: 'cat-4',
    title: 'New Fiat Listings',
    description: 'Fiat gateway updates, new deposit/withdrawal options, and regional fiat support.',
  },
  {
    _id: 'cat-5',
    title: 'API Updates',
    description: 'REST and WebSocket API changes, deprecations, and developer notes.',
  },
  {
    _id: 'cat-6',
    title: 'Maintenance Notices',
    description: 'Scheduled maintenance windows and incident postmortems.',
  },
]

export const MOCK_ANNOUNCEMENTS: Record<string, AnnouncementItem[]> = {
  'cat-1': [
    {
      _id: 'a-1-1',
      title: 'AGCE Will List TTD (Trade Tide Token)',
      description:
        '<p>AGCE will list <strong>TTD/USDT</strong> on the spot market. Trading opens on April 20, 2026 at 10:00 UTC. Deposits are now open.</p>',
      createdAt: '2026-04-10T10:00:00.000Z',
    },
    {
      _id: 'a-1-2',
      title: 'New Listing: HLS (Helios)',
      description:
        '<p>AGCE welcomes <strong>HLS/USDT</strong> to the platform. Spot trading goes live April 18, 2026 at 08:00 UTC.</p>',
      createdAt: '2026-04-08T09:30:00.000Z',
    },
  ],
  'cat-2': [
    {
      _id: 'a-2-1',
      title: 'AGCE Partners with CryptoSwift for Travel Rule Compliance',
      description:
        '<p>We are pleased to announce a strategic partnership with CryptoSwift, the leading travel rule provider, to enhance compliance and user protection.</p>',
      createdAt: '2026-04-05T14:00:00.000Z',
    },
  ],
  'cat-3': [
    {
      _id: 'a-3-1',
      title: 'Spring Trading Competition — Win up to $50,000',
      description:
        '<p>Join our Spring Trading Competition from April 15 to April 30, 2026. Prize pool of $50,000 USDT in BTC rewards.</p>',
      createdAt: '2026-04-12T12:00:00.000Z',
    },
  ],
  'cat-4': [],
  'cat-5': [
    {
      _id: 'a-5-1',
      title: 'REST API v2.0 Beta Release',
      description:
        '<p>We are rolling out REST API v2.0 to beta testers. New endpoints include futures position history and unified margin. Docs available in the developer portal.</p>',
      createdAt: '2026-04-01T09:00:00.000Z',
    },
  ],
  'cat-6': [],
}
