import { useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import { widget } from '../charting_library';
import Datafeed from './datafeed';
import { SocketContext } from '../../SocketContext';
import { disconnectChartSocket, setSharedSocket } from './streaming';
import {
  applyChartThemeToWidget,
  CHART_BG_DARK,
  CHART_BG_LIGHT,
  getChartThemeFromBody,
} from '../chartThemeFromBody';

const TV_CHART_CONTAINER = '#TVChartContainer';

export default function TVChartContainer({ symbol }) {
  const { getSocket, isConnected } = useContext(SocketContext);
  const [tvWidget, setTvWidget] = useState();
  const [bodyChartTheme, setBodyChartTheme] = useState(getChartThemeFromBody);
  const functCheckRef = useRef(true);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setBodyChartTheme(getChartThemeFromBody());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Set shared socket for chart to use the same connection as TradePage
  useEffect(() => {
    if (isConnected) {
      const socket = getSocket();
      if (socket) {
        setSharedSocket(socket);
      }
    }
  }, [isConnected, getSocket]);

  const getChart = (symbol) => {
    const chartContainer = document.getElementById("TVChartContainer");

    if (!chartContainer) {
      console.error("Chart container not found! Retrying...");
      setTimeout(() => getChart(symbol), 500);
      return;
    }
    const Theme = getChartThemeFromBody();
    const isMobile = window.innerWidth <= 480;
    const isLight = Theme === 'light';
    const bgColor = isLight ? CHART_BG_LIGHT : CHART_BG_DARK;
    const textColor = isLight ? '#1a1a1a' : '#ffffff';

    const widgetOptions = {
      symbol: `${symbol}`,
      load_last_chart: true,
      interval: '1',
      fullscreen: false,
      timezone: 'Asia/Kolkata',
      container: "TVChartContainer",
      datafeed: Datafeed,
      has_intraday: true,
      library_path: '/charting_library/',
      pricescale: 100000000,
      intraday_multipliers: ['1', '3', '5', '15', '30', '60'],
      custom_css_url: 'css/style.css',
      hide_resolution_in_legend: true,
      height: isMobile ? '400px' : '625px',
      time_frames: [
        { text: '1D', resolution: 'D', description: '1 Day' },
        { text: '1W', resolution: 'W', description: '1 Week' },
        { text: '1M', resolution: 'M', description: '1 Month' },
      ],
      time_scale: {
        min_bar_spacing: 1
      },
      theme: Theme === 'light' ? "light" : "dark",
      overrides: {
        "scalesProperties.fontSize": 14,
        "scalesProperties.fontFamily": "HarmonyOS Sans Regular, sans-serif",
        "scalesProperties.textColor": textColor,
        "paneProperties.legendProperties.showLegend": true,
        "paneProperties.legendProperties.showStudyValues": true,
        "paneProperties.legendProperties.fontSize": 14,
        "paneProperties.legendProperties.fontFamily": "HarmonyOS Sans Regular, sans-serif",
      },
      styleOverrides: {
        "paneProperties.background": bgColor,
        "paneProperties.backgroundType": "solid",
      },
      loading_screen: {
        backgroundColor: bgColor,
      },
      disabled_features: [
        "use_sessionStorage_for_settings", "adaptive_logo",
        "border_around_the_chart", 'header_symbol_search',
        'header_interval_dialog_button', 'header_compare',
        'header_undo_redo', 'header_resolutions',
        'left_toolbar'
      ],
    };

    const tvWidgetInstance = new widget(widgetOptions);

    tvWidgetInstance.onChartReady(() => {
      const chart = tvWidgetInstance.chart();
      if (!chart) return;

      applyChartThemeToWidget(tvWidgetInstance, TV_CHART_CONTAINER);

      const studies = chart.getAllStudies();
      studies.forEach(study => {
        if (study.name.toLowerCase().includes('volume')) {
          chart.removeEntity(study.id);
        }
      });
      chart.createStudy('Volume', false, true);

      tvWidgetInstance.headerReady?.().then(() => {
        const intervals = [
          { value: '1', label: '1 Min' },
          { value: '5', label: '5 Min' },
          { value: '15', label: '15 Min' },
          { value: '30', label: '30 Min' },
          { value: '60', label: '1 Hour' },
          { value: 'D', label: '1 Day' },
          { value: 'W', label: '1 Week' },
          { value: 'M', label: '1 Month' }
        ];
        intervals.forEach(interval => {
          const button = tvWidgetInstance.createButton();
          button.classList.add('custom-interval-button');
          button.title = `Switch to ${interval.label}`;
          button.addEventListener('click', function () {
            tvWidgetInstance.chart().setResolution(interval.value);
          });
          button.textContent = interval.label;
        });
      });
    });

    setTvWidget(tvWidgetInstance);
  };

  // Initialize chart when symbol is valid
  useEffect(() => {
    if (symbol.split('/')[0] !== 'undefined') {
      if (functCheckRef.current) {
        getChart(symbol);
      }
      functCheckRef.current = false;
    };
  }, [symbol]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectChartSocket();
      if (tvWidget) {
        try {
          tvWidget.remove();
        } catch (e) {
          // Widget removal error - safe to ignore
        }
      }
    };
  }, [tvWidget]);

  useEffect(() => {
    if (tvWidget) {
      tvWidget.onChartReady(() => {
        const chart = tvWidget.chart();
        if (chart) {
          chart.setSymbol(symbol, () => null);
        }
      });
    }
  }, [symbol]);

  // Live theme: body class + localStorage-independent (matches shell toggle)
  useEffect(() => {
    if (!tvWidget) return;
    const apply = async () => {
      try {
        await tvWidget._innerWindowLoaded;
        applyChartThemeToWidget(tvWidget, TV_CHART_CONTAINER);
      } catch (error) {
        console.error('Error applying spot chart theme from body class:', error);
      }
    };
    apply();
  }, [bodyChartTheme, tvWidget]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (tvWidget) {
      tvWidget.onChartReady(() => {
        setIsReady(true);
      });
    }
  }, [tvWidget]);

  const isMobile = window.innerWidth <= 480;
  const chartHeight = isMobile ? '400px' : '625px';
  const bgColor = bodyChartTheme === 'light' ? CHART_BG_LIGHT : CHART_BG_DARK;

  return (
    <div style={{ position: "relative", minHeight: chartHeight, height: chartHeight, backgroundColor: bgColor }}>
      <div
        id="TVChartContainer"
        style={{
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.1s ease",
          backgroundColor: bgColor,
          height: "100%",
        }}
      />

      {!isReady && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: bgColor,
            zIndex: 10,
          }}
        >
          <div className="spinner-border text-primary" role="status" style={{ width: '1.5rem', height: '1.5rem', borderColor: bodyChartTheme === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)', borderRightColor: 'transparent' }}  />
        </div>
      )}
    </div>
  );
}
