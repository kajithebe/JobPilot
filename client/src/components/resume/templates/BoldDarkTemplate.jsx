export default function BoldDarkTemplate({ content, themeConfig }) {
  const theme = {
    primaryColor: themeConfig?.primaryColor || '#3b82f6',
    fontColor: themeConfig?.fontColor || '#f9fafb',
    bgColor: themeConfig?.bgColor || '#0f172a',
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
      {/* Header — centered */}
      <div
        className="px-10 py-8 border-b text-center"
        style={{ borderColor: `${theme.primaryColor}40` }}
      >
        <h1
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ color: theme.primaryColor }}
        >
          {content?.personalInfo?.fullName || 'Your Name'}
        </h1>
        <div
          className="flex flex-wrap gap-3 text-xs mt-2 justify-center"
          style={{ color: `${theme.fontColor}80` }}
        >
          {content?.personalInfo?.email && <span>{content.personalInfo.email}</span>}
          {content?.personalInfo?.phone && <span>• {content.personalInfo.phone}</span>}
          {content?.personalInfo?.location && <span>• {content.personalInfo.location}</span>}
          {content?.personalInfo?.linkedin && <span>• {content.personalInfo.linkedin}</span>}
          {content?.personalInfo?.github && <span>• {content.personalInfo.github}</span>}
        </div>
        {content?.personalInfo?.summary && (
          <p
            className="text-xs mt-3 leading-relaxed max-w-xl mx-auto"
            style={{ color: `${theme.fontColor}70` }}
          >
            {content.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="px-10 py-6 space-y-6">
        {/* Experience */}
        {content?.experience?.length > 0 && (
          <div>
            <h2
              className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4"
              style={{ color: theme.primaryColor }}
            >
              Experience
            </h2>
            <div className="space-y-5">
              {content.experience.map((item, i) => (
                <div
                  key={i}
                  className="pl-3 border-l-2"
                  style={{ borderColor: theme.primaryColor }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: theme.fontColor }}>
                        {item.title}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: `${theme.fontColor}60` }}>
                        {item.company}
                        {item.location ? ` — ${item.location}` : ''}
                      </p>
                    </div>
                    <p
                      className="text-[10px] whitespace-nowrap ml-4"
                      style={{ color: `${theme.fontColor}50` }}
                    >
                      {item.startDate}
                      {item.endDate ? ` – ${item.endDate}` : ''}
                    </p>
                  </div>
                  {item.description && (
                    <p
                      className="text-xs mt-1.5 leading-relaxed"
                      style={{ color: `${theme.fontColor}70` }}
                    >
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
            <h2
              className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4"
              style={{ color: theme.primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {content.education.map((item, i) => (
                <div
                  key={i}
                  className="pl-3 border-l-2"
                  style={{ borderColor: theme.primaryColor }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold">
                        {item.degree}
                        {item.field ? ` in ${item.field}` : ''}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: `${theme.fontColor}60` }}>
                        {item.institution}
                      </p>
                      {item.gpa && (
                        <p className="text-[10px]" style={{ color: `${theme.fontColor}50` }}>
                          GPA: {item.gpa}
                        </p>
                      )}
                    </div>
                    <p
                      className="text-[10px] whitespace-nowrap ml-4"
                      style={{ color: `${theme.fontColor}50` }}
                    >
                      {item.startDate}
                      {item.endDate ? ` – ${item.endDate}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {content?.skills?.length > 0 && (
          <div>
            <h2
              className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4"
              style={{ color: theme.primaryColor }}
            >
              Skills
            </h2>
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
            <h2
              className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4"
              style={{ color: theme.primaryColor }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {content.projects.map((item, i) => (
                <div
                  key={i}
                  className="pl-3 border-l-2"
                  style={{ borderColor: theme.primaryColor }}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold">{item.title}</p>
                    {item.url && (
                      <p className="text-[10px] ml-4" style={{ color: `${theme.fontColor}50` }}>
                        {item.url}
                      </p>
                    )}
                  </div>
                  {item.description && (
                    <p
                      className="text-xs mt-1 leading-relaxed"
                      style={{ color: `${theme.fontColor}70` }}
                    >
                      {item.description}
                    </p>
                  )}
                  {item.technologies?.length > 0 && (
                    <p className="text-[10px] mt-1" style={{ color: `${theme.fontColor}50` }}>
                      {item.technologies.join(' · ')}
                    </p>
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
              className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4"
              style={{ color: theme.primaryColor }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {content.certifications.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold">{item.name}</p>
                    <p className="text-[11px]" style={{ color: `${theme.fontColor}60` }}>
                      {item.issuer}
                    </p>
                  </div>
                  <p
                    className="text-[10px] whitespace-nowrap ml-4"
                    style={{ color: `${theme.fontColor}50` }}
                  >
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
