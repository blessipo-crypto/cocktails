import React, { useState, useEffect, useMemo } from 'react';
import { CocktailRecipe, SPIRITS_CATALOG } from '../data/cocktails';
import { CocktailVisual, GlasswareSilhouette } from './CocktailVisual';
import {
  evaluateCocktailMatch,
  isIngredientCovered,
  BAR_INVENTORY_ITEMS,
} from '../data/barInventory';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  Bookmark,
  MapPin,
  Thermometer,
  Droplets,
} from 'lucide-react';

interface RecipeDetailSheetProps {
  cocktail: CocktailRecipe | null;
  onClose: () => void;
  isSavedOffline: boolean;
  onToggleSaveOffline: (id: string) => void;
  onJumpToMapRegion: (country: string) => void;
  ownedItemIds?: string[];
  onToggleOwnedItem?: (itemId: string) => void;
  onOpenMyBar?: () => void;
}

export const RecipeDetailSheet: React.FC<RecipeDetailSheetProps> = ({
  cocktail,
  onClose,
  isSavedOffline,
  onToggleSaveOffline,
  onJumpToMapRegion,
  ownedItemIds,
  onToggleOwnedItem,
  onOpenMyBar,
}) => {
  const [unit, setUnit] = useState<'ml' | 'oz' | 'parts'>('ml');
  const [servings, setServings] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timerSec, setTimerSec] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const ownedSet = useMemo(() => new Set(ownedItemIds || []), [ownedItemIds]);
  const matchResult = useMemo(() => {
    if (!cocktail || !ownedItemIds) return null;
    return evaluateCocktailMatch(cocktail, ownedSet);
  }, [cocktail, ownedItemIds, ownedSet]);

  useEffect(() => {
    if (cocktail) {
      setCompletedSteps([]);
      setTimerSec(0);
      setIsRunning(false);
    }
  }, [cocktail]);

  useEffect(() => {
    if (!isRunning || !cocktail) return;
    const interval = window.setInterval(() => {
      setTimerSec((prev) => {
        if (prev >= cocktail.agitationDurationSec) {
          setIsRunning(false);
          return cocktail.agitationDurationSec;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, cocktail]);

  if (!cocktail) return null;

  const formatAmount = (ml: number) => {
    const scaledMl = ml * servings;
    if (unit === 'ml') {
      return `${Number(scaledMl.toFixed(1))} ml`;
    }
    if (unit === 'oz') {
      const oz = scaledMl / 30;
      return `${Number(oz.toFixed(2))} oz`;
    }
    const basePart = 15;
    const parts = scaledMl / basePart;
    return `${Number(parts.toFixed(1))} pt`;
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const timerProgress = Math.min(
    100,
    Math.round((timerSec / cocktail.agitationDurationSec) * 100)
  );

  // Calculate raw pre-dilution degrees (°) and pure alcohol grams
  const totalRawMl = cocktail.ingredients.reduce((acc, i) => acc + i.ml, 0) || 1;
  const totalPureAlcoholMl = cocktail.ingredients.reduce(
    (acc, i) => acc + i.ml * (i.abv / 100),
    0
  );
  const rawDegrees = (totalPureAlcoholMl / totalRawMl) * 100;
  const pureAlcoholGrams = totalPureAlcoholMl * 0.789 * servings;
  const usProof = Math.round(cocktail.abv * 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 gpu-smooth animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto pink-scrollbar rounded-t-3xl sm:rounded-3xl bg-[#faf6f8] dark:bg-[#140f13] border-t sm:border border-rose-950/15 dark:border-pink-200/20 shadow-2xl p-5 sm:p-7 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Sheet Drag Handle */}
        <div className="w-10 h-1.5 bg-rose-950/20 dark:bg-pink-200/20 rounded-full mx-auto -mt-2 sm:hidden" />

        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-pink-600 dark:text-pink-300 font-mono-tabular flex-wrap">
              <span className="font-semibold">{cocktail.abv.toFixed(1)}° Alcohol ({usProof} Proof)</span>
              <span aria-hidden="true">·</span>
              <span>{cocktail.country}</span>
              <span aria-hidden="true">·</span>
              <span>{cocktail.flavorProfile}</span>
              <span aria-hidden="true">·</span>
              <span>{cocktail.complexity}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#181115] dark:text-[#f7eef2] mt-1">
              {cocktail.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#644f5a] dark:text-pink-100/70 mt-0.5">
              {cocktail.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSaveOffline(cocktail.id)}
              className={`min-h-[44px] px-3.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                isSavedOffline
                  ? 'glossy-pink-btn text-[#140c10] font-semibold border-pink-300'
                  : 'bg-white dark:bg-[#1e171d] text-[#181115] dark:text-pink-100 border-rose-950/10 dark:border-pink-200/15'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
              <span>{isSavedOffline ? 'Pinned Offline' : 'Pin Recipe'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-white dark:bg-[#1e171d] border border-rose-950/10 dark:border-pink-200/15 flex items-center justify-center text-[#181115] dark:text-pink-100 hover:border-pink-400/50 transition-colors"
              aria-label="Close recipe sheet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual Showcase + Vessel Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
          <div className="sm:col-span-7">
            <CocktailVisual cocktail={cocktail} size="lg" />
          </div>

          <div className="sm:col-span-5 rounded-2xl bg-white dark:bg-[#1b1419] border border-rose-950/10 dark:border-pink-200/15 p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#644f5a] dark:text-pink-200/60">Vessel & Ice Spec</div>
                <div className="text-sm font-semibold text-[#181115] dark:text-pink-50">
                  {cocktail.glassware} · {cocktail.iceSpec}
                </div>
              </div>
              <GlasswareSilhouette
                glassware={cocktail.glassware}
                ingredients={cocktail.ingredients}
                className="w-10 h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-950/10 dark:border-pink-200/10 text-xs font-mono-tabular">
              <div className="p-2.5 rounded-xl bg-[#faf5f7] dark:bg-[#140f13]">
                <div className="text-[10px] text-[#644f5a] dark:text-pink-200/60">Served Degrees</div>
                <div className="text-sm font-semibold text-pink-600 dark:text-pink-300 mt-0.5">
                  {cocktail.abv.toFixed(1)}° ({cocktail.abv}% ABV)
                </div>
                <div className="text-[10px] text-[#644f5a] dark:text-pink-200/50 mt-0.5">
                  {rawDegrees.toFixed(1)}° before ice
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf5f7] dark:bg-[#140f13]">
                <div className="text-[10px] text-[#644f5a] dark:text-pink-200/60">Target Dilution</div>
                <div className="text-sm font-semibold text-pink-600 dark:text-pink-300 mt-0.5">
                  {cocktail.targetDilutionPct}% H₂O
                </div>
                <div className="text-[10px] text-[#644f5a] dark:text-pink-200/50 mt-0.5">
                  {pureAlcoholGrams.toFixed(1)}g pure ethanol
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf5f7] dark:bg-[#140f13]">
                <div className="text-[10px] text-[#644f5a] dark:text-pink-200/60 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-pink-400" />
                  <span>Serve Temp</span>
                </div>
                <div className="text-sm font-semibold text-[#181115] dark:text-pink-100 mt-0.5">
                  {cocktail.servingTempC}°C
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf5f7] dark:bg-[#140f13]">
                <div className="text-[10px] text-[#644f5a] dark:text-pink-200/60 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-pink-400" />
                  <span>Technique</span>
                </div>
                <div className="text-sm font-semibold text-[#181115] dark:text-pink-100 mt-0.5">
                  {cocktail.technique}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onJumpToMapRegion(cocktail.country);
              }}
              className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-[#faf5f7] dark:bg-[#231a20] hover:border-pink-400/50 border border-rose-950/10 dark:border-pink-200/15 text-xs font-medium text-[#181115] dark:text-pink-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span>Inspect {cocktail.country} Distillation Origin on Map</span>
            </button>
          </div>
        </div>

        {/* Bar Readiness & Inventory Connectivity Banner */}
        {matchResult && (
          <div
            className={`rounded-2xl p-4 border flex items-center justify-between gap-3 flex-wrap ${
              matchResult.isReady
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {matchResult.isReady ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider">
                  {matchResult.isReady
                    ? 'Ready to Mix'
                    : `Missing ${matchResult.missingCount} Ingredient${matchResult.missingCount > 1 ? 's' : ''}`}
                </div>
                <div className="text-xs opacity-90 truncate">
                  {matchResult.isReady
                    ? 'All required spirits, citrus, and modifiers are stocked in your My Bar inventory.'
                    : `Missing: ${matchResult.missingIngredients.join(', ')}`}
                </div>
              </div>
            </div>

            {onOpenMyBar && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMyBar();
                }}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-transform active:scale-95 ${
                  matchResult.isReady
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-amber-500 text-[#18100c] hover:bg-amber-400'
                }`}
              >
                Open My Bar Checklist
              </button>
            )}
          </div>
        )}

        {/* Formulation Controls: Units & Batch Multiplier */}
        <div className="rounded-2xl bg-white dark:bg-[#1b1419] border border-rose-950/10 dark:border-pink-200/15 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-lg font-display font-semibold text-[#181115] dark:text-[#f7eef2]">
                Precision Formulation Spec
              </h3>
              <p className="text-xs font-mono-tabular text-[#644f5a] dark:text-pink-200/65">
                Pre-Dilution Pour: {rawDegrees.toFixed(1)}° → Served in Glass: {cocktail.abv.toFixed(1)}°
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Unit Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-[#faf5f7] dark:bg-[#140f13] border border-rose-950/10 dark:border-pink-200/10">
                {(['ml', 'oz', 'parts'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-tabular font-medium transition-colors ${
                      unit === u
                        ? 'bg-pink-500 text-white'
                        : 'text-[#644f5a] dark:text-pink-200/70'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              {/* Batch Scaler */}
              <div className="flex items-center p-1 rounded-xl bg-[#faf5f7] dark:bg-[#140f13] border border-rose-950/10 dark:border-pink-200/10">
                {[1, 2, 4, 8].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setServings(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-tabular font-medium transition-colors ${
                      servings === s
                        ? 'bg-pink-500 text-white'
                        : 'text-[#644f5a] dark:text-pink-200/70'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredient Rows */}
          <div className="divide-y divide-rose-950/10 dark:divide-pink-200/10">
            {cocktail.ingredients.map((ing, idx) => {
              const spiritMeta = SPIRITS_CATALOG.find((s) => s.id === ing.spiritId);
              const coverage = ownedItemIds ? isIngredientCovered(ing, ownedSet) : null;
              const matchedItem = coverage?.matchedItemId
                ? BAR_INVENTORY_ITEMS.find((item) => item.id === coverage.matchedItemId)
                : BAR_INVENTORY_ITEMS.find((item) =>
                    item.matchingTerms.some((t) =>
                      ing.name.toLowerCase().includes(t.toLowerCase())
                    )
                  );

              return (
                <div
                  key={idx}
                  className="py-2.5 flex items-center justify-between gap-4 text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-2.5 h-6 rounded-sm shrink-0"
                      style={{ backgroundColor: ing.layerColor }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#181115] dark:text-pink-50 truncate">
                          {ing.name}
                        </span>
                        {coverage && (
                          coverage.covered ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-medium">
                              <Check className="w-2.5 h-2.5" />
                              <span>In Bar</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium">
                              <span>Missing</span>
                              {matchedItem && onToggleOwnedItem && (
                                <button
                                  type="button"
                                  onClick={() => onToggleOwnedItem(matchedItem.id)}
                                  className="ml-0.5 p-0.5 rounded hover:bg-amber-500/25 text-amber-900 dark:text-amber-200"
                                  title={`Add ${matchedItem.name} to My Bar`}
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </span>
                          )
                        )}
                      </div>
                      <div className="text-xs text-[#644f5a] dark:text-pink-200/60 font-mono-tabular">
                        {ing.role} · {ing.abv > 0 ? `${ing.abv}° Alcohol` : '0° Non-Alcoholic'}
                        {spiritMeta ? ` · ${spiritMeta.originCountry}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono-tabular font-semibold text-pink-600 dark:text-pink-300">
                      {formatAmount(ing.ml)}
                    </div>
                    <div className="text-[11px] font-mono-tabular text-[#644f5a] dark:text-pink-200/50">
                      {ing.abv}°
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-xs text-[#644f5a] dark:text-pink-200/75">
            <strong className="text-[#181115] dark:text-pink-100">Garnish Architecture:</strong>{' '}
            {cocktail.garnish}
          </div>
        </div>

        {/* Built-in Agitation Stopwatch & Step-by-Step Execution */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
          {/* Interactive Agitation Timer */}
          <div className="sm:col-span-5 rounded-2xl bg-white dark:bg-[#1b1419] border border-rose-950/10 dark:border-pink-200/15 p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono-tabular text-pink-600 dark:text-pink-300">
                Agitation Cadence Timer
              </div>
              <h4 className="text-base font-semibold text-[#181115] dark:text-pink-50 mt-0.5">
                {cocktail.technique} ({cocktail.agitationDurationSec}s Target)
              </h4>
              <p className="text-xs text-[#644f5a] dark:text-pink-200/65 mt-1">
                {cocktail.brixAcidRatio}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="font-mono-tabular text-3xl font-bold text-[#181115] dark:text-pink-200">
                {timerSec}s
                <span className="text-sm font-normal text-[#644f5a] dark:text-pink-200/50">
                  {' '}
                  / {cocktail.agitationDurationSec}s
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsRunning((r) => !r)}
                  className="min-h-[44px] px-4 rounded-xl glossy-pink-btn text-[#140c10] font-semibold text-xs flex items-center gap-1.5"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRunning(false);
                    setTimerSec(0);
                  }}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-[#faf5f7] dark:bg-[#140f13] border border-rose-950/10 dark:border-pink-200/15 flex items-center justify-center text-[#181115] dark:text-pink-100"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-rose-950/10 dark:bg-pink-200/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-300 via-pink-400 to-rose-500 transition-all duration-300"
                style={{ width: `${timerProgress}%` }}
              />
            </div>
          </div>

          {/* Sensory Balance Bars */}
          <div className="sm:col-span-7 rounded-2xl bg-white dark:bg-[#1b1419] border border-rose-950/10 dark:border-pink-200/15 p-4 space-y-2.5">
            <div className="text-xs font-mono-tabular text-pink-600 dark:text-pink-300">
              Spirit Profile & Sensory Matrix
            </div>
            {(
              [
                ['Sweetness Density', cocktail.spiritBalanceAnalysis.sweetness],
                ['Titratable Acidity', cocktail.spiritBalanceAnalysis.acidity],
                ['Botanical Bitterness', cocktail.spiritBalanceAnalysis.bitterness],
                ['Spirit Proof & Warmth', cocktail.spiritBalanceAnalysis.booziness],
                ['Aromatic Ester Lift', cocktail.spiritBalanceAnalysis.aromaticLift],
              ] as const
            ).map(([label, score]) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#4a3942] dark:text-pink-100/80">{label}</span>
                  <span className="font-mono-tabular text-pink-600 dark:text-pink-300">
                    {score}/10
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-rose-950/10 dark:bg-pink-200/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-300 to-pink-500"
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Preparation Steps */}
        <div className="space-y-2.5">
          <h4 className="text-base font-display font-semibold text-[#181115] dark:text-[#f7eef2]">
            Execution Protocol (Tap steps to check off)
          </h4>
          <div className="space-y-2">
            {cocktail.steps.map((step, index) => {
              const isDone = completedSteps.includes(index);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleStep(index)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-pink-500/10 border-pink-400/40 text-[#644f5a] dark:text-pink-200/50 line-through'
                      : 'bg-white dark:bg-[#1b1419] border-rose-950/10 dark:border-pink-200/15 text-[#181115] dark:text-pink-50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono-tabular shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-pink-500 text-white'
                        : 'bg-[#faf5f7] dark:bg-[#140f13] text-pink-600 dark:text-pink-300 border border-pink-300/25'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : `0${index + 1}`}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed">{step}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Balance Callout */}
        <div className="rounded-2xl bg-[#f5ebef] dark:bg-[#1e151b] border border-pink-400/25 p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-pink-500 dark:text-pink-300 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-[#3d2e36] dark:text-pink-100/85">
            <strong className="text-[#181115] dark:text-pink-200 block mb-0.5">
              Technical Spirit Balance Note
            </strong>
            {cocktail.technicalTip}
          </div>
        </div>
      </div>
    </div>
  );
};
