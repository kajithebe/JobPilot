import {parseJobPosting} from '../utils/jobParser.js';

// POST /api/import/url
export const importFromUrl = async (req, res) => {
  const {url} = req.body;

  if (!url) {
    return res.status(400).json({error: 'URL is required'});
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({error: 'Invalid URL'});
  }

  try {
    const result = await parseJobPosting(url);
    res.json(result);
  } catch (err) {
    console.error('Import error:', err.message);
    res.status(422).json({
      error: 'Could not fetch or parse the job posting',
      detail: err.message,
    });
  }
};
