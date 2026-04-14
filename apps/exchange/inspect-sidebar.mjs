import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await ctx.newPage()

// Seed auth so we land on the dashboard
await page.addInitScript(() => {
  localStorage.setItem('agce_auth_token', 'stub-session')
})

await page.goto('http://localhost:5174/user_profile/dashboard', {
  waitUntil: 'networkidle',
})

const sidebarHtml = await page.$eval(
  '#content.leftside_menu',
  (el) => el.outerHTML,
)
console.log('=== SIDEBAR HTML (truncated) ===')
console.log(sidebarHtml.slice(0, 4000))

const items = await page.$$eval('#content.leftside_menu > ul > li', (lis) =>
  lis.map((li, i) => {
    const cs = getComputedStyle(li)
    const rect = li.getBoundingClientRect()
    return {
      index: i,
      text: li.textContent?.trim().slice(0, 40),
      display: cs.display,
      visibility: cs.visibility,
      height: Math.round(rect.height),
      top: Math.round(rect.top),
    }
  }),
)
console.log('=== TOP-LEVEL <li> ITEMS ===')
console.table(items)

await page.screenshot({ path: 'sidebar-debug.png', fullPage: true })
console.log('Screenshot saved to sidebar-debug.png')

await browser.close()
