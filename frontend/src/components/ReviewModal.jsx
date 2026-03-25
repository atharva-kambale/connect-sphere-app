import { useState } from 'react';
import { FiStar, FiX } from 'react-icons/fi';

const ReviewModal = ({ isOpen, onClose, onSubmit, sellerName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FiX size={24}/>
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate {sellerName}</h3>
        <p className="text-gray-500 mb-6">Share your experience with this seller</p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-125"
              >
                <FiStar size={32} className={star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about your experience..."
            className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-28 mb-4"
          />
          <button type="submit" disabled={!rating} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};
export default ReviewModal;
