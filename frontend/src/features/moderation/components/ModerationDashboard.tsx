import React from 'react';

// TODO: Add dispute resolution modal component for Moderators
// REVIEW: Display transparent incident history timeline for reported accounts

export const ModerationDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-slate-950 border rounded-lg text-white space-y-6">
      <h2 className="text-2xl font-bold">Moderator Dashboard</h2>
      <div className="border border-slate-800 p-4 rounded bg-slate-900">
        <h3 className="font-semibold text-amber-400 mb-2">Pending Work Items</h3>
        <p className="text-sm text-slate-300">No open dispute tickets requiring moderation review.</p>
      </div>
    </div>
  );
};
