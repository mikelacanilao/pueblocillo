export type OccupancyType = 'owner' | 'renter' | 'unoccupied' | 'vacant_lot';

export interface HouseholdCensusRecord {
  id: string;
  block: number;
  lot: number;
  street: string;
  occupancyType: OccupancyType;
  ownerName: string;
  ownerContact?: string;
  tenantName?: string;
  tenantContact?: string;
  totalOccupants: number;
  seniorsCount: number;
  pwdCount: number;
  vehiclesCount?: number;
  vehiclePlates?: string;
  notes?: string;
  encodedBy: string;
  updatedAt: string;
  privacyConsent: boolean;
}

export interface BlueprintBlockInfo {
  block: number;
  lots: number;
  street: string;
  note: string;
}

export interface VillageSettings {
  villageName: string;
  totalLotsBaseline: number;
  subdivisionCode: string;
  location: string;
}

export type RoleType = 'admin' | 'encoder1' | 'encoder2' | 'resident';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  badge: string;
  block?: number;
  lot?: number;
  canEditSettings: boolean;
  canEncode: boolean;
  canDelete: boolean;
}

export interface AuthSession {
  user: UserAccount;
  token: string;
  expiresAt: number;
}
