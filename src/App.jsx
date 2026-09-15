import React, { useState, useRef } from 'react';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import './App.css';

function App() {
    const [cvData, setCvData] = useState({
        personalInfo: {
            name: 'Toan Thai',
            jobTitle: 'Android Developer',
            email: 'toanthai.me@gmail.com',
            phone: '+84 977472667',
            address: 'Ho Chi Minh City, Vietnam',
            avatar: '/images/me1.jpg'
        },
        summary: 'Born in 1999, I have been actively working in Android development for over 3 years in building, deploying and maintaining applications on the Android platform, with a focus on Kotlin and Java. Throughout my experience, I am always interested in honing my skills in new trending technologies and the latest updates of Android SDK.',
        socials: {
            linkedin: 'https://www.linkedin.com/in/toanthai/',
            github: 'https://github.com/thaiquoctoanvn'
        },
        experience: [
            {
                title: 'Android Developer',
                company: 'Silicon Stack',
                date: 'Jun 2022 - Present',
                location: 'Ho Chi Minh City, Vietnam',
                details: [
                    'Discuss app business with the BA team to understand client’s points.',
                    'Work the Design team to delivery better UI to end users.',
                    'Fix bugs and research solutions that could be completed client’s problems.',
                    'Improve codebases and UX in existing applications.'
                ]
            },
            {
                title: 'Android Developer',
                company: 'gumi Vietnam',
                date: 'Sep 2021 - Jun 2022',
                location: 'Ho Chi Minh City, Vietnam',
                details: [
                    'Developed and maintained Android application for Japanese customers.',
                    'Analyzed of requirements and suggesting reasonable solutions with team.',
                    'Kept reporting to project\'s leader and mentors daily.'
                ]
            }
        ],
        projects: [
            {
                name: 'Feedjoy',
                details: [
                    'A food ordering app for a Vietnamese vendor in Australia.',
                    'The app was integrated Google Pay api, Custom animations, Google Map api, Biometric authentication, Coroutines and Koin.'
                ],
                pageBreak: true
            },
            {
                name: 'Yakult Health Care',
                details: [
                    'App for tracking sleeping and walking then summarize and give advices in a report to users.',
                    'Technologies used include Google Fitness api, Amazon Dynamo DB, Custom charts, Navigation Component, Hilt and Clean Architecture.'
                ]
            },
            {
                name: 'Apricot',
                details: [
                    'There were a lot of new apps that were built from the same source code. Some of them provided only paid content and others offered watching ad to view content.',
                    'The project was made with multiple build variants in Gradle, Java, Google Admob, Google Billing.'
                ]
            },
            {
                name: 'AVN Live',
                details: [
                    'An internal social network app for sharing cooking recipe. Some core functions include share images and videos, mention friends in comments and chat.',
                    'The project was made with Java, RxAndroid, Firebase.'
                ]
            },
            {
                name: 'EasyCheck',
                details: [
                    'An app for car repair booking for car dealerships. A part of the booking system that each dealership can customize depends on their own services.',
                    'Deployment on Android and iOS.',
                    'Build with Flutter SDK.'
                ]
            },
            {
                name: 'Qik Font (Side Project)',
                details: [
                    'An simple tool to create typography on your image.',
                    'Technologies used include Jetpack Compose, Google Admob, Room database, Kotlin Flows and Hilt.',
                    '<p class="text-along-with-url">Google Play: <a href="https://play.google.com/store/apps/details?id=io.edenx.qikfont" class="url-in-text">https://play.google.com/store/apps/details?id=io.edenx.qikfont</a></p>'
                ]
            },
            {
                name: 'Color Battle (Side Project)',
                details: [
                    'A mini game to challenge how fast your fingers are.',
                    'Made with Android views, Google Admob.',
                    '<p class="text-along-with-url">Google Play: <a href="https://play.google.com/store/apps/details?id=io.edenxwhistle.fingerchallenge" class="url-in-text">https://play.google.com/store/apps/details?id=io.edenxwhistle.fingerchallenge</a></p>'
                ]
            },
            {
                name: 'Better Screenshots (Side Project)',
                details: [
                    'A simple tool to create an colorful background for image.',
                    'The app was built with Jetpack Compose, Google Admob.',
                    '<p class="text-along-with-url">Google Play: <a href="https://play.google.com/store/apps/details?id=io.edenxwhistle.betterscreenshot" class="url-in-text">https://play.google.com/store/apps/details?id=io.edenxwhistle.betterscreenshot</a></p>'
                ]
            }
        ],
        education: [
            {
                school: 'University of Information and Technology - VNUHCM',
                date: '2017 - 2022',
                location: 'HCMC, Vietnam',
                degree: 'Engineer of Computer Network and Communication.'
            }
        ],
        skills: [
            'Android SDK', 'Kotlin', 'Java', 'Jetpack Compose', 'Google Play Billing', 'Flutter', 'Firebase', 'Room Database'
        ],
        tools: [
            'Android Studio', 'VS Code', 'XCode', 'Figma', 'Jira', 'Bitrise', 'fastlane', 'GitLab', 'Bitbucket', 'GitHub'
        ],
        languages: [
            'Vietnamese (Native)', 'English (Intermediate)'
        ],
        template: 'stacked',
        sectionSettings: {
            experience: false,
            projects: false,
            education: false,
            skills: false,
            tools: false,
            languages: false
        }
    });

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

    const importInputRef = useRef(null);

    const handleExport = () => {
        const json = JSON.stringify(cvData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const name = cvData.personalInfo?.name?.replace(/\s+/g, '_') || 'cv';
        const now = new Date();
        const pad = (n, len = 2) => String(n).padStart(len, '0');
        const timestamp = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}-${pad(now.getMilliseconds(), 3)}`;
        a.href = url;
        a.download = `${name}_${timestamp}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (!imported.personalInfo) {
                    alert('Invalid CV JSON file.');
                    return;
                }
                setCvData(imported);
            } catch (err) {
                alert('Failed to parse JSON file: ' + err.message);
            }
        };
        reader.readAsText(file);
        // Reset so the same file can be re-imported
        e.target.value = '';
    };

    // JSON files exported before templates existed have no `template` field
    const template = cvData.template ?? 'columns';

    const handleTemplateChange = (e) => {
        handleDataChange('template', null, e.target.value);
    };

    return (
        <div className="app-container">
            <div className="no-print form-container">
                <h1>CV Builder</h1>
                <div className="toolbar">
                    <button onClick={handlePrint} className="print-button">🖨️ Print / Save as PDF</button>
                    <button onClick={handleExport} className="export-button">⬇️ Export JSON</button>
                    <button onClick={() => importInputRef.current.click()} className="import-button">⬆️ Import JSON</button>
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
                    <select value={template} onChange={handleTemplateChange}>
                        <option value="columns">Classic – 2 columns</option>
                        <option value="stacked">Stacked</option>
                    </select>
                </label>
                <CVForm data={cvData} onChange={handleDataChange} />
            </div>
            <div className="preview-container">
                <CVPreview data={cvData} template={template} />
            </div>
        </div>
    );
}

export default App;
