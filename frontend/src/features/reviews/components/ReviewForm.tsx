import React, { useState } from 'react';
import { submitReview } from '../api/reviewApi';

// TODO: Render interactive star selection component (1-5 stars)
// REVIEW: Ensure no reply or response UI is exposed to walker accounts per requirement

interface ReviewFormProps {
  bookingId: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ bookingId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReview({ bookingId, rating, comment });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded">
        Thank you! Your review has been submitted and is pending moderation.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-slate-950 text-white space-y-4 max-w-md">
      <h3 className="text-lg font-bold">Leave a Review</h3>
      <div>
        <label className="block text-sm mb-1">Rating (1-5 Stars)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-sm w-full"
        >
          <option value={5}>5 Stars - Excellent</option>
          <option value={4}>4 Stars - Good</option>
          <option value={3}>3 Stars - Average</option>
          <option value={2}>2 Stars - Poor</option>
          <option value={1}>1 Star - Terrible</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review experience (min 10 characters)..."
          rows={4}
          className="bg-slate-800 border border-slate-700 p-2 rounded text-sm w-full focus:outline-none focus:border-amber-400"
        />
      </div>
      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded text-sm w-full"
      >
        Submit Review for Moderation
      </button>
    </form>
  );
};
