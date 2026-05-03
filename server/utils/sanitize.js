import xss from 'xss';

export const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return xss(value.trim());
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  // Handle arrays — sanitise each element but preserve array structure
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === 'string') return sanitizeString(item);
      if (typeof item === 'object') return sanitizeObject(item);
      return item;
    });
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};
