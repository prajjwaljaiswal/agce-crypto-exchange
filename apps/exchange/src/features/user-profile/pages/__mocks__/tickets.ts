export interface MockTicket {
  id: number
  ticketId: string
  category: 'Deposit' | 'Withdrawal' | 'KYC' | 'Other'
  subject: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'In Progress' | 'Closed'
}

export const MOCK_TICKETS: MockTicket[] = [
  {
    id: 1,
    ticketId: 'TCK-001',
    category: 'Withdrawal',
    subject: 'Withdrawal pending',
    priority: 'High',
    status: 'Open',
  },
  {
    id: 2,
    ticketId: 'TCK-002',
    category: 'KYC',
    subject: 'Verification failed',
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    id: 3,
    ticketId: 'TCK-003',
    category: 'Other',
    subject: 'General inquiry',
    priority: 'Low',
    status: 'Closed',
  },
]
