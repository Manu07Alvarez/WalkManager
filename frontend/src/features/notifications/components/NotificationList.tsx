import React from 'react';

// TODO: Add mark-all-as-read button and filter tabs (All / Unread)
// REVIEW: Ensure unread notifications display highlighted badge state

export const NotificationList: React.FC = () => {
  return (
    <div className="p-4 border rounded-md bg-slate-950 text-white space-y-3">
      <h3 className="text-lg font-bold">Notifications</h3>
      <div className="divide-y divide-slate-800">
        <div className="py-2">
          <p className="text-sm font-semibold">Booking Accepted</p>
          <p className="text-xs text-slate-400">Your walker accepted your booking request.</p>
        </div>
      </div>
    </div>
  );
};
