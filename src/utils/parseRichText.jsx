import React from 'react';

// [label](url) — what the Link button writes — or a raw <a> tag from CV data
// exported before the Link button existed.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)|<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

// Turns a description line into JSX with clickable links, so the preview never
// has to inject raw HTML.
const parseRichText = (text) => {
    if (typeof text !== 'string') return text;

    // Legacy lines wrapped the text in <p class="text-along-with-url">…</p>
    const source = text.replace(/<\/?p[^>]*>/gi, '');
    const nodes = [];
    let lastIndex = 0;
    let match;

    LINK_PATTERN.lastIndex = 0;
    while ((match = LINK_PATTERN.exec(source)) !== null) {
        const [full, markdownLabel, markdownUrl, htmlUrl, htmlLabel] = match;
        if (match.index > lastIndex) {
            nodes.push(source.slice(lastIndex, match.index));
        }
        nodes.push(
            <a
                key={`link-${match.index}`}
                className="url-in-text"
                href={markdownUrl ?? htmlUrl}
                target="_blank"
                rel="noreferrer"
            >
                {(markdownLabel ?? htmlLabel).trim()}
            </a>
        );
        lastIndex = match.index + full.length;
    }

    if (lastIndex < source.length) {
        nodes.push(source.slice(lastIndex));
    }

    return nodes.length > 0 ? nodes : source;
};

export default parseRichText;
