"use client";
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import type { Candle } from '@/lib/indicators';

export default function PriceChart({ candles, markers }: { candles: Candle[]; markers: { time: number; position: 'aboveBar' | 'belowBar'; color: string; shape: 'circle' }[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height: 300,
      layout: { background: { type: ColorType.Solid, color: '#121821' }, textColor: '#e5eef7' },
      grid: { vertLines: { color: '#1e2a39' }, horzLines: { color: '#1e2a39' } },
      rightPriceScale: { borderColor: '#1e2a39' },
      timeScale: { borderColor: '#1e2a39' }
    });
    chartRef.current = chart;
    const series = chart.addCandlestickSeries({ upColor: '#2ecc71', downColor: '#e74c3c', borderVisible: false, wickUpColor: '#2ecc71', wickDownColor: '#e74c3c' });
    series.setData(candles.map(c => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close })) as any);
    if (markers?.length) series.setMarkers(markers as any);
    const handle = () => chart.applyOptions({ width: containerRef.current!.clientWidth });
    handle();
    window.addEventListener('resize', handle);
    return () => { window.removeEventListener('resize', handle); chart.remove(); };
  }, [candles, markers]);

  return <div ref={containerRef} style={{ width: '100%' }} />;
}
