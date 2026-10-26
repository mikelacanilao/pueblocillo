'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  Home, 
  CheckCircle, 
  Search, 
  Download, 
  Filter, 
  Edit3, 
  Trash2, 
  HeartHandshake, 
  AlertCircle,
  FileSpreadsheet,
  Layers,
  MapPin
} from 'lucide-react';
import { HouseholdCensusRecord, VillageSettings } from '@/types/census';
import { BLUEPRINT_BLOCKS } from '@/data/pueblocilloBlocks';

interface AnalyticsDashboardProps {
  records: HouseholdCensusRecord[];
  settings: VillageSettings;
  onEditRecord: (record: HouseholdCensusRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  onNavigateToEncode: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  records,
  settings,
  onEditRecord,
  onDeleteRecord,
  onNavigateToEncode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterOccupancy, setFilterOccupancy] = useState<string>('all');
  const [filterVulnerableOnly, setFilterVulnerableOnly] = useState<boolean>(false);

  // Computed Metrics
  const totalLotsBaseline = settings.totalLotsBaseline || 480;
  const totalEncoded = records.length;
  const completionRate = Math.min(100, Math.round((totalEncoded / totalLotsBaseline) * 100));

  const ownerCount = records.filter((r) => r.occupancyType === 'owner').length;
  const renterCount = records.filter((r) => r.occupancyType === 'renter').length;
  const unoccupiedCount = records.filter((r) => r.occupancyType === 'unoccupied').length;
  const vacantLotCount = records.filter((r) => r.occupancyType === 'vacant_lot').length;

  const activeHouseholds = ownerCount + renterCount;
  const activeCommunityPct = totalEncoded > 0 ? Math.round((activeHouseholds / totalEncoded) * 100) : 0;

