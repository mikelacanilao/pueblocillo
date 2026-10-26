import React from 'react';
import { Shield, Phone, AlertCircle, MapPin, Users, HeartHandshake } from 'lucide-react';

export const VillageNotices: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Emergency Contacts */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Phone className="w-4 h-4 text-emerald-700" />
          <h4 className="font-bold text-slate-800 text-sm">Emergency Hotlines</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-50">
            <span className="text-slate-600 font-medium">Village Guardhouse / Main Gate:</span>
            <span className="font-bold text-slate-900">0917-882-9011</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-50">
            <span className="text-slate-600 font-medium">HOA Admin Desk:</span>
            <span className="font-bold text-slate-900">0920-551-7734</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-50">
            <span className="text-slate-600 font-medium">Brgy. Langkaan II Hall:</span>
            <span className="font-bold text-slate-900">(046) 416-2810</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600 font-medium">Dasmariñas Police / PNP:</span>
            <span className="font-bold text-slate-900">166 / (046) 416-0255</span>
          </div>
        </div>
      </div>

      {/* Community Roadmap */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Shield className="w-4 h-4 text-emerald-700" />
          <h4 className="font-bold text-slate-800 text-sm">System Roadmap</h4>
        </div>
        <div className="space-y-2 text-xs text-slate-600">
          <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60">
            <strong className="text-emerald-900">Phase 1 (Active):</strong> Census, Block & Lot occupancy mapping, and disaster vulnerability directory.
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <strong className="text-slate-800">Phase 2:</strong> Monthly HOA dues tracker & payment receipts per lot.
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <strong className="text-slate-800">Phase 3:</strong> Guardhouse gate passes & vehicle RFID stickers.
          </div>
        </div>
      </div>

      {/* Encoder Field Guidelines */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <AlertCircle className="w-4 h-4 text-emerald-700" />
          <h4 className="font-bold text-slate-800 text-sm">Encoder Field Instructions</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
          <li>Always verify the registered owner on the land title or deed of sale.</li>
          <li>For tenant-occupied houses, register both the primary renter and the owner.</li>
          <li>Mark seniors (60+) and PWDs to assist barangay health emergency workers.</li>
          <li>Record vehicle plate numbers to streamline Phase 3 gate sticker processing.</li>
        </ul>
      </div>
    </div>
  );
};
