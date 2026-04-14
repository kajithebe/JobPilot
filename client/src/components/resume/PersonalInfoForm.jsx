import { useState } from 'react';

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300"
    />
  </div>
);

const PersonalInfoForm = ({ data, onChange }) => {
  const [expanded, setExpanded] = useState(true);

  const handleField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded font-medium">
            FIXED
          </span>
          <h3 className="text-gray-900 text-sm font-medium">Personal Info</h3>
        </div>
        <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Fields */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
          <div className="pt-3">
            <Field
              label="Full Name"
              value={data.fullName}
              onChange={(v) => handleField('fullName', v)}
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Email"
              value={data.email}
              onChange={(v) => handleField('email', v)}
              placeholder="john@email.com"
              type="email"
            />
            <Field
              label="Phone"
              value={data.phone}
              onChange={(v) => handleField('phone', v)}
              placeholder="+1 234 567 8900"
            />
          </div>
          <Field
            label="Location"
            value={data.location}
            onChange={(v) => handleField('location', v)}
            placeholder="New York, NY"
          />
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Summary</label>
            <textarea
              value={data.summary || ''}
              onChange={(e) => handleField('summary', e.target.value)}
              placeholder="A brief professional summary..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-300 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="LinkedIn"
              value={data.linkedin}
              onChange={(v) => handleField('linkedin', v)}
              placeholder="linkedin.com/in/..."
            />
            <Field
              label="GitHub"
              value={data.github}
              onChange={(v) => handleField('github', v)}
              placeholder="github.com/..."
            />
            <Field
              label="Website"
              value={data.website}
              onChange={(v) => handleField('website', v)}
              placeholder="yoursite.com"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;
