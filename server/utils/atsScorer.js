// Common English stopwords to strip from keyword extraction
const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'shall',
  'can',
  'need',
  'dare',
  'this',
  'that',
  'these',
  'those',
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'what',
  'which',
  'who',
  'whom',
  'my',
  'your',
  'his',
  'her',
  'its',
  'our',
  'their',
  'as',
  'if',
  'then',
  'than',
  'so',
  'yet',
  'both',
  'not',
  'no',
  'nor',
  'up',
  'out',
  'about',
  'into',
  'through',
  'during',
  'also',
  'just',
  'more',
  'other',
  'such',
  'each',
  'how',
  'all',
  'any',
]);

// Extract and normalise keywords from a block of text
export const extractKeywords = (text) => {
  if (!text || typeof text !== 'string') return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, ' ') // keep + and # for C++, C#, etc.
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
};

// Extract all text from resume JSONB content
export const extractResumeText = (content) => {
  const parts = [];

  // personalInfo
  if (content.personalInfo) {
    const p = content.personalInfo;
    parts.push(p.summary || '');
  }

  // experience
  if (Array.isArray(content.experience)) {
    content.experience.forEach((exp) => {
      parts.push(exp.title || '');
      parts.push(exp.company || '');
      parts.push(exp.description || '');
    });
  }

  // education
  if (Array.isArray(content.education)) {
    content.education.forEach((edu) => {
      parts.push(edu.degree || '');
      parts.push(edu.field || '');
      parts.push(edu.institution || '');
    });
  }

  // skills
  if (Array.isArray(content.skills)) {
    content.skills.forEach((skill) => {
      parts.push(typeof skill === 'string' ? skill : skill.name || '');
    });
  }

  // projects
  if (Array.isArray(content.projects)) {
    content.projects.forEach((proj) => {
      parts.push(proj.title || '');
      parts.push(proj.description || '');
      parts.push((proj.technologies || []).join(' '));
    });
  }

  // certifications
  if (Array.isArray(content.certifications)) {
    content.certifications.forEach((cert) => {
      parts.push(cert.name || '');
      parts.push(cert.issuer || '');
    });
  }

  return parts.join(' ');
};

// Category weights — skills matter most
const WEIGHTS = {
  skills: 1.5,
  experience: 1.2,
  education: 1.0,
  projects: 1.1,
  certifications: 1.0,
  personalInfo: 0.8,
};

// Extract keywords per category with weights applied
const extractWeightedKeywords = (content) => {
  const weighted = {};

  const addKeywords = (text, category) => {
    const weight = WEIGHTS[category] || 1.0;
    extractKeywords(text).forEach((kw) => {
      weighted[kw] = (weighted[kw] || 0) + weight;
    });
  };

  if (content.personalInfo) {
    addKeywords(content.personalInfo.summary || '', 'personalInfo');
  }

  if (Array.isArray(content.skills)) {
    content.skills.forEach((skill) => {
      addKeywords(
        typeof skill === 'string' ? skill : skill.name || '',
        'skills'
      );
    });
  }

  if (Array.isArray(content.experience)) {
    content.experience.forEach((exp) => {
      addKeywords(`${exp.title} ${exp.description || ''}`, 'experience');
    });
  }

  if (Array.isArray(content.education)) {
    content.education.forEach((edu) => {
      addKeywords(`${edu.degree} ${edu.field || ''}`, 'education');
    });
  }

  if (Array.isArray(content.projects)) {
    content.projects.forEach((proj) => {
      addKeywords(
        `${proj.title} ${proj.description || ''} ${(proj.technologies || []).join(' ')}`,
        'projects'
      );
    });
  }

  if (Array.isArray(content.certifications)) {
    content.certifications.forEach((cert) => {
      addKeywords(`${cert.name} ${cert.issuer || ''}`, 'certifications');
    });
  }

  return weighted;
};

// Main ATS scoring function
export const scoreResume = (resumeContent, jobDescription) => {
  const jobKeywords = extractKeywords(jobDescription);
  const resumeWeighted = extractWeightedKeywords(resumeContent);

  if (jobKeywords.length === 0) {
    return {score: 0, matched: [], missing: [], total: 0};
  }

  const matched = [];
  const missing = [];

  jobKeywords.forEach((kw) => {
    if (resumeWeighted[kw]) {
      matched.push({keyword: kw, weight: resumeWeighted[kw]});
    } else {
      missing.push(kw);
    }
  });

  // Score = weighted matched keywords / total job keywords * 100
  const weightedMatchSum = matched.reduce((sum, m) => sum + m.weight, 0);
  const maxPossibleSum =
    jobKeywords.length * Math.max(...Object.values(WEIGHTS));
  const score = Math.min(
    100,
    Math.round((weightedMatchSum / maxPossibleSum) * 100)
  );

  return {
    score,
    matched: matched.sort((a, b) => b.weight - a.weight),
    missing: [...new Set(missing)],
    total: jobKeywords.length,
  };
};
