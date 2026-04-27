import PDFDocument from 'pdfkit';

const FONTS = {
  'Inter, sans-serif': 'Helvetica',
  'Merriweather, serif': 'Times-Roman',
  'Roboto Mono, monospace': 'Courier',
};

const DEFAULT_PRIMARY = '#2563eb';

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
};

export const generateResumePDF = (resume) => {
  const doc = new PDFDocument({margin: 0, size: 'A4'});

  const content = resume.content || {};
  const themeConfig = resume.theme_config || {};
  const sectionOrder = resume.section_order || [
    'personalInfo',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
  ];

  const primaryHex = themeConfig.primaryColor || DEFAULT_PRIMARY;
  const primaryRgb = hexToRgb(primaryHex);
  const fontFamily = FONTS[themeConfig.font] || 'Helvetica';
  const boldFont =
    fontFamily === 'Helvetica'
      ? 'Helvetica-Bold'
      : fontFamily === 'Times-Roman'
        ? 'Times-Bold'
        : 'Courier-Bold';

  const PAGE_WIDTH = doc.page.width;
  const MARGIN = 48;
  const CONTENT_W = PAGE_WIDTH - MARGIN * 2;

  // ── Header block ──────────────────────────────────────────────────
  const info = content.personalInfo || {};

  doc.rect(0, 0, PAGE_WIDTH, 110).fill(primaryRgb);

  doc
    .fillColor('white')
    .font(boldFont)
    .fontSize(22)
    .text(info.fullName || 'Your Name', MARGIN, 28, {
      width: CONTENT_W,
      align: 'center',
    });

  const contactParts = [
    info.email,
    info.phone,
    info.location,
    info.linkedin,
    info.github,
  ].filter(Boolean);

  doc
    .font(fontFamily)
    .fontSize(9)
    .fillColor('rgba(255,255,255,0.85)')
    .text(contactParts.join('  ·  '), MARGIN, 58, {
      width: CONTENT_W,
      align: 'center',
    });

  if (info.summary) {
    doc
      .fontSize(9)
      .fillColor('rgba(255,255,255,0.75)')
      .text(info.summary, MARGIN, 76, {width: CONTENT_W, align: 'center'});
  }

  let y = 126;

  // ── Section heading helper ────────────────────────────────────────
  const sectionHeading = (title) => {
    if (y > doc.page.height - 80) {
      doc.addPage({margin: 0, size: 'A4'});
      y = 40;
    }

    doc
      .font(boldFont)
      .fontSize(9)
      .fillColor(primaryRgb)
      .text(title.toUpperCase(), MARGIN, y, {width: CONTENT_W});

    y += 14;

    doc
      .moveTo(MARGIN, y)
      .lineTo(MARGIN + CONTENT_W, y)
      .strokeColor(primaryRgb)
      .lineWidth(0.5)
      .stroke();

    y += 8;
  };

  // ── Check page overflow ───────────────────────────────────────────
  const checkOverflow = (needed = 40) => {
    if (y + needed > doc.page.height - 40) {
      doc.addPage({margin: 0, size: 'A4'});
      y = 40;
    }
  };

  // ── Render each section in sectionOrder ──────────────────────────
  for (const sectionKey of sectionOrder) {
    if (sectionKey === 'personalInfo') continue;

    if (sectionKey === 'experience' && content.experience?.length > 0) {
      sectionHeading('Experience');
      for (const item of content.experience) {
        checkOverflow(50);
        doc
          .font(boldFont)
          .fontSize(10)
          .fillColor('#111827')
          .text(item.title || '', MARGIN, y, {
            continued: true,
            width: CONTENT_W - 80,
          });
        doc
          .font(fontFamily)
          .fontSize(9)
          .fillColor('#6b7280')
          .text(
            `${item.startDate || ''}${item.endDate ? ` – ${item.endDate}` : ''}`,
            {align: 'right'}
          );
        y = doc.y + 2;
        doc
          .font(fontFamily)
          .fontSize(9)
          .fillColor('#6b7280')
          .text(
            `${item.company || ''}${item.location ? ` — ${item.location}` : ''}`,
            MARGIN,
            y
          );
        y = doc.y + 3;
        if (item.description) {
          doc
            .font(fontFamily)
            .fontSize(9)
            .fillColor('#374151')
            .text(item.description, MARGIN, y, {width: CONTENT_W});
          y = doc.y + 3;
        }
        y += 8;
      }
      y += 4;
    }

    if (sectionKey === 'education' && content.education?.length > 0) {
      sectionHeading('Education');
      for (const item of content.education) {
        checkOverflow(40);
        const degreeText = `${item.degree || ''}${item.field ? ` in ${item.field}` : ''}`;
        doc
          .font(boldFont)
          .fontSize(10)
          .fillColor('#111827')
          .text(degreeText, MARGIN, y, {
            continued: true,
            width: CONTENT_W - 80,
          });
        doc
          .font(fontFamily)
          .fontSize(9)
          .fillColor('#6b7280')
          .text(
            `${item.startDate || ''}${item.endDate ? ` – ${item.endDate}` : ''}`,
            {align: 'right'}
          );
        y = doc.y + 2;
        doc
          .font(fontFamily)
          .fontSize(9)
          .fillColor('#6b7280')
          .text(item.institution || '', MARGIN, y);
        y = doc.y + 3;
        if (item.gpa) {
          doc
            .font(fontFamily)
            .fontSize(9)
            .fillColor('#6b7280')
            .text(`GPA: ${item.gpa}`, MARGIN, y);
          y = doc.y + 3;
        }
        y += 8;
      }
      y += 4;
    }

    if (sectionKey === 'skills' && content.skills?.length > 0) {
      sectionHeading('Skills');
      checkOverflow(20);
      const skillText = content.skills
        .map((s) => (typeof s === 'string' ? s : s.name))
        .join('  ·  ');
      doc
        .font(fontFamily)
        .fontSize(9)
        .fillColor('#374151')
        .text(skillText, MARGIN, y, {width: CONTENT_W});
      y = doc.y + 12;
    }

    if (sectionKey === 'projects' && content.projects?.length > 0) {
      sectionHeading('Projects');
      for (const item of content.projects) {
        checkOverflow(40);
        doc
          .font(boldFont)
          .fontSize(10)
          .fillColor('#111827')
          .text(item.title || '', MARGIN, y);
        y = doc.y + 2;
        if (item.technologies?.length > 0) {
          doc
            .font(fontFamily)
            .fontSize(9)
            .fillColor('#6b7280')
            .text(item.technologies.join(' · '), MARGIN, y);
          y = doc.y + 3;
        }
        if (item.description) {
          doc
            .font(fontFamily)
            .fontSize(9)
            .fillColor('#374151')
            .text(item.description, MARGIN, y, {width: CONTENT_W});
          y = doc.y + 3;
        }
        if (item.url) {
          doc
            .font(fontFamily)
            .fontSize(9)
            .fillColor('#6b7280')
            .text(item.url, MARGIN, y);
          y = doc.y + 3;
        }
        y += 8;
      }
      y += 4;
    }

    if (sectionKey === 'certifications' && content.certifications?.length > 0) {
      sectionHeading('Certifications');
      for (const item of content.certifications) {
        checkOverflow(30);
        doc
          .font(boldFont)
          .fontSize(10)
          .fillColor('#111827')
          .text(item.name || '', MARGIN, y, {
            continued: true,
            width: CONTENT_W - 80,
          });
        doc
          .font(fontFamily)
          .fontSize(9)
          .fillColor('#6b7280')
          .text(item.date || '', {align: 'right'});
        y = doc.y + 2;
        if (item.issuer) {
          doc
            .font(fontFamily)
            .fontSize(9)
            .fillColor('#6b7280')
            .text(item.issuer, MARGIN, y);
          y = doc.y + 3;
        }
        y += 8;
      }
    }
  }

  doc.end();
  return doc;
};
