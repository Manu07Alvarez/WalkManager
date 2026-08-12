import React from 'react';

// TODO: Display transparent expiry countdown timer for temporary account restrictions
// REVIEW: Ensure banner clearly states active restriction type (BookingLimited, Suspended, etc.)

interface RestrictionNoticeProps {
  restrictionType: string;
  reason: string;
  expiresAt: string;
}

export const RestrictionNotice: React.FC<RestrictionNoticeProps> = ({ restrictionType, reason, expiresAt }) => {
  return (
    <div className="p-4 bg-rose-950 border border-rose-800 text-rose-200 rounded-md space-y-1">
      <h4 className="font-bold">Account Restriction Active: {restrictionType}</h4>
      <p className="text-sm">{reason}</p>
      <p className="text-xs text-rose-400">Expires: {expiresAt}</p>
    </div>
  );
};
