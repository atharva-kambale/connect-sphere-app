import { FiStar } from 'react-icons/fi';

const Rating = ({ value = 0, max = 5 }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, i) => (
        <FiStar key={i} size={16} className={i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
      ))}
      <span className="ml-1 text-sm text-gray-500">({value}/{max})</span>
    </div>
  );
};
export default Rating;
