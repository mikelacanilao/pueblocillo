'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Map, ZoomIn, ZoomOut, Layers, Eye, Compass, Info } from 'lucide-react';
import { BLUEPRINT_BLOCKS } from '@/data/pueblocilloBlocks';

interface VillagePlanViewerProps {
  onSelectBlock?: (blockNumber: number) => void;
}

export const VillagePlanViewer: React.FC<VillagePlanViewerProps> = ({ onSelectBlock }) => {
  const [filterMode, setFilterMode] = useState<'normal' | 'ink' | 'contrast'>('normal');
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);

  const getFilterClass = () => {
    switch (filterMode) {
      case 'ink':
        return 'grayscale contrast-150 brightness-105';
      case 'contrast':
        return 'contrast-125 brightness-105';
      default:
        return 'contrast-105';
    }
  };

  const handleBlockClick = (blockNo: number) => {
    setSelectedBlock(blockNo);
    if (onSelectBlock) {
      onSelectBlock(blockNo);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Pueblocillo NDC Housing Project — Site Development Plan</h3>
          </div>
          <p className="text-xs text-slate-500">
            Brgy. Langkaan, Dasmariñas, Cavite • Official Blueprint Layout (Blocks 1 to 23)
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterMode('normal')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterMode === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clean Map
          </button>
          <button
            onClick={() => setFilterMode('ink')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterMode === 'ink' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High-Contrast Ink
          </button>
          <button
            onClick={() => setFilterMode('contrast')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterMode === 'contrast' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sharp View
          </button>
        </div>
      </div>

      {/* Map Graphic Container */}
      <div className="relative rounded-xl border border-slate-200 bg-slate-950/5 overflow-hidden flex items-center justify-center min-h-[360px] max-h-[500px]">
        <img
          src="/pueblocillocropmap.png"
          alt="Pueblocillo Village NDC Housing Project Blueprint Map"
          className={`w-full h-auto max-h-[500px] object-contain transition-all duration-300 ${getFilterClass()}`}
        />
      </div>

      {/* Quick Block Selector (1–23) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quick Block Inspector (Click to Encode / Highlight)
          </span>
          <span className="text-xs text-emerald-700 font-medium">23 Blocks Total</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5">
          {BLUEPRINT_BLOCKS.map((b) => (
            <button
              key={b.block}
              onClick={() => handleBlockClick(b.block)}
              className={`p-1.5 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center ${
                selectedBlock === b.block
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <span>Blk {b.block}</span>
              <span className={`text-[10px] font-normal ${selectedBlock === b.block ? 'text-emerald-100' : 'text-slate-400'}`}>
                {b.lots}L
              </span>
            </button>
          ))}
        </div>

        {selectedBlock && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <strong>Block {selectedBlock}:</strong> {BLUEPRINT_BLOCKS.find((b) => b.block === selectedBlock)?.lots} lots •{' '}
              {BLUEPRINT_BLOCKS.find((b) => b.block === selectedBlock)?.street} (
              {BLUEPRINT_BLOCKS.find((b) => b.block === selectedBlock)?.note})
            </div>
            {onSelectBlock && (
              <button
                onClick={() => onSelectBlock(selectedBlock)}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px]"
              >
                Encode Block {selectedBlock} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
