import React, { useState } from 'react';
import { SPIRITS_CATALOG, TECHNICAL_MASTERY_GUIDES, SpiritId } from '../data/cocktails';
import { Sliders, Thermometer, Scale, Beaker, CheckCircle2, AlertTriangle } from 'lucide-react';

export const BalanceLab: React.FC<{
  onFilterBySpirit: (spiritId: SpiritId) => void;
}> = ({ onFilterBySpirit }) => {
  const [baseSpiritMl, setBaseSpiritMl] = useState<number>(50);
  const [baseSpiritAbv, setBaseSpiritAbv] = useState<number>(45);
  const [modifierMl, setModifierMl] = useState<number>(15);
  const [modifierAbv, setModifierAbv] = useState<number>(22);
  const [acidMl, setAcidMl] = useState<number>(22.5);
  const [syrupMl, setSyrupMl] = useState<number>(15);
  const [syrupBrix, setSyrupBrix] = useState<50 | 66>(50);
  const [technique, setTechnique] = useState<'Stirred' | 'Hard Shake' | 'Whip Shake' | 'Built'>('Hard Shake');

  // Thermodynamic & Brix-to-Acid Math
  const preDilutionVolume = baseSpiritMl + modifierMl + acidMl + syrupMl;
  const pureEthanolMl =
    baseSpiritMl * (baseSpiritAbv / 100) + modifierMl * (modifierAbv / 100);

  const dilutionRate =
    technique === 'Hard Shake'
      ? 0.27
      : technique === 'Whip Shake'
      ? 0.31
      : technique === 'Stirred'
      ? 0.22
      : 0.14;

  const addedWaterMl = preDilutionVolume * dilutionRate;
  const finalVolumeMl = preDilutionVolume + addedWaterMl;
  const finalAbv = finalVolumeMl > 0 ? (pureEthanolMl / finalVolumeMl) * 100 : 0;

  const servingTempC =
    technique === 'Hard Shake'
      ? -5.4
      : technique === 'Whip Shake'
      ? -2.8
      : technique === 'Stirred'
      ? -3.6
      : 0.4;

  // Effective sugar grams vs titratable acid grams (lemon/lime ~6% acid)
  const sugarGrams = syrupMl * (syrupBrix === 66 ? 0.88 : 0.62) + modifierMl * 0.18;
  const acidGrams = acidMl * 0.06;
  const sugarToAcidRatio = acidGrams > 0 ? sugarGrams / acidGrams : sugarGrams;

  let balanceStatus: { label: string; advice: string; tone: 'optimal' | 'tart' | 'sweet' } = {
    label: 'Optimal Palate Equilibrium',
    advice: 'Sugar density and titratable acidity sit within the 8.5–11.5:1 harmonic window for craft sours and daisy structures.',
    tone: 'optimal',
  };

  if (acidMl === 0) {
    if (sugarGrams > 9) {
      balanceStatus = {
        label: 'Rich Spirit-Forward Profile',
        advice: 'With zero citrus acid, express citrus peel oils and add 2 dashes of aromatic bitters to prevent cloying finish.',
        tone: 'sweet',
      };
    } else {
      balanceStatus = {
        label: 'Dry Stirred Structure',
        advice: 'Balanced dry spirit-forward matrix. Stir with tempered 3cm cubes for 28–32 seconds.',
        tone: 'optimal',
      };
    }
  } else if (sugarToAcidRatio < 7.5) {
    balanceStatus = {
      label: 'High-Acid / Bracingly Tart',
      advice: 'Acidity dominates the mid-palate. Increase syrup by 5ml or switch to 66° Brix rich syrup to cushion the citrus edge.',
      tone: 'tart',
    };
  } else if (sugarToAcidRatio > 13.5) {
    balanceStatus = {
      label: 'Sweet-Leaning / Soft Finish',
      advice: 'Dissolved sugars outweigh citrus tension. Add 7.5ml fresh lime/lemon or 2 drops of 20% saline to sharpen structure.',
      tone: 'sweet',
    };
  }

  const applyPreset = (preset: 'sour' | 'negroni' | 'oldfashioned' | 'daisy') => {
    if (preset === 'sour') {
      setBaseSpiritMl(60);
      setBaseSpiritAbv(45);
      setModifierMl(0);
      setModifierAbv(0);
      setAcidMl(22.5);
      setSyrupMl(22.5);
      setSyrupBrix(50);
      setTechnique('Hard Shake');
    } else if (preset === 'negroni') {
      setBaseSpiritMl(30);
      setBaseSpiritAbv(45);
      setModifierMl(60);
      setModifierAbv(21);
      setAcidMl(0);
      setSyrupMl(0);
      setSyrupBrix(50);
      setTechnique('Stirred');
    } else if (preset === 'oldfashioned') {
      setBaseSpiritMl(60);
      setBaseSpiritAbv(47);
      setModifierMl(0);
      setModifierAbv(0);
      setAcidMl(0);
      setSyrupMl(7.5);
      setSyrupBrix(66);
      setTechnique('Stirred');
    } else {
      setBaseSpiritMl(45);
      setBaseSpiritAbv(42);
      setModifierMl(22.5);
      setModifierAbv(35);
      setAcidMl(22.5);
      setSyrupMl(7.5);
      setSyrupBrix(50);
      setTechnique('Hard Shake');
    }
  };

  return (
    <div className="space-y-8">
      {/* Interactive Formulation & Dilution Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#161115] border border-rose-950/10 dark:border-pink-200/15 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-display font-semibold text-[#181115] dark:text-[#f7eef2]">
                Spirit Equilibrium & Dilution Calculator
              </h2>
              <p className="text-xs text-[#644f5a] dark:text-pink-200/65 mt-0.5">
                Simulate ABV dilution, thermal drop, and Brix-to-Acid harmony before pouring.
              </p>
            </div>

            {/* Template Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'sour', label: 'Classic Sour' },
                { id: 'negroni', label: 'Equal-Parts Stirred' },
                { id: 'oldfashioned', label: 'Agave / Oak Old Fashioned' },
                { id: 'daisy', label: 'Split Daisy' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id as 'sour' | 'negroni' | 'oldfashioned' | 'daisy')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#faf5f7] dark:bg-[#21181f] text-[#3d2e36] dark:text-pink-200 hover:border-pink-400/50 border border-rose-950/10 dark:border-pink-200/10 transition-colors whitespace-nowrap shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#3d2e36] dark:text-pink-100">Base Spirit Volume</span>
                <span className="font-mono-tabular font-semibold text-pink-600 dark:text-pink-300">{baseSpiritMl} ml</span>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                step={2.5}
                value={baseSpiritMl}
                onChange={(e) => setBaseSpiritMl(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#644f5a] dark:text-pink-200/60">
                <span>Spirit Proof: {baseSpiritAbv}% ABV</span>
                <div className="flex gap-1.5">
                  {[40, 45, 50, 55].map((abv) => (
                    <button
                      key={abv}
                      type="button"
                      onClick={() => setBaseSpiritAbv(abv)}
                      className={`px-1.5 py-0.5 rounded font-mono-tabular ${
                        baseSpiritAbv === abv
                          ? 'bg-pink-500 text-white'
                          : 'bg-black/5 dark:bg-white/5'
                      }`}
                    >
                      {abv}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#3d2e36] dark:text-pink-100">Liqueur / Vermouth Modifier</span>
                <span className="font-mono-tabular font-semibold text-pink-600 dark:text-pink-300">{modifierMl} ml</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                step={2.5}
                value={modifierMl}
                onChange={(e) => setModifierMl(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#644f5a] dark:text-pink-200/60">
                <span>Modifier ABV: {modifierAbv}%</span>
                <div className="flex gap-1.5">
                  {[17, 25, 35, 40].map((abv) => (
                    <button
                      key={abv}
                      type="button"
                      onClick={() => setModifierAbv(abv)}
                      className={`px-1.5 py-0.5 rounded font-mono-tabular ${
                        modifierAbv === abv
                          ? 'bg-pink-500 text-white'
                          : 'bg-black/5 dark:bg-white/5'
                      }`}
                    >
                      {abv}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#3d2e36] dark:text-pink-100">Fresh Citrus Acid (6% TA)</span>
                <span className="font-mono-tabular font-semibold text-pink-600 dark:text-pink-300">{acidMl} ml</span>
              </div>
              <input
                type="range"
                min={0}
                max={45}
                step={2.5}
                value={acidMl}
                onChange={(e) => setAcidMl(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="text-[11px] text-[#644f5a] dark:text-pink-200/60">
                Lemon / Key Lime (~60g/L citric-malic acid)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#3d2e36] dark:text-pink-100">Syrup / Agave Sweetener</span>
                <span className="font-mono-tabular font-semibold text-pink-600 dark:text-pink-300">{syrupMl} ml</span>
              </div>
              <input
                type="range"
                min={0}
                max={45}
                step={2.5}
                value={syrupMl}
                onChange={(e) => setSyrupMl(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-[#644f5a] dark:text-pink-200/60">
                <span>Concentration:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSyrupBrix(50)}
                    className={`px-2 py-0.5 rounded font-mono-tabular ${
                      syrupBrix === 50 ? 'bg-pink-500 text-white' : 'bg-black/5 dark:bg-white/5'
                    }`}
                  >
                    1:1 (50°Bx)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSyrupBrix(66)}
                    className={`px-2 py-0.5 rounded font-mono-tabular ${
                      syrupBrix === 66 ? 'bg-pink-500 text-white' : 'bg-black/5 dark:bg-white/5'
                    }`}
                  >
                    2:1 (66°Bx)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Agitation Technique Selector */}
          <div className="pt-2">
            <div className="text-xs font-medium text-[#644f5a] dark:text-pink-200/70 mb-2">
              Agitation & Thermal Integration Technique
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Stirred', 'Hard Shake', 'Whip Shake', 'Built'] as const).map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setTechnique(tech)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                    technique === tech
                      ? 'glossy-pink-btn text-[#140c10] font-semibold border-pink-300'
                      : 'bg-[#faf5f7] dark:bg-[#1e171d] text-[#3d2e36] dark:text-pink-100/80 border-rose-950/10 dark:border-pink-200/10'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Telemetry & Balance Verdict Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#161115] border border-rose-950/10 dark:border-pink-200/15 p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="text-xs font-mono-tabular text-pink-600 dark:text-pink-300">
              Calculated Glass Output
            </div>
            <h3 className="text-xl font-display font-semibold text-[#181115] dark:text-[#f7eef2] mt-0.5">
              Thermodynamic & Palate Readout
            </h3>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d]">
                <div className="flex items-center gap-1.5 text-xs text-[#644f5a] dark:text-pink-200/65">
                  <Scale className="w-3.5 h-3.5 text-pink-500" />
                  <span>Final Served ABV</span>
                </div>
                <div className="text-2xl font-mono-tabular font-semibold text-[#181115] dark:text-pink-100 mt-1">
                  {finalAbv.toFixed(1)}%
                </div>
                <div className="text-[11px] font-mono-tabular text-[#644f5a] dark:text-pink-200/50 mt-0.5">
                  {finalVolumeMl.toFixed(0)}ml total yield
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d]">
                <div className="flex items-center gap-1.5 text-xs text-[#644f5a] dark:text-pink-200/65">
                  <Thermometer className="w-3.5 h-3.5 text-pink-500" />
                  <span>Chilled Temp & H₂O</span>
                </div>
                <div className="text-2xl font-mono-tabular font-semibold text-[#181115] dark:text-pink-100 mt-1">
                  {servingTempC > 0 ? `+${servingTempC}` : servingTempC}°C
                </div>
                <div className="text-[11px] font-mono-tabular text-[#644f5a] dark:text-pink-200/50 mt-0.5">
                  +{addedWaterMl.toFixed(1)}ml ({Math.round(dilutionRate * 100)}% dilution)
                </div>
              </div>

              <div className="col-span-2 p-3.5 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#644f5a] dark:text-pink-200/65">
                    <Beaker className="w-3.5 h-3.5 text-pink-500" />
                    <span>Dissolved Sugar vs Titratable Acid</span>
                  </div>
                  <div className="text-sm font-mono-tabular font-semibold text-[#181115] dark:text-pink-100 mt-1">
                    {sugarGrams.toFixed(1)}g Sucrose · {acidGrams.toFixed(2)}g Citric Acid
                  </div>
                </div>
                <div className="text-right font-mono-tabular">
                  <div className="text-xs text-pink-600 dark:text-pink-300">Brix/Acid Index</div>
                  <div className="text-lg font-semibold text-[#181115] dark:text-pink-100">
                    {acidGrams > 0 ? `${sugarToAcidRatio.toFixed(1)} : 1` : 'Dry / Non-Citrus'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Prescription Box */}
          <div className="p-4 rounded-xl bg-[#faf5f7] dark:bg-[#1e171d] border border-rose-950/10 dark:border-pink-300/20 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#181115] dark:text-pink-200">
              {balanceStatus.tone === 'optimal' ? (
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-pink-400 shrink-0" />
              )}
              <span>{balanceStatus.label}</span>
            </div>
            <p className="text-xs leading-relaxed text-[#4a3942] dark:text-pink-100/75">
              {balanceStatus.advice}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Mixology Technical Mastery Cards */}
      <div>
        <h3 className="text-xl font-display font-semibold text-[#181115] dark:text-[#f7eef2] mb-3">
          Technical Principles for Perfecting Spirit Profiles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TECHNICAL_MASTERY_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="rounded-2xl bg-white dark:bg-[#161115] border border-rose-950/10 dark:border-pink-200/15 p-5 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="text-xs font-mono-tabular text-pink-600 dark:text-pink-300">
                  {guide.subtitle}
                </div>
                <h4 className="text-lg font-display font-semibold text-[#181115] dark:text-pink-50 mt-0.5">
                  {guide.title}
                </h4>
                <p className="text-xs leading-relaxed text-[#4a3942] dark:text-pink-100/75 mt-2">
                  {guide.summary}
                </p>
              </div>
              <div className="pt-3 border-t border-rose-950/10 dark:border-pink-200/10 space-y-1.5">
                <div className="text-[11px] font-mono-tabular text-pink-700 dark:text-pink-300">
                  {guide.formula}
                </div>
                <p className="text-xs text-[#644f5a] dark:text-pink-200/65">
                  <strong className="text-[#181115] dark:text-pink-100">Bar Tip:</strong> {guide.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spirit-by-Spirit Balancing Reference Strip */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-display font-semibold text-[#181115] dark:text-[#f7eef2]">
            Base Spirit & Modifier Balancing Rules
          </h3>
          <span className="text-xs text-[#644f5a] dark:text-pink-200/60">
            Tap any spirit to filter recipes
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pink-scrollbar pb-2 snap-x">
          {SPIRITS_CATALOG.map((spirit) => (
            <button
              key={spirit.id}
              type="button"
              onClick={() => onFilterBySpirit(spirit.id)}
              className="snap-start min-w-[260px] max-w-[280px] rounded-2xl bg-white dark:bg-[#161115] border border-rose-950/10 dark:border-pink-200/15 hover:border-pink-400/50 p-4 text-left transition-all shrink-0 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#644f5a] dark:text-pink-200/65">
                  <span>{spirit.category}</span>
                  <span className="font-mono-tabular text-pink-600 dark:text-pink-300">
                    {spirit.abvDefault}% ABV
                  </span>
                </div>
                <div className="text-base font-semibold text-[#181115] dark:text-pink-50 mt-1 flex items-center justify-between">
                  <span>{spirit.name}</span>
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <p className="text-xs leading-relaxed text-[#4a3942] dark:text-pink-100/75 mt-2">
                  {spirit.balanceRule}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-rose-950/10 dark:border-pink-200/10 text-[11px] font-mono-tabular text-pink-600 dark:text-pink-300">
                Origin: {spirit.originCountry} → View Recipes
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
