const EMPTY_STATE_CONFIG = {
  wishlist:  { emoji: '🔖', message: 'No jobs saved yet',         sub: 'Add jobs you want to apply to'        },
  applied:   { emoji: '📨', message: 'No applications yet',       sub: 'Move a job here when you apply'       },
  interview: { emoji: '🎯', message: 'No interviews scheduled',   sub: 'Move here when you get an interview'  },
  offer:     { emoji: '🎉', message: 'No offers yet',             sub: 'Keep going — you\'re doing great!'    },
  rejected:  { emoji: '💪', message: 'No rejections',             sub: 'Every no gets you closer to a yes'    },
  withdrawn: { emoji: '↩️', message: 'None withdrawn',            sub: 'Applications you\'ve pulled back'     },
  default:   { emoji: '📋', message: 'Nothing here yet',          sub: 'Add your first item'                  },
};

const EmptyState = ({ status, onAdd }) => {
  const config = EMPTY_STATE_CONFIG[status] || EMPTY_STATE_CONFIG.default;

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <span className="text-3xl mb-3">{config.emoji}</span>
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
