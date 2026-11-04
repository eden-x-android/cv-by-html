// Helpers for the CV data model (schema v2): validation on import, stable ids
// for reorderable items, and stripping app-only fields before export.

const TECH_STACK_LABEL = 'Tech stack';

// Lists whose items can be reordered/added/removed and therefore need ids
const ITEM_SECTIONS = ['experience', 'projects', 'education', 'skills'];

export const PAGE_BREAK_SECTIONS = ['skills', 'experience', 'projects', 'education', 'languages'];

export const EMPTY_PAGE_BREAKS = { sections: {}, items: {} };

export const createId = () => crypto.randomUUID();

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// Files exported before v2: flat skill strings, a separate tools list and
// projects described by `details` lines.
const isLegacyCvData = (data) =>
    'tools' in data
    || (Array.isArray(data.skills) && data.skills.some((skill) => typeof skill === 'string'))
    || (Array.isArray(data.projects) && data.projects.some((project) => isObject(project) && 'details' in project));

// Returns a message describing why `data` cannot be used, or null if it is valid.
export const getCvDataError = (data) => {
    if (!isObject(data) || !isObject(data.personalInfo)) {
        return 'Invalid CV JSON file.';
    }
    if (isLegacyCvData(data)) {
        return 'This JSON uses the old CV format (with "tools", flat "skills" or project "details") and can no longer be imported. Please use the v2 format.';
    }
    const listFields = [...ITEM_SECTIONS, 'languages'];
    const badField = listFields.find((field) => field in data && !Array.isArray(data[field]));
    if (badField) {
        return `Invalid CV JSON file: "${badField}" must be a list.`;
    }
    return null;
};

const withId = (item) => ({ ...item, id: item.id || createId() });

// Fills missing sections and gives every reorderable item a stable id.
export const normalizeCvData = (data) => ({
    ...data,
    personalInfo: { ...data.personalInfo },
    socials: { ...data.socials },
    summary: data.summary ?? '',
    languages: data.languages ?? [],
    ...Object.fromEntries(ITEM_SECTIONS.map((section) => [section, (data[section] ?? []).map(withId)])),
    projects: (data.projects ?? []).map((project) => (
        Array.isArray(project.items)
            ? { ...withId(project), items: project.items.map(withId) }
            : withId(project)
    )),
});

const omitKeys = (item, keys) => Object.fromEntries(
    Object.entries(item).filter(([key]) => !keys.includes(key))
);

const APP_ONLY_KEYS = ['id', 'pageBreakAfter'];

// Drops ids and page-break flags: those belong to this browser, not the CV.
export const stripAppOnlyFields = (data) => {
    const rest = omitKeys(data, ['sectionSettings', 'template']);
    return {
        ...rest,
        ...Object.fromEntries(ITEM_SECTIONS.map((section) => [
            section,
            (data[section] ?? []).map((item) => omitKeys(item, APP_ONLY_KEYS)),
        ])),
        projects: (data.projects ?? []).map((project) => {
            const cleaned = omitKeys(project, APP_ONLY_KEYS);
            return Array.isArray(project.items)
                ? { ...cleaned, items: project.items.map((item) => omitKeys(item, APP_ONLY_KEYS)) }
                : cleaned;
        }),
    };
};

export const isProjectGroup = (project) => Array.isArray(project.items);

export const getTechStack = (item) =>
    (item.meta ?? []).find((entry) => entry.label === TECH_STACK_LABEL)?.value ?? [];

// Replaces the tech-stack entry and keeps any other meta entries untouched.
export const setTechStack = (item, techStack) => {
    const otherMeta = (item.meta ?? []).filter((entry) => entry.label !== TECH_STACK_LABEL);
    return { ...item, meta: [{ label: TECH_STACK_LABEL, value: techStack }, ...otherMeta] };
};

// Textarea lines may be blank while the user is typing; the CV skips them.
export const nonEmptyLines = (lines) => (lines ?? []).filter((line) => line.trim() !== '');
