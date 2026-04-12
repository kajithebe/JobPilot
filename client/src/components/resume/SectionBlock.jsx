import { useState } from 'react';

const SectionBlock = ({ sectionKey, label, data, onChange, onMoveUp, onMoveDown }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-[#080d1a] border border-gray-800 rounded-xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer hover:opacity-80"
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className="text-white text-sm font-medium">{label}</h3>
          <span className="text-gray-600 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>

        {/* Reorder arrows */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded hover:bg-gray-800"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded hover:bg-gray-800"
            title="Move down"
          >
            ↓
          </button>
        </div>
      </div>

      {/* Section content */}
      {expanded && (
        <div className="px-4 pb-4">
          <SectionContent sectionKey={sectionKey} data={data} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

// ── Section content renderers ─────────────────────────────────────────

const SectionContent = ({ sectionKey, data, onChange }) => {
  switch (sectionKey) {
    case 'experience':
      return <ExperienceSection data={data} onChange={onChange} />;
    case 'education':
      return <EducationSection data={data} onChange={onChange} />;
    case 'skills':
      return <SkillsSection data={data} onChange={onChange} />;
    case 'projects':
      return <ProjectsSection data={data} onChange={onChange} />;
    case 'certifications':
      return <CertificationsSection data={data} onChange={onChange} />;
    default:
      return null;
  }
};

// ── Shared helpers ────────────────────────────────────────────────────

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0f1629] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#0f1629] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600 resize-none"
    />
  </div>
);

const AddButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full mt-3 py-2 border border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-gray-300 hover:border-gray-500 text-sm transition-colors"
  >
    + {label}
  </button>
);

const ItemHeader = ({ title, onRemove }) => (
  <div className="flex items-center justify-between mb-3">
    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</span>
    <button
      onClick={onRemove}
      className="text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
    >
      ×
    </button>
  </div>
);

const emptyItem = (type) => {
  switch (type) {
    case 'experience':
      return {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      };
    case 'education':
      return {
        degree: '',
        field: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
      };
    case 'project':
      return { title: '', description: '', technologies: [], url: '' };
    case 'certification':
      return { name: '', issuer: '', date: '', url: '' };
    default:
      return {};
  }
};

// ── Experience ────────────────────────────────────────────────────────

const ExperienceSection = ({ data, onChange }) => {
  const items = data || [];

  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const addItem = () => onChange([...items, emptyItem('experience')]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-800 rounded-lg p-3">
          <ItemHeader title={`Experience ${index + 1}`} onRemove={() => removeItem(index)} />
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Job Title"
                value={item.title}
                onChange={(v) => updateItem(index, 'title', v)}
                placeholder="Software Engineer"
              />
              <Field
                label="Company"
                value={item.company}
                onChange={(v) => updateItem(index, 'company', v)}
                placeholder="Acme Corp"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Field
                label="Location"
                value={item.location}
                onChange={(v) => updateItem(index, 'location', v)}
                placeholder="New York, NY"
              />
              <Field
                label="Start Date"
                value={item.startDate}
                onChange={(v) => updateItem(index, 'startDate', v)}
                placeholder="Jan 2022"
              />
              <Field
                label="End Date"
                value={item.endDate}
                onChange={(v) => updateItem(index, 'endDate', v)}
                placeholder="Present"
              />
            </div>
            <TextArea
              label="Description"
              value={item.description}
              onChange={(v) => updateItem(index, 'description', v)}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      ))}
      <AddButton label="Add Experience" onClick={addItem} />
    </div>
  );
};

// ── Education ─────────────────────────────────────────────────────────

