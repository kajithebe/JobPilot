const TEMPLATES = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'bold-dark', label: 'Bold Dark' },
  { id: 'executive', label: 'Executive' },
];

const THEMES = [
  { label: 'Blue', primaryColor: '#2563eb', fontColor: '#111827', bgColor: '#ffffff' },
  { label: 'Emerald', primaryColor: '#059669', fontColor: '#111827', bgColor: '#ffffff' },
  { label: 'Violet', primaryColor: '#7c3aed', fontColor: '#111827', bgColor: '#ffffff' },
  { label: 'Rose', primaryColor: '#e11d48', fontColor: '#111827', bgColor: '#ffffff' },
  { label: 'Amber', primaryColor: '#d97706', fontColor: '#111827', bgColor: '#ffffff' },
  { label: 'Slate', primaryColor: '#475569', fontColor: '#111827', bgColor: '#ffffff' },
  { label: 'Dark Blue', primaryColor: '#1e40af', fontColor: '#f8fafc', bgColor: '#0f172a' },
  { label: 'Dark Gray', primaryColor: '#94a3b8', fontColor: '#f1f5f9', bgColor: '#1e293b' },
];

const FONTS = [
  { id: 'Inter, sans-serif', label: 'Inter' },
  { id: 'Merriweather, serif', label: 'Merriweather' },
  { id: 'Roboto Mono, monospace', label: 'Roboto Mono' },
];

const TemplateSwitcher = ({ template, themeConfig, onChange, onClose }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-8">
        {/* Templates */}
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-medium">Template</p>
          <div className="flex gap-2 flex-wrap">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => onChange({ template: t.id })}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  template === t.id
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Colour themes */}
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-medium">
            Colour Theme
          </p>
          <div className="flex gap-2 flex-wrap">
            {THEMES.map((t) => (
              <button
                key={t.label}
                onClick={() =>
                  onChange({
                    theme_config: {
                      ...themeConfig,
                      primaryColor: t.primaryColor,
                      fontColor: t.fontColor,
                      bgColor: t.bgColor,
                    },
                  })
                }
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  themeConfig?.primaryColor === t.primaryColor
                    ? 'border-white scale-110'
                    : 'border-transparent hover:border-gray-400'
                }`}
                style={{ backgroundColor: t.primaryColor }}
                title={t.label}
              />
            ))}
          </div>
        </div>

        {/* Font */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-medium">Font</p>
          <div className="flex gap-2">
            {FONTS.map((f) => (
              <button
                key={f.id}
                onClick={() => onChange({ theme_config: { ...themeConfig, font: f.id } })}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  themeConfig?.font === f.id
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                }`}
                style={{ fontFamily: f.id }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Close */}
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors mt-1">
          ✕
        </button>
      </div>
    </div>
  );
};

export default TemplateSwitcher;
