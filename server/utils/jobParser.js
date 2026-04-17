import axios from 'axios';
import * as cheerio from 'cheerio';

// Fetch raw HTML from a URL
export const fetchHTML = async (url) => {
  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  return cheerio.load(response.data);
};

// Clean and normalise extracted text
export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\r\n\t]/g, ' ')
    .trim();
};

// Extract domain name from URL for fallback company name
export const extractDomain = (url) => {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace('www.', '').split('.');
    const domain = parts[0];
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return '';
  }
};

// Parser Step 1: Extract from JSON-LD structured data
export const extractFromJSONLD = ($) => {
  const scripts = $('script[type="application/ld+json"]');
  let result = null;

  scripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).html());

      // Handle both single object and @graph array
      const items = data['@graph'] ? data['@graph'] : [data];

      for (const item of items) {
        if (item['@type'] === 'JobPosting') {
          result = {
            title: cleanText(item.title || ''),
            company: cleanText(item.hiringOrganization?.name || ''),
            location: cleanText(
              typeof item.jobLocation === 'string'
                ? item.jobLocation
                : item.jobLocation?.address?.addressLocality ||
                    item.jobLocation?.address?.addressRegion ||
                    ''
            ),
            description: cleanText(item.description || ''),
            source: 'json-ld',
          };
          return false; // break each loop
        }
      }
    } catch {}
  });

  return result;
};