const EducationSection = ({ data, onChange }) => {
  const items = data || [];

  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const addItem = () => onChange([...items, emptyItem('education')]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-800 rounded-lg p-3">
          <ItemHeader title={`Education ${index + 1}`} onRemove={() => removeItem(index)} />
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Degree"
                value={item.degree}
                onChange={(v) => updateItem(index, 'degree', v)}
                placeholder="Bachelor of Science"
              />
              <Field
                label="Field of Study"
                value={item.field}
                onChange={(v) => updateItem(index, 'field', v)}
                placeholder="Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Institution"
                value={item.institution}
                onChange={(v) => updateItem(index, 'institution', v)}
                placeholder="MIT"
              />
              <Field
                label="GPA"
                value={item.gpa}
                onChange={(v) => updateItem(index, 'gpa', v)}
                placeholder="3.8"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Start Date"
                value={item.startDate}
                onChange={(v) => updateItem(index, 'startDate', v)}
                placeholder="Sep 2018"
              />
              <Field
                label="End Date"
                value={item.endDate}
                onChange={(v) => updateItem(index, 'endDate', v)}
                placeholder="May 2022"
              />
            </div>
          </div>
        </div>
      ))}
      <AddButton label="Add Education" onClick={addItem} />
    </div>
  );
};

// ── Skills ────────────────────────────────────────────────────────────

const SkillsSection = ({ data, onChange }) => {
  const [input, setInput] = useState('');
  const skills = data || [];

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInput('');
  };

  const removeSkill = (index) => onChange(skills.filter((_, i) => i !== index));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="flex items-center gap-1 bg-blue-900/30 border border-blue-800 text-blue-300 text-xs px-2 py-1 rounded-full"
          >
            {skill}
            <button
              onClick={() => removeSkill(index)}
              className="hover:text-red-400 transition-colors ml-1"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Type a skill and press Enter"
          className="flex-1 bg-[#0f1629] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
        />
        <button
          onClick={addSkill}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

// ── Projects ──────────────────────────────────────────────────────────

const ProjectsSection = ({ data, onChange }) => {
  const items = data || [];

  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const addItem = () => onChange([...items, emptyItem('project')]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-800 rounded-lg p-3">
          <ItemHeader title={`Project ${index + 1}`} onRemove={() => removeItem(index)} />
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Project Title"
                value={item.title}
                onChange={(v) => updateItem(index, 'title', v)}
                placeholder="JobPilot"
              />
              <Field
                label="URL"
                value={item.url}
                onChange={(v) => updateItem(index, 'url', v)}
                placeholder="github.com/..."
              />
            </div>
            <TextArea
              label="Description"
              value={item.description}
              onChange={(v) => updateItem(index, 'description', v)}
              placeholder="What did you build and what technologies did you use?"
            />
            <Field
              label="Technologies (comma separated)"
              value={
                Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies
              }
              onChange={(v) =>
                updateItem(
                  index,
                  'technologies',
                  v
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                )
              }
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>
        </div>
      ))}
      <AddButton label="Add Project" onClick={addItem} />
    </div>
  );
};

// ── Certifications ────────────────────────────────────────────────────

const CertificationsSection = ({ data, onChange }) => {
  const items = data || [];

  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const addItem = () => onChange([...items, emptyItem('certification')]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-800 rounded-lg p-3">
          <ItemHeader title={`Certification ${index + 1}`} onRemove={() => removeItem(index)} />
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Certification Name"
                value={item.name}
                onChange={(v) => updateItem(index, 'name', v)}
                placeholder="AWS Solutions Architect"
              />
              <Field
                label="Issuing Organisation"
                value={item.issuer}
                onChange={(v) => updateItem(index, 'issuer', v)}
                placeholder="Amazon Web Services"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Date"
                value={item.date}
                onChange={(v) => updateItem(index, 'date', v)}
                placeholder="Mar 2023"
              />
              <Field
                label="URL"
                value={item.url}
                onChange={(v) => updateItem(index, 'url', v)}
                placeholder="credential link"
              />
            </div>
          </div>
        </div>
      ))}
      <AddButton label="Add Certification" onClick={addItem} />
    </div>
  );
};

export default SectionBlock;
