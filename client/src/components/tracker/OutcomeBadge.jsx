const OUTCOME_STYLES = {
  offer:    { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500',  label: 'Offer'    },
  rejected: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-400',    label: 'Rejected' },
  waiting:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400',  label: 'Waiting'  },
};

const OutcomeBadge = ({ outcome }) => {
  if (!outcome) return null;

  const style = OUTCOME_STYLES[outcome] || {
    bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200',
    dot: 'bg-gray-400', label: outcome,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};

export default OutcomeBadge;
