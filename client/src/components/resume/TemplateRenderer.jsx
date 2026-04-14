import ModernTemplate from './templates/ModernTemplate.jsx';
import ClassicTemplate from './templates/ClassicTemplate.jsx';
import MinimalTemplate from './templates/MinimalTemplate.jsx';
import BoldDarkTemplate from './templates/BoldDarkTemplate.jsx';
import ExecutiveTemplate from './templates/ExecutiveTemplate.jsx';

// Maps template ID strings to components
// BACKEND: template ID must match one of these keys exactly
const TEMPLATE_MAP = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  'bold-dark': BoldDarkTemplate,
  executive: ExecutiveTemplate,
};

export default function TemplateRenderer({ content, template, themeConfig, sectionOrder }) {
  // Falls back to Modern if template ID is not recognised
  const TemplateComponent = TEMPLATE_MAP[template] || ModernTemplate;

  return (
    <TemplateComponent content={content} themeConfig={themeConfig} sectionOrder={sectionOrder} />
  );
}
