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
