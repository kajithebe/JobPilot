import { useState } from 'react';

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#080d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
    />
  </div>
);

const PersonalInfoForm = ({ data, onChange }) => {
  const [expanded, setExpanded] = useState(true);

  const handleField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-[#080d1a] border border-gray-800 rounded-xl overflow-hidden">
      {/* Section header — fixed, no reorder arrows */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-900 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-medium">
            FIXED
          </span>
          <h3 className="text-white text-sm font-medium">Personal Info</h3>
        </div>
        <span className="text-gray-600 text-xs">{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Fields */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <Field
            label="Full Name"
            value={data.fullName}
            onChange={(v) => handleField('fullName', v)}
            placeholder="John Doe"
          />
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
            <label className="block text-xs text-gray-500 mb-1">Summary</label>
            <textarea
              value={data.summary || ''}
              onChange={(e) => handleField('summary', e.target.value)}
              placeholder="A brief professional summary..."
              rows={3}
              className="w-full bg-[#080d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600 resize-none"
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
