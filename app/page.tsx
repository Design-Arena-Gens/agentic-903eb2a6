'use client';

import { useMemo, useState } from 'react';
import { generateSampleOhlc } from '@/lib/data';
import { computeEnhancedZeroLagMacd, MacdAlgorithm, SmoothingType } from '@/lib/indicators';
import dynamic from 'next/dynamic';
import cn from 'classnames';

const PriceChart = dynamic(() => import('@/components/PriceChart'), { ssr: false });
const MacdChart = dynamic(() => import('@/components/MacdChart'), { ssr: false });

export default function Page() {
  const [fastLength, setFastLength] = useState(12);
  const [slowLength, setSlowLength] = useState(26);
  const [signalLength, setSignalLength] = useState(9);
  const [macdEmaLength, setMacdEmaLength] = useState(9);
  const [smoothingType, setSmoothingType] = useState<SmoothingType>('EMA');
  const [algorithm, setAlgorithm] = useState<MacdAlgorithm>('Legacy');
  const [showDotsAbove, setShowDotsAbove] = useState(true);

  const data = useMemo(() => generateSampleOhlc(400), []);

  const macd = useMemo(() =>
    computeEnhancedZeroLagMacd({
      candles: data,
      fastLength,
      slowLength,
      signalLength,
      macdEmaLength,
      smoothingType,
      algorithm,
      showDotsAbove
    }),
  [data, fastLength, slowLength, signalLength, macdEmaLength, smoothingType, algorithm, showDotsAbove]);

  return (
    <div className="container">
      <header>
        <h1>Zero Lag MACD Enhanced 1.2</h1>
        <p>Based on ZeroLag EMA (Ehlers). Interactive visualization with configurable parameters.</p>
      </header>

      <section className="controls">
        <div className="grid">
          <label>
            <span>Fast period</span>
            <input type="number" min={1} value={fastLength} onChange={e => setFastLength(parseInt(e.target.value || '1'))} />
          </label>
          <label>
            <span>Slow period</span>
            <input type="number" min={1} value={slowLength} onChange={e => setSlowLength(parseInt(e.target.value || '1'))} />
          </label>
          <label>
            <span>Signal period</span>
            <input type="number" min={1} value={signalLength} onChange={e => setSignalLength(parseInt(e.target.value || '1'))} />
          </label>
          <label>
            <span>MACD EMA length</span>
            <input type="number" min={1} value={macdEmaLength} onChange={e => setMacdEmaLength(parseInt(e.target.value || '1'))} />
          </label>
          <label>
            <span>Smoothing</span>
            <select value={smoothingType} onChange={e => setSmoothingType(e.target.value as SmoothingType)}>
              <option value="EMA">EMA</option>
              <option value="SMA">SMA (Glaz mode)</option>
            </select>
          </label>
          <label>
            <span>Algorithm</span>
            <select value={algorithm} onChange={e => setAlgorithm(e.target.value as MacdAlgorithm)}>
              <option value="Legacy">Legacy</option>
              <option value="Glaz">Glaz</option>
            </select>
          </label>
          <label className={cn('checkbox')}>
            <input type="checkbox" checked={showDotsAbove} onChange={e => setShowDotsAbove(e.target.checked)} />
            <span>Show dots above price</span>
          </label>
        </div>
      </section>

      <section className="charts">
        <div className="panel">
          <h2>Price</h2>
          <PriceChart candles={data} markers={macd.priceMarkers} />
        </div>
        <div className="panel">
          <h2>MACD</h2>
          <MacdChart macd={macd} />
        </div>
      </section>

      <footer>
        <a href="https://www.tradingview.com/chart/EURUSD/UV0YI6Wy-ZeroLag-Macd" target="_blank" rel="noreferrer">Reference</a>
      </footer>
    </div>
  );
}
