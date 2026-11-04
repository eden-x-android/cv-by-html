// Builds a standalone HTML file of the Modern template: fonts, icons and the
// avatar are embedded, there are no page breaks and no internal paths, so the
// file opens offline and is easy to diff/inspect.
import { createElement } from 'react';
import CVPreviewModern from '../components/CVPreviewModern';
import modernCss from '../components/CVPreviewModern.css?raw';
import CV_ICON_PATHS from './cvIcons';
import { EMPTY_PAGE_BREAKS } from './cvSchema';
import { fetchAsDataUrl, toPortableAvatar } from './embedAssets';

// Only the faces the Modern template uses; must match Global.css @font-face.
const EXPORT_FONTS = [
    { family: 'BergenText', weight: 700, url: '/fonts/BergenText-SemiBold.otf' },
    { family: 'WorkSans', weight: 400, url: '/fonts/WorkSans-Light.ttf' },
    { family: 'WorkSans', weight: 700, url: '/fonts/WorkSans-SemiBold.ttf' },
];

// Block-level closing/opening tags after which a newline is safe to add.
const BLOCK_TAGS = 'div|section|header|ul|li|h1|h2';
const AFTER_BLOCK_CLOSE = new RegExp(`(</(?:${BLOCK_TAGS})>)(?=<)`, 'g');
const BLOCK_OPEN_BEFORE_BLOCK = new RegExp(`(<(?:${BLOCK_TAGS})\\b[^>]*>)(?=<(?:${BLOCK_TAGS})\\b)`, 'g');

const escapeHtml = (text) => text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Resolves every var(--x) the template uses to its current value, so the
// export does not need the app's Global.css.
const buildRootVariables = () => {
    const names = [...new Set([...modernCss.matchAll(/var\((--[\w-]+)\)/g)].map((match) => match[1]))];
    const computed = getComputedStyle(document.documentElement);
    const lines = names.map((name) => `    ${name}: ${computed.getPropertyValue(name).trim()};`);
    return `:root {\n${lines.join('\n')}\n}`;
};

const buildFontFaces = async () => {
    const faces = await Promise.all(EXPORT_FONTS.map(async (font) => {
        const dataUrl = await fetchAsDataUrl(font.url);
        return `@font-face {\n    font-family: ${font.family};\n    src: url('${dataUrl}');\n    font-weight: ${font.weight};\n}`;
    }));
    return faces.join('\n\n');
};

const buildIcons = async () => {
    const entries = await Promise.all(
        Object.entries(CV_ICON_PATHS).map(async ([key, path]) => [key, await fetchAsDataUrl(path)])
    );
    return Object.fromEntries(entries);
};

// One block element per line: whitespace between block boxes does not render.
const formatMarkup = (markup) => markup
    .replace(BLOCK_OPEN_BEFORE_BLOCK, '$1\n')
    .replace(AFTER_BLOCK_CLOSE, '$1\n');

export const buildCvHtml = async (cvData, title) => {
    // react-dom/server is only needed here, so it stays out of the main bundle
    const [{ renderToStaticMarkup }, fontFaces, icons, avatar] = await Promise.all([
        import('react-dom/server'),
        buildFontFaces(),
        buildIcons(),
        toPortableAvatar(cvData.personalInfo.avatar),
    ]);

    const exportData = { ...cvData, personalInfo: { ...cvData.personalInfo, avatar } };
    const markup = renderToStaticMarkup(
        createElement(CVPreviewModern, { data: exportData, pageBreaks: EMPTY_PAGE_BREAKS, icons })
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
${fontFaces}

${buildRootVariables()}

html {
    font-size: 14px;
}

body {
    margin: 0;
}

${modernCss}
</style>
</head>
<body>
${formatMarkup(markup)}
</body>
</html>
`;
};
