import React from 'react';
import './CVPreviewModern.css';
import parseRichText from '../utils/parseRichText';
import CV_ICON_PATHS from '../utils/cvIcons';
import { EMPTY_PAGE_BREAKS, getTechStack, isProjectGroup, nonEmptyLines } from '../utils/cvSchema';

const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// Fallback text when a link has no label: the package id for store links.
const linkText = (url) => url.match(/[?&]id=([^&]+)/)?.[1] ?? stripProtocol(url);

const joinParts = (...parts) => parts.filter(Boolean).join(' // ');

// Modern template (CV schema v2). Also rendered to static HTML for the HTML
// export, which passes embedded `icons` and no page breaks.
const CVPreviewModern = ({ data, pageBreaks = EMPTY_PAGE_BREAKS, icons = CV_ICON_PATHS }) => {
    const { personalInfo, summary, socials = {}, experience, projects, education, skills, languages } = data;

    const sectionBreak = (section) =>
        pageBreaks.sections[section] && <div className="page-break" />;
    const itemBreak = (id) =>
        pageBreaks.items[id] && <div className="page-break" />;

    const contacts = [
        personalInfo.phone && { key: 'phone', icon: icons.phone, href: `tel:${personalInfo.phone}`, text: personalInfo.phone },
        socials.linkedin && { key: 'linkedin', icon: icons.linkedin, href: socials.linkedin, text: stripProtocol(socials.linkedin) },
        personalInfo.email && { key: 'email', icon: icons.email, href: `mailto:${personalInfo.email}`, text: personalInfo.email },
        socials.github && { key: 'github', icon: icons.github, href: socials.github, text: stripProtocol(socials.github) },
    ].filter(Boolean);

    const renderBullets = (lines) => {
        const visibleLines = nonEmptyLines(lines);
        return visibleLines.length > 0 && (
            <ul className="cv-bullets">
                {visibleLines.map((line, i) => (
                    <li key={i}><span>{parseRichText(line)}</span></li>
                ))}
            </ul>
        );
    };

    const renderChips = (items, className = 'cv-chips') => {
        const visibleItems = nonEmptyLines(items);
        return visibleItems.length > 0 && (
            <div className={className}>
                {visibleItems.map((item, i) => <span className="cv-chip" key={i}>{item}</span>)}
            </div>
        );
    };

    // Shown inline right after the project name, e.g. "KDS  Google Play ↗".
    // Readers click it in the PDF, so only the label is shown.
    const renderLinks = (links) => (links ?? [])
        .filter((link) => link.url)
        .map((link, i) => (
            <a className="cv-project-link" href={link.url} key={i}>
                {link.label?.trim() || linkText(link.url)}&nbsp;↗
            </a>
        ));

    return (
        <div className="cv-page cv-modern">
            <header className="cv-header">
                <div className="cv-identity">
                    <div className="cv-identity-text">
                        <h1 className="cv-name">{personalInfo.name}</h1>
                        {personalInfo.jobTitle && <div className="cv-job-title">{personalInfo.jobTitle}</div>}
                        {personalInfo.address && <div className="cv-address">{personalInfo.address}</div>}
                    </div>
                    {personalInfo.avatar && (
                        <img className="cv-avatar" src={personalInfo.avatar} alt={personalInfo.name} />
                    )}
                </div>

                {summary && (
                    <section className="cv-summary">
                        <h2 className="cv-section-title">SUMMARY</h2>
                        <div className="cv-summary-text">{parseRichText(summary)}</div>
                    </section>
                )}

                {contacts.length > 0 && (
                    <div className="cv-contacts">
                        {contacts.map((contact) => (
                            <a className="cv-contact" href={contact.href} key={contact.key}>
                                <img src={contact.icon} alt="" />
                                <span className="cv-underlined">{contact.text}</span>
                            </a>
                        ))}
                    </div>
                )}
            </header>

            {sectionBreak('skills')}
            <section className="cv-section">
                <h2 className="cv-section-title">SKILLS</h2>
                <div className="cv-skill-groups">
                    {skills.map((group) => (
                        <React.Fragment key={group.id ?? group.group}>
                            <div className="cv-skill-group-name">{group.group}</div>
                            {renderChips(group.items, 'cv-chips cv-chips-large') || <div />}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {sectionBreak('experience')}
            <section className="cv-section">
                <h2 className="cv-section-title">RELEVANT EXPERIENCE</h2>
                {experience.map((exp) => (
                    <React.Fragment key={exp.id}>
                        <div className="cv-entry">
                            <div className="cv-entry-title">
                                {exp.title} {exp.company && <span className="cv-muted">at {exp.company}</span>}
                            </div>
                            <div className="cv-entry-meta">{joinParts(exp.date, exp.location)}</div>
                            {renderBullets(exp.details)}
                        </div>
                        {itemBreak(exp.id)}
                    </React.Fragment>
                ))}
            </section>

            {sectionBreak('projects')}
            <section className="cv-section">
                <h2 className="cv-section-title">PROJECTS</h2>
                {projects.map((project) => (
                    <React.Fragment key={project.id}>
                        {isProjectGroup(project) ? (
                            <div className="cv-entry cv-project-group">
                                <div className="cv-entry-title">{project.name}</div>
                                {project.items.map((item) => (
                                    <div className="cv-project-group-item" key={item.id}>
                                        <div className="cv-project-group-heading">
                                            <span className="cv-project-group-name">{item.name}</span>
                                            {renderLinks(item.links)}
                                            {item.overview && <> — {parseRichText(item.overview)}</>}
                                        </div>
                                        {renderChips(getTechStack(item))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="cv-entry cv-project">
                                <div className="cv-entry-title">{project.name}{renderLinks(project.links)}</div>
                                {project.overview && <div className="cv-project-overview">{parseRichText(project.overview)}</div>}
                                {renderBullets(project.responsibilities)}
                                {renderChips(getTechStack(project))}
                            </div>
                        )}
                        {itemBreak(project.id)}
                    </React.Fragment>
                ))}
            </section>

            {sectionBreak('education')}
            <section className="cv-section">
                <h2 className="cv-section-title">EDUCATION</h2>
                {education.map((edu) => (
                    <React.Fragment key={edu.id}>
                        <div className="cv-entry">
                            <div className="cv-entry-title">{edu.school}</div>
                            <div className="cv-entry-meta">{joinParts(edu.date, edu.location)}</div>
                            {edu.degree && <div className="cv-degree">{edu.degree}</div>}
                        </div>
                        {itemBreak(edu.id)}
                    </React.Fragment>
                ))}
            </section>

            {sectionBreak('languages')}
            <section className="cv-section">
                <h2 className="cv-section-title">LANGUAGES</h2>
                {renderChips(languages, 'cv-chips cv-chips-large')}
            </section>
        </div>
    );
};

export default CVPreviewModern;
