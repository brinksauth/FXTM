'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (container.current && container.current.querySelector('script')) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "BINANCE:BTCUSDT",
        "interval": "60",
        "timezone": "America/Mexico_City",
        "theme": "dark",
        "style": "1",
        "locale": "es",
        "enable_publishing": false,
        "backgroundColor": "rgba(42, 35, 79, 0)",
        "gridColor": "rgba(255, 179, 195, 0.06)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_btcusd",
        "support_host": "https://www.tradingview.com"
      }`;
    
    if (container.current) {
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright hidden">
        <a href="https://es.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="text-brand-primary">Mercados en TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingChart);
