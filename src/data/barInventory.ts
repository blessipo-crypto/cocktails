import { CocktailRecipe, IngredientSpec, SpiritId } from './cocktails';

export type BarCategory =
  | 'Base Spirits'
  | 'Liqueurs'
  | 'Mixers'
  | 'Citrus & Garnishes';

export interface BarInventoryItem {
  id: string;
  name: string;
  category: BarCategory;
  description: string;
  spiritId?: SpiritId;
  matchingTerms: string[];
}

export const BAR_INVENTORY_ITEMS: BarInventoryItem[] = [
  // --- 1. BASE SPIRITS ---
  {
    id: 'spirit_gin',
    name: 'London Dry & Botanical Gin',
    category: 'Base Spirits',
    description: 'Tanqueray, Beefeater, Bombay Sapphire, Kyoto Dry Gin',
    spiritId: 'gin',
    matchingTerms: ['gin', 'london dry', 'navy-strength', 'old tom'],
  },
  {
    id: 'spirit_tequila',
    name: 'Tequila (Blanco / Reposado)',
    category: 'Base Spirits',
    description: '100% Blue Weber Agave (Ocho, Fortaleza, Don Julio, Arette)',
    spiritId: 'tequila',
    matchingTerms: ['tequila', 'blanco', 'reposado'],
  },
  {
    id: 'spirit_mezcal',
    name: 'Artisanal Mezcal (Espadín)',
    category: 'Base Spirits',
    description: 'Del Maguey, Alipús, Montelobos, artisanal earthen pit roast',
    spiritId: 'mezcal',
    matchingTerms: ['mezcal', 'espadín'],
  },
  {
    id: 'spirit_bourbon',
    name: 'Bourbon Whiskey',
    category: 'Base Spirits',
    description: 'Buffalo Trace, Woodford Reserve, Maker’s Mark, Knob Creek',
    spiritId: 'bourbon',
    matchingTerms: ['bourbon'],
  },
  {
    id: 'spirit_rye',
    name: 'Straight Rye Whiskey',
    category: 'Base Spirits',
    description: 'Rittenhouse 100, Sazerac Rye, Bulleit Rye, Michter’s',
    spiritId: 'rye',
    matchingTerms: ['rye', 'straight rye'],
  },
  {
    id: 'spirit_scotch',
    name: 'Scotch Whisky (Blended & Peated)',
    category: 'Base Spirits',
    description: 'Speyside blend, Johnnie Walker Black, Laphroaig, Ardbeg',
    spiritId: 'scotch',
    matchingTerms: ['scotch', 'whisky', 'peated', 'islay'],
  },
  {
    id: 'spirit_rum_dark',
    name: 'Aged & Jamaican Dark Rum',
    category: 'Base Spirits',
    description: 'Appleton Estate, Smith & Cross, Plantation, El Dorado',
    spiritId: 'rum',
    matchingTerms: ['rum', 'dark rum', 'jamaican pot-still', 'pot-still dark rum'],
  },
  {
    id: 'spirit_rum_white',
    name: 'White Rum & Rhum Agricole',
    category: 'Base Spirits',
    description: 'Havana Club 3, Flor de Caña, Clement Agricole Blanc',
    spiritId: 'rum',
    matchingTerms: ['white rum', 'carta blanca', 'rhum agricole', 'agricole'],
  },
  {
    id: 'spirit_cognac',
    name: 'Cognac & French Brandy',
    category: 'Base Spirits',
    description: 'Pierre Ferrand, Rémy Martin, Hennessy VSOP, Armagnac',
    spiritId: 'cognac',
    matchingTerms: ['cognac', 'brandy', 'vsop'],
  },
  {
    id: 'spirit_vodka',
    name: 'Artisanal Vodka',
    category: 'Base Spirits',
    description: 'Belvedere, Ketel One, Grey Goose, Chopin winter wheat',
    spiritId: 'vodka',
    matchingTerms: ['vodka', 'winter wheat'],
  },
  {
    id: 'spirit_pisco',
    name: 'Peruvian Pisco (Quebranta)',
    category: 'Base Spirits',
    description: 'Pisco Portón, Barsol, Cuatro G’s single-distilled',
    spiritId: 'pisco',
    matchingTerms: ['pisco', 'quebranta'],
  },
  {
    id: 'spirit_cachaca',
    name: 'Artisanal Cachaça',
    category: 'Base Spirits',
    description: 'Avuá, Leblon, Novo Fogo fresh sugarcane juice',
    spiritId: 'cachaca',
    matchingTerms: ['cachaça', 'cachaca'],
  },
  {
    id: 'spirit_irish_whiskey',
    name: 'Irish Single Pot Still Whiskey',
    category: 'Base Spirits',
    description: 'Redbreast 12, Green Spot, Powers John’s Lane',
    spiritId: 'irish_whiskey',
    matchingTerms: ['irish whiskey', 'pot still irish', 'midleton'],
  },

  // --- 2. LIQUEURS & FORTIFIED ---
  {
    id: 'liq_campari',
    name: 'Campari & Red Bitter Aperitivo',
    category: 'Liqueurs',
    description: 'Campari, Aperol, Select, bitter orange & gentian',
    spiritId: 'campari',
    matchingTerms: ['campari', 'aperol', 'bitter aperitivo', 'aperitivo blend'],
  },
  {
    id: 'liq_sweet_vermouth',
    name: 'Sweet Vermouth (Torino Rosso)',
    category: 'Liqueurs',
    description: 'Carpano Antica Formula, Cocchi Storico, Cinzano Rosso',
    spiritId: 'vermouth',
    matchingTerms: ['vermouth di torino', 'vermouth di torino rosso', 'sweet vermouth', 'rosso'],
  },
  {
    id: 'liq_dry_vermouth',
    name: 'Dry & Blanc Vermouth (Lillet / Dolin)',
    category: 'Liqueurs',
    description: 'Noilly Prat Dry, Dolin Blanc, Lillet Blanc, Kina L’Aéro',
    spiritId: 'vermouth',
    matchingTerms: ['dry french vermouth', 'blanc vermouth', 'lillet blanc', 'dry vermouth', 'quinine'],
  },
  {
    id: 'liq_orange_curacao',
    name: 'Orange Liqueur (Cointreau / Dry Curaçao)',
    category: 'Liqueurs',
    description: 'Cointreau, Pierre Ferrand Dry Curaçao, Grand Marnier, Triple Sec',
    matchingTerms: ['cointreau', 'curaçao', 'curacao', 'triple sec', 'orange liqueur'],
  },
  {
    id: 'liq_maraschino',
    name: 'Luxardo Maraschino Liqueur',
    category: 'Liqueurs',
    description: 'Distilled Marasca sour cherry liqueur with herbal stone notes',
    matchingTerms: ['maraschino', 'luxardo maraschino'],
  },
  {
    id: 'liq_chartreuse_green',
    name: 'Green & Yellow Chartreuse',
    category: 'Liqueurs',
    description: 'Chartreuse Verte 55%, Chartreuse Jaune 43% with 130 herbs',
    spiritId: 'chartreuse',
    matchingTerms: ['chartreuse', 'green chartreuse', 'yellow chartreuse'],
  },
  {
    id: 'liq_amaro_herbal',
    name: 'Alpine & Herbal Amaro (Nonino / Montenegro / Bénédictine)',
    category: 'Liqueurs',
    description: 'Amaro Nonino, Amaro Montenegro, Bénédictine D.O.M., Averna',
    spiritId: 'amaro',
    matchingTerms: ['amaro nonino', 'bénédictine', 'benedictine', 'herbal amaro', 'amaro'],
  },
  {
    id: 'liq_fernet',
    name: 'Fernet-Branca',
    category: 'Liqueurs',
    description: 'Bitter alpine amaro with saffron, myrrh, rhubarb, and spearmint',
    spiritId: 'amaro',
    matchingTerms: ['fernet-branca', 'fernet'],
  },
  {
    id: 'liq_coffee',
    name: 'Craft Coffee Liqueur',
    category: 'Liqueurs',
    description: 'Mr Black Cold Brew Liqueur, Kahlúa, Galliano Ristretto',
    matchingTerms: ['coffee liqueur', 'mr black', 'kahlua', 'kahlúa'],
  },
  {
    id: 'liq_sherry',
    name: 'Sherry (Fino / Manzanilla / Oloroso)',
    category: 'Liqueurs',
    description: 'Tio Pepe Fino, La Gitana Manzanilla, Lustau Oloroso',
    spiritId: 'sherry',
    matchingTerms: ['sherry', 'fino sherry', 'manzanilla', 'oloroso'],
  },
  {
    id: 'liq_absinthe',
    name: 'Verte Absinthe / Herbsaint',
    category: 'Liqueurs',
    description: 'Pernod, Jade, Lucid Verte, St. George Absinthe Verte',
    spiritId: 'absinthe',
    matchingTerms: ['absinthe', 'herbsaint', 'verte absinthe'],
  },
  {
    id: 'liq_yuzu_sakura',
    name: 'Yuzu & Sakura Blossom Liqueur',
    category: 'Liqueurs',
    description: 'Umeshu, Yuzushu, Japanese floral blossom liqueurs',
    spiritId: 'yuzu',
    matchingTerms: ['yuzu', 'sakura & yuzu', 'yuzu liqueur'],
  },
  {
    id: 'liq_cassis_mure',
    name: 'Crème de Cassis & Crème de Mûre',
    category: 'Liqueurs',
    description: 'Dijon blackcurrant liqueur or blackberry liqueur',
    matchingTerms: ['cassis', 'crème de cassis', 'crème de mûre', 'mûre'],
  },
  {
    id: 'liq_violette',
    name: 'Crème de Violette',
    category: 'Liqueurs',
    description: 'Rothman & Winter, Tempus Fugit alpine violet liqueur',
    matchingTerms: ['crème de violette', 'violette'],
  },

  // --- 3. MIXERS & SWEETENERS ---
  {
    id: 'mix_simple_syrup',
    name: 'Simple Syrup (Cane / Demerara)',
    category: 'Mixers',
    description: '1:1 or 2:1 rich cane sugar syrup, raw Demerara or turbinado syrup',
    matchingTerms: ['simple cane syrup', 'cane syrup', 'rich simple', 'demerara', 'jarabe de goma', 'sugar'],
  },
  {
    id: 'mix_agave',
    name: 'Raw Agave Nectar',
    category: 'Mixers',
    description: 'Organic light or amber Blue Agave nectar diluted 1:1 with spring water',
    matchingTerms: ['agave nectar', 'agave syrup', 'blue agave'],
  },
  {
    id: 'mix_orgeat',
    name: 'Almond Orgeat Syrup',
    category: 'Mixers',
    description: 'Artisanal French almond syrup with orange blossom and rose water',
    matchingTerms: ['orgeat', 'almond orgeat'],
  },
  {
    id: 'mix_honey_ginger',
    name: 'Honey-Ginger Syrup',
    category: 'Mixers',
    description: 'Wildflower or heather honey simmered with fresh pressed ginger juice',
    matchingTerms: ['honey-ginger', 'ginger syrup', 'honey'],
  },
  {
    id: 'mix_soda_water',
    name: 'Club Soda / Carbonated Sparkling Water',
    category: 'Mixers',
    description: 'Chilled high-carbonation soda water (Fever-Tree, Q Mixers)',
    matchingTerms: ['soda water', 'club soda', 'sparkling soda'],
  },
  {
    id: 'mix_ginger_beer',
    name: 'Spicy Craft Ginger Beer',
    category: 'Mixers',
    description: 'Fever-Tree Ginger Beer, Bundaberg, ginger brew',
    matchingTerms: ['ginger beer'],
  },
  {
    id: 'mix_champagne',
    name: 'Champagne Brut / Dry Prosecco',
    category: 'Mixers',
    description: 'Vintage or NV Brut Champagne, French Cremant, Cava',
    spiritId: 'champagne',
    matchingTerms: ['champagne', 'champagne brut', 'prosecco', 'sparkling wine'],
  },
  {
    id: 'mix_espresso',
    name: 'Freshly Pulled Hot Espresso',
    category: 'Mixers',
    description: 'Freshly brewed single or double shot Arabica espresso with crema',
    matchingTerms: ['espresso', 'hot espresso', 'coffee'],
  },
  {
    id: 'mix_bitters_aromatic',
    name: 'Aromatic Bitters (Angostura / Peychaud’s / Orange)',
    category: 'Mixers',
    description: 'Angostura aromatic, Peychaud’s creole bitters, orange bitters, mole bitters',
    matchingTerms: ['angostura', "peychaud's", 'bitters', 'orange bitters', 'mole'],
  },

  // --- 4. CITRUS & FRESH GARNISHES ---
  {
    id: 'citrus_limes',
    name: 'Fresh Limes & Lime Juice',
    category: 'Citrus & Garnishes',
    description: 'Juicy Persian limes, key limes, cut wedges, and lime peels',
    matchingTerms: ['lime juice', 'fresh lime', 'key lime', 'lime coin', 'lime wheel', 'limes'],
  },
  {
    id: 'citrus_lemons',
    name: 'Fresh Lemons & Lemon Juice',
    category: 'Citrus & Garnishes',
    description: 'Eureka or Lisbon lemons, clarified juice, lemon twists and coins',
    matchingTerms: ['lemon juice', 'fresh lemon', 'clarified lemon', 'lemon peel', 'lemon twist', 'lemons'],
  },
  {
    id: 'citrus_grapefruit',
    name: 'Ruby Red / Pink Grapefruit',
    category: 'Citrus & Garnishes',
    description: 'Fresh pink or ruby red grapefruit juice and flamed peel strips',
    matchingTerms: ['grapefruit', 'ruby red grapefruit', 'pink grapefruit'],
  },
  {
    id: 'citrus_oranges',
    name: 'Fresh Oranges & Peels',
    category: 'Citrus & Garnishes',
    description: 'Navel, blood orange, or Seville oranges for expression and twists',
    matchingTerms: ['orange', 'orange peel', 'blood orange', 'orange juice'],
  },
  {
    id: 'citrus_pineapple',
    name: 'Fresh Pineapple Juice & Fronds',
    category: 'Citrus & Garnishes',
    description: 'Cold-pressed fresh pineapple juice and green crown fronds',
    matchingTerms: ['pineapple', 'pineapple juice', 'pineapple fronds'],
  },
  {
    id: 'citrus_cherries',
    name: 'Luxardo Maraschino Cherries',
    category: 'Citrus & Garnishes',
    description: 'Dense brandied sour Italian cocktail cherries in syrup',
    matchingTerms: ['cherry', 'cherries', 'luxardo cherry', 'maraschino cherry', 'griottines'],
  },
  {
    id: 'citrus_mint',
    name: 'Fresh Garden Mint',
    category: 'Citrus & Garnishes',
    description: 'Aromatic spearmint sprigs for tiki crowns and highball bouquets',
    matchingTerms: ['mint', 'mint sprig', 'mint bouquet'],
  },
  {
    id: 'citrus_egg_white',
    name: 'Egg Whites / Aquafaba (Albumen)',
    category: 'Citrus & Garnishes',
    description: 'Fresh egg white or chickpea aquafaba for velvet micro-foam head',
    matchingTerms: ['egg white', 'albumen', 'aquafaba'],
  },
];

