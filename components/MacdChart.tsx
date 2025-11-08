"use client";
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import type { MacdResult } from '@/lib/indicators';

export default function MacdChart({ macd }: { macd: MacdResult }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height: 240,
      layout: { background: { type: ColorType.Solid, color: '#121821' }, textColor: '#e5eef7' },
      grid: { vertLines: { color: '#1e2a39' }, horzLines: { color: '#1e2a39' } },
      rightPriceScale: { borderColor: '#1e2a39' },
      timeScale: { borderColor: '#1e2a39' }
    });
    chartRef.current = chart;

    const histSeries = chart.addHistogramSeries({ priceFormat: { type: 'price', precision: 5, minMove: 0.00001 } });
    histSeries.setData(macd.histogram.map(h => ({ time: h.time as any, value: h.value, color: h.color })));

    const macdLine = chart.addLineSeries({ color: '#3aa0ff', lineWidth: 2 });
    macdLine.setData(macd.macdLine.map(p => ({ time: p.time as any, value: p.value })));

    const signalLine = chart.addLineSeries({ color: '#f1c40f', lineWidth: 2 });
    signalLine.setData(macd.signalLine.map(p => ({ time: p.time as any, value: p.value })));

    const handle = () => chart.applyOptions({ width: containerRef.current!.clientWidth });
    handle();
    window.addEventListener('resize', handle);
    return () => { window.removeEventListener('resize', handle); chart.remove(); };
  }, [macd]);

  return <div ref={containerRef} style={{ width: '100%' }} />;
}
