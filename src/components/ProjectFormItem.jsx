import React from 'react';
import LinkableTextarea from './LinkableTextarea';
import ProjectLinksInput from './ProjectLinksInput';
import { createId, getTechStack, isProjectGroup, setTechStack } from '../utils/cvSchema';
import './ProjectFormItem.css';

const EMPTY_SUB_PROJECT = { name: '', overview: '', meta: [], links: [] };

// Fields of one project card. A project is either a single project
// (overview, responsibilities, tech stack, links) or a group such as
// "Side Projects" whose sub-projects each have overview, tech stack and links.
const ProjectFormItem = ({ project, onChange }) => {
    const handleFieldChange = (field, value) => {
        onChange({ ...project, [field]: value });
    };

    const handleSubItemChange = (subId, updater) => {
        onChange({
            ...project,
            items: project.items.map((item) => (item.id === subId ? updater(item) : item)),
        });
    };

    const handleAddSubItem = () => {
        onChange({ ...project, items: [...project.items, { ...EMPTY_SUB_PROJECT, id: createId() }] });
    };

    const handleRemoveSubItem = (subId) => {
        onChange({ ...project, items: project.items.filter((item) => item.id !== subId) });
    };

    const renderTechStackInput = (item, onItemChange) => (
        <textarea
            className="tech-stack-input"
            placeholder="Tech stack (one per line)"
            value={getTechStack(item).join('\n')}
            onChange={(e) => onItemChange(setTechStack(item, e.target.value.split('\n')))}
        />
    );

    if (isProjectGroup(project)) {
        return (
            <>
                <div className="project-kind">Project group</div>
                <input type="text" placeholder="Group name (e.g. Side Projects)" value={project.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                {project.items.map((item) => (
                    <div className="sub-project" key={item.id}>
                        <input
                            type="text"
                            placeholder="Sub-project name"
                            value={item.name}
                            onChange={(e) => handleSubItemChange(item.id, (current) => ({ ...current, name: e.target.value }))}
                        />
                        <LinkableTextarea
                            placeholder="Overview"
                            value={item.overview ?? ''}
                            onChange={(value) => handleSubItemChange(item.id, (current) => ({ ...current, overview: value }))}
                        />
                        {renderTechStackInput(item, (updated) => handleSubItemChange(item.id, () => updated))}
                        <ProjectLinksInput
                            links={item.links}
                            onChange={(links) => handleSubItemChange(item.id, (current) => ({ ...current, links }))}
                        />
                        <button type="button" className="sub-project-remove" onClick={() => handleRemoveSubItem(item.id)}>Remove Sub-project</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddSubItem}>Add Sub-project</button>
            </>
        );
    }

    return (
        <>
            <input type="text" placeholder="Project Name" value={project.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
            <LinkableTextarea placeholder="Overview" value={project.overview ?? ''} onChange={(value) => handleFieldChange('overview', value)} />
            <LinkableTextarea
                placeholder="Responsibilities (one per line)"
                value={(project.responsibilities ?? []).join('\n')}
                onChange={(value) => handleFieldChange('responsibilities', value.split('\n'))}
            />
            {renderTechStackInput(project, onChange)}
            <ProjectLinksInput links={project.links} onChange={(links) => handleFieldChange('links', links)} />
        </>
    );
};

export default ProjectFormItem;