// Pre-configured inventory kits to help users bootstrap their bar in one click
export const INVENTORY_PRESET_KITS: { id: string; label: string; itemIds: string[] }[] = [
  {
    id: 'classic-bar',
    label: 'Classic Home Bar Essentials',
    itemIds: [
      'spirit_gin',
      'spirit_bourbon',
      'spirit_rye',
      'spirit_tequila',
      'spirit_rum_dark',
      'liq_campari',
      'liq_sweet_vermouth',
      'liq_dry_vermouth',
      'liq_orange_curacao',
      'mix_simple_syrup',
      'mix_bitters_aromatic',
      'mix_soda_water',
      'citrus_lemons',
      'citrus_limes',
      'citrus_oranges',
      'citrus_cherries',
    ],
  },
  {
    id: 'agave-tropical',
    label: 'Agave & Tropical Specialist',
    itemIds: [
      'spirit_tequila',
      'spirit_mezcal',
      'spirit_rum_dark',
      'spirit_rum_white',
      'spirit_cachaca',
      'liq_campari',
      'liq_orange_curacao',
      'mix_agave',
      'mix_orgeat',
      'mix_ginger_beer',
      'mix_soda_water',
      'citrus_limes',
      'citrus_grapefruit',
      'citrus_pineapple',
      'citrus_mint',
    ],
  },
  {
    id: 'aperitivo-craft',
    label: 'European Aperitivo & Craft Master',
    itemIds: [
      'spirit_gin',
      'spirit_cognac',
      'spirit_scotch',
      'liq_campari',
      'liq_sweet_vermouth',
      'liq_dry_vermouth',
      'liq_chartreuse_green',
      'liq_amaro_herbal',
      'liq_maraschino',
      'liq_absinthe',
      'mix_champagne',
      'mix_soda_water',
      'mix_simple_syrup',
      'mix_bitters_aromatic',
      'citrus_lemons',
      'citrus_oranges',
    ],
  },
];

