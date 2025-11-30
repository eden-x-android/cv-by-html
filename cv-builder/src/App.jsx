import React, { useState, useEffect } from 'react';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import './App.css';

function App() {
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // Load CV data on mount
    useEffect(() => {
        loadCVData();
    }, []);

    const loadCVData = async () => {
        try {
            const response = await fetch('/api/load-cv');
            const data = await response.json();
            setCvData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading CV data:', error);
            setLoading(false);
        }
    };

    const saveCVData = async () => {
        setSaving(true);
        setSaveMessage('');
        try {
            const response = await fetch('/api/save-cv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cvData),
            });
            const result = await response.json();
            if (result.success) {
                setSaveMessage('✓ Saved successfully!');
                setTimeout(() => setSaveMessage(''), 3000);
            } else {
                setSaveMessage('✗ Save failed: ' + result.error);
            }
        } catch (error) {
            console.error('Error saving CV data:', error);
            setSaveMessage('✗ Save failed: ' + error.message);
        }
        setSaving(false);
    };

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

    if (loading) {
        return (
            <div className="app-container">
                <div className="loading">Loading CV data...</div>
            </div>
        );
    }

    if (!cvData) {
        return (
            <div className="app-container">
                <div className="error">Failed to load CV data. Please refresh the page.</div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="no-print form-container">
                <h1>CV Builder</h1>
                <div className="action-buttons">
                    <button onClick={saveCVData} className="save-button" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={handlePrint} className="print-button">Print / Save as PDF</button>
                    {saveMessage && <span className={`save-message ${saveMessage.startsWith('✓') ? 'success' : 'error'}`}>{saveMessage}</span>}
                </div>
                <CVForm data={cvData} onChange={handleDataChange} />
            </div>
            <div className="preview-container">
                <CVPreview data={cvData} />
            </div>
        </div>
    );
}

export default App;
