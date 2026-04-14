import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './Annoucement.css'
import { MOCK_ANNOUNCEMENTS } from './data.js'
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
 * AnnouncementDetails — single article view. Ported from legacy
 * src/ui/Pages/AnnouncmentManagement/AnnouncementDetails.js. Uses mock data.
 */
export function AnnouncementDetails() {
  const navigate = useNavigate()
  const { announce_title_id: announceTitleId } = useParams<{ announce_title_id: string }>()

  const [announcement, setAnnouncement] = useState<AnnouncementItem | null>(null)
  const [related, setRelated] = useState<AnnouncementItem[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!announceTitleId) return
    let found: AnnouncementItem | null = null
    let categoryList: AnnouncementItem[] = []
    for (const list of Object.values(MOCK_ANNOUNCEMENTS)) {
      const match = list.find((a) => a._id === announceTitleId)
      if (match) {
        found = match
        categoryList = list
        break
      }
    }
    setAnnouncement(found)
    setRelated(categoryList.filter((a) => a._id !== announceTitleId).slice(0, 5))
  }, [announceTitleId])

  return (
    <section className="announcement_section single_announcement">
      <div className="container">
        <h1>
          <img
            src="/images/AnnouncementImg/back_btn.png"
            alt="back btn"
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => navigate(-1)}
          />
          {announcement?.title || '----'}
        </h1>

        <span className="subtext">
          Published on {announcement ? formatDate(announcement.createdAt) : '-'}
        </span>

        <div className="row pt-5">
          <div className="col-sm-8">
            <div className="single_left_s">
              <div
                className="block_cnt"
                dangerouslySetInnerHTML={{
                  __html: announcement?.description ?? '',
                }}
              />
            </div>
          </div>

          <div className="col-sm-4">
            <div className="rightsidebar">
              <div className="articles_blog">
                <h3>Related Articles</h3>
                <ul>
                  {related.map((item) => {
                    const formattedTitle = formatTitleSlug(item.title)
                    return (
                      <li key={item._id}>
                        <h5>
                          <Link
                            to={`/announcement_details/${formattedTitle}/${item._id}`}
                          >
                            {item.title}
                          </Link>
                        </h5>
                        <span className="subtext">
                          Published on {formatDate(item.createdAt)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
