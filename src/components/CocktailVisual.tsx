import React, { useState } from 'react';
import { CocktailRecipe, GlasswareType } from '../data/cocktails';

interface CocktailVisualProps {
  cocktail: CocktailRecipe;
  size?: 'sm' | 'md' | 'lg';
  showBlueprintByDefault?: boolean;
}

export const GlasswareSilhouette: React.FC<{
  glassware: GlasswareType;
  ingredients: CocktailRecipe['ingredients'];
  className?: string;
}> = ({ glassware, ingredients, className = 'w-12 h-12' }) => {
  const totalMl = ingredients.reduce((acc, item) => acc + item.ml, 0) || 90;

  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="glassShine" x1="0" y1="0" x2="100" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#f472b6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {glassware === 'Rocks Glass' || glassware === 'Fluted Tiki' ? (
        <g>
          {/* Liquid fill */}
          <rect x="22" y="42" width="56" height="54" rx="4" fill={ingredients[0]?.layerColor || '#f472b6'} fillOpacity="0.55" />
          <rect x="22" y="64" width="56" height="32" rx="3" fill={ingredients[1]?.layerColor || '#e11d48'} fillOpacity="0.65" />
          {/* Clear ice block */}
          <rect x="33" y="46" width="34" height="32" rx="5" stroke="#fdf2f8" strokeOpacity="0.6" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.14" />
          {/* Rim and walls */}
          <path d="M18 28H82L78 100C78 103 75 105 72 105H28C25 105 22 103 22 100L18 28Z" stroke="url(#glassShine)" strokeWidth="3" />
          <line x1="21" y1="96" x2="79" y2="96" stroke="#f9a8d4" strokeOpacity="0.5" strokeWidth="2" />
        </g>
      ) : glassware === 'Nick & Nora' || glassware === 'Coupe' ? (
        <g>
          <path d="M20 26C20 52 36 64 50 64C64 64 80 52 80 26H20Z" fill={ingredients[0]?.layerColor || '#f472b6'} fillOpacity="0.55" />
          <path d="M16 20H84C84 52 66 66 50 66C34 66 16 52 16 20Z" stroke="url(#glassShine)" strokeWidth="3" />
          <line x1="50" y1="66" x2="50" y2="104" stroke="#f9a8d4" strokeOpacity="0.65" strokeWidth="3" />
          <line x1="30" y1="104" x2="70" y2="104" stroke="#f9a8d4" strokeOpacity="0.65" strokeWidth="3" strokeLinecap="round" />
        </g>
      ) : glassware === 'Champagne Flute' ? (
        <g>
          <path d="M35 24H65L61 72C60 78 55 82 50 82C45 82 40 78 39 72L35 24Z" fill={ingredients[0]?.layerColor || '#fbcfe8'} fillOpacity="0.5" />
          <path d="M33 16H67L62 72C61 80 56 84 50 84C44 84 39 80 38 72L33 16Z" stroke="url(#glassShine)" strokeWidth="3" />
          <line x1="50" y1="84" x2="50" y2="108" stroke="#f9a8d4" strokeOpacity="0.65" strokeWidth="2.5" />
          <line x1="34" y1="108" x2="66" y2="108" stroke="#f9a8d4" strokeOpacity="0.65" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="58" r="1.5" fill="#fff" />
          <circle cx="53" cy="46" r="1.5" fill="#fff" />
          <circle cx="47" cy="36" r="1.2" fill="#fff" />
        </g>
      ) : (
        /* Highball */
        <g>
          <rect x="29" y="28" width="42" height="72" rx="2" fill={ingredients[0]?.layerColor || '#f472b6'} fillOpacity="0.45" />
          <rect x="36" y="24" width="28" height="72" rx="3" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.12" />
          <rect x="26" y="16" width="48" height="88" rx="4" stroke="url(#glassShine)" strokeWidth="3" />
          <span className="sr-only">{totalMl}ml</span>
        </g>
      )}
    </svg>
  );
};

export const CocktailVisual: React.FC<CocktailVisualProps> = ({
  cocktail,
  size = 'sm',
  showBlueprintByDefault = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [showBlueprint, setShowBlueprint] = useState(showBlueprintByDefault);

  const dimensions =
    size === 'sm'
      ? 'w-20 h-20 sm:w-24 sm:h-24 rounded-xl'
      : size === 'md'
      ? 'w-full h-44 rounded-xl'
      : 'w-full h-64 sm:h-72 rounded-2xl';

  return (
    <div
      className={`relative overflow-hidden shrink-0 select-none bg-[#171115] border border-pink-950/30 dark:border-pink-200/15 ${dimensions}`}
    >
      {!imgError && !showBlueprint ? (
        <img
          src={cocktail.image}
          alt={`${cocktail.name} served in a ${cocktail.glassware}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center gpu-smooth transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1f151c] via-[#140e12] to-[#2b1623] p-2">
          <GlasswareSilhouette
            glassware={cocktail.glassware}
            ingredients={cocktail.ingredients}
            className={size === 'sm' ? 'w-12 h-12' : 'w-24 h-24'}
          />
          {size !== 'sm' && (
            <span className="mt-2 text-[11px] font-mono-tabular text-pink-200/80">
              {cocktail.glassware} · {cocktail.iceSpec}
            </span>
          )}
        </div>
      )}

      {/* Subtle dark-to-pink bottom scrim for high contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0a0c]/80 via-transparent to-transparent" />

      {/* Alcohol Degrees (°) Corner Readout */}
      <div
        className={`pointer-events-none absolute ${
          size === 'sm' ? 'bottom-1.5 left-1.5 px-1.5 py-0.5 text-[10px]' : 'top-2.5 left-2.5 px-2.5 py-1 text-xs'
        } rounded-md bg-[#0d0a0c]/85 backdrop-blur-md border border-pink-300/30 font-mono-tabular font-semibold text-pink-200 leading-none`}
      >
        {cocktail.abv.toFixed(1)}°
      </div>

      {/* Interactive Blueprint Toggle on Medium/Large visuals */}
      {size !== 'sm' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowBlueprint((prev) => !prev);
          }}
          className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#0d0a0c]/85 backdrop-blur-md border border-pink-300/25 text-[11px] font-medium text-pink-200 hover:border-pink-300/60 transition-colors whitespace-nowrap shrink-0"
        >
          {showBlueprint ? 'Show HD Photo' : 'Vessel Spec'}
        </button>
      )}
    </div>
  );
};
