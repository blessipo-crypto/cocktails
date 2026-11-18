import React, { useState, useEffect, useMemo } from 'react';
import {
  COCKTAILS_DATA,
  SPIRITS_CATALOG,
  DISTILLATION_REGIONS,
  CocktailRecipe,
  SpiritId,
  FlavorProfile,
  GlasswareType,
  ComplexityLevel,
} from './data/cocktails';
import { CocktailVisual } from './components/CocktailVisual';
import { DistillationMap } from './components/DistillationMap';
import { BalanceLab } from './components/BalanceLab';
import { RecipeDetailSheet } from './components/RecipeDetailSheet';
import { MyBarModule } from './components/MyBarModule';
import { INVENTORY_PRESET_KITS } from './data/barInventory';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWAInstall';
import {
  Search,
  Sun,
  Moon,
  Sparkles,
  Globe,
  Sliders,
  Bookmark,
  Wine,
  Download,
  X,
  Plus,
  Filter,
  Check,
  CheckSquare,
} from 'lucide-react';

const FLAVOR_PROFILES: ('All' | FlavorProfile)[] = [
  'All',
  'Bitter & Botanical',
  'Smoky & Agave',
  'Crisp & Floral',
  'Tropical & Spiced',
  'Effervescent & Dry',
  'Rich & Spirit-Forward',
];

const GLASSWARE_TYPES: ('All' | GlasswareType)[] = [
  'All',
  'Rocks Glass',
  'Nick & Nora',
  'Coupe',
  'Champagne Flute',
  'Highball',
  'Fluted Tiki',
];

const COMPLEXITY_LEVELS: ('All' | ComplexityLevel)[] = [
  'All',
  'Essential',
  'Technical',
  'Masterclass',
];

type DegreeTier = 'All' | 'Light (10°–17°)' | 'Balanced (18°–25°)' | 'Strong (26°+)';

const DEGREE_TIERS: DegreeTier[] = [
  'All',
  'Light (10°–17°)',
  'Balanced (18°–25°)',
  'Strong (26°+)',
];

