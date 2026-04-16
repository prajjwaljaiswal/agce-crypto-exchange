export const CHART_BG_LIGHT = '#ffffff';
/** Dark chart pane / platform background (matches `public/charting_library/css/style.css` `.theme-dark`). */
export const CHART_BG_DARK = '#181A20';

/** Matches app shell theme (body class) — same source used for chart init and live updates. */
export function getChartThemeFromBody() {
  return document.body.classList.contains('light_theme') ? 'light' : 'dark';
}

const CHART_THEME_STYLE_ID = 'tv-chart-theme-inline';

/**
 * @param {string} containerSelector - e.g. '#TVChartContainer' or '#TVFuturesChartContainer'
 * @param {string} bgColor
 */
export function injectIframeThemeStyles(containerSelector, bgColor) {
  const iframe = document.querySelector(`${containerSelector} iframe`);
  if (!iframe?.contentDocument?.head) return;
  const doc = iframe.contentDocument;
  let el = doc.getElementById(CHART_THEME_STYLE_ID);
  if (!el) {
    el = doc.createElement('style');
    el.id = CHART_THEME_STYLE_ID;
    doc.head.appendChild(el);
  }
  el.textContent = `
    @font-face {
      font-family: 'HarmonyOS Sans Regular';
      src: url('/font/HarmonyOS_Sans_Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    body, .chart-page, .chart-container, .tv-text, .pane-legend {
      font-family: 'HarmonyOS Sans Regular', sans-serif !important;
      font-size: 14px !important;
    }
    body, .chart-page {
      background-color: ${bgColor} !important;
    }
  `;
}

/** Updates TradingView widget + iframe from `document.body` theme (no remount). */
export function applyChartThemeToWidget(instance, containerSelector) {
  const t = getChartThemeFromBody();
  const bg = t === 'light' ? CHART_BG_LIGHT : CHART_BG_DARK;
  const txt = t === 'light' ? '#1a1a1a' : '#ffffff';
  instance.changeTheme(t === 'light' ? 'light' : 'dark');
  const chart = instance.chart();
  if (chart) {
    chart.applyOverrides({
      'paneProperties.background': bg,
      'scalesProperties.backgroundColor': bg,
      'scalesProperties.textColor': txt,
      'paneProperties.backgroundType': 'solid',
      'mainSeriesProperties.style': 1,
    });
  }
  requestAnimationFrame(() => {
    injectIframeThemeStyles(containerSelector, bg);
    setTimeout(() => injectIframeThemeStyles(containerSelector, bg), 80);
  });
}
