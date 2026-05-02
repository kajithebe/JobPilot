import {sanitizeObject} from '../utils/sanitize.js';

// Sanitise all string fields in req.body against XSS
export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};