export default function App() {
  // Dual-Theme State (Default Dark for Night Bar Use)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('vespera_theme');
    return saved ? saved === 'dark' : true;
  });

  // Panel Glossy Color Configuration ('tri-gloss' | 'pink' | 'blue' | 'orange')
  const [panelAccent, setPanelAccent] = useState<'tri-gloss' | 'pink' | 'blue' | 'orange'>(() => {
    const saved = localStorage.getItem('vespera_panel_accent');
    return (saved as 'tri-gloss' | 'pink' | 'blue' | 'orange') || 'tri-gloss';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('vespera_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('vespera_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(
      'data-panel-accent',
      panelAccent === 'tri-gloss' ? 'pink' : panelAccent
    );
    localStorage.setItem('vespera_panel_accent', panelAccent);
  }, [panelAccent]);

  // Active Section Navigation ('recipes' | 'my-bar' | 'map' | 'lab' | 'vault')
  const [activeTab, setActiveTab] = useState<'recipes' | 'my-bar' | 'map' | 'lab' | 'vault'>('recipes');

  // My Bar Inventory Checklist & What Can I Make Persistence
  const [ownedInventoryIds, setOwnedInventoryIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('vespera_my_bar_inventory');
      if (raw) {
        return JSON.parse(raw);
      }
      return INVENTORY_PRESET_KITS[0].itemIds; // Classic Home Bar starter default
    } catch {
      return INVENTORY_PRESET_KITS[0].itemIds;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vespera_my_bar_inventory', JSON.stringify(ownedInventoryIds));
    } catch {
      // ignore storage quota errors
    }
  }, [ownedInventoryIds]);

  const toggleOwnedInventoryItem = (itemId: string) => {
    setOwnedInventoryIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Offline & Custom Recipes Persistence
  const [customCocktails, setCustomCocktails] = useState<CocktailRecipe[]>(() => {
    try {
      const raw = localStorage.getItem('vespera_custom_cocktails');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('vespera_saved_ids');
      return raw ? JSON.parse(raw) : ['negroni-rubino', 'oaxaca-old-fashioned', 'sakura-yuzu-martini'];
    } catch {
      return ['negroni-rubino', 'oaxaca-old-fashioned', 'sakura-yuzu-martini'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vespera_saved_ids', JSON.stringify(savedIds));
    } catch {
      // ignore storage quota errors
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('vespera_custom_cocktails', JSON.stringify(customCocktails));
    } catch {
      // ignore storage quota errors
    }
  }, [customCocktails]);

  const allCocktails = useMemo(
    () => [...customCocktails, ...COCKTAILS_DATA],
    [customCocktails]
  );

  // Multi-Spirit & Category Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpirits, setSelectedSpirits] = useState<SpiritId[]>([]);
  const [spiritMatchMode, setSpiritMatchMode] = useState<'AND' | 'OR'>('AND');
  const [spiritBlendFilter, setSpiritBlendFilter] = useState<'All' | 'Multi' | 'Single'>('All');
  const [selectedFlavor, setSelectedFlavor] = useState<'All' | FlavorProfile>('All');
  const [selectedGlassware, setSelectedGlassware] = useState<'All' | GlasswareType>('All');
  const [selectedComplexity, setSelectedComplexity] = useState<'All' | ComplexityLevel>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedDegreeTier, setSelectedDegreeTier] = useState<DegreeTier>('All');
  const [degreeSort, setDegreeSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [activeCategoryAxis, setActiveCategoryAxis] = useState<
    'degrees' | 'flavor' | 'glassware' | 'complexity' | 'country'
  >('degrees');

  // Selected Recipe Detail Drawer
  const [activeCocktail, setActiveCocktail] = useState<CocktailRecipe | null>(null);

  // Custom Spec Builder Modal
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [newSpecName, setNewSpecName] = useState<string>('');
  const [newSpecSubtitle, setNewSpecSubtitle] = useState<string>('');
  const [newSpecCountry, setNewSpecCountry] = useState<string>('Italy');
  const [newSpecFlavor, setNewSpecFlavor] = useState<FlavorProfile>('Bitter & Botanical');
  const [newSpecGlass, setNewSpecGlass] = useState<GlasswareType>('Coupe');
  const [newSpecDegrees, setNewSpecDegrees] = useState<number>(24.5);
  const [newSpecSpirits, setNewSpecSpirits] = useState<SpiritId[]>(['gin', 'campari']);
  const [newSpecTip, setNewSpecTip] = useState<string>(
    'Stir over tempered crystal ice for 28 seconds and express fresh citrus peel.'
  );

  // PWA Install & Online Status
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showInstallGuideModal, setShowInstallGuideModal] = useState<boolean>(false);

  const toggleSpiritSelection = (id: SpiritId) => {
    setSelectedSpirits((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSaveOffline = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSpirits([]);
    setSpiritBlendFilter('All');
    setSelectedFlavor('All');
    setSelectedGlassware('All');
    setSelectedComplexity('All');
    setSelectedCountry('All');
    setSelectedDegreeTier('All');
    setDegreeSort('default');
  };

  const filteredCocktails = useMemo(() => {
    const list = allCocktails.filter((cocktail) => {
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inName = cocktail.name.toLowerCase().includes(q);
        const inSub = cocktail.subtitle.toLowerCase().includes(q);
        const inCountry = cocktail.country.toLowerCase().includes(q);
        const inDeg = `${cocktail.abv}°`.includes(q);
        const inIng = cocktail.ingredients.some((i) => i.name.toLowerCase().includes(q));
        if (!inName && !inSub && !inCountry && !inDeg && !inIng) return false;
      }

      // Single vs Multi-Spirit filter
      if (spiritBlendFilter === 'Multi' && !cocktail.isMultiSpirit) return false;
      if (spiritBlendFilter === 'Single' && cocktail.isMultiSpirit) return false;

      // Multi-Spirit or Single-Spirit selection
      if (selectedSpirits.length > 0) {
        if (spiritMatchMode === 'AND') {
          const hasAll = selectedSpirits.every((sp) => cocktail.spirits.includes(sp));
          if (!hasAll) return false;
        } else {
          const hasAny = selectedSpirits.some((sp) => cocktail.spirits.includes(sp));
          if (!hasAny) return false;
        }
      }

      // Alcohol Degrees (°) Tier Filter
      if (selectedDegreeTier === 'Light (10°–17°)' && cocktail.abv >= 18) return false;
      if (
        selectedDegreeTier === 'Balanced (18°–25°)' &&
        (cocktail.abv < 18 || cocktail.abv >= 26)
      ) {
        return false;
      }
      if (selectedDegreeTier === 'Strong (26°+)' && cocktail.abv < 26) return false;

      // Flavor profile
      if (selectedFlavor !== 'All' && cocktail.flavorProfile !== selectedFlavor) return false;

      // Glassware
      if (selectedGlassware !== 'All' && cocktail.glassware !== selectedGlassware) return false;

      // Complexity
      if (selectedComplexity !== 'All' && cocktail.complexity !== selectedComplexity) return false;

      // Country
      if (selectedCountry !== 'All' && cocktail.country !== selectedCountry) return false;

      return true;
    });

    if (degreeSort === 'asc') {
      return [...list].sort((a, b) => a.abv - b.abv);
    }
    if (degreeSort === 'desc') {
      return [...list].sort((a, b) => b.abv - a.abv);
    }
    return list;
  }, [
    allCocktails,
    searchQuery,
    spiritBlendFilter,
    selectedSpirits,
    spiritMatchMode,
    selectedDegreeTier,
    degreeSort,
    selectedFlavor,
    selectedGlassware,
    selectedComplexity,
    selectedCountry,
  ]);

  const savedCocktails = useMemo(
    () => allCocktails.filter((c) => savedIds.includes(c.id)),
    [allCocktails, savedIds]
  );

  const countriesList = useMemo(() => {
    const unique = Array.from(new Set(allCocktails.map((c) => c.country)));
    return ['All', ...unique];
  }, [allCocktails]);

  const handleCreateCustomSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;
    const chosenSpirits: SpiritId[] = newSpecSpirits.length > 0 ? newSpecSpirits : ['gin'];
    const created: CocktailRecipe = {
      id: `custom-${Date.now()}`,
      name: newSpecName.trim(),
      subtitle:
        newSpecSubtitle.trim() ||
        'Bespoke house formulation saved to local offline atelier vault',
      image: '/src/assets/images/cocktail_sakura_martini_1794963306133.jpg',
      spirits: chosenSpirits,
      primarySpirit: chosenSpirits[0],
      isMultiSpirit: chosenSpirits.length > 1,
      flavorProfile: newSpecFlavor,
      glassware: newSpecGlass,
      complexity: 'Technical',
      country: newSpecCountry,
      regionId:
        DISTILLATION_REGIONS.find((r) => r.country === newSpecCountry)?.id || 'italy-north',
      abv: Number(newSpecDegrees) || 24.5,
      targetDilutionPct: 23,
      servingTempC: -3.5,
      brixAcidRatio: 'Custom House Balance',
      iceSpec: newSpecGlass === 'Rocks Glass' ? 'Large Clear Cube' : 'Served Up (No Ice)',
      technique: newSpecGlass === 'Rocks Glass' ? 'Stirred' : 'Hard Shake',
      prepTimeSec: 90,
      agitationDurationSec: 25,
      garnish: 'Expressed citrus twist',
      ingredients: chosenSpirits.map((sp, idx) => {
        const meta = SPIRITS_CATALOG.find((s) => s.id === sp);
        return {
          name: meta?.name || sp,
          ml: idx === 0 ? 45 : 22.5,
          spiritId: sp,
          role: idx === 0 ? 'Base' : 'Modifier',
          layerColor: meta?.colorHex || '#f472b6',
          abv: meta?.abvDefault || 40,
        };
      }),
      steps: [
        'Pre-chill serving vessel to -8°C.',
        'Measure selected base and modifier spirits into mixing tin or Yarai beaker.',
        'Agitate with dense tempered ice to target 23% water integration.',
        'Fine-strain into chilled vessel and express essential peel oils.',
      ],
      technicalTip: newSpecTip,
      spiritBalanceAnalysis: {
        sweetness: 5,
        acidity: 5,
        bitterness: 6,
        booziness: 7,
        aromaticLift: 9,
      },
    };

    setCustomCocktails((prev) => [created, ...prev]);
    setSavedIds((prev) => [created.id, ...prev]);
    setNewSpecName('');
    setNewSpecSubtitle('');
    setShowCustomModal(false);
    setActiveCocktail(created);
  };

  const activeFilterCount =
    selectedSpirits.length +
    (spiritBlendFilter !== 'All' ? 1 : 0) +
    (selectedDegreeTier !== 'All' ? 1 : 0) +
    (degreeSort !== 'default' ? 1 : 0) +
    (selectedFlavor !== 'All' ? 1 : 0) +
    (selectedGlassware !== 'All' ? 1 : 0) +
    (selectedComplexity !== 'All' ? 1 : 0) +
    (selectedCountry !== 'All' ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f8] dark:bg-[#0d0a0c] text-[#181115] dark:text-[#f7eef2] transition-colors duration-200 pb-20 md:pb-12">
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 h-14 px-4 sm:px-8 flex items-center justify-between gap-8 bg-[#faf6f8]/90 dark:bg-[#0d0a0c]/90 backdrop-blur-md border-b border-rose-950/10 dark:border-pink-200/10">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('recipes');
          }}
          className="text-2xl font-display font-bold tracking-tight text-[#181115] dark:text-pink-100 whitespace-nowrap shrink-0"
        >
          Vespera
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5c4752] dark:text-pink-100/70">
          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className={`hover:text-pink-500 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'recipes'
                ? 'text-[#181115] dark:text-pink-200 border-b-2 border-pink-400'
                : ''
            }`}
          >
            Recipes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my-bar')}
            className={`hover:text-pink-500 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
              activeTab === 'my-bar'
                ? 'text-[#181115] dark:text-pink-200 border-b-2 border-pink-400 font-semibold'
                : ''
            }`}
          >
            <span>My Bar</span>
            <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
              {ownedInventoryIds.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`hover:text-pink-500 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'map'
                ? 'text-[#181115] dark:text-pink-200 border-b-2 border-pink-400'
                : ''
            }`}
          >
            World Origins
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            className={`hover:text-pink-500 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'lab'
                ? 'text-[#181115] dark:text-pink-200 border-b-2 border-pink-400'
                : ''
            }`}
          >
            Balance Lab
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vault')}
            className={`hover:text-pink-500 dark:hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'vault'
                ? 'text-[#181115] dark:text-pink-200 border-b-2 border-pink-400'
                : ''
            }`}
          >
            Offline Vault ({savedIds.length})
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          {!isInstalled && (isInstallable || isIOS) ? (
            <button
              type="button"
              onClick={() => {
                if (isInstallable) {
                  install();
                } else {
                  setShowInstallGuideModal(true);
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-[#140c10] rounded-xl glossy-pink-btn transition-transform active:scale-95 whitespace-nowrap shrink-0"
            >
              Install App
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="px-4 py-2 text-xs font-semibold text-[#140c10] rounded-xl glossy-pink-btn transition-transform active:scale-95 whitespace-nowrap shrink-0"
            >
              New House Spec
            </button>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 space-y-6">
        {/* Sub-Header Utility Strip: Dual-Mode Switcher, Panel Glossy Color Config & Custom Spec Trigger */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-rose-950/10 dark:border-pink-200/10">
          <div className="flex items-center gap-2 text-xs text-[#644f5a] dark:text-pink-200/70">
            <span>{allCocktails.length} Precision Recipes</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">11.2° to 33.4° Alcohol Range</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular text-pink-600 dark:text-pink-300">
              {isOnline ? 'Offline Cache Ready' : 'Offline Mode Active'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Panel Glossy Color Configuration Selector */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#161115] border border-rose-950/10 dark:border-pink-200/15"
              role="group"
              aria-label="Panel Glossy Color Configuration"
            >
              <span className="text-[11px] font-medium text-[#644f5a] dark:text-pink-200/65 px-2 whitespace-nowrap">
                Panel Gloss:
              </span>
              {(
                [
                  ['tri-gloss', 'Tri-Gloss', 'bg-gradient-to-r from-pink-300 via-sky-300 to-orange-300'],
                  ['pink', 'Glossy Pink', 'glossy-pink-pill'],
                  ['blue', 'Light Glossy Blue', 'glossy-blue-btn'],
                  ['orange', 'Glossy Orange', 'glossy-orange-btn'],
                ] as const
              ).map(([mode, label, swatchClass]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPanelAccent(mode)}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    panelAccent === mode
                      ? `${swatchClass} text-[#140c10] font-semibold shadow-sm`
                      : 'text-[#644f5a] dark:text-pink-100/70 hover:text-[#181115] dark:hover:text-white'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${swatchClass} shrink-0`} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Dual-Mode Light / Night Service Switch */}
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#161115] border border-rose-950/10 dark:border-pink-200/15 text-xs font-medium text-[#181115] dark:text-pink-100 hover:border-pink-400/50 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-orange-300" />
                  <span>Daylight Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-600" />
                  <span>Night Bar Mode</span>
                </>
              )}
            </button>

            {/* Install App Trigger if not already shown as primary */}
            {!isInstalled && (
              <button
                type="button"
                onClick={() => {
                  if (isInstallable) {
                    install();
                  } else {
                    setShowInstallGuideModal(true);
                  }
                }}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white dark:bg-[#161115] border border-rose-950/10 dark:border-pink-200/15 text-xs font-medium text-[#181115] dark:text-pink-200 hover:border-pink-400/50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Offline App</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl glossy-orange-btn text-xs font-semibold text-[#140c10] transition-transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spec</span>
            </button>
          </div>
        </div>

        {/* TAB 1: RECIPES ATELIER (MULTI-SPIRIT COMBINATION & SLIDING ONGLETS) */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            {/* Search & Multi-Spirit Combination Matrix */}
            <section
              className={`rounded-2xl bg-white dark:bg-[#151014] border p-4 sm:p-5 space-y-4 transition-all ${
                panelAccent === 'blue'
                  ? 'panel-frame-blue'
                  : panelAccent === 'orange'
                  ? 'panel-frame-orange'
                  : 'panel-frame-pink'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cocktail, spirit, degrees (e.g. 24°), or country..."
                    className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-xl bg-[#faf5f7] dark:bg-[#1d161b] border border-rose-950/10 dark:border-pink-200/15 text-sm text-[#181115] dark:text-pink-50 placeholder:text-[#7a636f] dark:placeholder:text-pink-200/40 focus:outline-none focus:border-sky-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#644f5a] dark:text-pink-200/60 hover:text-pink-400"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Single vs Multi-Spirit & Combination Logic Controls */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <div className="flex items-center p-1 rounded-xl bg-[#faf5f7] dark:bg-[#1d161b] border border-rose-950/10 dark:border-pink-200/10 shrink-0">
                    {(
                      [
                        ['All', 'All Spirits'],
                        ['Multi', 'Multi-Spirit Combined'],
                        ['Single', 'Single-Spirit'],
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSpiritBlendFilter(mode)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          spiritBlendFilter === mode
                            ? panelAccent === 'blue' || panelAccent === 'tri-gloss'
                              ? 'glossy-blue-btn text-[#0c1418] font-semibold'
                              : panelAccent === 'orange'
                              ? 'glossy-orange-btn text-[#18100c] font-semibold'
                              : 'glossy-pink-btn text-[#140c10] font-semibold'
                            : 'text-[#644f5a] dark:text-pink-200/70 hover:text-[#181115] dark:hover:text-pink-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Match Logic Toggle (Combine All Selected vs Match Any) with Glossy Orange Accent */}
                  <div className="flex items-center p-1 rounded-xl bg-[#faf5f7] dark:bg-[#1d161b] border border-rose-950/10 dark:border-pink-200/10 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSpiritMatchMode('AND')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        spiritMatchMode === 'AND'
                          ? 'glossy-orange-btn text-[#18100c] font-semibold'
                          : 'text-[#644f5a] dark:text-pink-200/70'
                      }`}
                      title="Only show cocktails containing every selected alcohol together"
                    >
                      Combine All (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpiritMatchMode('OR')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        spiritMatchMode === 'OR'
                          ? 'glossy-orange-btn text-[#18100c] font-semibold'
                          : 'text-[#644f5a] dark:text-pink-200/70'
                      }`}
                      title="Show cocktails containing any of the selected alcohols"
                    >
                      Any Selected
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontal Sliding Base Spirit & Modifier Combination Onglets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#644f5a] dark:text-pink-200/75">
                    Tap 1 or multiple alcohols to combine ({selectedSpirits.length} selected
                    {selectedSpirits.length > 1
                      ? ` · ${spiritMatchMode === 'AND' ? 'Combined Blend' : 'Either Spirit'}`
                      : ''}
                    )
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="text-xs font-medium text-pink-600 dark:text-pink-300 hover:underline whitespace-nowrap shrink-0"
                    >
                      Reset Filters ({activeFilterCount})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pink-scrollbar pb-1.5 snap-x">
                  {SPIRITS_CATALOG.map((spirit) => {
                    const isSelected = selectedSpirits.includes(spirit.id);
                    const activeGlossClass =
                      panelAccent === 'blue'
                        ? 'glossy-blue-btn border-sky-300'
                        : panelAccent === 'orange'
                        ? 'glossy-orange-btn border-orange-300'
                        : 'glossy-pink-btn border-pink-300';
                    return (
                      <button
                        key={spirit.id}
                        type="button"
                        onClick={() => toggleSpiritSelection(spirit.id)}
                        className={`snap-start min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-medium transition-all gpu-smooth whitespace-nowrap shrink-0 flex items-center gap-2 border ${
                          isSelected
                            ? `${activeGlossClass} text-[#140c10] font-semibold scale-[1.02]`
                            : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#3d2e36] dark:text-pink-100/80 border-rose-950/10 dark:border-pink-200/10 hover:border-pink-400/50'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: isSelected ? '#140c10' : spirit.colorHex }}
                        />
                        <span>{spirit.name}</span>
                        <span className="font-mono-tabular opacity-70">{spirit.abvDefault}°</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multi-Axis Sliding Onglets (Degrees / Flavor Profile / Glassware / Complexity / Country) */}
              <div className="pt-2 border-t border-rose-950/10 dark:border-pink-200/10 space-y-2.5">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-xs text-[#644f5a] dark:text-pink-200/60 flex items-center gap-1 shrink-0 mr-1">
                    <Filter className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dimension:</span>
                  </span>
                  {(
                    [
                      ['degrees', `Degrees ° (${selectedDegreeTier})`, 'glossy-blue-btn'],
                      ['flavor', `Flavor (${selectedFlavor})`, 'glossy-orange-btn'],
                      ['glassware', `Vessel (${selectedGlassware})`, 'glossy-blue-btn'],
                      ['complexity', `Complexity (${selectedComplexity})`, 'glossy-pink-pill'],
                      ['country', `Country (${selectedCountry})`, 'glossy-orange-btn'],
                    ] as const
                  ).map(([axis, label, accentBtn]) => (
                    <button
                      key={axis}
                      type="button"
                      onClick={() => setActiveCategoryAxis(axis)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                        activeCategoryAxis === axis
                          ? `${accentBtn} text-[#140c10] font-semibold`
                          : 'text-[#644f5a] dark:text-pink-200/65 hover:text-[#181115] dark:hover:text-pink-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Active Dimension Horizontal Sliding Onglets */}
                <div className="flex items-center gap-2 overflow-x-auto pink-scrollbar pb-1 snap-x">
                  {activeCategoryAxis === 'degrees' && (
                    <>
                      {DEGREE_TIERS.map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setSelectedDegreeTier(tier)}
                          className={`snap-start min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                            selectedDegreeTier === tier
                              ? 'glossy-blue-btn text-[#0c1418] font-semibold border-sky-300'
                              : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#4a3942] dark:text-pink-100/75 border-rose-950/10 dark:border-pink-200/10'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}

                      <div className="h-5 w-px bg-rose-950/10 dark:bg-pink-200/15 mx-1 shrink-0" />

                      {(
                        [
                          ['default', 'Order: Curated'],
                          ['asc', 'Degrees: Low → High °'],
                          ['desc', 'Degrees: High → Low °'],
                        ] as const
                      ).map(([sortKey, sortLabel]) => (
                        <button
                          key={sortKey}
                          type="button"
                          onClick={() => setDegreeSort(sortKey)}
                          className={`snap-start min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-mono-tabular font-medium transition-all whitespace-nowrap shrink-0 border ${
                            degreeSort === sortKey
                              ? 'glossy-orange-btn text-[#18100c] font-semibold border-orange-300'
                              : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#4a3942] dark:text-pink-100/75 border-rose-950/10 dark:border-pink-200/10'
                          }`}
                        >
                          {sortLabel}
                        </button>
                      ))}
                    </>
                  )}

                  {activeCategoryAxis === 'flavor' &&
                    FLAVOR_PROFILES.map((flavor) => (
                      <button
                        key={flavor}
                        type="button"
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`snap-start min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                          selectedFlavor === flavor
                            ? 'glossy-orange-btn text-[#18100c] font-semibold border-orange-300'
                            : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#4a3942] dark:text-pink-100/75 border-rose-950/10 dark:border-pink-200/10'
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}

                  {activeCategoryAxis === 'glassware' &&
                    GLASSWARE_TYPES.map((glass) => (
                      <button
                        key={glass}
                        type="button"
                        onClick={() => setSelectedGlassware(glass)}
                        className={`snap-start min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                          selectedGlassware === glass
                            ? 'glossy-blue-btn text-[#0c1418] font-semibold border-sky-300'
                            : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#4a3942] dark:text-pink-100/75 border-rose-950/10 dark:border-pink-200/10'
                        }`}
                      >
                        {glass}
                      </button>
                    ))}

                  {activeCategoryAxis === 'complexity' &&
                    COMPLEXITY_LEVELS.map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setSelectedComplexity(comp)}
                        className={`snap-start min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                          selectedComplexity === comp
                            ? 'glossy-pink-btn text-[#140c10] font-semibold border-pink-300'
                            : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#4a3942] dark:text-pink-100/75 border-rose-950/10 dark:border-pink-200/10'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}

                  {activeCategoryAxis === 'country' &&
                    countriesList.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => setSelectedCountry(country)}
                        className={`snap-start min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                          selectedCountry === country
                            ? 'glossy-orange-btn text-[#18100c] font-semibold border-orange-300'
                            : 'bg-[#faf5f7] dark:bg-[#1d161b] text-[#4a3942] dark:text-pink-100/75 border-rose-950/10 dark:border-pink-200/10'
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                </div>
              </div>
            </section>

            {/* Horizontal + Vertical Dual-Panel Layout */}
            {filteredCocktails.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-[#151014] border border-rose-950/10 dark:border-pink-200/15 p-10 text-center space-y-3">
                <p className="text-lg font-display font-semibold text-[#181115] dark:text-pink-100">
                  No cocktails match this exact multi-spirit or degree filter combination.
                </p>
                <p className="text-xs text-[#644f5a] dark:text-pink-200/65 max-w-md mx-auto">
                  Switch combination mode from &ldquo;Combine All (+)&rdquo; to &ldquo;Any Selected&rdquo; or clear active filters.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSpiritMatchMode('OR')}
                    className="px-4 py-2 rounded-xl bg-[#faf5f7] dark:bg-[#21181e] border border-pink-400/30 text-xs font-medium text-[#181115] dark:text-pink-200"
                  >
                    Switch to Any Spirit (OR)
                  </button>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-4 py-2 rounded-xl glossy-pink-btn text-xs font-semibold text-[#140c10]"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-7">
                {/* 1. Horizontal 120Hz Snap-Scrolling Spotlight Carousel */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-semibold text-[#181115] dark:text-[#f7eef2]">
                      Horizontal Quick-Swipe Spotlight ({filteredCocktails.length})
                    </h2>
                    <span className="text-xs text-[#644f5a] dark:text-pink-200/60">
                      Swipe horizontally · Tap for full vessel spec
                    </span>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pink-scrollbar pb-2 snap-x snap-mandatory">
                    {filteredCocktails.map((cocktail) => {
                      const spiritNames = cocktail.spirits
                        .map((id) => SPIRITS_CATALOG.find((s) => s.id === id)?.name || id)
                        .join(' + ');

                      return (
                        <div
                          key={cocktail.id}
                          onClick={() => setActiveCocktail(cocktail)}
                          className="snap-start w-[290px] sm:w-[320px] shrink-0 rounded-2xl bg-white dark:bg-[#151014] border border-rose-950/10 dark:border-pink-200/15 hover:border-pink-400/60 p-4 cursor-pointer transition-all gpu-smooth hover:-translate-y-0.5 group flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start gap-3.5">
                              <CocktailVisual cocktail={cocktail} size="sm" />
                              <div className="min-w-0 flex-1">
                                <div className="text-[11px] font-mono-tabular text-pink-600 dark:text-pink-300 truncate">
                                  {cocktail.abv.toFixed(1)}° Alcohol · {cocktail.country}
                                </div>
                                <h3 className="text-lg font-display font-bold text-[#181115] dark:text-pink-50 truncate group-hover:text-pink-500 dark:group-hover:text-pink-300 mt-0.5">
                                  {cocktail.name}
                                </h3>
                                <div className="text-xs text-[#644f5a] dark:text-pink-200/70 truncate mt-0.5">
                                  {spiritNames}
                                </div>
                                <div className="text-[11px] font-mono-tabular text-[#644f5a] dark:text-pink-200/55 mt-1.5">
                                  {cocktail.glassware} · {Math.round(cocktail.abv * 2)} Proof
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-[#4a3942] dark:text-pink-100/75 line-clamp-2 leading-relaxed">
                              {cocktail.technicalTip}
                            </p>
                          </div>

                          <div className="pt-2.5 border-t border-rose-950/10 dark:border-pink-200/10 flex items-center justify-between text-xs">
                            <span className="text-[#644f5a] dark:text-pink-200/65">
                              {cocktail.flavorProfile}
                            </span>
                            <span className="font-mono-tabular font-medium text-pink-600 dark:text-pink-300">
                              {cocktail.abv.toFixed(1)}° · {cocktail.technique} →
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 2. Vertical Categorized Recipe Feed with Small HD Pictures & Technical Specs */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-semibold text-[#181115] dark:text-[#f7eef2]">
                      Complete Formulation Index
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('map')}
                      className="text-xs font-medium text-pink-600 dark:text-pink-300 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Explore on World Map</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCocktails.map((cocktail) => {
                      const isPinned = savedIds.includes(cocktail.id);
                      const spiritNames = cocktail.spirits
                        .map((id) => SPIRITS_CATALOG.find((s) => s.id === id)?.name || id)
                        .join(' + ');
                      const totalRawMl =
                        cocktail.ingredients.reduce((acc, i) => acc + i.ml, 0) || 1;
                      const rawDeg =
                        (cocktail.ingredients.reduce(
                          (acc, i) => acc + i.ml * (i.abv / 100),
                          0
                        ) /
                          totalRawMl) *
                        100;

                      return (
                        <article
                          key={cocktail.id}
                          onClick={() => setActiveCocktail(cocktail)}
                          className="rounded-2xl bg-white dark:bg-[#151014] border border-rose-950/10 dark:border-pink-200/15 hover:border-pink-400/55 p-4 cursor-pointer transition-all gpu-smooth group flex flex-col justify-between space-y-3.5"
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Small HD Picture */}
                            <CocktailVisual cocktail={cocktail} size="sm" />

                            <div className="min-w-0 flex-1">
                              {/* Unboxed clean metadata with typographic separators */}
                              <div className="flex items-center gap-1.5 text-[11px] text-[#644f5a] dark:text-pink-200/65 truncate">
                                <span className="font-mono-tabular font-semibold text-pink-600 dark:text-pink-300">
                                  {cocktail.abv.toFixed(1)}°
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{cocktail.country}</span>
                                <span aria-hidden="true">·</span>
                                <span>{cocktail.flavorProfile}</span>
                              </div>

                              <h3 className="text-lg font-display font-bold text-[#181115] dark:text-pink-50 truncate group-hover:text-pink-500 dark:group-hover:text-pink-300 mt-0.5">
                                {cocktail.name}
                              </h3>

                              <div className="text-xs font-medium text-pink-700 dark:text-pink-300 truncate mt-0.5">
                                {spiritNames}
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px] font-mono-tabular text-[#644f5a] dark:text-pink-200/60 mt-1.5">
                                <span>{cocktail.abv.toFixed(1)}° served ({rawDeg.toFixed(0)}° raw)</span>
                                <span aria-hidden="true">·</span>
                                <span>{cocktail.glassware}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveOffline(cocktail.id);
                              }}
                              className={`min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center transition-colors ${
                                isPinned
                                  ? 'text-pink-500 dark:text-pink-300 bg-pink-500/10'
                                  : 'text-[#644f5a] dark:text-pink-200/40 hover:text-pink-400'
                              }`}
                              aria-label="Pin recipe for rapid offline access"
                              title="Pin recipe for rapid offline access"
                            >
                              <Bookmark className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          {/* Proportional Spec Preview Bar */}
                          <div className="space-y-1.5 pt-2 border-t border-rose-950/10 dark:border-pink-200/10">
                            <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-rose-950/10 dark:bg-pink-200/10">
                              {cocktail.ingredients.map((ing, i) => (
                                <div
                                  key={i}
                                  style={{
                                    width: `${Math.max(12, ing.ml)}%`,
                                    backgroundColor: ing.layerColor,
                                  }}
                                />
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#644f5a] dark:text-pink-200/70">
                              <span className="truncate">
                                {cocktail.ingredients
                                  .slice(0, 3)
                                  .map((i) => `${i.ml}ml ${i.name.split(' ')[0]}`)
                                  .join(' · ')}
                              </span>
                              <span className="text-pink-600 dark:text-pink-300 shrink-0 ml-2">
                                {cocktail.abv.toFixed(1)}° Spec →
                              </span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY BAR INVENTORY CHECKLIST & WHAT CAN I MAKE */}
        {activeTab === 'my-bar' && (
          <MyBarModule
            cocktails={allCocktails}
            ownedItemIds={ownedInventoryIds}
            onToggleOwnedItem={toggleOwnedInventoryItem}
            onSetOwnedItems={setOwnedInventoryIds}
            onSelectCocktail={(cocktail) => setActiveCocktail(cocktail)}
            panelAccent={panelAccent}
          />
        )}

        {/* TAB 3: INTERACTIVE WORLD & REGIONAL DISTILLATION ORIGINS MAP */}
        {activeTab === 'map' && (
          <DistillationMap
            cocktails={allCocktails}
            selectedCountry={selectedCountry}
            onSelectCountry={(country) => setSelectedCountry(country)}
            onSelectCocktail={(cocktail) => setActiveCocktail(cocktail)}
          />
        )}

        {/* TAB 3: TECHNICAL INTEGRATION & SPIRIT BALANCE LAB */}
        {activeTab === 'lab' && (
          <BalanceLab
            onFilterBySpirit={(spiritId) => {
              setSelectedSpirits([spiritId]);
              setActiveTab('recipes');
            }}
          />
        )}

        {/* TAB 4: OFFLINE RAPID ACCESS VAULT */}
        {activeTab === 'vault' && (
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#181115] dark:text-[#f7eef2]">
                  Rapid Offline Recipe Vault
                </h2>
                <p className="text-sm text-[#644f5a] dark:text-pink-200/65 mt-0.5">
                  Pinned recipes and custom house specifications are stored locally on your phone for zero-latency cellar or night-bar service.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(true)}
                className="min-h-[44px] px-4 py-2 rounded-xl glossy-pink-btn text-xs font-semibold text-[#140c10] flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Spec</span>
              </button>
            </div>

            {savedCocktails.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-[#151014] border border-rose-950/10 dark:border-pink-200/15 p-8 text-center space-y-3">
                <p className="text-base font-medium text-[#181115] dark:text-pink-100">
                  No pinned recipes in your vault yet.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('recipes')}
                  className="px-4 py-2 rounded-xl glossy-pink-btn text-xs font-semibold text-[#140c10]"
                >
                  Browse Cocktail Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCocktails.map((cocktail) => (
                  <article
                    key={cocktail.id}
                    onClick={() => setActiveCocktail(cocktail)}
                    className="rounded-2xl bg-white dark:bg-[#151014] border border-rose-950/10 dark:border-pink-200/15 hover:border-pink-400/55 p-4 cursor-pointer transition-all flex items-start gap-3.5"
                  >
                    <CocktailVisual cocktail={cocktail} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-mono-tabular text-pink-600 dark:text-pink-300">
                        {cocktail.country} · {cocktail.glassware}
                      </div>
                      <h3 className="text-lg font-display font-bold text-[#181115] dark:text-pink-50 truncate mt-0.5">
                        {cocktail.name}
                      </h3>
                      <p className="text-xs text-[#644f5a] dark:text-pink-200/70 line-clamp-2 mt-1">
                        {cocktail.technicalTip}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Mobile Ergonomic Bottom Navigation Bar (< md) */}
      <nav
        aria-label="Mobile Primary Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[#faf6f8]/95 dark:bg-[#0d0a0c]/95 backdrop-blur-md border-t border-rose-950/10 dark:border-pink-200/15 grid grid-cols-5 items-center px-1"
      >
        {(
          [
            ['recipes', 'Atelier', Wine],
            ['my-bar', 'My Bar', CheckSquare],
            ['map', 'Origins', Globe],
            ['lab', 'Lab', Sliders],
            ['vault', `Vault (${savedIds.length})`, Bookmark],
          ] as const
        ).map(([id, label, Icon]) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors relative ${
                active
                  ? 'text-pink-600 dark:text-pink-300 font-semibold'
                  : 'text-[#644f5a] dark:text-pink-100/55'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">{label}</span>
              {id === 'my-bar' && ownedInventoryIds.length > 0 && (
                <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#faf6f8] dark:ring-[#0d0a0c]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sliding Recipe Detail Sheet */}
      <RecipeDetailSheet
        cocktail={activeCocktail}
        onClose={() => setActiveCocktail(null)}
        isSavedOffline={activeCocktail ? savedIds.includes(activeCocktail.id) : false}
        onToggleSaveOffline={toggleSaveOffline}
        onJumpToMapRegion={(country) => {
          setSelectedCountry(country);
          setActiveTab('map');
        }}
        ownedItemIds={ownedInventoryIds}
        onToggleOwnedItem={toggleOwnedInventoryItem}
        onOpenMyBar={() => setActiveTab('my-bar')}
      />

      {/* Custom House Spec Modal */}
      {showCustomModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowCustomModal(false)}
        >
          <form
            onSubmit={handleCreateCustomSpec}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#faf6f8] dark:bg-[#151014] border border-rose-950/15 dark:border-pink-200/20 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display font-bold text-[#181115] dark:text-pink-50">
                New Offline House Cocktail Spec
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center text-[#644f5a] dark:text-pink-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#644f5a] dark:text-pink-200/75 mb-1">
                    Cocktail Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newSpecName}
                    onChange={(e) => setNewSpecName(e.target.value)}
                    placeholder="e.g., Rosa Nocturna Negroni"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white dark:bg-[#1e171d] border border-rose-950/10 dark:border-pink-200/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#644f5a] dark:text-pink-200/75 mb-1">
                    Degrees (° ABV)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="75"
                    required
                    value={newSpecDegrees}
                    onChange={(e) => setNewSpecDegrees(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white dark:bg-[#1e171d] border border-rose-950/10 dark:border-pink-200/15 text-sm font-mono-tabular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#644f5a] dark:text-pink-200/75 mb-1">
                    Flavor Profile
                  </label>
                  <select
                    value={newSpecFlavor}
                    onChange={(e) => setNewSpecFlavor(e.target.value as FlavorProfile)}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white dark:bg-[#1e171d] border border-rose-950/10 dark:border-pink-200/15 text-xs"
                  >
                    {FLAVOR_PROFILES.filter((f) => f !== 'All').map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#644f5a] dark:text-pink-200/75 mb-1">
                    Serving Vessel
                  </label>
                  <select
                    value={newSpecGlass}
                    onChange={(e) => setNewSpecGlass(e.target.value as GlasswareType)}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white dark:bg-[#1e171d] border border-rose-950/10 dark:border-pink-200/15 text-xs"
                  >
                    {GLASSWARE_TYPES.filter((g) => g !== 'All').map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#644f5a] dark:text-pink-200/75 mb-1">
                  Combined Base & Modifying Spirits
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SPIRITS_CATALOG.slice(0, 10).map((sp) => {
                    const active = newSpecSpirits.includes(sp.id);
                    return (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() =>
                          setNewSpecSpirits((prev) =>
                            prev.includes(sp.id)
                              ? prev.filter((i) => i !== sp.id)
                              : [...prev, sp.id]
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          active
                            ? 'bg-pink-500 text-white border-pink-400'
                            : 'bg-white dark:bg-[#1e171d] text-[#644f5a] dark:text-pink-200/70 border-rose-950/10 dark:border-pink-200/10'
                        }`}
                      >
                        {sp.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#644f5a] dark:text-pink-200/75 mb-1">
                  Origin Country & Technical Balance Note
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={newSpecCountry}
                    onChange={(e) => setNewSpecCountry(e.target.value)}
                    className="min-h-[42px] px-3 py-2 rounded-xl bg-white dark:bg-[#1e171d] border border-rose-950/10 dark:border-pink-200/15 text-xs"
                  >
                    {DISTILLATION_REGIONS.map((r) => (
                      <option key={r.id} value={r.country}>
                        {r.country}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newSpecTip}
                    onChange={(e) => setNewSpecTip(e.target.value)}
                    placeholder="Balance tip..."
                    className="col-span-2 min-h-[42px] px-3 py-2 rounded-xl bg-white dark:bg-[#1e171d] border border-rose-950/10 dark:border-pink-200/15 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="min-h-[42px] px-4 rounded-xl bg-white dark:bg-[#1e171d] text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[42px] px-5 rounded-xl glossy-pink-btn text-xs font-semibold text-[#140c10]"
              >
                Save to Offline Vault
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PWA Install Guide Modal for iOS / Browser */}
      {showInstallGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowInstallGuideModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-[#faf6f8] dark:bg-[#151014] border border-rose-950/15 dark:border-pink-200/20 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-[#181115] dark:text-pink-50">
                Install Vespera on Your Phone
              </h3>
              <button
                type="button"
                onClick={() => setShowInstallGuideModal(false)}
                className="p-1 text-[#644f5a] dark:text-pink-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs leading-relaxed text-[#4a3942] dark:text-pink-100/80">
              All 12 world formulations, HD photography, and the dilution calculator are cached via Service Worker for instant offline access:
            </p>
            <ol className="text-xs space-y-2 text-[#181115] dark:text-pink-100 list-decimal list-inside">
              <li>Tap the browser <strong>Share</strong> or <strong>Menu</strong> icon.</li>
              <li>Select <strong>Add to Home Screen</strong> or <strong>Install App</strong>.</li>
              <li>Launch <strong>Vespera</strong> anytime without network connectivity.</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowInstallGuideModal(false)}
              className="w-full min-h-[42px] rounded-xl glossy-pink-btn text-xs font-semibold text-[#140c10]"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
