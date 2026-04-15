const CVPreview = ({ content, template, themeConfig, sectionOrder }) => {
  const theme = {
    primaryColor: themeConfig?.primaryColor || '#2563eb',
    fontColor: themeConfig?.fontColor || '#111827',
    bgColor: themeConfig?.bgColor || '#ffffff',
  };

  return (
    <div className="w-1/2 overflow-y-auto bg-gray-200 flex flex-col items-center py-8">
      {/* A4 paper */}
      <div
        className="w-[210mm] min-h-[297mm] shadow-2xl"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.fontColor,
          fontFamily: themeConfig?.font || 'Inter, sans-serif',
        }}
      >
        {sectionOrder.map((sectionKey) => (
          <SectionRenderer
            key={sectionKey}
            sectionKey={sectionKey}
            content={content}
            theme={theme}
            template={template}
          />
        ))}
      </div>
    </div>
  );
};

// ── Route each section to the right renderer ──────────────────────────

const SectionRenderer = ({ sectionKey, content, theme, template }) => {
  switch (sectionKey) {
    case 'personalInfo':
      return <PersonalInfoPreview data={content.personalInfo} theme={theme} />;
    case 'experience':
      return <ExperiencePreview data={content.experience} theme={theme} />;
    case 'education':
      return <EducationPreview data={content.education} theme={theme} />;
    case 'skills':
      return <SkillsPreview data={content.skills} theme={theme} />;
    case 'projects':
      return <ProjectsPreview data={content.projects} theme={theme} />;
    case 'certifications':
      return <CertificationsPreview data={content.certifications} theme={theme} />;
    default:
      return null;
  }
};

// ── Section heading shared component ─────────────────────────────────

const SectionHeading = ({ title, theme }) => (
  <div className="mb-3">
    <h2
      className="text-sm font-bold uppercase tracking-widest pb-1 border-b"
      style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
    >
      {title}
    </h2>
  </div>
);

// ── Personal Info ─────────────────────────────────────────────────────

const PersonalInfoPreview = ({ data, theme }) => {
  if (!data?.fullName) return null;
  return (
    <div
      className="px-10 py-8 text-center"
      style={{ borderBottom: `3px solid ${theme.primaryColor}` }}
    >
      <h1 className="text-3xl font-bold mb-1" style={{ color: theme.primaryColor }}>
        {data.fullName}
      </h1>
      <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 mt-2">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>• {data.phone}</span>}
        {data.location && <span>• {data.location}</span>}
        {data.linkedin && <span>• {data.linkedin}</span>}
        {data.github && <span>• {data.github}</span>}
        {data.website && <span>• {data.website}</span>}
      </div>
      {data.summary && (
        <p className="text-xs text-gray-600 mt-3 max-w-xl mx-auto leading-relaxed">
          {data.summary}
        </p>
      )}
    </div>
  );
};

// ── Experience ────────────────────────────────────────────────────────

const ExperiencePreview = ({ data, theme }) => {
  if (!data?.length) return null;
  return (
    <div className="px-10 py-5">
      <SectionHeading title="Experience" theme={theme} />
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
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
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Education ─────────────────────────────────────────────────────────

const EducationPreview = ({ data, theme }) => {
  if (!data?.length) return null;
  return (
    <div className="px-10 py-5">
      <SectionHeading title="Education" theme={theme} />
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold">
                {item.degree} {item.field ? `in ${item.field}` : ''}
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
};

// ── Skills ────────────────────────────────────────────────────────────

const SkillsPreview = ({ data, theme }) => {
  if (!data?.length) return null;
  return (
    <div className="px-10 py-5">
      <SectionHeading title="Skills" theme={theme} />
      <div className="flex flex-wrap gap-2">
        {data.map((skill, index) => (
          <span
            key={index}
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
};

// ── Projects ──────────────────────────────────────────────────────────

const ProjectsPreview = ({ data, theme }) => {
  if (!data?.length) return null;
  return (
    <div className="px-10 py-5">
      <SectionHeading title="Projects" theme={theme} />
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold">{item.title}</p>
              {item.url && <p className="text-xs text-gray-400 ml-4">{item.url}</p>}
            </div>
            {item.description && (
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</p>
            )}
            {item.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.technologies.map((tech, i) => (
                  <span key={i} className="text-xs text-gray-400">
                    {tech}
                    {i < item.technologies.length - 1 ? ' •' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Certifications ────────────────────────────────────────────────────

const CertificationsPreview = ({ data, theme }) => {
  if (!data?.length) return null;
  return (
    <div className="px-10 py-5">
      <SectionHeading title="Certifications" theme={theme} />
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
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
};

export default CVPreview;
