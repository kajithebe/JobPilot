export default function ModernTemplate({ content, themeConfig, sectionOrder }) {
  const theme = {
    primaryColor: themeConfig?.primaryColor || '#2563eb',
    fontColor: themeConfig?.fontColor || '#111827',
    bgColor: themeConfig?.bgColor || '#ffffff',
    font: themeConfig?.font || 'Helvetica, Arial, sans-serif',
  };

  const order = sectionOrder || [
    'personalInfo',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
  ];

  const SectionHeading = ({ title }) => (
    <div className="mb-3">
      <h2
        className="text-xs font-bold uppercase tracking-widest pb-1 border-b"
        style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
      >
        {title}
      </h2>
    </div>
  );

  const renderSection = (sectionKey) => {
    switch (sectionKey) {
      case 'personalInfo':
        return (
          <div
            key="personalInfo"
            className="px-10 py-8 text-white text-center"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <h1 className="text-2xl font-bold mb-1">
              {content?.personalInfo?.fullName || 'Your Name'}
            </h1>
            <div className="flex flex-wrap gap-3 text-xs text-white/80 mt-2 justify-center">
              {content?.personalInfo?.email && <span>{content.personalInfo.email}</span>}
              {content?.personalInfo?.phone && <span>• {content.personalInfo.phone}</span>}
              {content?.personalInfo?.location && <span>• {content.personalInfo.location}</span>}
              {content?.personalInfo?.linkedin && <span>• {content.personalInfo.linkedin}</span>}
              {content?.personalInfo?.github && <span>• {content.personalInfo.github}</span>}
            </div>
            {content?.personalInfo?.summary && (
              <p className="text-xs text-white/70 mt-3 leading-relaxed max-w-xl mx-auto">
                {content.personalInfo.summary}
              </p>
            )}
          </div>
        );

      case 'experience':
        return content?.experience?.length ? (
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
                    <p className="text-[11px] text-gray-400 whitespace-nowrap ml-4">
                      {item.startDate}
                      {item.endDate ? ` – ${item.endDate}` : ''}
                    </p>
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'education':
        return content?.education?.length ? (
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
                    {item.gpa && <p className="text-[11px] text-gray-400">GPA: {item.gpa}</p>}
                  </div>
                  <p className="text-[11px] text-gray-400 whitespace-nowrap ml-4">
                    {item.startDate}
                    {item.endDate ? ` – ${item.endDate}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return content?.skills?.length ? (
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
        ) : null;

      case 'projects':
        return content?.projects?.length ? (
          <div key="projects" className="px-10 py-5">
            <SectionHeading title="Projects" />
            <div className="space-y-3">
              {content.projects.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold">{item.title}</p>
                    {item.url && <p className="text-[11px] text-gray-400 ml-4">{item.url}</p>}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                  )}
                  {item.technologies?.length > 0 && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      {item.technologies.join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'certifications':
        return content?.certifications?.length ? (
          <div key="certifications" className="px-10 py-5">
            <SectionHeading title="Certifications" />
            <div className="space-y-2">
              {content.certifications.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.issuer}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 whitespace-nowrap ml-4">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
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
      {order.map((sectionKey) => renderSection(sectionKey))}
    </div>
  );
}
