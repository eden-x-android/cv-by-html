import React from 'react';
import './ProjectLinksInput.css';

// Editable list of { label, url } rows for a project. Rows are not
// reorderable and inputs are controlled, so index keys are safe here.
const ProjectLinksInput = ({ links = [], onChange }) => {
    const handleLinkChange = (index, field, value) => {
        onChange(links.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
    };

    const handleAddLink = () => {
        onChange([...links, { label: '', url: '' }]);
    };

    const handleRemoveLink = (index) => {
        onChange(links.filter((_, i) => i !== index));
    };

    return (
        <div className="project-links-input">
            {links.map((link, index) => (
                <div className="project-link-row" key={index}>
                    <input
                        type="text"
                        className="project-link-label"
                        placeholder="Label (e.g. Google Play)"
                        value={link.label}
                        onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="URL (https://...)"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    />
                    <button type="button" className="project-link-remove" onClick={() => handleRemoveLink(index)}>X</button>
                </div>
            ))}
            <button type="button" onClick={handleAddLink}>Add Link</button>
        </div>
    );
};

export default ProjectLinksInput;
