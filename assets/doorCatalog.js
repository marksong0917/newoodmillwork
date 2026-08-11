// doorCatalog.js
// Single source of truth for the Newood door catalog and the Door Order Form
// option sets. Reuses the exact door images already shipped on doors.html
// (assets/gallery/door-NN.webp and door-raised-NN.webp) — nothing is scraped
// at runtime and no images are invented.
//
// IDs are unique per collection so that Flat Panel Door #1 (FP-01) and
// Raised Panel Door #1 (RP-01) are distinct products.

const FLAT_COUNT = 16;
const RAISED_COUNT = 18;

function pad(n) {
  return String(n).padStart(2, '0');
}

function buildCollection(prefix, category, collectionName, count, fileBase, ext) {
  const out = [];
  for (let n = 1; n <= count; n++) {
    const nn = pad(n);
    out.push({
      id: `${prefix}-${nn}`,
      category,
      collectionName,
      number: n,
      name: `${prefix} Door #${n}`,
      image: `assets/gallery/${fileBase}${nn}.${ext}`,
      alt: `Newood Millwork MDF ${collectionName.toLowerCase()} door style #${n}`,
      active: true,
    });
  }
  return out;
}

export const DOOR_CATALOG = [
  ...buildCollection('FP', 'flat-panel', 'Flat Panel', FLAT_COUNT, 'door-', 'webp'),
  ...buildCollection('RP', 'raised-panel', 'Raised Panel', RAISED_COUNT, 'door-raised-', 'webp'),
];

export const DOOR_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'flat-panel', label: 'Flat Panel' },
  { value: 'raised-panel', label: 'Raised Panel' },
];

export function getDoorById(id) {
  return DOOR_CATALOG.find((d) => d.id === id) || null;
}

export function doorsByCategory(category) {
  if (!category || category === 'all') return DOOR_CATALOG.filter((d) => d.active);
  return DOOR_CATALOG.filter((d) => d.active && d.category === category);
}

// --- Order-form option sets -------------------------------------------------

// Item types. `needsDoorStyle` controls whether the visual door picker shows;
// `glass` controls whether glass-specific fields replace/augment door fields.
export const ITEM_TYPES = [
  { value: 'door', label: 'Door', needsDoorStyle: true, glass: false },
  { value: 'drawer-front', label: 'Drawer Front', needsDoorStyle: true, glass: false },
  { value: 'panel', label: 'Panel', needsDoorStyle: true, glass: false },
  { value: 'filler', label: 'Filler', needsDoorStyle: false, glass: false },
  { value: 'l-panel', label: 'L Panel', needsDoorStyle: false, glass: false },
  { value: 'molding', label: 'Molding', needsDoorStyle: false, glass: false },
  { value: 'glass-door', label: 'Glass Door', needsDoorStyle: true, glass: true },
  { value: 'glass-shelf', label: 'Glass Shelf', needsDoorStyle: false, glass: true },
  { value: 'glass', label: 'Glass', needsDoorStyle: false, glass: true },
];

export function getItemType(value) {
  return ITEM_TYPES.find((t) => t.value === value) || ITEM_TYPES[0];
}

// Door construction / product type — distinct from the visual door style (FP-07)
// and from material/finish (White, D-3, ...).
export const CONSTRUCTIONS = [
  { value: 'mdf-routed', label: 'MDF Routed Door' },
  { value: 'egger-5pc', label: 'EGGER 5-Piece Shaker Door' },
  { value: 'agt-5pc', label: 'AGT 5-Piece Shaker Door' },
  { value: '7000-flat', label: '7000 Flat Panel' },
  { value: 'single-shaker', label: 'Single Shaker' },
  { value: 'double-shaker', label: 'Double Shaker' },
  { value: 'glass', label: 'Glass' },
];

export function getConstruction(value) {
  return CONSTRUCTIONS.find((c) => c.value === value) || null;
}

// Which product fields apply to each construction (progressive disclosure).
export const CONSTRUCTION_FIELDS = {
  'mdf-routed': ['material', 'color', 'thickness', 'supplier'],
  'egger-5pc': ['railSize', 'thickness', 'color', 'supplier'],
  'agt-5pc': ['railSize', 'thickness', 'color', 'supplier'],
  '7000-flat': ['material', 'color', 'thickness', 'supplier'],
  'single-shaker': ['railSize', 'thickness', 'color', 'supplier'],
  'double-shaker': ['railSize', 'thickness', 'color', 'supplier'],
  glass: ['glassType', 'glassThickness', 'tempered', 'supplier'],
};

// Fields shown for glass item types (Glass, Glass Shelf, and the glass insert
// on a Glass Door).
export const GLASS_FIELDS = ['glassType', 'glassThickness', 'tempered', 'supplier'];

export const GLASS_TYPES = [
  '3mm Reeded Glass',
  '3mm Clear Glass',
  '4mm Clear Glass',
  '6mm Clear Glass',
  '6mm Clear Glass Shelf',
  'Frosted Glass',
];

export const GLASS_THICKNESSES = ['3mm', '4mm', '6mm', '10mm'];
export const RAIL_SIZES = ['2"', '2-1/4"', '2-3/8"', '2-1/2"', '3"'];
export const THICKNESSES = ['5/8"', '3/4"', '1"'];
export const SUPPLIERS = ['PANELiM', 'PANOLAM', 'EGGER', 'Uniboard', 'Tafisa', 'AGT', 'In-House'];
export const MATERIALS = ['MDF', 'HDF', 'Plywood', 'Melamine', 'Particle Core'];

// Expose globally so the existing (non-module) doors.html could eventually
// consume the same dataset without a second copy.
if (typeof window !== 'undefined') {
  window.NEWOOD_DOOR_CATALOG = DOOR_CATALOG;
}
