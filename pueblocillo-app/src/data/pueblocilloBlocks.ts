import { BlueprintBlockInfo } from '@/types/census';

export const DEFAULT_STREETS: string[] = [
  'Main Entrance Ave. (Blk 1 & 11)',
  'West Perimeter St. (Blk 2, 3 & 4)',
  'Chapel & Park Loop (Blk 5 & 6)',
  'Multi-Purpose Hall & Creek Rd. (Blk 7, 14–16)',
  'South Curve St. (Blk 8, 9 & 10)',
  'Central Rotonda Circle (Blk 12 & 13)',
  'Northeast Creekside Loop (Blk 17–20)',
  'East Grid St. (Blk 21, 22 & 23)'
];

// Official Blueprint Blocks 1–23 Metadata from Pueblocillo NDC Housing Project Plan
export const BLUEPRINT_BLOCKS: BlueprintBlockInfo[] = [
  { block: 1, lots: 20, street: 'Main Entrance Ave. (Blk 1 & 11)', note: 'South Main Gate Row' },
  { block: 2, lots: 24, street: 'West Perimeter St. (Blk 2, 3 & 4)', note: 'West Boundary Wall' },
  { block: 3, lots: 19, street: 'West Perimeter St. (Blk 2, 3 & 4)', note: 'Lower West Inner Loop' },
  { block: 4, lots: 28, street: 'West Perimeter St. (Blk 2, 3 & 4)', note: 'Mid-West Loop' },
  { block: 5, lots: 12, street: 'Chapel & Park Loop (Blk 5 & 6)', note: 'Adjacent to Chapel' },
  { block: 6, lots: 10, street: 'Chapel & Park Loop (Blk 5 & 6)', note: 'Chapel & Park Zone' },
  { block: 7, lots: 21, street: 'Multi-Purpose Hall & Creek Rd. (Blk 7, 14–16)', note: 'Near Multi-Purpose Hall' },
  { block: 8, lots: 25, street: 'South Curve St. (Blk 8, 9 & 10)', note: 'West-Central Curve' },
  { block: 9, lots: 29, street: 'South Curve St. (Blk 8, 9 & 10)', note: 'Lower Central Curve' },
  { block: 10, lots: 14, street: 'South Curve St. (Blk 8, 9 & 10)', note: 'South Open Space / Court' },
  { block: 11, lots: 30, street: 'Main Entrance Ave. (Blk 1 & 11)', note: 'Southeast Perimeter Row' },
  { block: 12, lots: 19, street: 'Central Rotonda Circle (Blk 12 & 13)', note: 'Central Rotonda Hub' },
  { block: 13, lots: 18, street: 'Central Rotonda Circle (Blk 12 & 13)', note: 'Central Rotonda Ring' },
  { block: 14, lots: 18, street: 'Multi-Purpose Hall & Creek Rd. (Blk 7, 14–16)', note: 'North-Central Creekside' },
  { block: 15, lots: 13, street: 'Multi-Purpose Hall & Creek Rd. (Blk 7, 14–16)', note: 'Upper Creekside Row' },
  { block: 16, lots: 10, street: 'Multi-Purpose Hall & Creek Rd. (Blk 7, 14–16)', note: 'Northwest Creek Buffer' },
  { block: 17, lots: 23, street: 'Northeast Creekside Loop (Blk 17–20)', note: 'Upper Northeast Loop' },
  { block: 18, lots: 26, street: 'Northeast Creekside Loop (Blk 17–20)', note: 'North Creekside Row' },
  { block: 19, lots: 19, street: 'Northeast Creekside Loop (Blk 17–20)', note: 'Northeast Inner Road' },
  { block: 20, lots: 19, street: 'Northeast Creekside Loop (Blk 17–20)', note: 'Mid-East Collector Rd' },
  { block: 21, lots: 28, street: 'East Grid St. (Blk 21, 22 & 23)', note: 'East Grid Upper Section' },
  { block: 22, lots: 40, street: 'East Grid St. (Blk 21, 22 & 23)', note: 'East Grid Main Section' },
  { block: 23, lots: 15, street: 'East Grid St. (Blk 21, 22 & 23)', note: 'Southeast Perimeter & Open Space' }
];

export const TOTAL_BLUEPRINT_LOTS = BLUEPRINT_BLOCKS.reduce((sum, b) => sum + b.lots, 0); // 480 lots
