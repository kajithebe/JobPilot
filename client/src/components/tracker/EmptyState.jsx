const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
);
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);

const EMPTY_STATE_CONFIG = {
  wishlist:  { Icon: BookmarkIcon, message: 'No jobs saved yet',          sub: 'Add jobs you want to apply to' },
  applied:   { Icon: SendIcon,     message: 'No applications yet',        sub: 'Move a job here when you apply' },
  interview: { Icon: TargetIcon,   message: 'No interviews scheduled',    sub: 'Move here when you get an interview' },
  offer:     { Icon: StarIcon,     message: 'No offers yet',              sub: "Keep going — you're doing great!" },
  rejected:  { Icon: MinusIcon,    message: 'No rejections',              sub: 'Every no gets you closer to a yes' },
  withdrawn: { Icon: ArrowLeftIcon,message: 'None withdrawn',             sub: "Applications you've pulled back" },
  default:   { Icon: ListIcon,     message: 'Nothing here yet',           sub: 'Add your first item' },
};

const EmptyState = ({ status, onAdd }) => {
  const config = EMPTY_STATE_CONFIG[status] || EMPTY_STATE_CONFIG.default;
  const { Icon } = config;

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <span className="text-gray-200 mb-3">
        <Icon />
      </span>
      <p className="text-sm font-medium text-gray-500">{config.message}</p>
      <p className="text-xs text-gray-300 mt-1">{config.sub}</p>
      {onAdd && status === 'wishlist' && (
        <button
          onClick={onAdd}
          className="mt-4 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition"
        >
          + Add job
        </button>
      )}
    </div>
  );
};

export default EmptyState;
