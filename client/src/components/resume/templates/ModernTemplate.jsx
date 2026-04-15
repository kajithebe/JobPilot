export default function ModernTemplate({ content, themeConfig, sectionOrder }) {
  const theme = {
    primaryColor: themeConfig?.primaryColor || '#2563eb',
    fontColor: themeConfig?.fontColor || '#111827',
    bgColor: themeConfig?.bgColor || '#ffffff',
    font: themeConfig?.font || 'Inter, sans-serif',
  };

  const SectionHeading = ({ title }) => (
    <div className="mb-3">
      <h2
        className="text-sm font-bold uppercase tracking-widest pb-1 border-b"
        style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
      >
        {title}
      </h2>
    </div>
  );

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

      {sectionOrder
        .filter((s) => s !== 'personalInfo')
        .map((sectionKey) => {
          switch (sectionKey) {
            case 'experience':
              if (!content?.experience?.length) return null;
              return (
                <div key="experience" className="px-10 py-5">
                  <SectionHeading title="Experience" />
                  <div className="space-y-4">
                    {content.experience.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold">{item.title}</p>
                            <p className="text-xs text-gray-500">
                              {item.company}
                              {item.location ? ` — ${item.location}` : ''}
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                            {item.startDate}
                            {item.endDate ? ` – ${item.endDate}` : ''}
                          </p>
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'education':
              if (!content?.education?.length) return null;
              return (
                <div key="education" className="px-10 py-5">
                  <SectionHeading title="Education" />
                  <div className="space-y-3">
                    {content.education.map((item, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold">
                            {item.degree}
                            {item.field ? ` in ${item.field}` : ''}
                          </p>
                          <p className="text-xs text-gray-500">{item.institution}</p>
                          {item.gpa && <p className="text-xs text-gray-400">GPA: {item.gpa}</p>}
                        </div>
                        <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {item.startDate}
                          {item.endDate ? ` – ${item.endDate}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'skills':
              if (!content?.skills?.length) return null;
              return (
                <div key="skills" className="px-10 py-5">
                  <SectionHeading title="Skills" />
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
              );

            case 'projects':
              if (!content?.projects?.length) return null;
              return (
                <div key="projects" className="px-10 py-5">
                  <SectionHeading title="Projects" />
                  <div className="space-y-3">
                    {content.projects.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold">{item.title}</p>
                          {item.url && <p className="text-xs text-gray-400 ml-4">{item.url}</p>}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        {item.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.technologies.map((tech, j) => (
                              <span key={j} className="text-xs text-gray-400">
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
              );

            case 'certifications':
              if (!content?.certifications?.length) return null;
              return (
                <div key="certifications" className="px-10 py-5">
                  <SectionHeading title="Certifications" />
                  <div className="space-y-2">
                    {content.certifications.map((item, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.issuer}</p>
                        </div>
                        <p className="text-xs text-gray-400 whitespace-nowrap ml-4">{item.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
    </div>
  );
}
