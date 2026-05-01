import { useState } from 'react';

const OUTCOMES = [
  {
    value: 'offer',
    label: 'Got an Offer! 🎉',
    description: 'Congratulations! The company has extended an offer.',
    bg: 'bg-green-50 border-green-300 hover:bg-green-100',
    selected: 'bg-green-500 border-green-500 text-white',
    text: 'text-green-700',
  },
  {
    value: 'rejected',
    label: 'Not Selected',
    description: 'The company decided not to move forward.',
    bg: 'bg-red-50 border-red-200 hover:bg-red-100',
    selected: 'bg-red-500 border-red-500 text-white',
    text: 'text-red-700',
  },
  {
    value: 'waiting',
    label: 'Still Waiting',
    description: "Waiting to hear back — you'll know soon.",
    bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    selected: 'bg-amber-500 border-amber-500 text-white',
    text: 'text-amber-700',
  },
];

const CheckInModal = ({ interview, onSubmit, onSkip, totalPending, currentIndex }) => {
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOutcome) return;
    setSubmitting(true);
    try {
      await onSubmit(interview.id, selectedOutcome);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-xl">
        {/* Progress indicator */}
        {totalPending > 1 && (
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: totalPending }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentIndex ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="mb-5">
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
            Post-Interview Check-in
          </p>
          <h3 className="text-gray-900 font-semibold text-lg">
            How did it go at {interview.company}?
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {interview.role} ·{' '}
            {new Date(interview.scheduled_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Outcome selector */}
        <div className="space-y-2 mb-5">
          {OUTCOMES.map((outcome) => (
            <button
              key={outcome.value}
              onClick={() => setSelectedOutcome(outcome.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition ${
                selectedOutcome === outcome.value
                  ? outcome.selected
                  : outcome.bg + ' border-transparent'
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  selectedOutcome === outcome.value ? 'text-white' : outcome.text
                }`}
              >
                {outcome.label}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  selectedOutcome === outcome.value ? 'text-white/80' : 'text-gray-400'
                }`}
              >
                {outcome.description}
              </p>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-between">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Remind me later
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedOutcome || submitting}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-40"
          >
            {submitting
              ? 'Saving...'
              : totalPending > 1 && currentIndex < totalPending - 1
                ? 'Next →'
                : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