/**
 * Normalizes an ingredient name or string for resilient matching.
 */
function cleanTerm(str: string): string {
  return str
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // remove parenthetical like (45% ABV)
    .replace(/[^\w\s]/g, ' ')
    .trim();
}

/**
 * Checks whether an ingredient in a cocktail is covered by the user's owned inventory item IDs.
 */
export function isIngredientCovered(
  ing: IngredientSpec,
  ownedItemIds: Set<string>
): { covered: boolean; matchedItemId?: string } {
  const ingClean = cleanTerm(ing.name);

  // 1. Saline / Salt is standard kitchen pantry - treat as covered if mix_bitters_aromatic or simple pantry is ok,
  // or match with 'salt'
  if (ingClean.includes('saline') || ingClean.includes('salt')) {
    return { covered: true };
  }

  // 2. Direct Spirit ID match check
  if (ing.spiritId) {
    const matchingSpiritItems = BAR_INVENTORY_ITEMS.filter(
      (item) => item.spiritId === ing.spiritId
    );

    // If it's vermouth, distinguish between sweet/rosso vs dry/blanc
    if (ing.spiritId === 'vermouth') {
      if (ingClean.includes('dry') || ingClean.includes('blanc') || ingClean.includes('extra dry') || ingClean.includes('lillet')) {
        if (ownedItemIds.has('liq_dry_vermouth')) {
          return { covered: true, matchedItemId: 'liq_dry_vermouth' };
        }
      } else {
        if (ownedItemIds.has('liq_sweet_vermouth')) {
          return { covered: true, matchedItemId: 'liq_sweet_vermouth' };
        }
      }
    }

    // If it's rum, check white vs dark/aged
    if (ing.spiritId === 'rum') {
      if (ingClean.includes('white') || ingClean.includes('blanca') || ingClean.includes('blanc')) {
        if (ownedItemIds.has('spirit_rum_white') || ownedItemIds.has('spirit_rum_dark')) {
          return { covered: true, matchedItemId: 'spirit_rum_white' };
        }
      } else {
        if (ownedItemIds.has('spirit_rum_dark') || ownedItemIds.has('spirit_rum_white')) {
          return { covered: true, matchedItemId: 'spirit_rum_dark' };
        }
      }
    }

    // Check generic spirit matching
    for (const item of matchingSpiritItems) {
      if (ownedItemIds.has(item.id)) {
        return { covered: true, matchedItemId: item.id };
      }
    }
  }

  // 3. Fallback matching across all owned items using item matching terms
  for (const itemId of ownedItemIds) {
    const item = BAR_INVENTORY_ITEMS.find((i) => i.id === itemId);
    if (!item) continue;

    for (const term of item.matchingTerms) {
      const termClean = cleanTerm(term);
      if (ingClean.includes(termClean) || termClean.includes(ingClean)) {
        return { covered: true, matchedItemId: item.id };
      }
    }
  }

  return { covered: false };
}

