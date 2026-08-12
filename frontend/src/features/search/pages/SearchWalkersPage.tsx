import React, { useState } from 'react';
import { SearchQueryParams } from '../api/searchApi';

// TODO: Add interactive Leaflet map component with walker location markers
// REVIEW: Optimize 375px mobile viewport responsiveness for search filter pill controls

export const SearchWalkersPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchQueryParams>({
    latitude: -34.6037,
    longitude: -58.3816,
    radiusKm: 5,
  });

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Search Dog Walkers Near You</h1>
      <div className="flex gap-4 items-center flex-wrap">
        <label className="text-sm font-medium">Radius (km):</label>
        <input
          type="number"
          value={filters.radiusKm}
          onChange={(e) => setFilters({ ...filters, radiusKm: Number(e.target.value) })}
          className="border rounded p-2 text-sm w-24"
        />
      </div>
      <div className="border rounded-lg p-6 bg-slate-900 text-white">
        <p className="text-slate-400">Nearest walkers will appear here sorted by distance.</p>
      </div>
    </div>
  );
};
