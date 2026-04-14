export default function ClassicTemplate({ content, themeConfig, sectionOrder }) {
  const theme = {
    primaryColor: themeConfig?.primaryColor || '#2563eb',
    fontColor: themeConfig?.fontColor || '#111827',
    bgColor: themeConfig?.bgColor || '#ffffff',
    font: themeConfig?.font || 'Inter, sans-serif',
  };

  const leftSections = ['personalInfo', 'skills', 'certifications'];
  const rightSections = ['experience', 'education', 'projects'];

  return (
    <div
      className="w-[210mm] min-h-[297mm] shadow-2xl flex"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.fontColor,
        fontFamily: theme.font,
      }}
    >
      {/* Left column */}
      <div
        className="w-[35%] min-h-full px-6 py-8"
        style={{ backgroundColor: `${theme.primaryColor}12` }}
      >
        {/* Name */}
        <div className="mb-6">
          <h1
            className="text-xl font-bold leading-tight mb-1"
            style={{ color: theme.primaryColor }}
          >
            {content?.personalInfo?.fullName || 'Your Name'}
          </h1>
          <div className="space-y-1 mt-3">
            {content?.personalInfo?.email && (
              <p className="text-[10px] text-gray-600 break-all">{content.personalInfo.email}</p>
            )}
            {content?.personalInfo?.phone && (
              <p className="text-[10px] text-gray-600">{content.personalInfo.phone}</p>
            )}
            {content?.personalInfo?.location && (
              <p className="text-[10px] text-gray-600">{content.personalInfo.location}</p>
            )}
            {content?.personalInfo?.linkedin && (
              <p className="text-[10px] text-gray-600 break-all">{content.personalInfo.linkedin}</p>
            )}
            {content?.personalInfo?.github && (
              <p className="text-[10px] text-gray-600 break-all">{content.personalInfo.github}</p>
            )}
          </div>
        </div>

        {/* Summary */}
        {content?.personalInfo?.summary && (
          <div className="mb-6">
            <h2
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
            >
              About
            </h2>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              {content.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {content?.skills?.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {content.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[9px] px-1.5 py-0.5 rounded"
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

        {/* Certifications */}
        {content?.certifications?.length > 0 && (
          <div>
            <h2
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {content.certifications.map((cert, i) => (
                <div key={i}>
                  <p className="text-[10px] font-semibold">{cert.name}</p>
                  <p className="text-[9px] text-gray-500">
                    {cert.issuer} · {cert.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column */}
      <div className="flex-1 px-6 py-8">
        {/* Experience */}
        {content?.experience?.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b mb-3"
              style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {content.experience.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-[10px] text-gray-500">
                        {item.company}
                        {item.location ? ` — ${item.location}` : ''}
                      </p>
                    </div>
                    <p className="text-[9px] text-gray-400 whitespace-nowrap ml-4">
                      {item.startDate}
                      {item.endDate ? ` – ${item.endDate}` : ''}
                    </p>
                  </div>
                  {item.description && (
                    <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
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
          <div className="mb-6">
            <h2
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b mb-3"
              style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {content.education.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold">
                      {item.degree}
                      {item.field ? ` in ${item.field}` : ''}
                    </p>
                    <p className="text-[10px] text-gray-500">{item.institution}</p>
                    {item.gpa && <p className="text-[9px] text-gray-400">GPA: {item.gpa}</p>}
                  </div>
                  <p className="text-[9px] text-gray-400 whitespace-nowrap ml-4">
                    {item.startDate}
                    {item.endDate ? ` – ${item.endDate}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {content?.projects?.length > 0 && (
          <div>
            <h2
              className="text-[10px] font-bold uppercase tracking-widest pb-1 border-b mb-3"
              style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
            >
              Projects
            </h2>
            <div className="space-y-3">
              {content.projects.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold">{item.title}</p>
                    {item.url && <p className="text-[9px] text-gray-400 ml-4">{item.url}</p>}
                  </div>
                  {item.description && (
                    <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.technologies.map((tech, j) => (
                        <span key={j} className="text-[9px] text-gray-400">
                          {tech}
                          {j < item.technologies.length - 1 ? ' •' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
