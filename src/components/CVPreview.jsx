import React from 'react';
import '../CVPreview.css';

const CVPreview = ({ data }) => {
    const { personalInfo, summary, socials, experience, projects, education, skills, tools, languages, sectionSettings } = data;

    return (
        <div className="container cv-page">
            <div className="personal-infor">
                <div className="name-and-image">
                    <div className="name-flex">
                        <h1>{personalInfo.name}</h1>
                        <div className="job-title">{personalInfo.jobTitle}</div>
                        {personalInfo.address && (
                            <div className="contact-info">
                                <a className="contact-info-item">
                                    <span>{personalInfo.address}</span>
                                </a>
                            </div>
                        )}
                        <div className="contact-info">
                            {personalInfo.email && (
                                <a href={`mailto:${personalInfo.email}`} className="contact-info-item">
                                    <span>{personalInfo.email}</span>
                                </a>
                            )}
                            {personalInfo.email && personalInfo.phone && (
                                <a className="contact-info-item">
                                    <span> | </span>
                                </a>
                            )}
                            {personalInfo.phone && (
                                <a href={`tel:${personalInfo.phone}`} className="contact-info-item">
                                    <span>{personalInfo.phone}</span>
                                </a>
                            )}
                        </div>
                    </div>
                    {personalInfo.avatar && (
                        <div className="image-flex">
                            {console.log('Rendering avatar with src:', personalInfo.avatar)}
                            <img
                                className="avatar"
                                src={personalInfo.avatar}
                                alt="Avatar"
                                onError={(e) => {
                                    console.error('Image load error event:', e);
                                    console.error('Failed src:', e.target.src);
                                }}
                                onLoad={() => console.log('Image loaded successfully')}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="detail-infor">
                <div className="left">
                    <div className="additional-section">
                        <div className="experience-header">SUMMARY</div>
                    </div>
                </div>

                <div className="right">
                    <div className="additional-section">
                        <div className="additional-item">
                            <div className="additional-detail">
                                <p>{summary}</p>
                            </div>
                        </div>

                        <div className="contact-info-vertical-align">
                            {socials.linkedin && (
                                <a href={socials.linkedin} className="contact-info-item-vertical-align">
                                    <img src="/images/ic_linkedin.svg" alt="LinkedIn" />
                                    <span>{socials.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                                </a>
                            )}
                            {socials.github && (
                                <a href={socials.github} className="contact-info-item-vertical-align">
                                    <img src="/images/ic_github.svg" alt="GitHub" />
                                    <span>{socials.github.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {sectionSettings?.experience && <div className="page-break"></div>}
            <div className="detail-infor">
                <div className="left">
                    <div className="additional-section">
                        <div className="experience-header">RELEVANT EXPERIENCE</div>
                    </div>
                </div>

                <div className="right">
                    <div className="additional-section">
                        {experience.map((exp, index) => (
                            <React.Fragment key={index}>
                                <div className="experience-item">
                                    <div className="company-title">
                                        {exp.title} <span className="company-name">at {exp.company}</span>
                                    </div>
                                    <p className="date">{exp.date} // {exp.location}</p>
                                    <ul className="experience-item-details">
                                        {exp.details.map((detail, i) => (
                                            <li key={i}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                                {exp.pageBreakAfter && <div className="page-break"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {sectionSettings?.projects && <div className="page-break"></div>}
            <div className="detail-infor">
                <div className="left">
                    <div className="additional-section">
                        <div className="additional-header">PROJECTS</div>
                    </div>
                </div>

                <div className="right">
                    <div className="additional-section">
                        {projects.map((project, index) => (
                            <React.Fragment key={index}>
                                <div className="additional-item">
                                    <div className="project-title">{project.name}</div>
                                    <ul className="experience-item-details">
                                        {project.details.map((detail, i) => (
                                            <li key={i} dangerouslySetInnerHTML={{ __html: detail }}></li>
                                        ))}
                                    </ul>
                                </div>
                                {(project.pageBreak || project.pageBreakAfter) && <div className="page-break"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {sectionSettings?.education && <div className="page-break"></div>}
            <div className="detail-infor">
                <div className="left">
                    <div className="additional-section">
                        <div className="experience-header">EDUCATION</div>
                    </div>
                </div>

                <div className="right">
                    {education.map((edu, index) => (
                        <div className="additional-item" key={index}>
                            <div className="additional-title">{edu.school}</div>
                            <div className="date">{edu.date} // {edu.location}</div>
                            <div className="additional-detail">{edu.degree}</div>
                        </div>
                    ))}
                    {/* Education items usually don't need internal page breaks, but if added: */}
                    {education.map((edu, index) => edu.pageBreakAfter && <div key={`pb-${index}`} className="page-break"></div>)}
                </div>
            </div>

            {sectionSettings?.skills && <div className="page-break"></div>}
            <div className="detail-infor">
                <div className="left">
                    <div className="additional-section">
                        <div className="experience-header">SKILLS</div>
                    </div>
                </div>
                <div className="right">
                    <div className="skill-section">
                        {skills.map((skill, index) => (
                            <div className="skill-item-container" key={index}>
                                <div className="skill-item">{skill}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {sectionSettings?.tools && <div className="page-break"></div>}
            <div className="detail-infor">
                <div className="left">
                    <div className="additional-section">
                        <div className="experience-header">TOOLS</div>
                    </div>
                </div>
                <div className="right">
                    <div className="skill-section">
                        {tools.map((tool, index) => (
                            <div className="skill-item-container" key={index}>
                                <div className="skill-item">{tool}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {sectionSettings?.languages && <div className="page-break"></div>}
            <div className="detail-infor">
                <div className="left">
                    <div className="additional-section">
                        <div className="experience-header">LANGUAGES</div>
                    </div>
                </div>
                <div className="right">
                    <div className="skill-section">
                        {languages.map((lang, index) => (
                            <div className="skill-item-container" key={index}>
                                <div className="skill-item">{lang}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVPreview;