export interface CocktailMatchResult {
  cocktail: CocktailRecipe;
  isReady: boolean;
  missingCount: number;
  totalRequired: number;
  missingIngredients: string[];
  ownedIngredients: string[];
  matchPercentage: number;
}

/**
 * Compares a cocktail's recipe against the user's owned bar items.
 */
export function evaluateCocktailMatch(
  cocktail: CocktailRecipe,
  ownedItemIds: Set<string>
): CocktailMatchResult {
  const missingIngredients: string[] = [];
  const ownedIngredients: string[] = [];

  // Filter out pure saline drops from counting as a blocker
  const actionableIngredients = cocktail.ingredients.filter(
    (ing) => !cleanTerm(ing.name).includes('saline') && !cleanTerm(ing.name).includes('salt')
  );

  for (const ing of actionableIngredients) {
    const check = isIngredientCovered(ing, ownedItemIds);
    // Format human-friendly name
    const friendlyName = ing.name.replace(/\([^)]*\)/g, '').trim();
    if (check.covered) {
      ownedIngredients.push(friendlyName);
    } else {
      missingIngredients.push(friendlyName);
    }
  }

  const totalRequired = actionableIngredients.length;
  const missingCount = missingIngredients.length;
  const isReady = missingCount === 0;
  const matchPercentage =
    totalRequired > 0 ? Math.round(((totalRequired - missingCount) / totalRequired) * 100) : 100;

  return {
    cocktail,
    isReady,
    missingCount,
    totalRequired,
    missingIngredients,
    ownedIngredients,
    matchPercentage,
  };
}
