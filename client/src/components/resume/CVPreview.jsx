import { useRef, useEffect, useState } from 'react';
import TemplateRenderer from './TemplateRenderer.jsx';

const A4_WIDTH = 794; // 210mm at 96dpi

const CVPreview = ({ content, template, themeConfig, sectionOrder }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const available = containerRef.current.clientWidth - 48; // 24px padding each side
      setScale(Math.min(1, available / A4_WIDTH));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-1/2 overflow-y-auto bg-gray-200 flex flex-col items-center py-8"
    >
      <div style={{ zoom: scale }}>
        <TemplateRenderer
          content={content}
          template={template}
          themeConfig={themeConfig}
          sectionOrder={sectionOrder}
        />
      </div>
    </div>
  );
};

export default CVPreview;
