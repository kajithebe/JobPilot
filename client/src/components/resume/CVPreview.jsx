import TemplateRenderer from './TemplateRenderer.jsx';

const CVPreview = ({ content, template, themeConfig, sectionOrder }) => {
  return (
    <div className="w-1/2 overflow-y-auto bg-gray-200 flex flex-col items-center py-8">
      <TemplateRenderer
        content={content}
        template={template}
        themeConfig={themeConfig}
        sectionOrder={sectionOrder}
      />
    </div>
  );
};

export default CVPreview;
