import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Annoucement.css'
import { MOCK_CATEGORIES } from './data.js'
import type { AnnouncementCategory } from './types.js'

/**
 * Announcement landing — topic grid. Ported from legacy
 * src/ui/Pages/AnnouncmentManagement/Announcement.js. API calls replaced
 * with MOCK_CATEGORIES until AuthService.getAnnouncementCategoryList is
 * ported to @agce/api.
 */
export function Announcement() {
  const [categoryList, setCategoryList] = useState<AnnouncementCategory[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    document.title = 'AGCE — Latest News & Platform Updates'
    setCategoryList(MOCK_CATEGORIES)
  }, [])

  const filteredCategories = useMemo<AnnouncementCategory[]>(() => {
    if (!categoryList.length) return []
    const q = searchTerm.trim().toLowerCase()
    if (!q) return categoryList
    return categoryList.filter((item) => {
      const title = String(item.title || '').toLowerCase()
      const desc = String(item.description || '').toLowerCase()
      return title.includes(q) || desc.includes(q)
    })
  }, [categoryList, searchTerm])

  return (
    <section className="announcement_section">
      <div className="container">
        <div className="announcement_hero_s">
          <div className="row">
            <div className="col-sm-8">
              <h1>Announcement</h1>
              <p>
                Stay informed with the latest updates, new listings, feature rollouts, and
                important notices from AGCE. From exciting token launches to security enhancements
                and platform upgrades — everything you need to know, all in one place. 🚀
              </p>
            </div>

            <div className="col-sm-4">
              <div className="announcement_vector">
                <img src="/images/AnnouncementImg/hand_speaker_img.png" alt="Announcement" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="topic_block">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h2>All Topics</h2>
            <div className="search_info">
              <button type="button">
                <img src="/images/AnnouncementImg/search_icon.png" alt="search" />
              </button>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredCategories.length > 0 ? (
            <ul>
              {filteredCategories.map((item, index) => {
                const formattedTitle = item.title
                  .trim()
                  .replace(/\s+/g, '_')
                  .slice(0, 50)
                  .replace(/_+$/, '')

                return (
                  <li key={item._id}>
                    <div className="cryptocurrency_icon">
                      <img
                        src={`/images/AnnouncementImg/topic_items_icon${index + 1}.svg`}
                        alt={item.title}
                      />
                    </div>

                    <div className="cnt_topic">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className="d-flex justify-content-center align-items-center">
                        <Link
                          className="readbtn"
                          to={`/announcement_list/${formattedTitle}/${item._id}`}
                        >
                          <button className="readbtn" type="button">
                            Read More{' '}
                            <img
                              src="/images/AnnouncementImg/read_btn.svg"
                              alt="read more"
                            />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="announcement-topics-empty" role="status">
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
                <p className="announcement-empty-text">
                  {categoryList.length > 0
                    ? 'No topics match your search.'
                    : 'No categories found.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
