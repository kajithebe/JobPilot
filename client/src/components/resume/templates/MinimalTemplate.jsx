export default function MinimalTemplate({ content, themeConfig, sectionOrder }) {
  const theme = {
    primaryColor: themeConfig?.primaryColor || '#2563eb',
    fontColor: themeConfig?.fontColor || '#111827',
    bgColor: themeConfig?.bgColor || '#ffffff',
    font: themeConfig?.font || 'Inter, sans-serif',
  };

  return (
    <div
      className="w-[210mm] min-h-[297mm] shadow-2xl px-14 py-12"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.fontColor,
        fontFamily: theme.font,
      }}
    >
      {/* Personal Info */}
      {content?.personalInfo && (
        <div className="mb-10">
          <h1
            className="text-4xl font-light tracking-tight mb-2"
            style={{ color: theme.fontColor }}
          >
            {content.personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-3 text-[10px] text-gray-400">
            {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
            {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
            {content.personalInfo.location && <span>{content.personalInfo.location}</span>}
            {content.personalInfo.linkedin && <span>{content.personalInfo.linkedin}</span>}
            {content.personalInfo.github && <span>{content.personalInfo.github}</span>}
          </div>
          {content.personalInfo.summary && (
            <p className="text-xs text-gray-500 mt-4 leading-relaxed max-w-lg">
              {content.personalInfo.summary}
            </p>
          )}
        </div>
      )}

      {/* Experience */}
      {content?.experience?.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: theme.primaryColor }}
          >
            Experience
          </h2>
          <div className="space-y-5">
            {content.experience.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-[9px] text-gray-400">
                    {item.startDate}
                    {item.endDate ? ` – ${item.endDate}` : ''}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {item.company}
                  {item.location ? `, ${item.location}` : ''}
                </p>
                {item.description && (
                  <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {content?.education?.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: theme.primaryColor }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {content.education.map((item, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <p className="text-sm font-medium">
                    {item.degree}
                    {item.field ? ` in ${item.field}` : ''}
                  </p>
                  <p className="text-[10px] text-gray-400">{item.institution}</p>
                  {item.gpa && <p className="text-[9px] text-gray-400">GPA: {item.gpa}</p>}
                </div>
                <p className="text-[9px] text-gray-400">
                  {item.startDate}
                  {item.endDate ? ` – ${item.endDate}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {content?.skills?.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: theme.primaryColor }}
          >
            Skills
          </h2>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            {content.skills.map((s) => (typeof s === 'string' ? s : s.name)).join(' · ')}
          </p>
        </div>
      )}

      {/* Projects */}
      {content?.projects?.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: theme.primaryColor }}
          >
            Projects
          </h2>
          <div className="space-y-4">
            {content.projects.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.url && <p className="text-[9px] text-gray-400">{item.url}</p>}
                </div>
                {item.description && (
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
                {item.technologies?.length > 0 && (
                  <p className="text-[9px] text-gray-400 mt-1">{item.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {content?.certifications?.length > 0 && (
        <div>
          <h2
            className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: theme.primaryColor }}
          >
            Certifications
          </h2>
          <div className="space-y-2">
            {content.certifications.map((item, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.issuer}</p>
                </div>
                <p className="text-[9px] text-gray-400">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
