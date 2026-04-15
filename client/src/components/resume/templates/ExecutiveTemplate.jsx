export default function ExecutiveTemplate({ content, themeConfig }) {
  const theme = {
    primaryColor: themeConfig?.primaryColor || '#1e3a5f',
    fontColor: themeConfig?.fontColor || '#111827',
    bgColor: themeConfig?.bgColor || '#ffffff',
    font: themeConfig?.font || 'Helvetica, Arial, sans-serif',
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
      {/* Full width banner header — centered */}
      <div className="px-10 py-10 text-white text-center" style={{ backgroundColor: theme.primaryColor }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {content?.personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="w-16 h-0.5 my-3 mx-auto" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
        <div className="flex flex-wrap gap-4 text-xs text-white/70 justify-center">
          {content?.personalInfo?.email && <span>{content.personalInfo.email}</span>}
          {content?.personalInfo?.phone && <span>{content.personalInfo.phone}</span>}
          {content?.personalInfo?.location && <span>{content.personalInfo.location}</span>}
          {content?.personalInfo?.linkedin && <span>{content.personalInfo.linkedin}</span>}
          {content?.personalInfo?.github && <span>{content.personalInfo.github}</span>}
          {content?.personalInfo?.website && <span>{content.personalInfo.website}</span>}
        </div>
        {content?.personalInfo?.summary && (
          <p className="text-xs text-white/60 mt-4 leading-relaxed max-w-2xl mx-auto">
            {content.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Thin accent bar */}
      <div className="h-1" style={{ backgroundColor: `${theme.primaryColor}40` }} />

      {/* Body */}
      <div className="px-10 py-8 space-y-7">
        {/* Experience */}
        {content?.experience?.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: theme.primaryColor }}
              >
                Professional Experience
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: `${theme.primaryColor}30` }} />
            </div>
            <div className="space-y-5">
              {content.experience.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold" style={{ color: theme.primaryColor }}>
                        {item.title}
                      </p>
                      <p className="text-xs font-semibold text-gray-600 mt-0.5">
                        {item.company}
                        {item.location ? ` · ${item.location}` : ''}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-400 whitespace-nowrap ml-4 mt-0.5 font-medium">
                      {item.startDate}
                      {item.endDate ? ` – ${item.endDate}` : ''}
                    </p>
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
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
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: theme.primaryColor }}
              >
                Education
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: `${theme.primaryColor}30` }} />
            </div>
            <div className="space-y-3">
              {content.education.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold" style={{ color: theme.primaryColor }}>
                      {item.degree}
                      {item.field ? ` in ${item.field}` : ''}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.institution}</p>
                    {item.gpa && <p className="text-[11px] text-gray-400 mt-0.5">GPA: {item.gpa}</p>}
                  </div>
                  <p className="text-[11px] text-gray-400 whitespace-nowrap ml-4 mt-0.5">
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
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: theme.primaryColor }}
              >
                Core Competencies
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: `${theme.primaryColor}30` }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${theme.primaryColor}18`,
                    color: theme.primaryColor,
                    border: `1px solid ${theme.primaryColor}40`,
                  }}
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {content?.projects?.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: theme.primaryColor }}
              >
                Key Projects
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: `${theme.primaryColor}30` }} />
            </div>
            <div className="space-y-4">
              {content.projects.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold" style={{ color: theme.primaryColor }}>
                      {item.title}
                    </p>
                    {item.url && <p className="text-[11px] text-gray-400 ml-4">{item.url}</p>}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.technologies?.length > 0 && (
                    <p className="text-[11px] text-gray-400 mt-1">{item.technologies.join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {content?.certifications?.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: theme.primaryColor }}
              >
                Certifications
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: `${theme.primaryColor}30` }} />
            </div>
            <div className="space-y-2">
              {content.certifications.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold" style={{ color: theme.primaryColor }}>
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600">{item.issuer}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 whitespace-nowrap ml-4">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