  const totalResidents = records.reduce((sum, r) => sum + (r.totalOccupants || 0), 0);
  const totalSeniors = records.reduce((sum, r) => sum + (r.seniorsCount || 0), 0);
  const totalPwd = records.reduce((sum, r) => sum + (r.pwdCount || 0), 0);
  const totalVehicles = records.reduce((sum, r) => sum + (r.vehiclesCount || 0), 0);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        searchTerm === '' ||
        r.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.tenantName && r.tenantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `b${r.block} l${r.lot}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `block ${r.block}`.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBlock = filterBlock === 'all' || r.block === Number(filterBlock);
      const matchOccupancy = filterOccupancy === 'all' || r.occupancyType === filterOccupancy;
      const matchVulnerable = !filterVulnerableOnly || (r.seniorsCount > 0 || r.pwdCount > 0);

      return matchSearch && matchBlock && matchOccupancy && matchVulnerable;
    });
  }, [records, searchTerm, filterBlock, filterOccupancy, filterVulnerableOnly]);

  // Street Breakdown aggregation
  const streetBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; owners: number; renters: number; vacant: number }>();
    records.forEach((r) => {
      const current = map.get(r.street) || { total: 0, owners: 0, renters: 0, vacant: 0 };
      current.total += 1;
      if (r.occupancyType === 'owner') current.owners += 1;
      else if (r.occupancyType === 'renter') current.renters += 1;
      else current.vacant += 1;
      map.set(r.street, current);
    });
    return Array.from(map.entries()).map(([street, data]) => ({ street, ...data }));
  }, [records]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Block',
      'Lot',
      'Street',
      'Occupancy Type',
      'Owner Name',
      'Owner Contact',
      'Tenant Name',
      'Tenant Contact',
      'Total Occupants',
      'Seniors (60+)',
      'PWD',
      'Vehicles Count',
      'Vehicle Plates',
      'Notes',
      'Encoded By',
      'Updated At'
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      r.block,
      r.lot,
      `"${r.street.replace(/"/g, '""')}"`,
      `"${r.occupancyType}"`,
      `"${r.ownerName.replace(/"/g, '""')}"`,
      `"${(r.ownerContact || '').replace(/"/g, '""')}"`,
      `"${(r.tenantName || '').replace(/"/g, '""')}"`,
      `"${(r.tenantContact || '').replace(/"/g, '""')}"`,
      r.totalOccupants,
      r.seniorsCount,
      r.pwdCount,
      r.vehiclesCount || 0,
      `"${(r.vehiclePlates || '').replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${r.encodedBy.replace(/"/g, '""')}"`,
      `"${r.updatedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pueblocillo_Village_Census_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Baseline Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Live Village Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">Census Dashboard & Directory</h2>
          <p className="text-xs text-slate-500">
            Blocks 1 to 23 • Baseline Capacity: <strong className="text-slate-700">{totalLotsBaseline} Mapped Lots</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToEncode}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>+ Encode Next Lot</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Community</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              {activeCommunityPct}%
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{activeHouseholds} Units</div>
            <div className="text-xs text-slate-500 mt-0.5">{totalEncoded} total encoded records</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${activeCommunityPct}%` }}></div>
          </div>
        </div>

        {/* Owner vs Renter Ratio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenure Ratio</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold">
              {activeHouseholds > 0 ? Math.round((renterCount / activeHouseholds) * 100) : 0}% Renters
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-slate-900">{ownerCount}</span>
              <span className="text-xs text-slate-500 ml-1">Owners</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-teal-700">{renterCount}</span>
              <span className="text-xs text-slate-500 ml-1">Renters</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            {unoccupiedCount} unoccupied houses • {vacantLotCount} vacant lots
          </div>
        </div>

        {/* Vulnerable Sector / Disaster Preparedness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disaster Vulnerability</span>
            <HeartHandshake className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-slate-900">{totalSeniors}</span>
              <span className="text-xs text-slate-500 ml-1">Seniors (60+)</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-rose-600">{totalPwd}</span>
              <span className="text-xs text-slate-500 ml-1">PWD</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            {totalResidents} total residents tracked
          </div>
        </div>

        {/* Census Progress Baseline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subdivision Progress</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
              {completionRate}% of 480
            </span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{totalEncoded} / {totalLotsBaseline}</div>
            <div className="text-xs text-slate-500 mt-0.5">{totalLotsBaseline - totalEncoded} lots remaining to encode</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Street & Zone Progress Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Zone & Street Census Summary</h3>
          </div>
          <span className="text-xs text-slate-500">{streetBreakdown.length} Active Street Zones</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-2">Street Name / Assigned Blocks</th>
                <th className="pb-2 text-center">Encoded Lots</th>
                <th className="pb-2 text-center">Owners</th>
                <th className="pb-2 text-center">Renters</th>
                <th className="pb-2 text-center">Vacant / Unoccupied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {streetBreakdown.map((s) => (
                <tr key={s.street} className="hover:bg-slate-50/60 transition">
                  <td className="py-2.5 font-medium text-slate-800">{s.street}</td>
                  <td className="py-2.5 text-center font-bold text-slate-900">{s.total}</td>
                  <td className="py-2.5 text-center text-emerald-700">{s.owners}</td>
                  <td className="py-2.5 text-center text-teal-700">{s.renters}</td>
                  <td className="py-2.5 text-center text-slate-400">{s.vacant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Searchable Resident Directory & Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Property & Resident Registry</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              {filteredRecords.length} records shown
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search owner, tenant, block, lot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44 sm:w-56"
              />
            </div>

            <select
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none"
            >
              <option value="all">All Blocks (1–23)</option>
              {BLUEPRINT_BLOCKS.map((b) => (
                <option key={b.block} value={b.block}>
                  Block {b.block}
                </option>
              ))}
            </select>

            <select
              value={filterOccupancy}
              onChange={(e) => setFilterOccupancy(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="owner">Owner-Occupied</option>
              <option value="renter">Rented / Leased</option>
              <option value="unoccupied">Unoccupied House</option>
              <option value="vacant_lot">Vacant Lot</option>
            </select>

            <button
              onClick={() => setFilterVulnerableOnly(!filterVulnerableOnly)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                filterVulnerableOnly
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Seniors/PWD Only</span>
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-2">Location</th>
                <th className="pb-2">Occupancy</th>
                <th className="pb-2">Registered Owner</th>
                <th className="pb-2">Current Occupant / Tenant</th>
                <th className="pb-2 text-center">Headcount</th>
                <th className="pb-2 text-center">Seniors / PWD</th>
                <th className="pb-2 text-center">Vehicles</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">
                    No matching census records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-semibold text-slate-900">
                      Block {r.block}, Lot {r.lot}
                      <div className="text-[11px] font-normal text-slate-500">{r.street}</div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.occupancyType === 'owner'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.occupancyType === 'renter'
                            ? 'bg-teal-100 text-teal-800'
                            : r.occupancyType === 'unoccupied'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.occupancyType.toUpperCase().replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-slate-800">
                      {r.ownerName}
                      {r.ownerContact && <div className="text-[11px] text-slate-500">{r.ownerContact}</div>}
                    </td>
                    <td className="py-3">
                      {r.tenantName ? (
                        <div>
                          <span className="font-medium text-teal-900">{r.tenantName}</span>
                          {r.tenantContact && <div className="text-[11px] text-teal-700/80">{r.tenantContact}</div>}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-800">{r.totalOccupants}</td>
                    <td className="py-3 text-center">
                      {r.seniorsCount > 0 || r.pwdCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                          {r.seniorsCount > 0 && `${r.seniorsCount} Senior${r.seniorsCount > 1 ? 's' : ''}`}
                          {r.seniorsCount > 0 && r.pwdCount > 0 && ' • '}
                          {r.pwdCount > 0 && `${r.pwdCount} PWD`}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {r.vehiclesCount ? (
                        <div>
                          <span className="font-semibold text-slate-800">{r.vehiclesCount}</span>
                          {r.vehiclePlates && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[100px] mx-auto">
                              {r.vehiclePlates}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => onEditRecord(r)}
                        title="Edit Record"
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteRecord(r.id)}
                        title="Delete Record"
                        className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
