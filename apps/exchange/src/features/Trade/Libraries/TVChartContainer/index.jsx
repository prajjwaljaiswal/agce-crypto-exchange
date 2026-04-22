import { useContext, useEffect, useRef, useState } from 'react';
import './index.css';
import { widget } from '../charting_library';
import Datafeed, { setDatafeedAvailability } from './datafeed';
import { SocketContext } from '../../SocketContext';
import { disconnectChartSocket, setSharedSocket } from './streaming';
import { pairsApi } from '../../../../lib/matching-api';
import {
  applyChartThemeToWidget,
  CHART_BG_DARK,
  CHART_BG_LIGHT,
  getChartThemeFromBody,
} from '../chartThemeFromBody';

const TV_CHART_CONTAINER = '#TVChartContainer';

export default function TVChartContainer({ symbol }) {
  const { getSocket, isConnected } = useContext(SocketContext);
  const [tvWidget, setTvWidget] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [bodyChartTheme, setBodyChartTheme] = useState(getChartThemeFromBody);
  // Availability is a property of the trading pair (set per-pair in
  // asset-service): GLOBAL pairs source from Binance, LOCAL pairs from
  // our matching engine. We fetch it on symbol change rather than
  // exposing a user-facing toggle — the user doesn't choose the source,
  // the pair dictates it.
  const [availability, setAvailability] = useState('LOCAL');
  // Tracks the widget instance created in the current effect cycle so cleanup
  // uses the closed-over reference, not the potentially-stale state value.
  const widgetInstanceRef = useRef(null);

  // Resolve pair availability whenever the symbol changes. We push the
  // result into the datafeed module holder BEFORE creating the widget
  // so the first getBars call hits the right source. The effect is
  // cancellable so fast pair-switches don't race.
  useEffect(() => {
    if (!symbol || symbol.includes('undefined')) return undefined;
    let cancelled = false;
    const [base, quote] = symbol.split('/');
    const pairSymbol = base && quote ? `${base}-${quote}` : null;
    if (!pairSymbol) return undefined;

    const controller = new AbortController();
    pairsApi
      .get(pairSymbol, controller.signal)
      .then((pair) => {
        if (cancelled) return;
        const next = pair?.availability === 'GLOBAL' ? 'GLOBAL' : 'LOCAL';
        setDatafeedAvailability(next);
        setAvailability(next);
        // The widget-create effect and this effect both key on [symbol];
        // their firing order isn't guaranteed. If the widget's first
        // getBars call landed before this promise resolved, it used the
        // stale availability — reset so bars reload from the correct
        // source. Safe if the chart isn't ready yet (try/catch).
        try {
          widgetInstanceRef.current?.chart?.()?.resetData?.();
        } catch {
          // widget not ready — harmless.
        }
      })
      .catch(() => {
        // Pair lookup failed — stay on LOCAL. Chart will show either
        // local candles (if any) or the flat refPrice fallback.
        if (!cancelled) {
          setDatafeedAvailability('LOCAL');
          setAvailability('LOCAL');
        }
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [symbol]);

  // Sync body class → chart theme.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setBodyChartTheme(getChartThemeFromBody());
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Share the page-level socket with the chart streaming module.
  useEffect(() => {
    if (isConnected) {
      const socket = getSocket();
      if (socket) setSharedSocket(socket);
    }
  }, [isConnected, getSocket]);

  // Create / recreate the TradingView widget whenever the symbol changes.
  // The cleanup tears down the previous instance so StrictMode double-invoke
  // and pair switches both work correctly.
  useEffect(() => {
    if (!symbol || symbol.includes('undefined')) return;

    const isMobile = window.innerWidth <= 480;
    const Theme = getChartThemeFromBody();
    const isLight = Theme === 'light';
    const bgColor = isLight ? CHART_BG_LIGHT : CHART_BG_DARK;
    const textColor = isLight ? '#1a1a1a' : '#ffffff';

    const widgetOptions = {
      symbol,
      load_last_chart: true,
      interval: '1',
      fullscreen: false,
      timezone: 'Asia/Kolkata',
      container: 'TVChartContainer',
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
      time_scale: { min_bar_spacing: 1 },
      theme: isLight ? 'light' : 'dark',
      overrides: {
        'scalesProperties.fontSize': 14,
        'scalesProperties.fontFamily': 'HarmonyOS Sans Regular, sans-serif',
        'scalesProperties.textColor': textColor,
        'paneProperties.legendProperties.showLegend': true,
        'paneProperties.legendProperties.showStudyValues': true,
        'paneProperties.legendProperties.fontSize': 14,
        'paneProperties.legendProperties.fontFamily': 'HarmonyOS Sans Regular, sans-serif',
      },
      styleOverrides: {
        'paneProperties.background': bgColor,
        'paneProperties.backgroundType': 'solid',
      },
      loading_screen: { backgroundColor: bgColor },
      disabled_features: [
        'use_sessionStorage_for_settings', 'adaptive_logo',
        'border_around_the_chart', 'header_symbol_search',
        'header_interval_dialog_button', 'header_compare',
        'header_undo_redo', 'header_resolutions',
        'left_toolbar',
      ],
    };

    const instance = new widget(widgetOptions);
    widgetInstanceRef.current = instance;
    setTvWidget(instance);
    setIsReady(false);

    instance.onChartReady(() => {
      const chart = instance.chart();
      if (!chart) return;

      applyChartThemeToWidget(instance, TV_CHART_CONTAINER);

      instance.headerReady?.().then(() => {
        const intervals = [
          { value: '1', label: '1 Min' },
          { value: '5', label: '5 Min' },
          { value: '15', label: '15 Min' },
          { value: '30', label: '30 Min' },
          { value: '60', label: '1 Hour' },
          { value: '240', label: '4 Hour' },
          { value: 'D', label: '1 Day' },
          { value: 'W', label: '1 Week' },
        ];
        intervals.forEach((interval) => {
          const button = instance.createButton();
          button.classList.add('custom-interval-button');
          button.title = `Switch to ${interval.label}`;
          button.textContent = interval.label;
          button.addEventListener('click', () => instance.chart().setResolution(interval.value));
        });
      });

      setIsReady(true);
    });

    return () => {
      disconnectChartSocket();
      if (widgetInstanceRef.current) {
        try { widgetInstanceRef.current.remove(); } catch { /* safe to ignore */ }
        widgetInstanceRef.current = null;
      }
      setTvWidget(null);
      setIsReady(false);
    };
  }, [symbol]);

  // Apply live theme changes to the mounted widget.
  useEffect(() => {
    if (!tvWidget) return;
    const apply = async () => {
      try {
        await tvWidget._innerWindowLoaded;
        applyChartThemeToWidget(tvWidget, TV_CHART_CONTAINER);
      } catch {
        // ignore
      }
    };
    apply();
  }, [bodyChartTheme, tvWidget]);

  const isMobile = window.innerWidth <= 480;
  const chartHeight = isMobile ? '400px' : '625px';
  const bgColor = bodyChartTheme === 'light' ? CHART_BG_LIGHT : CHART_BG_DARK;

  return (
    <div
      style={{ position: 'relative', minHeight: chartHeight, height: chartHeight, backgroundColor: bgColor }}
      data-availability={availability}
    >
      <div
        id="TVChartContainer"
        style={{
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.1s ease',
          backgroundColor: bgColor,
          height: '100%',
        }}
      />

      {!isReady && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: bgColor,
            zIndex: 10,
          }}
        >
          <div
            className="spinner-border text-primary"
            role="status"
            style={{
              width: '1.5rem', height: '1.5rem',
              borderColor: bodyChartTheme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
              borderRightColor: 'transparent',
            }}
          />
        </div>
      )}
    </div>
  );
}
