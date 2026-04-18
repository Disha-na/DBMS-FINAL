import { useState } from 'react';
import { submitFeedback } from '../services/api';
import toast from 'react-hot-toast';
import { HiStar } from 'react-icons/hi';

const FeedbackForm = ({ eventId, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({ eventId, rating, comment });
      toast.success('Feedback submitted successfully!');
      setRating(0);
      setComment('');
      if (onSubmitted) onSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="input-label">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-125"
            >
              <HiStar
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'text-accent-400'
                    : 'text-dark-600'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="input-label">Comment (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
          maxLength={500}
          className="input-field resize-none"
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
