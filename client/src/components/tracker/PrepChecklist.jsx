import { useState } from 'react';

const PrepChecklist = ({ topics, onAdd, onToggle, onDelete }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput('');
  };

  const completed = topics.filter((t) => t.is_completed).length;

  return (
    <div>
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">Prep Checklist</h4>
        {topics.length > 0 && (
          <span className="text-xs text-gray-400">
            {completed}/{topics.length} done
          </span>
        )}
      </div>

      {/* Progress bar */}
      {topics.length > 0 && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(completed / topics.length) * 100}%` }}
          />
        </div>
      )}

      {/* Topic list */}
      <div className="space-y-2 mb-3">
        {topics.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">
            No prep topics yet — add some below
          </p>
        ) : (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center gap-2 group"
            >
              <input
                type="checkbox"
                checked={topic.is_completed}
                onChange={() => onToggle(topic.id, !topic.is_completed)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600"
              />
              <span className={`flex-1 text-sm transition-colors ${
                topic.is_completed
                  ? 'text-gray-400 line-through'
                  : 'text-gray-700'
              }`}>
                {topic.topic}
              </span>
              <button
                onClick={() => onDelete(topic.id)}
                className="text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add topic input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a prep topic..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default PrepChecklist;
