import React, { useState } from 'react';
import LinkableTextarea from './LinkableTextarea';
import ProjectFormItem from './ProjectFormItem';
import { createId } from '../utils/cvSchema';
import './CVForm.css';

const EMPTY_PROJECT = { name: '', overview: '', responsibilities: [], meta: [], links: [] };

// Editor for CV schema v2. Page breaks are not part of the CV data: they come
// from `pageBreaks` (browser storage) and change through their own callbacks.
const CVForm = ({ data, onChange, pageBreaks, onSectionBreakChange, onItemBreakChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [draggedItem, setDraggedItem] = useState({ section: null, index: null });
    const [collapsedSections, setCollapsedSections] = useState({});

    const avatar = data.personalInfo.avatar ?? '';
    const hasEmbeddedAvatar = avatar.startsWith('data:');

    const handleDragStart = (e, section, index) => {
        setDraggedItem({ section, index });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, section, index) => {
        e.preventDefault();
        if (draggedItem.section === section && draggedItem.index !== null && draggedItem.index !== index) {
            const newArray = [...data[section]];
            const [movedItem] = newArray.splice(draggedItem.index, 1);
            newArray.splice(index, 0, movedItem);
            onChange(section, null, newArray);
        }
        setDraggedItem({ section: null, index: null });
    };

    const handleDragEnd = () => {
        setDraggedItem({ section: null, index: null });
    };

    const itemClass = (base, section, index) =>
        draggedItem.section === section && draggedItem.index === index ? `${base} is-dragging` : base;

    const dragProps = (section, index) => ({
        draggable: true,
        onDragStart: (e) => handleDragStart(e, section, index),
        onDragOver: handleDragOver,
        onDrop: (e) => handleDrop(e, section, index),
        onDragEnd: handleDragEnd,
    });

    const handleChange = (section, field, value) => {
        onChange(section, field, value);
    };

    const handleItemChange = (section, index, field, value) => {
        const newArray = data[section].map((item, i) => (i === index ? { ...item, [field]: value } : item));
        onChange(section, null, newArray);
    };

    const handleItemReplace = (section, index, newItem) => {
        const newArray = data[section].map((item, i) => (i === index ? newItem : item));
        onChange(section, null, newArray);
    };

    const handleSimpleArrayChange = (section, index, value) => {
        const newArray = data[section].map((item, i) => (i === index ? value : item));
        onChange(section, null, newArray);
    };

    const handleAddItem = (section, item, insertAtTop = false) => {
        const newArray = insertAtTop ? [item, ...data[section]] : [...data[section], item];
        onChange(section, null, newArray);
    };

    const handleRemoveItem = (section, index) => {
        onChange(section, null, data[section].filter((_, i) => i !== index));
    };

    const isSectionOpen = (section) => !collapsedSections[section];

    const handleToggleSection = (section) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Collapsing only hides the editor fields; the CV preview is unaffected.
    const renderSectionHeader = (title, section, hasPageBreakOption = true) => (
        <div className="section-header">
            <button
                type="button"
                className="section-toggle"
                aria-expanded={isSectionOpen(section)}
                onClick={() => handleToggleSection(section)}
            >
                <span className="section-toggle-icon">{isSectionOpen(section) ? '▾' : '▸'}</span>
                <h2>{title}</h2>
            </button>
            {hasPageBreakOption && (
                <label>
                    <input
                        type="checkbox"
                        checked={pageBreaks.sections[section] || false}
                        onChange={(e) => onSectionBreakChange(section, e.target.checked)}
                    />
                    Start on New Page
                </label>
            )}
        </div>
    );

    const renderItemOptions = (section, index, item) => (
        <div className="item-options">
            <label>
                <input
                    type="checkbox"
                    checked={pageBreaks.items[item.id] || false}
                    onChange={(e) => onItemBreakChange(item.id, e.target.checked)}
                />
                Page Break After
            </label>
            <button onClick={() => handleRemoveItem(section, index)}>Remove</button>
        </div>
    );

    return (
        <div className="cv-form">
            {renderSectionHeader('Personal Info', 'personalInfo', false)}
            {isSectionOpen('personalInfo') && (
                <>
                    <input type="text" placeholder="Name" value={data.personalInfo.name} onChange={(e) => handleChange('personalInfo', 'name', e.target.value)} />
                    <input type="text" placeholder="Job Title" value={data.personalInfo.jobTitle} onChange={(e) => handleChange('personalInfo', 'jobTitle', e.target.value)} />
                    <input type="email" placeholder="Email" value={data.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} />
                    <input type="text" placeholder="Phone" value={data.personalInfo.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} />
                    <input type="text" placeholder="Address" value={data.personalInfo.address} onChange={(e) => handleChange('personalInfo', 'address', e.target.value)} />
                    <div className="avatar-input-group">
                        <input
                            type="text"
                            placeholder={hasEmbeddedAvatar ? 'Embedded image (type a URL to replace it)' : 'Avatar URL (e.g. /images/me1.jpg)'}
                            value={hasEmbeddedAvatar ? '' : avatar}
                            onChange={(e) => handleChange('personalInfo', 'avatar', e.target.value)}
                        />
                        <div className="avatar-upload-row">
                            <input
                                type="file"
                                accept="image/*"
                                disabled={isUploading}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setIsUploading(true);
                                        const reader = new FileReader();
                                        reader.onloadend = async () => {
                                            const base64 = reader.result;
                                            const img = new Image();
                                            img.onload = async () => {
                                                if (img.width !== img.height) {
                                                    alert(`Image must be square (width and height must be equal). Current dimensions: ${img.width}x${img.height}`);
                                                    setIsUploading(false);
                                                    return;
                                                }

                                                try {
                                                    const extension = file.name.split('.').pop();
                                                    const newFilename = `${Date.now()}.${extension}`;

                                                    const response = await fetch('/api/upload-avatar', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            image: base64,
                                                            filename: newFilename
                                                        })
                                                    });
                                                    const result = await response.json();
                                                    if (result.success) {
                                                        // Add cache buster to force reload
                                                        // Add a small delay to ensure the file is ready to be served
                                                        setTimeout(() => {
                                                            handleChange('personalInfo', 'avatar', result.path + '?t=' + new Date().getTime());
                                                            setIsUploading(false);
                                                        }, 1000);
                                                    } else {
                                                        alert('Failed to upload image: ' + (result.error || 'Unknown error'));
                                                        setIsUploading(false);
                                                    }
                                                } catch (err) {
                                                    console.error('Upload error:', err);
                                                    alert('Upload failed: ' + err.message);
                                                    setIsUploading(false);
                                                }
                                            };
                                            img.src = base64;
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            {isUploading && <span className="upload-status">Uploading...</span>}
                            {avatar && (
                                <button type="button" className="avatar-remove" onClick={() => handleChange('personalInfo', 'avatar', '')}>Remove</button>
                            )}
                        </div>
                    </div>
                </>
            )}

            {renderSectionHeader('Summary', 'summary', false)}
            {isSectionOpen('summary') && (
                <>
                    <LinkableTextarea placeholder="Summary" value={data.summary} onChange={(value) => onChange('summary', null, value)} />
                </>
            )}

            {renderSectionHeader('Socials', 'socials', false)}
            {isSectionOpen('socials') && (
                <>
                    <input type="text" placeholder="LinkedIn URL" value={data.socials.linkedin ?? ''} onChange={(e) => handleChange('socials', 'linkedin', e.target.value)} />
                    <input type="text" placeholder="GitHub URL" value={data.socials.github ?? ''} onChange={(e) => handleChange('socials', 'github', e.target.value)} />
                </>
            )}

            {renderSectionHeader('Skills', 'skills')}
            {isSectionOpen('skills') && (
                <>
                    {data.skills.map((group, index) => (
                        <div key={group.id} className={itemClass('form-item', 'skills', index)} {...dragProps('skills', index)}>
                            <div className="drag-handle">&#x2630; Drag to reorder</div>
                            <input type="text" placeholder="Group (e.g. Mobile)" value={group.group} onChange={(e) => handleItemChange('skills', index, 'group', e.target.value)} />
                            <textarea placeholder="Skills (one per line)" value={(group.items ?? []).join('\n')} onChange={(e) => handleItemChange('skills', index, 'items', e.target.value.split('\n'))} />
                            <div className="item-options">
                                <span />
                                <button onClick={() => handleRemoveItem('skills', index)}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => handleAddItem('skills', { id: createId(), group: '', items: [] })}>Add Skill Group</button>
                </>
            )}

            {renderSectionHeader('Experience', 'experience')}
            {isSectionOpen('experience') && (
                <>
                    {data.experience.map((exp, index) => (
                        <div key={exp.id} className={itemClass('form-item', 'experience', index)} {...dragProps('experience', index)}>
                            <div className="drag-handle">&#x2630; Drag to reorder</div>
                            <input type="text" placeholder="Title" value={exp.title} onChange={(e) => handleItemChange('experience', index, 'title', e.target.value)} />
                            <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleItemChange('experience', index, 'company', e.target.value)} />
                            <input type="text" placeholder="Date" value={exp.date} onChange={(e) => handleItemChange('experience', index, 'date', e.target.value)} />
                            <input type="text" placeholder="Location" value={exp.location} onChange={(e) => handleItemChange('experience', index, 'location', e.target.value)} />
                            <LinkableTextarea placeholder="Details (one per line)" value={(exp.details ?? []).join('\n')} onChange={(value) => handleItemChange('experience', index, 'details', value.split('\n'))} />
                            {renderItemOptions('experience', index, exp)}
                        </div>
                    ))}
                    <button onClick={() => handleAddItem('experience', { id: createId(), title: '', company: '', date: '', location: '', details: [] }, true)}>Add Experience</button>
                </>
            )}

            {renderSectionHeader('Projects', 'projects')}
            {isSectionOpen('projects') && (
                <>
                    {data.projects.map((project, index) => (
                        <div key={project.id} className={itemClass('form-item', 'projects', index)} {...dragProps('projects', index)}>
                            <div className="drag-handle">&#x2630; Drag to reorder</div>
                            <ProjectFormItem project={project} onChange={(newProject) => handleItemReplace('projects', index, newProject)} />
                            {renderItemOptions('projects', index, project)}
                        </div>
                    ))}
                    <button onClick={() => handleAddItem('projects', { ...EMPTY_PROJECT, id: createId() }, true)}>Add Project</button>
                    <button onClick={() => handleAddItem('projects', { id: createId(), name: '', items: [] })}>Add Project Group</button>
                </>
            )}

            {renderSectionHeader('Education', 'education')}
            {isSectionOpen('education') && (
                <>
                    {data.education.map((edu, index) => (
                        <div key={edu.id} className={itemClass('form-item', 'education', index)} {...dragProps('education', index)}>
                            <div className="drag-handle">&#x2630; Drag to reorder</div>
                            <input type="text" placeholder="School" value={edu.school} onChange={(e) => handleItemChange('education', index, 'school', e.target.value)} />
                            <input type="text" placeholder="Date" value={edu.date} onChange={(e) => handleItemChange('education', index, 'date', e.target.value)} />
                            <input type="text" placeholder="Location" value={edu.location} onChange={(e) => handleItemChange('education', index, 'location', e.target.value)} />
                            <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleItemChange('education', index, 'degree', e.target.value)} />
                            {renderItemOptions('education', index, edu)}
                        </div>
                    ))}
                    <button onClick={() => handleAddItem('education', { id: createId(), school: '', date: '', location: '', degree: '' })}>Add Education</button>
                </>
            )}

            {renderSectionHeader('Languages', 'languages')}
            {isSectionOpen('languages') && (
                <>
                    {data.languages.map((lang, index) => (
                        <div key={index} className={itemClass('form-item-inline', 'languages', index)} {...dragProps('languages', index)}>
                            <span className="drag-grip">&#x2630;</span>
                            <input type="text" value={lang} onChange={(e) => handleSimpleArrayChange('languages', index, e.target.value)} />
                            <button onClick={() => handleRemoveItem('languages', index)}>X</button>
                        </div>
                    ))}
                    <button onClick={() => handleAddItem('languages', '')}>Add Language</button>
                </>
            )}
        </div>
    );
};

export default CVForm;
