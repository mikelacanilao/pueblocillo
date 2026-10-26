'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  MapPin, 
  User, 
  Users, 
  ShieldCheck, 
  Car, 
  Building2,
  FileCheck
} from 'lucide-react';
import { HouseholdCensusRecord, OccupancyType } from '@/types/census';
import { BLUEPRINT_BLOCKS, DEFAULT_STREETS } from '@/data/pueblocilloBlocks';

interface CensusEncoderFormProps {
  existingRecords: HouseholdCensusRecord[];
  activeUser: string;
  editRecord?: HouseholdCensusRecord | null;
  onSaveRecord: (record: HouseholdCensusRecord) => void;
  onCancelEdit?: () => void;
}

export const CensusEncoderForm: React.FC<CensusEncoderFormProps> = ({
  existingRecords,
  activeUser,
  editRecord,
  onSaveRecord,
  onCancelEdit
}) => {
  const [block, setBlock] = useState<number>(1);
  const [lot, setLot] = useState<number>(1);
  const [street, setStreet] = useState<string>(DEFAULT_STREETS[0]);
  const [occupancyType, setOccupancyType] = useState<OccupancyType>('owner');
  const [ownerName, setOwnerName] = useState<string>('');
  const [ownerContact, setOwnerContact] = useState<string>('');
  const [tenantName, setTenantName] = useState<string>('');
  const [tenantContact, setTenantContact] = useState<string>('');
  const [totalOccupants, setTotalOccupants] = useState<number>(1);
  const [seniorsCount, setSeniorsCount] = useState<number>(0);
  const [pwdCount, setPwdCount] = useState<number>(0);
  const [vehiclesCount, setVehiclesCount] = useState<number>(0);
  const [vehiclePlates, setVehiclePlates] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(true);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Set default street based on selected block
  useEffect(() => {
    const foundBlock = BLUEPRINT_BLOCKS.find((b) => b.block === block);
    if (foundBlock && !editRecord) {
      setStreet(foundBlock.street);
    }
  }, [block, editRecord]);

  // Load record into form when editing
  useEffect(() => {
    if (editRecord) {
      setBlock(editRecord.block);
      setLot(editRecord.lot);
      setStreet(editRecord.street);
      setOccupancyType(editRecord.occupancyType);
      setOwnerName(editRecord.ownerName);
      setOwnerContact(editRecord.ownerContact || '');
      setTenantName(editRecord.tenantName || '');
      setTenantContact(editRecord.tenantContact || '');
      setTotalOccupants(editRecord.totalOccupants);
      setSeniorsCount(editRecord.seniorsCount);
      setPwdCount(editRecord.pwdCount);
      setVehiclesCount(editRecord.vehiclesCount || 0);
      setVehiclePlates(editRecord.vehiclePlates || '');
      setNotes(editRecord.notes || '');
      setPrivacyConsent(editRecord.privacyConsent ?? true);
    }
  }, [editRecord]);

  // Check for duplicate Block + Lot
  useEffect(() => {
    const isDuplicate = existingRecords.some(
      (r) => r.block === block && r.lot === lot && (!editRecord || r.id !== editRecord.id)
    );
    if (isDuplicate) {
      setDuplicateWarning(`Warning: Block ${block}, Lot ${lot} already has an existing encoded record. Saving will update or replace it.`);
    } else {
      setDuplicateWarning(null);
    }
  }, [block, lot, existingRecords, editRecord]);

  const resetForm = () => {
    setBlock(1);
    setLot(1);
    setStreet(DEFAULT_STREETS[0]);
    setOccupancyType('owner');
    setOwnerName('');
    setOwnerContact('');
    setTenantName('');
    setTenantContact('');
    setTotalOccupants(1);
    setSeniorsCount(0);
    setPwdCount(0);
    setVehiclesCount(0);
    setVehiclePlates('');
    setNotes('');
    setPrivacyConsent(true);
    setValidationError(null);
    if (onCancelEdit) onCancelEdit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!ownerName.trim()) {
      setValidationError('Please enter the Registered Owner name.');
      return;
    }

    if (occupancyType === 'renter' && !tenantName.trim()) {
      setValidationError('For rented/leased properties, please enter the primary tenant or occupant name.');
      return;
    }

    if (!privacyConsent) {
      setValidationError('Data Privacy Act (RA 10173) consent is required to complete the submission.');
      return;
    }

    const currentBlockObj = BLUEPRINT_BLOCKS.find((b) => b.block === block);
    const maxLotsForBlock = currentBlockObj ? currentBlockObj.lots : 50;

    if (lot > maxLotsForBlock) {
      setValidationError(`Block ${block} only has ${maxLotsForBlock} lots mapped on the subdivision blueprint. Please verify the lot number.`);
      return;
    }

    const record: HouseholdCensusRecord = {
      id: editRecord ? editRecord.id : `rec-${Date.now()}`,
      block,
      lot,
      street,
      occupancyType,
      ownerName: ownerName.trim(),
      ownerContact: ownerContact.trim() || undefined,
      tenantName: occupancyType === 'renter' ? tenantName.trim() : undefined,
      tenantContact: occupancyType === 'renter' ? tenantContact.trim() : undefined,
      totalOccupants: occupancyType === 'vacant_lot' || occupancyType === 'unoccupied' ? 0 : Number(totalOccupants) || 0,
      seniorsCount: occupancyType === 'vacant_lot' || occupancyType === 'unoccupied' ? 0 : Number(seniorsCount) || 0,
      pwdCount: occupancyType === 'vacant_lot' || occupancyType === 'unoccupied' ? 0 : Number(pwdCount) || 0,
      vehiclesCount: Number(vehiclesCount) || 0,
      vehiclePlates: vehiclePlates.trim() || undefined,
      notes: notes.trim() || undefined,
      encodedBy: activeUser,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      privacyConsent: true
    };

    onSaveRecord(record);
    setSuccessToast(`Successfully encoded Block ${block}, Lot ${lot} (${occupancyType.toUpperCase()})!`);
    setTimeout(() => setSuccessToast(null), 4000);

    if (!editRecord) {
      // Suggest next lot in same block
      setLot((prev) => Math.min(prev + 1, maxLotsForBlock));
      setOwnerName('');
      setOwnerContact('');
      setTenantName('');
      setTenantContact('');
      setTotalOccupants(1);
      setSeniorsCount(0);
      setPwdCount(0);
      setVehiclesCount(0);
      setVehiclePlates('');
      setNotes('');
    }
  };

  const currentBlockLots = BLUEPRINT_BLOCKS.find((b) => b.block === block)?.lots || 30;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Encoder Mode A: Door-to-Door Field Capture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {editRecord ? `Editing Census: Block ${editRecord.block}, Lot ${editRecord.lot}` : 'Village Census Encoding Form'}
          </h2>
          <p className="text-emerald-100/80 text-sm mt-0.5">
            Active Field Encoder: <span className="font-semibold text-white">{activeUser}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editRecord && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancel Edit</span>
            </button>
          )}
          <button
            type="button"
            onClick={resetForm}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Fields</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-2 text-emerald-800 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2 text-amber-800 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{duplicateWarning}</span>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-center gap-2 text-rose-800 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Step 1: Property Location (Block + Lot + Street) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-base">1. Property Location (Block + Lot + Street)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Block Number (1–23) *
              </label>
              <select
                value={block}
                onChange={(e) => setBlock(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {BLUEPRINT_BLOCKS.map((b) => (
                  <option key={b.block} value={b.block}>
                    Block {b.block} ({b.lots} Lots mapped)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Lot Number (1–{currentBlockLots}) *
              </label>
              <input
                type="number"
                min={1}
                max={currentBlockLots + 10}
                value={lot}
                onChange={(e) => setLot(Number(e.target.value))}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Street / Village Zone *
              </label>
              <select
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {DEFAULT_STREETS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Occupancy Classification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-base">2. Occupancy Classification</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'owner', label: 'Owner-Occupied', desc: 'Titleholder lives in the property' },
              { id: 'renter', label: 'Rented / Leased', desc: 'Tenant/renter occupies property' },
              { id: 'unoccupied', label: 'Unoccupied House', desc: 'Built house, currently vacant' },
              { id: 'vacant_lot', label: 'Vacant Lot', desc: 'Undeveloped / bare lot' }
            ].map((item) => (
              <label
                key={item.id}
                className={`relative flex flex-col p-3 rounded-xl border cursor-pointer transition ${
                  occupancyType === item.id
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-800">{item.label}</span>
                  <input
                    type="radio"
                    name="occupancyType"
                    value={item.id}
                    checked={occupancyType === item.id}
                    onChange={() => setOccupancyType(item.id as OccupancyType)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-xs text-slate-500 leading-snug">{item.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Registered Owner Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-base">3. Registered Homeowner Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Registered Owner Name(s) *
              </label>
              <input
                type="text"
                placeholder="e.g. Juan & Maria Dela Cruz"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Owner Contact Number / Email
              </label>
              <input
                type="text"
                placeholder="e.g. 0917-123-4567 or email@domain.com"
                value={ownerContact}
                onChange={(e) => setOwnerContact(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Tenant / Renter Details (Conditional) */}
        {occupancyType === 'renter' && (
          <div className="space-y-4 bg-teal-50/40 p-4 rounded-xl border border-teal-200/80">
            <div className="flex items-center gap-2 border-b border-teal-200/60 pb-2">
              <Users className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-teal-900 text-base">4. Current Tenant / Renter Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-teal-900 uppercase tracking-wider mb-1">
                  Primary Tenant / Occupant Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Roberto & Ana Santos"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  required={occupancyType === 'renter'}
                  className="w-full rounded-xl border border-teal-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-900 uppercase tracking-wider mb-1">
                  Tenant Contact Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0918-987-6543"
                  value={tenantContact}
                  onChange={(e) => setTenantContact(e.target.value)}
                  className="w-full rounded-xl border border-teal-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Household Headcount & Vulnerable Sectors */}
        {occupancyType !== 'vacant_lot' && occupancyType !== 'unoccupied' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-800 text-base">5. Household Demographics & Disaster Readiness</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Total Household Occupants
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={totalOccupants}
                  onChange={(e) => setTotalOccupants(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Senior Citizens (60+)
                </label>
                <input
                  type="number"
                  min={0}
                  max={totalOccupants}
                  value={seniorsCount}
                  onChange={(e) => setSeniorsCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Persons with Disabilities (PWD)
                </label>
                <input
                  type="number"
                  min={0}
                  max={totalOccupants}
                  value={pwdCount}
                  onChange={(e) => setPwdCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Vehicles & Plate numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-slate-500" />
                  <span>Number of Registered Vehicles</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={vehiclesCount}
                  onChange={(e) => setVehiclesCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Vehicle Plate Numbers / Models (for gate stickers)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABC-1234 (Vios), NAE-5521 (Innova)"
                  value={vehiclePlates}
                  onChange={(e) => setVehiclePlates(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Notes & Data Privacy Consent */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Encoder Remarks & Specific Lot Location Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Corner lot near rotonda, dogs on premises, special health requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Philippine Data Privacy Act (R.A. 10173) Compliance:</strong> I certify that the information encoded herein has been verified with the household or title records strictly for Pueblocillo Village HOA administrative, census, and disaster emergency preparedness records.
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{editRecord ? 'Update Census Record' : 'Save & Encode Next Lot'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
