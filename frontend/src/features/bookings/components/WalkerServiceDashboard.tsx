import React from 'react';
import { acceptBooking, rejectBooking } from '../api/bookingApi';

// TODO: Add visual state badges for Pending, Accepted, Rejected, Expired, Completed, and Disputed
// REVIEW: Ensure dispute resolution submission is accessible to customer role users

interface WalkerServiceDashboardProps {
  bookingId: string;
  status: string;
}

export const WalkerServiceDashboard: React.FC<WalkerServiceDashboardProps> = ({ bookingId, status }) => {
  const handleAccept = async () => {
    try {
      await acceptBooking(bookingId);
      alert('Booking accepted!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async () => {
    try {
      await rejectBooking(bookingId);
      alert('Booking rejected!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 border rounded-md space-y-4 bg-slate-950 text-white">
      <h2 className="text-xl font-bold">Walker Dashboard - Service Request</h2>
      <p className="text-sm text-slate-300">Booking ID: {bookingId}</p>
      <p className="text-sm font-medium">Status: <span className="text-amber-400">{status}</span></p>

      {status === 'Pending' && (
        <div className="flex gap-4">
          <button
            onClick={handleAccept}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Accept Request
          </button>
          <button
            onClick={handleReject}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Reject Request
          </button>
        </div>
      )}
    </div>
  );
};
