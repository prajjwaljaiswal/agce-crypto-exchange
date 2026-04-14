import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './Annoucement.css'
import { MOCK_ANNOUNCEMENTS, MOCK_CATEGORIES } from './data.js'
import type { AnnouncementItem } from './types.js'

function formatTitleSlug(title: string): string {
  return title.trim().replace(/\s+/g, '_').slice(0, 50).replace(/_+$/, '')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

/**
 * AnnouncementList — category-filtered list. Ported from legacy
 * src/ui/Pages/AnnouncmentManagement/AnnouncementList.js. Uses mock data.
 */
export function AnnouncementList() {
  const navigate = useNavigate()
  const { announce_title_id: announceTitleId, title } = useParams<{
    announce_title_id: string
    title: string
  }>()
  const readableTitle = title?.replace(/_/g, ' ') ?? ''

  const [announcementList, setAnnouncementList] = useState<AnnouncementItem[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!announceTitleId) return
    const list = MOCK_ANNOUNCEMENTS[announceTitleId] ?? []
    setAnnouncementList([...list].reverse())
  }, [announceTitleId])

  const handleTabClick = (formattedTitle: string, categoryId: string) => {
    navigate(`/announcement_list/${formattedTitle}/${categoryId}`)
  }

  return (
    <section className="announcement_section single_announcement">
      <div className="container">
        <h1>
          <img
            src="/images/AnnouncementImg/back_btn.png"
            alt="back btn"
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => navigate('/announcement')}
          />
          Announcement Details
        </h1>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <ul className="nav nav-tabs announcement_tabs" id="announcementTabs">
            {MOCK_CATEGORIES.map((item) => {
              const formattedTitle = formatTitleSlug(item.title)
              return (
                <li key={item._id} className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link ${item.title === readableTitle ? 'active' : ''}`}
                    onClick={() => handleTabClick(formattedTitle, item._id)}
                  >
                    {item.title}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="tab-content announcement_content" id="announcementTabsContent">
          <div
            className="tab-pane fade show active"
            id="crypto"
            role="tabpanel"
            aria-labelledby="crypto-tab"
          >
            <h3 className="text-white">{readableTitle}</h3>

            <div className="crypto_listing_cnt">
              {announcementList.length > 0 ? (
                announcementList.map((announcement) => {
                  const formattedTitle = formatTitleSlug(announcement.title)
                  return (
                    <div className="block_listing" key={announcement._id}>
                      <h5>
                        <Link
                          to={`/announcement_details/${formattedTitle}/${announcement._id}`}
                        >
                          {announcement.title}
                        </Link>
                      </h5>
                      <span className="small">{formatDate(announcement.createdAt)}</span>
                    </div>
                  )
                })
              ) : (
                <div className="announcement-list-empty" role="status">
                  <div className="announcement-empty-inner">
                    <div className="announcement-empty-illustration">
                      <img
                        src="/images/no_data_vector.svg"
                        className="img-fluid dark_img"
                        width={96}
                        height={96}
                        alt=""
                      />
                      <img
                        src="/images/no_data_vector_light.png"
                        className="img-fluid light_img"
                        width={96}
                        height={96}
                        alt=""
                      />
                    </div>
                    <p className="announcement-empty-text">No announcements found.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
