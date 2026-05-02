import xss from 'xss';

// Sanitise a single string value
export const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return xss(value.trim());
};

// Recursively sanitise all string values in an object
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};
