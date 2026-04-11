import PersonalInfoForm from './PersonalInfoForm.jsx';
import SectionBlock from './SectionBlock.jsx';

const SECTION_LABELS = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
};

const EditorPanel = ({ content, sectionOrder, onChange }) => {
  const reorderableSections = sectionOrder.filter((s) => s !== 'personalInfo');

  const handlePersonalInfoChange = (personalInfo) => {
    onChange({ ...content, personalInfo }, sectionOrder);
  };

  const handleSectionChange = (sectionKey, value) => {
    onChange({ ...content, [sectionKey]: value }, sectionOrder);
  };

  const moveSection = (index, direction) => {
    const sections = [...reorderableSections];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    [sections[index], sections[targetIndex]] = [sections[targetIndex], sections[index]];
    const newOrder = ['personalInfo', ...sections];
    onChange(content, newOrder);
  };

  return (
    <div className="w-1/2 overflow-y-auto bg-[#0f1629] border-r border-gray-800">
      <div className="p-6 space-y-4">
        {/* Personal Info — fixed, always on top */}
        <PersonalInfoForm data={content.personalInfo} onChange={handlePersonalInfoChange} />

        {/* Reorderable sections */}
        {reorderableSections.map((sectionKey, index) => (
          <SectionBlock
            key={sectionKey}
            sectionKey={sectionKey}
            label={SECTION_LABELS[sectionKey]}
            data={content[sectionKey]}
            onChange={(value) => handleSectionChange(sectionKey, value)}
            onMoveUp={index > 0 ? () => moveSection(index, -1) : null}
            onMoveDown={index < reorderableSections.length - 1 ? () => moveSection(index, 1) : null}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorPanel;
