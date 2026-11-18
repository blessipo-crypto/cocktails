import React, { useState } from 'react';
import {
  CocktailRecipe,
  DISTILLATION_REGIONS,
  DistillationRegion,
} from '../data/cocktails';
import { CocktailVisual } from './CocktailVisual';
import { Compass, MapPin, Droplets, Mountain, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface DistillationMapProps {
  cocktails: CocktailRecipe[];
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  onSelectCocktail: (cocktail: CocktailRecipe) => void;
}

export const DistillationMap: React.FC<DistillationMapProps> = ({
  cocktails,
  selectedCountry,
  onSelectCountry,
  onSelectCocktail,
}) => {
  const [activeRegion, setActiveRegion] = useState<DistillationRegion>(
    DISTILLATION_REGIONS.find((r) => r.country === selectedCountry) || DISTILLATION_REGIONS[0]
  );
  const [zoom, setZoom] = useState<number>(1);

  const handleRegionClick = (region: DistillationRegion) => {
    setActiveRegion(region);
    onSelectCountry(region.country);
  };

  const regionCocktails = cocktails.filter(
    (c) => c.regionId === activeRegion.id || c.country === activeRegion.country
  );

  return (
    <div className="space-y-6">
      {/* Horizontal Region Quick-Jump Onglets */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-[#181115] dark:text-[#f7eef2]">
            World Distillation & Terroir Atlas
          </h2>
          <p className="text-sm text-[#644f5a] dark:text-pink-100/65 mt-0.5">
            Tap any distillation pin or slide horizontally across protected geographical origins.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.2).toFixed(1))))}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-[#171115] border border-rose-950/10 dark:border-pink-200/15 text-[#181115] dark:text-pink-100 hover:border-pink-400/50 transition-colors"
            title="Zoom in map"
            aria-label="Zoom in map"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(1))))}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-[#171115] border border-rose-950/10 dark:border-pink-200/15 text-[#181115] dark:text-pink-100 hover:border-pink-400/50 transition-colors"
            title="Zoom out map"
            aria-label="Zoom out map"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              onSelectCountry('All');
            }}
            className="min-h-[44px] px-3.5 flex items-center gap-1.5 rounded-xl bg-white dark:bg-[#171115] border border-rose-950/10 dark:border-pink-200/15 text-xs font-medium text-[#181115] dark:text-pink-100 hover:border-pink-400/50 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset View
          </button>
        </div>
      </div>

      {/* Horizontal Sliding Country Onglets */}
      <div className="flex items-center gap-2 overflow-x-auto pink-scrollbar pb-2 snap-x">
        {DISTILLATION_REGIONS.map((region) => {
          const isSelected = activeRegion.id === region.id;
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => handleRegionClick(region)}
              className={`snap-start min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium transition-all gpu-smooth whitespace-nowrap shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'glossy-pink-btn text-[#140c10] font-semibold border-pink-300'
                  : 'bg-white dark:bg-[#171115] text-[#4a3942] dark:text-pink-100/75 border-rose-950/10 dark:border-pink-200/10 hover:border-pink-400/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{region.country}</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span className="opacity-85">{region.regionName.split('&')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Map + Active Terroir Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Vector World Map Canvas */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#120d10] border border-pink-200/15 flex flex-col justify-between min-h-[340px] sm:min-h-[420px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-pink-200/10 bg-[#171115]/90 backdrop-blur-md z-10">
            <div className="flex items-center gap-2 text-xs text-pink-200/80 font-mono-tabular">
              <Compass className="w-4 h-4 text-pink-400" />
              <span>{activeRegion.coordinatesLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{activeRegion.giDesignation}</span>
            </div>
            <span className="text-xs text-pink-300/70 font-mono-tabular">
              {DISTILLATION_REGIONS.length} Protected Appellations
            </span>
          </div>

          <div className="relative flex-1 w-full overflow-auto pink-scrollbar flex items-center justify-center p-2">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full max-h-[420px] select-none gpu-smooth transition-transform duration-300"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              role="img"
              aria-label="Interactive World Map of Spirit Distillation Regions"
            >
              <defs>
                <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f472b6" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
                </radialGradient>
                <pattern id="latLongGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="#f9a8d4"
                    strokeOpacity="0.06"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              {/* Graticule Grid & Equator / Tropics */}
              <rect width="1000" height="500" fill="url(#latLongGrid)" />
              <line
                x1="0"
                y1="260"
                x2="1000"
                y2="260"
                stroke="#f472b6"
                strokeOpacity="0.16"
                strokeDasharray="4 6"
              />
              <line
                x1="0"
                y1="190"
                x2="1000"
                y2="190"
                stroke="#fbcfe8"
                strokeOpacity="0.08"
                strokeDasharray="2 6"
              />

              {/* Stylized Continental Masses */}
              <g fill="#231920" stroke="#f9a8d4" strokeOpacity="0.22" strokeWidth="1.2">
                {/* North & Central America */}
                <path d="M95,70 L235,62 L315,115 L292,195 L245,235 L215,265 L258,282 L240,295 L185,255 L145,180 L88,125 Z" />
                {/* Caribbean Islands */}
                <path d="M262,252 L298,258 L286,270 L258,264 Z" />
                {/* South America */}
                <path d="M265,292 L348,315 L385,375 L340,468 L292,475 L268,385 L252,328 Z" />
                {/* Europe & British Isles */}
                <path d="M455,95 L488,92 L492,142 L458,145 Z" />
                <path d="M472,88 L595,72 L625,148 L565,192 L515,202 L472,175 L468,140 Z" />
                {/* Africa */}
                <path d="M452,212 L578,208 L632,278 L595,418 L528,432 L488,332 L442,268 Z" />
                {/* Asia & Japan Archipelago */}
                <path d="M598,75 L865,82 L892,178 L825,268 L748,292 L678,255 L615,195 Z" />
                <path d="M825,162 L856,172 L848,215 L818,205 Z" />
                {/* Australia */}
                <path d="M768,342 L882,338 L898,418 L812,438 L758,395 Z" />
              </g>

              {/* Connecting Trade & Botanical Route Arcs */}
              <path
                d={`M ${activeRegion.mapX} ${activeRegion.mapY} Q 500 95 515 165`}
                fill="none"
                stroke="#f472b6"
                strokeOpacity="0.28"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Interactive Distillation Origin Pins */}
              {DISTILLATION_REGIONS.map((region) => {
                const isSelected = activeRegion.id === region.id;
                return (
                  <g
                    key={region.id}
                    transform={`translate(${region.mapX}, ${region.mapY})`}
                    onClick={() => handleRegionClick(region)}
                    className="cursor-pointer group"
                  >
                    {isSelected && (
                      <circle cx="0" cy="0" r="28" fill="url(#pinGlow)" />
                    )}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 10 : 7}
                      fill={isSelected ? '#fbcfe8' : '#1f151c'}
                      stroke={isSelected ? '#ec4899' : '#f472b6'}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    <rect
                      x="-48"
                      y={isSelected ? -34 : -28}
                      width="96"
                      height="18"
                      rx="5"
                      fill={isSelected ? '#f472b6' : '#140e12'}
                      fillOpacity={isSelected ? '0.95' : '0.85'}
                      stroke="#f9a8d4"
                      strokeOpacity="0.35"
                      strokeWidth="0.8"
                    />
                    <text
                      x="0"
                      y={isSelected ? -22 : -16}
                      textAnchor="middle"
                      fill={isSelected ? '#140c10' : '#f9a8d4'}
                      fontSize="9.5"
                      fontWeight={isSelected ? '700' : '500'}
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {region.country}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Legend Bar */}
          <div className="px-4 py-2.5 border-t border-pink-200/10 bg-[#171115]/90 flex items-center justify-between text-xs text-pink-200/70">
            <span>Selected Origin: <strong className="text-pink-200">{activeRegion.regionName}</strong></span>
            <span>Spirit Focus: <strong className="text-pink-300">{activeRegion.spiritFocus}</strong></span>
          </div>
        </div>

        {/* Terroir & Distillation Apparatus Specification Card */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#161115] border border-rose-950/10 dark:border-pink-200/15 p-5 sm:p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono-tabular text-pink-600 dark:text-pink-300">
                {activeRegion.country} · {activeRegion.coordinatesLabel}
              </div>
              <h3 className="text-2xl font-display font-semibold text-[#181115] dark:text-[#f7eef2] mt-1">
                {activeRegion.regionName}
              </h3>
              <p className="text-xs font-medium text-[#644f5a] dark:text-pink-200/75 mt-0.5">
                {activeRegion.spiritFocus}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-[#3d2e36] dark:text-pink-100/80">
              {activeRegion.terroirProfile}
            </p>

            {/* Technical Distillation Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-rose-950/10 dark:border-pink-200/10">
              <div className="p-3 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#644f5a] dark:text-pink-200/60">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>Still Apparatus</span>
                </div>
                <div className="text-xs font-medium text-[#181115] dark:text-pink-100 mt-1">
                  {activeRegion.stillType}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#644f5a] dark:text-pink-200/60">
                  <Mountain className="w-3.5 h-3.5 text-pink-500" />
                  <span>Altitude & Climate</span>
                </div>
                <div className="text-xs font-medium text-[#181115] dark:text-pink-100 mt-1">
                  {activeRegion.elevation}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d] sm:col-span-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#644f5a] dark:text-pink-200/60">
                  <Droplets className="w-3.5 h-3.5 text-pink-500" />
                  <span>Botanical & Fermentable Substrate</span>
                </div>
                <div className="text-xs font-medium text-[#181115] dark:text-pink-100 mt-1">
                  {activeRegion.rawMaterial} · Matured in {activeRegion.agingVessel}
                </div>
              </div>
            </div>
          </div>

          {/* Regional Signature Cocktails List */}
          <div className="mt-5 pt-4 border-t border-rose-950/10 dark:border-pink-200/10">
            <div className="text-xs font-medium text-[#644f5a] dark:text-pink-200/70 mb-2.5">
              Regional Cocktails from {activeRegion.country} ({regionCocktails.length})
            </div>
            <div className="space-y-2">
              {regionCocktails.map((cocktail) => (
                <button
                  key={cocktail.id}
                  type="button"
                  onClick={() => onSelectCocktail(cocktail)}
                  className="w-full p-2.5 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d] hover:border-pink-400/50 border border-transparent transition-all flex items-center gap-3 text-left group"
                >
                  <CocktailVisual cocktail={cocktail} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[#181115] dark:text-pink-50 truncate group-hover:text-pink-500 dark:group-hover:text-pink-300">
                      {cocktail.name}
                    </div>
                    <div className="text-xs text-[#644f5a] dark:text-pink-200/65 truncate mt-0.5">
                      {cocktail.flavorProfile} · {cocktail.glassware}
                    </div>
                    <div className="text-[11px] font-mono-tabular text-pink-600 dark:text-pink-300/80 mt-1">
                      {cocktail.abv.toFixed(1)}° ({cocktail.abv}% ABV) · {cocktail.technique}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
