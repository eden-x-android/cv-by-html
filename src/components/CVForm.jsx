import React, { useState } from 'react';
import LinkableTextarea from './LinkableTextarea';
import './CVForm.css';

const CVForm = ({ data, onChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [draggedItem, setDraggedItem] = useState({ section: null, index: null });

    const handleDragStart = (e, section, index) => {
        setDraggedItem({ section, index });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
    };

    const handleDragOver = (e, section) => {
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

    const handleChange = (section, field, value) => {
        onChange(section, field, value);
    };

    const handleArrayChange = (section, index, field, value) => {
        const newArray = [...data[section]];
        newArray[index][field] = value;
        onChange(section, null, newArray);
    };

    const handleSimpleArrayChange = (section, index, value) => {
        const newArray = [...data[section]];
        newArray[index] = value;
        onChange(section, null, newArray);
    };

    const handleSectionSettingChange = (section, value) => {
        const newSettings = { ...data.sectionSettings, [section]: value };
        onChange('sectionSettings', null, newSettings);
    };

    const addItem = (section, template, insertAtTop = false) => {
        const newArray = insertAtTop ? [template, ...data[section]] : [...data[section], template];
        onChange(section, null, newArray);
    };

    const removeItem = (section, index) => {
        const newArray = [...data[section]];
        newArray.splice(index, 1);
        onChange(section, null, newArray);
    };

    return (
        <div className="cv-form">
            <h2>Personal Info</h2>
            <input type="text" placeholder="Name" value={data.personalInfo.name} onChange={(e) => handleChange('personalInfo', 'name', e.target.value)} />
            <input type="text" placeholder="Job Title" value={data.personalInfo.jobTitle} onChange={(e) => handleChange('personalInfo', 'jobTitle', e.target.value)} />
            <input type="email" placeholder="Email" value={data.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} />
            <input type="text" placeholder="Phone" value={data.personalInfo.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} />
            <input type="text" placeholder="Address" value={data.personalInfo.address} onChange={(e) => handleChange('personalInfo', 'address', e.target.value)} />
            <div className="avatar-input-group">
                <input
                    type="text"
                    placeholder="Avatar URL (e.g. /images/me1.jpg)"
                    value={data.personalInfo.avatar}
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
                </div>
            </div>

            <h2>Summary</h2>
            <LinkableTextarea placeholder="Summary" value={data.summary} onChange={(value) => onChange('summary', null, value)} />

            <h2>Socials</h2>
            <input type="text" placeholder="LinkedIn URL" value={data.socials.linkedin} onChange={(e) => handleChange('socials', 'linkedin', e.target.value)} />
            <input type="text" placeholder="GitHub URL" value={data.socials.github} onChange={(e) => handleChange('socials', 'github', e.target.value)} />

            <div className="section-header">
                <h2>Experience</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={data.sectionSettings?.experience || false}
                        onChange={(e) => handleSectionSettingChange('experience', e.target.checked)}
                    />
                    Start on New Page
                </label>
            </div>
            {data.experience.map((exp, index) => (
                <div 
                    key={index} 
                    className={itemClass('form-item', 'experience', index)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'experience', index)}
                    onDragOver={(e) => handleDragOver(e, 'experience')}
                    onDrop={(e) => handleDrop(e, 'experience', index)}
                    onDragEnd={handleDragEnd}
                >
                    <div className="drag-handle">
                        &#x2630; Drag to reorder
                    </div>
                    <input type="text" placeholder="Title" value={exp.title} onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)} />
                    <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
                    <input type="text" placeholder="Date" value={exp.date} onChange={(e) => handleArrayChange('experience', index, 'date', e.target.value)} />
                    <input type="text" placeholder="Location" value={exp.location} onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)} />
                    <LinkableTextarea placeholder="Details (one per line)" value={exp.details.join('\n')} onChange={(value) => handleArrayChange('experience', index, 'details', value.split('\n'))} />
                    <div className="item-options">
                        <label>
                            <input type="checkbox" checked={exp.pageBreakAfter || false} onChange={(e) => handleArrayChange('experience', index, 'pageBreakAfter', e.target.checked)} />
                            Page Break After
                        </label>
                        <button onClick={() => removeItem('experience', index)}>Remove</button>
                    </div>
                </div>
            ))}
            <button onClick={() => addItem('experience', { title: '', company: '', date: '', location: '', details: [] }, true)}>Add Experience</button>

            <div className="section-header">
                <h2>Projects</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={data.sectionSettings?.projects || false}
                        onChange={(e) => handleSectionSettingChange('projects', e.target.checked)}
                    />
                    Start on New Page
                </label>
            </div>
            {data.projects.map((project, index) => (
                <div 
                    key={index} 
                    className={itemClass('form-item', 'projects', index)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'projects', index)}
                    onDragOver={(e) => handleDragOver(e, 'projects')}
                    onDrop={(e) => handleDrop(e, 'projects', index)}
                    onDragEnd={handleDragEnd}
                >
                    <div className="drag-handle">
                        &#x2630; Drag to reorder
                    </div>
                    <input type="text" placeholder="Project Name" value={project.name} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} />
                    <LinkableTextarea placeholder="Details (one per line)" value={project.details.join('\n')} onChange={(value) => handleArrayChange('projects', index, 'details', value.split('\n'))} />
                    <div className="item-options">
                        <label>
                            <input type="checkbox" checked={project.pageBreakAfter || false} onChange={(e) => handleArrayChange('projects', index, 'pageBreakAfter', e.target.checked)} />
                            Page Break After
                        </label>
                        <button onClick={() => removeItem('projects', index)}>Remove</button>
                    </div>
                </div>
            ))}
            <button onClick={() => addItem('projects', { name: '', details: [] }, true)}>Add Project</button>

            <div className="section-header">
                <h2>Education</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={data.sectionSettings?.education || false}
                        onChange={(e) => handleSectionSettingChange('education', e.target.checked)}
                    />
                    Start on New Page
                </label>
            </div>
            {data.education.map((edu, index) => (
                <div 
                    key={index} 
                    className={itemClass('form-item', 'education', index)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'education', index)}
                    onDragOver={(e) => handleDragOver(e, 'education')}
                    onDrop={(e) => handleDrop(e, 'education', index)}
                    onDragEnd={handleDragEnd}
                >
                    <div className="drag-handle">
                        &#x2630; Drag to reorder
                    </div>
                    <input type="text" placeholder="School" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} />
                    <input type="text" placeholder="Date" value={edu.date} onChange={(e) => handleArrayChange('education', index, 'date', e.target.value)} />
                    <input type="text" placeholder="Location" value={edu.location} onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)} />
                    <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                    <div className="item-options">
                        <label>
                            <input type="checkbox" checked={edu.pageBreakAfter || false} onChange={(e) => handleArrayChange('education', index, 'pageBreakAfter', e.target.checked)} />
                            Page Break After
                        </label>
                        <button onClick={() => removeItem('education', index)}>Remove</button>
                    </div>
                </div>
            ))}
            <button onClick={() => addItem('education', { school: '', date: '', location: '', degree: '' })}>Add Education</button>

            <div className="section-header">
                <h2>Skills</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={data.sectionSettings?.skills || false}
                        onChange={(e) => handleSectionSettingChange('skills', e.target.checked)}
                    />
                    Start on New Page
                </label>
            </div>
            {data.skills.map((skill, index) => (
                <div 
                    key={index} 
                    className={itemClass('form-item-inline', 'skills', index)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'skills', index)}
                    onDragOver={(e) => handleDragOver(e, 'skills')}
                    onDrop={(e) => handleDrop(e, 'skills', index)}
                    onDragEnd={handleDragEnd}
                >
                    <span className="drag-grip">&#x2630;</span>
                    <input type="text" value={skill} onChange={(e) => handleSimpleArrayChange('skills', index, e.target.value)} />
                    <button onClick={() => removeItem('skills', index)}>X</button>
                </div>
            ))}
            <button onClick={() => addItem('skills', '')}>Add Skill</button>

            <div className="section-header">
                <h2>Tools</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={data.sectionSettings?.tools || false}
                        onChange={(e) => handleSectionSettingChange('tools', e.target.checked)}
                    />
                    Start on New Page
                </label>
            </div>
            {data.tools.map((tool, index) => (
                <div 
                    key={index} 
                    className={itemClass('form-item-inline', 'tools', index)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'tools', index)}
                    onDragOver={(e) => handleDragOver(e, 'tools')}
                    onDrop={(e) => handleDrop(e, 'tools', index)}
                    onDragEnd={handleDragEnd}
                >
                    <span className="drag-grip">&#x2630;</span>
                    <input type="text" value={tool} onChange={(e) => handleSimpleArrayChange('tools', index, e.target.value)} />
                    <button onClick={() => removeItem('tools', index)}>X</button>
                </div>
            ))}
            <button onClick={() => addItem('tools', '')}>Add Tool</button>

            <div className="section-header">
                <h2>Languages</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={data.sectionSettings?.languages || false}
                        onChange={(e) => handleSectionSettingChange('languages', e.target.checked)}
                    />
                    Start on New Page
                </label>
            </div>
            {data.languages.map((lang, index) => (
                <div 
                    key={index} 
                    className={itemClass('form-item-inline', 'languages', index)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'languages', index)}
                    onDragOver={(e) => handleDragOver(e, 'languages')}
                    onDrop={(e) => handleDrop(e, 'languages', index)}
                    onDragEnd={handleDragEnd}
                >
                    <span className="drag-grip">&#x2630;</span>
                    <input type="text" value={lang} onChange={(e) => handleSimpleArrayChange('languages', index, e.target.value)} />
                    <button onClick={() => removeItem('languages', index)}>X</button>
                </div>
            ))}
            <button onClick={() => addItem('languages', '')}>Add Language</button>
        </div>
    );
};

export default CVForm;
