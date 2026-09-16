import React, { useRef, useState } from 'react';
import './LinkableTextarea.css';

// Textarea with a Link button: select text, paste a URL, and the selection
// is wrapped as [label](url) — rendered as a link in the CV preview.
const LinkableTextarea = ({ value, onChange, placeholder }) => {
    const textareaRef = useRef(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const [isLinkBoxOpen, setIsLinkBoxOpen] = useState(false);
    const [url, setUrl] = useState('');

    const handleOpenLinkBox = () => {
        // A textarea keeps its selection after it loses focus to the button,
        // so read it here instead of tracking every selection change.
        const textarea = textareaRef.current;
        selectionRef.current = textarea
            ? { start: textarea.selectionStart, end: textarea.selectionEnd }
            : { start: value.length, end: value.length };
        setUrl('');
        setIsLinkBoxOpen(true);
    };

    const handleCloseLinkBox = () => {
        setIsLinkBoxOpen(false);
        textareaRef.current?.focus();
    };

    const handleTextareaKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            handleOpenLinkBox();
        }
    };

    const handleInsertLink = () => {
        const trimmed = url.trim();
        if (!trimmed) return;

        const href = /^(https?:|mailto:|tel:)/i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const { start, end } = selectionRef.current;
        const selected = value.slice(start, end).trim();
        const label = selected || href.replace(/^https?:\/\//i, '').replace(/\/$/, '');
        const markdown = `[${label}](${href})`;

        onChange(value.slice(0, start) + markdown + value.slice(end));
        setIsLinkBoxOpen(false);

        const caret = start + markdown.length;
        selectionRef.current = { start: caret, end: caret };
        // Wait for the new value to render before moving the caret
        setTimeout(() => {
            const textarea = textareaRef.current;
            if (!textarea) return;
            textarea.focus();
            textarea.setSelectionRange(caret, caret);
        }, 0);
    };

    const handleUrlKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInsertLink();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            handleCloseLinkBox();
        }
    };

    return (
        <div className="linkable-textarea">
            <div className="linkable-toolbar">
                <button type="button" className="link-button" onClick={handleOpenLinkBox}>🔗 Link</button>
                <span className="linkable-hint">Select text, then add a link (⌘K)</span>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
            />
            {isLinkBoxOpen && (
                <div className="link-box">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Paste link (https://...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleUrlKeyDown}
                    />
                    <button type="button" className="link-box-ok" onClick={handleInsertLink}>OK</button>
                    <button type="button" className="link-box-cancel" onClick={handleCloseLinkBox}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default LinkableTextarea;
