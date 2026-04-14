import CVPreview from '../CVPreview.jsx';

export default function ModernTemplate({ content, themeConfig, sectionOrder }) {
  const theme = {
    primaryColor: themeConfig?.primaryColor || '#2563eb',
    fontColor: themeConfig?.fontColor || '#111827',
    bgColor: themeConfig?.bgColor || '#ffffff',
    font: themeConfig?.font || 'Inter, sans-serif',
  };

  return (
    <div
      className="w-[210mm] min-h-[297mm] shadow-2xl"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.fontColor,
        fontFamily: theme.font,
      }}
    >
      {/* Coloured header block */}
      <div className="px-10 py-8 text-white" style={{ backgroundColor: theme.primaryColor }}>
        <h1 className="text-3xl font-bold mb-1">
          {content?.personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-3 text-xs text-white/80 mt-2">
          {content?.personalInfo?.email && <span>{content.personalInfo.email}</span>}
          {content?.personalInfo?.phone && <span>• {content.personalInfo.phone}</span>}
          {content?.personalInfo?.location && <span>• {content.personalInfo.location}</span>}
          {content?.personalInfo?.linkedin && <span>• {content.personalInfo.linkedin}</span>}
          {content?.personalInfo?.github && <span>• {content.personalInfo.github}</span>}
        </div>
        {content?.personalInfo?.summary && (
          <p className="text-xs text-white/70 mt-3 leading-relaxed max-w-xl">
            {content.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Remaining sections via CVPreview */}
      <CVPreview
        content={content}
        themeConfig={themeConfig}
        sectionOrder={sectionOrder.filter((s) => s !== 'personalInfo')}
        template="modern"
      />
    </div>
  );
}
