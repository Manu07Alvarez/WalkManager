import React, { useState } from 'react';
import { createBookingRequest } from '../../search/api/searchApi';

// TODO: Add date-time picker UI with walker availability highlight calendar
// REVIEW: Display immediate visual feedback when request enters Pending status

interface CreateBookingRequestFormProps {
  walkerId: string;
}

export const CreateBookingRequestForm: React.FC<CreateBookingRequestFormProps> = ({ walkerId }) => {
  const [dogCount, setDogCount] = useState<number>(1);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() + 3600000).toISOString();
      const endTime = new Date(now.getTime() + 7200000).toISOString();
      const res = await createBookingRequest({
        walkerId,
        startTime,
        endTime,
        dogCount,
      });
      setStatusFeedback(`Booking requested successfully! Status: ${res.status}`);
    } catch (err: any) {
      setStatusFeedback(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
      <h2 className="text-lg font-semibold">Request a Walk</h2>
      <div>
        <label className="block text-sm font-medium">Number of Dogs:</label>
        <input
          type="number"
          min={1}
          max={6}
          value={dogCount}
          onChange={(e) => setDogCount(Number(e.target.value))}
          className="border rounded p-2 text-sm w-20"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium"
      >
        Send Booking Request
      </button>
      {statusFeedback && <p className="text-sm font-medium text-emerald-400">{statusFeedback}</p>}
    </form>
  );
};
