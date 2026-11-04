import React, { useEffect, useRef, useState } from 'react';
import CVForm from './components/CVForm';
import CVPreviewModern from './components/CVPreviewModern';
import ThemeToggle from './components/ThemeToggle';
import DEFAULT_CV_DATA from './utils/defaultCvData';
import { EMPTY_PAGE_BREAKS, getCvDataError, normalizeCvData, stripAppOnlyFields } from './utils/cvSchema';
import { loadStoredJson, saveStoredJson } from './utils/browserStorage';
import { toPortableAvatar } from './utils/embedAssets';
import { buildCvHtml } from './utils/exportCvHtml';
import './App.css';

// CV data and page breaks are cached separately: page breaks are a layout
// choice for this browser and never go into exported/imported files.
const CV_DATA_STORAGE_KEY = 'cv-builder-data';
const PAGE_BREAKS_STORAGE_KEY = 'cv-builder-page-breaks';

const loadInitialCvData = () => {
    const stored = loadStoredJson(CV_DATA_STORAGE_KEY);
    return normalizeCvData(stored && !getCvDataError(stored) ? stored : DEFAULT_CV_DATA);
};

const loadInitialPageBreaks = () => {
    const stored = loadStoredJson(PAGE_BREAKS_STORAGE_KEY);
    return {
        sections: { ...stored?.sections },
        items: { ...stored?.items },
    };
};

const toFileSafeName = (name) => name?.trim().replace(/\s+/g, '_') || '';

const timestamp = () => {
    const now = new Date();
    const pad = (n, len = 2) => String(n).padStart(len, '0');
    return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}-${pad(now.getMilliseconds(), 3)}`;
};

const downloadFile = (content, type, filename) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const App = () => {
    const [cvData, setCvData] = useState(loadInitialCvData);
    const [pageBreaks, setPageBreaks] = useState(loadInitialPageBreaks);
    const [isExportingHtml, setIsExportingHtml] = useState(false);
    const importInputRef = useRef(null);

    const safeName = toFileSafeName(cvData.personalInfo.name);
    // Also the default file name Chrome suggests for "Save as PDF"
    const documentTitle = safeName ? `CV_${safeName}` : 'CV';

    useEffect(() => {
        saveStoredJson(CV_DATA_STORAGE_KEY, cvData);
    }, [cvData]);

    useEffect(() => {
        saveStoredJson(PAGE_BREAKS_STORAGE_KEY, pageBreaks);
    }, [pageBreaks]);

    useEffect(() => {
        document.title = documentTitle;
    }, [documentTitle]);

    const handleDataChange = (section, field, value) => {
        setCvData(prevData => {
            if (field === null) {
                return { ...prevData, [section]: value };
            }
            return {
                ...prevData,
                [section]: {
                    ...prevData[section],
                    [field]: value
                }
            };
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSectionBreakChange = (section, isOn) => {
        setPageBreaks(prev => ({ ...prev, sections: { ...prev.sections, [section]: isOn } }));
    };

    const handleItemBreakChange = (id, isOn) => {
        setPageBreaks(prev => ({ ...prev, items: { ...prev.items, [id]: isOn } }));
    };

    const exportFileName = (extension) => `${safeName || 'cv'}_${timestamp()}.${extension}`;

    const handleExport = async () => {
        // No ids, page breaks or internal paths: an internal avatar is embedded
        const exportData = stripAppOnlyFields(cvData);
        const avatar = await toPortableAvatar(exportData.personalInfo.avatar);
        const json = JSON.stringify({ ...exportData, personalInfo: { ...exportData.personalInfo, avatar } }, null, 2);
        downloadFile(json, 'application/json', exportFileName('json'));
    };

    const handleExportHtml = async () => {
        setIsExportingHtml(true);
        try {
            const html = await buildCvHtml(cvData, documentTitle);
            downloadFile(html, 'text/html', exportFileName('html'));
        } catch (err) {
            alert('Failed to export HTML: ' + err.message);
        } finally {
            setIsExportingHtml(false);
        }
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                const error = getCvDataError(imported);
                if (error) {
                    alert(error);
                    return;
                }
                // Page breaks from the file (if any) are ignored and the old
                // ones no longer match the new items, so start clean.
                setCvData(normalizeCvData(stripAppOnlyFields(imported)));
                setPageBreaks(EMPTY_PAGE_BREAKS);
            } catch (err) {
                alert('Failed to parse JSON file: ' + err.message);
            }
        };
        reader.readAsText(file);
        // Reset so the same file can be re-imported
        e.target.value = '';
    };

    return (
        <div className="app-container">
            <div className="no-print form-container">
                <h1>CV Builder</h1>
                <div className="toolbar">
                    <button
                        onClick={handlePrint}
                        className="toolbar-button print-button"
                        aria-label="Print / Save as PDF"
                        data-tooltip="Print / Save as PDF"
                    >🖨️</button>
                    <button
                        onClick={handleExport}
                        className="toolbar-button export-button"
                        aria-label="Export JSON"
                        data-tooltip="Export JSON"
                    >⬇️</button>
                    <button
                        onClick={handleExportHtml}
                        disabled={isExportingHtml}
                        className="toolbar-button export-button"
                        aria-label="Export HTML"
                        data-tooltip={isExportingHtml ? 'Exporting HTML…' : 'Export HTML'}
                    >🌐</button>
                    <button
                        onClick={() => importInputRef.current.click()}
                        className="toolbar-button import-button"
                        aria-label="Import JSON"
                        data-tooltip="Import JSON"
                    >⬆️</button>
                    <ThemeToggle />
                    <a
                        href="/api/logout"
                        className="toolbar-button logout-button"
                        aria-label="Sign out"
                        data-tooltip="Sign out"
                    >🚪</a>
                    <input
                        ref={importInputRef}
                        type="file"
                        accept=".json,application/json"
                        style={{ display: 'none' }}
                        onChange={handleImport}
                    />
                </div>
                <label className="template-picker">
                    Template
                    {/* Classic and Stacked read the old (v1) data format, so they stay
                        listed but cannot be selected. */}
                    <select defaultValue="modern">
                        <option value="modern">Modern – 1 column</option>
                        <option value="columns" disabled>Classic – 2 columns</option>
                        <option value="stacked" disabled>Stacked</option>
                    </select>
                </label>
                <CVForm
                    data={cvData}
                    onChange={handleDataChange}
                    pageBreaks={pageBreaks}
                    onSectionBreakChange={handleSectionBreakChange}
                    onItemBreakChange={handleItemBreakChange}
                />
            </div>
            <div className="preview-container">
                <CVPreviewModern data={cvData} pageBreaks={pageBreaks} />
            </div>
        </div>
    );
};

export default App;
