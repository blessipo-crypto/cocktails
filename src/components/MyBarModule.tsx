import React, { useState, useMemo } from 'react';
import { CocktailRecipe } from '../data/cocktails';
import {
  BarCategory,
  BAR_INVENTORY_ITEMS,
  INVENTORY_PRESET_KITS,
  evaluateCocktailMatch,
  CocktailMatchResult,
} from '../data/barInventory';
import { CocktailVisual } from './CocktailVisual';
import {
  Check,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  X,
  Plus,
  Trash2,
  ArrowRight,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';

interface MyBarModuleProps {
  cocktails: CocktailRecipe[];
  ownedItemIds: string[];
  onToggleOwnedItem: (itemId: string) => void;
  onSetOwnedItems: (itemIds: string[]) => void;
  onSelectCocktail: (cocktail: CocktailRecipe) => void;
  panelAccent: 'tri-gloss' | 'pink' | 'blue' | 'orange';
}

const CATEGORIES: BarCategory[] = [
  'Base Spirits',
  'Liqueurs',
  'Mixers',
  'Citrus & Garnishes',
];

export const MyBarModule: React.FC<MyBarModuleProps> = ({
  cocktails,
  ownedItemIds,
  onToggleOwnedItem,
  onSetOwnedItems,
  onSelectCocktail,
  panelAccent,
}) => {
  // Top View Mode: Checklist vs "What Can I Make?"
  const [subView, setSubView] = useState<'inventory' | 'make'>('make');

  // Search filter inside inventory checklist
  const [inventorySearch, setInventorySearch] = useState<string>('');
  // Active Category filter in inventory checklist ('All' or BarCategory)
  const [selectedCategory, setSelectedCategory] = useState<'All' | BarCategory>('All');

  // Filter in "What Can I Make?" view ('all' | 'ready' | 'one-away' | 'two-away')
  const [matchFilter, setMatchFilter] = useState<'all' | 'ready' | 'one-away' | 'two-away'>('all');
  // Search query within "What Can I Make?" recipes
  const [recipeSearch, setRecipeSearch] = useState<string>('');

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);

  // Compute matches for all cocktails against the user's owned inventory
  const matchResults: CocktailMatchResult[] = useMemo(() => {
    const list = cocktails.map((cocktail) =>
      evaluateCocktailMatch(cocktail, ownedSet)
    );

    // Exact matches at the top (missingCount === 0), followed by near-matches ordered by missingCount ascending
    return list.sort((a, b) => {
      if (a.isReady && !b.isReady) return -1;
      if (!a.isReady && b.isReady) return 1;
      if (a.missingCount !== b.missingCount) {
        return a.missingCount - b.missingCount;
      }
      return b.matchPercentage - a.matchPercentage;
    });
  }, [cocktails, ownedSet]);

  const readyMatches = useMemo(
    () => matchResults.filter((m) => m.isReady),
    [matchResults]
  );
  const oneAwayMatches = useMemo(
    () => matchResults.filter((m) => m.missingCount === 1),
    [matchResults]
  );
  const twoAwayMatches = useMemo(
    () => matchResults.filter((m) => m.missingCount === 2),
    [matchResults]
  );

  // Filtered list for "What Can I Make?" view
  const filteredMatches = useMemo(() => {
    let list = matchResults;

    if (matchFilter === 'ready') {
      list = readyMatches;
    } else if (matchFilter === 'one-away') {
      list = oneAwayMatches;
    } else if (matchFilter === 'two-away') {
      list = twoAwayMatches;
    }

    if (recipeSearch.trim() !== '') {
      const q = recipeSearch.toLowerCase();
      list = list.filter(
        (m) =>
          m.cocktail.name.toLowerCase().includes(q) ||
          m.cocktail.country.toLowerCase().includes(q) ||
          m.cocktail.flavorProfile.toLowerCase().includes(q) ||
          m.missingIngredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    return list;
  }, [matchResults, matchFilter, readyMatches, oneAwayMatches, twoAwayMatches, recipeSearch]);

  // Filtered inventory items for the checklist
  const filteredInventoryItems = useMemo(() => {
    return BAR_INVENTORY_ITEMS.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (inventorySearch.trim() !== '') {
        const q = inventorySearch.toLowerCase();
        const inName = item.name.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inCat = item.category.toLowerCase().includes(q);
        if (!inName && !inDesc && !inCat) return false;
      }
      return true;
    });
  }, [selectedCategory, inventorySearch]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<BarCategory, { owned: number; total: number }> = {
      'Base Spirits': { owned: 0, total: 0 },
      Liqueurs: { owned: 0, total: 0 },
      Mixers: { owned: 0, total: 0 },
      'Citrus & Garnishes': { owned: 0, total: 0 },
    };

    BAR_INVENTORY_ITEMS.forEach((item) => {
      counts[item.category].total += 1;
      if (ownedSet.has(item.id)) {
        counts[item.category].owned += 1;
      }
    });

    return counts;
  }, [ownedSet]);

  const handleApplyPreset = (itemIds: string[]) => {
    const combined = Array.from(new Set([...ownedItemIds, ...itemIds]));
    onSetOwnedItems(combined);
  };

  const handleClearAll = () => {
    onSetOwnedItems([]);
  };

  const handleSelectAll = () => {
    onSetOwnedItems(BAR_INVENTORY_ITEMS.map((i) => i.id));
  };

  const activeGlossPill =
    panelAccent === 'blue'
      ? 'glossy-blue-btn text-[#0c1418] border-sky-300'
      : panelAccent === 'orange'
      ? 'glossy-orange-btn text-[#18100c] border-orange-300'
      : 'glossy-pink-btn text-[#140c10] border-pink-300';

  return (
    <div className="space-y-6">
      {/* Hero Header & Master View Switcher */}
      <section
        className={`rounded-3xl bg-white dark:bg-[#151014] border p-5 sm:p-7 space-y-5 transition-all ${
          panelAccent === 'blue'
            ? 'panel-frame-blue'
            : panelAccent === 'orange'
            ? 'panel-frame-orange'
            : 'panel-frame-pink'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-pink-600 dark:text-pink-300">
              <Sparkles className="w-4 h-4" />
              <span>BAR INVENTORY INTELLIGENCE</span>
              <span aria-hidden="true">·</span>
              <span>{ownedItemIds.length} of {BAR_INVENTORY_ITEMS.length} Items Owned</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#181115] dark:text-[#f7eef2] mt-1">
              My Bar Inventory & Formulation Matcher
            </h1>
            <p className="text-xs sm:text-sm text-[#644f5a] dark:text-pink-200/70 max-w-2xl mt-1 leading-relaxed">
              Check off the base spirits, liqueurs, mixers, and fresh citrus you have at home.
              Your bar is automatically saved locally, calculating instant cocktail readiness and missing ingredients.
            </p>
          </div>

          {/* Master View Switcher: Interactive Checklist vs What Can I Make? */}
          <div
            className="flex items-center p-1.5 rounded-2xl bg-[#faf5f7] dark:bg-[#1f171d] border border-rose-950/10 dark:border-pink-200/15 shrink-0 self-start sm:self-auto"
            role="tablist"
            aria-label="My Bar Sub-Navigation"
          >
            <button
              type="button"
              role="tab"
              aria-selected={subView === 'make'}
              onClick={() => setSubView('make')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                subView === 'make'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-[#644f5a] dark:text-pink-200/70 hover:text-[#181115] dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>What Can I Make?</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-mono-tabular ${
                  subView === 'make'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                }`}
              >
                {readyMatches.length} Ready
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={subView === 'inventory'}
              onClick={() => setSubView('inventory')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                subView === 'inventory'
                  ? `${activeGlossPill} shadow-md`
                  : 'text-[#644f5a] dark:text-pink-200/70 hover:text-[#181115] dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Inventory Checklist</span>
              <span className="font-mono-tabular opacity-75">
                ({ownedItemIds.length})
              </span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-rose-950/10 dark:border-pink-200/10">
          <div
            onClick={() => {
              setSubView('make');
              setMatchFilter('ready');
            }}
            className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 cursor-pointer hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              Ready to Mix Now
            </div>
            <div className="text-2xl font-display font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              {readyMatches.length} <span className="text-xs font-normal">cocktails</span>
            </div>
            <div className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
              100% ingredients covered
            </div>
          </div>

          <div
            onClick={() => {
              setSubView('make');
              setMatchFilter('one-away');
            }}
            className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 cursor-pointer hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
              1 Ingredient Away
            </div>
            <div className="text-2xl font-display font-bold text-amber-700 dark:text-amber-400 mt-1">
              {oneAwayMatches.length} <span className="text-xs font-normal">cocktails</span>
            </div>
            <div className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
              Just 1 bottle/citrus needed
            </div>
          </div>

          <div
            onClick={() => {
              setSubView('make');
              setMatchFilter('two-away');
            }}
            className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 cursor-pointer hover:border-rose-500/50 transition-all flex flex-col justify-between"
          >
            <div className="text-[11px] font-medium text-rose-700 dark:text-rose-300">
              2 Ingredients Away
            </div>
            <div className="text-2xl font-display font-bold text-rose-700 dark:text-rose-400 mt-1">
              {twoAwayMatches.length} <span className="text-xs font-normal">cocktails</span>
            </div>
            <div className="text-[10px] text-rose-700/80 dark:text-rose-300/80 mt-0.5">
              Near-matches for your next run
            </div>
          </div>

          <div
            onClick={() => setSubView('inventory')}
            className="p-3 rounded-2xl bg-[#faf5f7] dark:bg-[#1a1419] border border-rose-950/10 dark:border-pink-200/15 cursor-pointer hover:border-pink-400/50 transition-all flex flex-col justify-between"
          >
            <div className="text-[11px] font-medium text-[#644f5a] dark:text-pink-200/75">
              Inventory Completeness
            </div>
            <div className="text-2xl font-display font-bold text-[#181115] dark:text-pink-100 mt-1">
              {Math.round((ownedItemIds.length / BAR_INVENTORY_ITEMS.length) * 100)}%
            </div>
            <div className="text-[10px] text-[#644f5a] dark:text-pink-200/60 mt-0.5">
              {ownedItemIds.length} of {BAR_INVENTORY_ITEMS.length} items stocked
            </div>
          </div>
        </div>
      </section>

      {/* VIEW A: WHAT CAN I MAKE? */}
      {subView === 'make' && (
        <section className="space-y-5">
          {/* Controls Bar: Search & Status Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#151014] p-4 rounded-2xl border border-rose-950/10 dark:border-pink-200/15">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search matching recipes or missing ingredients..."
                className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-xl bg-[#faf5f7] dark:bg-[#1d161b] border border-rose-950/10 dark:border-pink-200/15 text-sm text-[#181115] dark:text-pink-50 placeholder:text-[#7a636f] dark:placeholder:text-pink-200/40 focus:outline-none focus:border-sky-400"
              />
              {recipeSearch && (
                <button
                  type="button"
                  onClick={() => setRecipeSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#644f5a] dark:text-pink-200/60 hover:text-pink-400"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => setMatchFilter('all')}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                  matchFilter === 'all'
                    ? `${activeGlossPill} font-semibold shadow-sm`
                    : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#5c4752] dark:text-pink-200/70 border-rose-950/10 dark:border-pink-200/10'
                }`}
              >
                All Matches ({matchResults.length})
              </button>

              <button
                type="button"
                onClick={() => setMatchFilter('ready')}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 border flex items-center gap-1.5 ${
                  matchFilter === 'ready'
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready to Mix ({readyMatches.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMatchFilter('one-away')}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                  matchFilter === 'one-away'
                    ? 'bg-amber-500 text-[#18100c] font-semibold border-amber-400 shadow-sm'
                    : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#5c4752] dark:text-pink-200/70 border-rose-950/10 dark:border-pink-200/10'
                }`}
              >
                1 Missing ({oneAwayMatches.length})
              </button>

              <button
                type="button"
                onClick={() => setMatchFilter('two-away')}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                  matchFilter === 'two-away'
                    ? 'bg-rose-500 text-white font-semibold border-rose-400 shadow-sm'
                    : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#5c4752] dark:text-pink-200/70 border-rose-950/10 dark:border-pink-200/10'
                }`}
              >
                2 Missing ({twoAwayMatches.length})
              </button>
            </div>
          </div>

          {/* Matches List */}
          {filteredMatches.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#151014] border border-rose-950/10 dark:border-pink-200/15 p-10 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-pink-400 mx-auto" />
              <h3 className="text-lg font-display font-semibold text-[#181115] dark:text-pink-100">
                No cocktails match this inventory filter.
              </h3>
              <p className="text-xs text-[#644f5a] dark:text-pink-200/65 max-w-md mx-auto">
                Check off more spirits or fresh citrus in your inventory, or apply a curated starter kit to immediately unlock cocktails.
              </p>
              <button
                type="button"
                onClick={() => setSubView('inventory')}
                className="min-h-[44px] px-5 py-2 rounded-xl glossy-pink-btn text-xs font-semibold text-[#140c10]"
              >
                Open Bar Checklist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((match) => {
                const { cocktail, isReady, missingCount, missingIngredients, ownedIngredients } = match;

                return (
                  <article
                    key={cocktail.id}
                    onClick={() => onSelectCocktail(cocktail)}
                    className={`rounded-2xl bg-white dark:bg-[#151014] border p-4 cursor-pointer transition-all gpu-smooth hover:-translate-y-0.5 group flex flex-col justify-between space-y-3 ${
                      isReady
                        ? 'border-emerald-500/40 shadow-sm hover:border-emerald-500'
                        : missingCount === 1
                        ? 'border-amber-500/30 hover:border-amber-500/60'
                        : 'border-rose-950/10 dark:border-pink-200/15 hover:border-pink-400/50'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badging Row: Required green "Ready to Mix" badge for exact matches OR labeled missing ingredient */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {isReady ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/35">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Ready to Mix</span>
                          </span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                              <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                              <span>
                                {missingCount === 1
                                  ? `Missing: ${missingIngredients[0]}`
                                  : `Missing ${missingCount}: ${missingIngredients.slice(0, 2).join(', ')}`}
                              </span>
                            </span>
                          </div>
                        )}

                        <span className="font-mono-tabular text-xs font-semibold text-pink-600 dark:text-pink-300">
                          {cocktail.abv.toFixed(1)}° ABV
                        </span>
                      </div>

                      {/* Cocktail Visual & Header */}
                      <div className="flex items-start gap-3.5">
                        <CocktailVisual cocktail={cocktail} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-mono-tabular text-[#644f5a] dark:text-pink-200/65">
                            {cocktail.country} · {cocktail.glassware}
                          </div>
                          <h4 className="text-lg font-display font-bold text-[#181115] dark:text-pink-50 truncate group-hover:text-pink-500 dark:group-hover:text-pink-300 mt-0.5">
                            {cocktail.name}
                          </h4>
                          <div className="text-xs text-[#644f5a] dark:text-pink-200/70 truncate mt-0.5">
                            {cocktail.flavorProfile}
                          </div>
                        </div>
                      </div>

                      {/* Ingredient Breakdown Chips */}
                      <div className="space-y-1.5 pt-2 border-t border-rose-950/10 dark:border-pink-200/10">
                        <div className="flex items-center justify-between text-[11px] font-medium text-[#644f5a] dark:text-pink-200/75">
                          <span>Recipe Composition</span>
                          <span className="font-mono-tabular">
                            {ownedIngredients.length} of {cocktail.ingredients.length} in bar
                          </span>
                        </div>

                        {/* Covered Ingredients (Green checks) */}
                        <div className="flex flex-wrap gap-1">
                          {ownedIngredients.map((ing, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                            >
                              <Check className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate max-w-[150px]">{ing}</span>
                            </span>
                          ))}

                          {/* Missing Ingredients (Amber warning badges with quick add button) */}
                          {missingIngredients.map((ing, i) => {
                            // Find matching inventory item to allow 1-click adding
                            const lower = ing.toLowerCase();
                            const matchedItem = BAR_INVENTORY_ITEMS.find((item) =>
                              item.matchingTerms.some((t) => lower.includes(t.toLowerCase()))
                            );

                            return (
                              <span
                                key={`missing-${i}`}
                                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/10 dark:bg-amber-950/25 text-amber-700 dark:text-amber-300 border border-amber-500/25"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span className="truncate max-w-[150px]">Missing: {ing}</span>
                                {matchedItem && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleOwnedItem(matchedItem.id);
                                    }}
                                    className="ml-1 p-0.5 rounded hover:bg-amber-500/20 text-amber-800 dark:text-amber-200"
                                    title={`Add ${matchedItem.name} to My Bar`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2.5 border-t border-rose-950/10 dark:border-pink-200/10 flex items-center justify-between text-xs">
                      <span className="text-[#644f5a] dark:text-pink-200/65 font-mono-tabular">
                        {cocktail.technique} · {cocktail.targetDilutionPct}% Dilution
                      </span>
                      <span className="font-semibold text-pink-600 dark:text-pink-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>View Spec</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* VIEW B: INTERACTIVE INVENTORY CHECKLIST */}
      {subView === 'inventory' && (
        <section className="space-y-5">
          {/* Preset Kits & Bulk Bar Configuration Strip */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151014] border border-rose-950/10 dark:border-pink-200/15 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#181115] dark:text-pink-100">
                <SlidersHorizontal className="w-4 h-4 text-pink-400" />
                <span>Quick Starter Kits:</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#faf5f7] dark:bg-[#1f171d] text-[#644f5a] dark:text-pink-200/70 hover:text-[#181115] dark:hover:text-white border border-rose-950/10 dark:border-pink-200/10 transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pink-scrollbar pb-1">
              {INVENTORY_PRESET_KITS.map((kit) => (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => handleApplyPreset(kit.itemIds)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#faf5f7] dark:bg-[#1f171d] border border-rose-950/10 dark:border-pink-200/15 hover:border-pink-400/50 text-[#181115] dark:text-pink-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-pink-500" />
                  <span>{kit.label}</span>
                  <span className="font-mono-tabular opacity-60">({kit.itemIds.length})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs & Search Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Category Onglets: Base Spirits, Liqueurs, Mixers, Citrus & Garnishes */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 border ${
                    selectedCategory === 'All'
                      ? `${activeGlossPill} shadow-sm`
                      : 'bg-white dark:bg-[#151014] text-[#5c4752] dark:text-pink-200/70 border-rose-950/10 dark:border-pink-200/15'
                  }`}
                >
                  All Categories ({ownedItemIds.length}/{BAR_INVENTORY_ITEMS.length})
                </button>

                {CATEGORIES.map((cat) => {
                  const stat = categoryCounts[cat];
                  const isCatActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border flex items-center gap-1.5 ${
                        isCatActive
                          ? `${activeGlossPill} font-semibold shadow-sm`
                          : 'bg-white dark:bg-[#151014] text-[#5c4752] dark:text-pink-200/70 border-rose-950/10 dark:border-pink-200/15'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="font-mono-tabular opacity-75">
                        ({stat.owned}/{stat.total})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Within Inventory */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Filter bottles & citrus..."
                  className="w-full min-h-[42px] pl-9 pr-8 py-1.5 rounded-xl bg-white dark:bg-[#151014] border border-rose-950/10 dark:border-pink-200/15 text-xs text-[#181115] dark:text-pink-50 placeholder:text-[#7a636f] dark:placeholder:text-pink-200/40 focus:outline-none focus:border-sky-400"
                />
                {inventorySearch && (
                  <button
                    type="button"
                    onClick={() => setInventorySearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#644f5a] dark:text-pink-200/60"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Checklist Grid Grouped by Category */}
            <div className="space-y-6">
              {CATEGORIES.filter((c) => selectedCategory === 'All' || selectedCategory === c).map(
                (category) => {
                  const itemsInCategory = filteredInventoryItems.filter(
                    (item) => item.category === category
                  );
                  if (itemsInCategory.length === 0) return null;

                  const stat = categoryCounts[category];

                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-rose-950/10 dark:border-pink-200/10">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-display font-semibold text-[#181115] dark:text-pink-100">
                            {category}
                          </h3>
                          <span className="text-xs font-mono-tabular text-pink-600 dark:text-pink-300">
                            ({stat.owned} of {stat.total} stocked)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const ids = itemsInCategory.map((i) => i.id);
                              const combined = Array.from(new Set([...ownedItemIds, ...ids]));
                              onSetOwnedItems(combined);
                            }}
                            className="text-[11px] text-[#644f5a] dark:text-pink-200/70 hover:text-pink-500"
                          >
                            Select Category
                          </button>
                          <span className="text-xs text-rose-950/20 dark:text-pink-200/20">·</span>
                          <button
                            type="button"
                            onClick={() => {
                              const idsToRemove = new Set(itemsInCategory.map((i) => i.id));
                              onSetOwnedItems(ownedItemIds.filter((id) => !idsToRemove.has(id)));
                            }}
                            className="text-[11px] text-[#644f5a] dark:text-pink-200/70 hover:text-rose-400"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {itemsInCategory.map((item) => {
                          const isOwned = ownedSet.has(item.id);

                          return (
                            <div
                              key={item.id}
                              onClick={() => onToggleOwnedItem(item.id)}
                              className={`min-h-[56px] p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                                isOwned
                                  ? 'bg-pink-500/10 dark:bg-pink-950/30 border-pink-400/60 dark:border-pink-300/40 shadow-sm'
                                  : 'bg-white dark:bg-[#151014] border-rose-950/10 dark:border-pink-200/15 hover:border-pink-400/40'
                              }`}
                            >
                              {/* Custom Touch Checkbox */}
                              <div
                                className={`w-5 h-5 mt-0.5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                                  isOwned
                                    ? 'bg-pink-500 border-pink-500 text-white shadow-sm'
                                    : 'border-rose-950/20 dark:border-pink-200/30 bg-[#faf5f7] dark:bg-[#1f171d]'
                                }`}
                              >
                                {isOwned && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4
                                    className={`text-sm font-semibold truncate ${
                                      isOwned
                                        ? 'text-pink-900 dark:text-pink-100 font-bold'
                                        : 'text-[#181115] dark:text-pink-50'
                                    }`}
                                  >
                                    {item.name}
                                  </h4>
                                </div>
                                <p className="text-xs text-[#644f5a] dark:text-pink-200/65 line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
