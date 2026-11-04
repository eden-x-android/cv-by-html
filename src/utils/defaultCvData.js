// Content shown on first load (CV schema v2). Layout-only fields such as page
// breaks are deliberately absent: they live in browser storage, not in CV data.
const DEFAULT_CV_DATA = {
    "personalInfo": {
        "name": "Toan Thai",
        "jobTitle": "Android Developer",
        "email": "toanthai.me@gmail.com",
        "phone": "0977472667",
        "address": "Ho Chi Minh City, Vietnam",
        "avatar": "/images/me1.jpg"
    },
    "summary": "Android Developer with 5+ years of experience building native Android applications in Kotlin and Java. Experienced in modular architecture and in migrating legacy codebases to scalable, modern architectures. Combines AI-assisted workflows with hands-on development to move fast and keep up with changing business needs.",
    "socials": {
        "linkedin": "https://www.linkedin.com/in/toanthai/",
        "github": "https://github.com/thaiquoctoanvn"
    },
    "experience": [
        {
            "title": "Android Developer",
            "company": "Blogic Systems",
            "date": "Mar 2025 - Present",
            "location": "Ho Chi Minh City, Vietnam",
            "details": [
                "Built and maintained native Android applications for fintech, retail, and restaurant clients in the U.S.",
                "Worked with the BA team to analyze requirements and deliver features that meet client expectations.",
                "Built payment modules using PAX SDK on PAX devices and TapLink SDK on SUNMI devices to process card transactions.",
                "Worked with the Design team to upgrade legacy retail and POS utility applications to a modern UI based on Material Design.",
                "Refactored and restructured the Android codebase to improve maintainability and reduce technical debt."
            ]
        },
        {
            "title": "Android Developer",
            "company": "Silicon Stack",
            "date": "Jun 2022 - Feb 2025",
            "location": "Ho Chi Minh City, Vietnam",
            "details": [
                "Built and delivered 4 mobile applications to Google Play and the App Store.",
                "Developed Android applications for F&B and automotive clients in Australia and Jordan.",
                "Worked with the Design team to implement polished UI and custom animations that improve the user experience.",
                "Built project codebases from scratch and set up CI/CD pipelines with Fastlane and GitHub Actions to automate builds and releases."
            ]
        },
        {
            "title": "Android Developer",
            "company": "gumi Vietnam",
            "date": "Apr 2021 - Jun 2022",
            "location": "Ho Chi Minh City, Vietnam",
            "details": [
                "Developed and maintained Android applications for Japanese clients, following strict quality standards.",
                "Optimized application startup time to deliver a faster launch experience.",
                "Implemented monetization features for apps on Google Play.",
                "Customized open-source libraries to meet specific UI and feature requirements."
            ]
        }
    ],
    "projects": [
        {
            "name": "Blogic Connect",
            "meta": [
                {
                    "label": "Tech stack",
                    "value": [
                        "Jetpack Compose",
                        "Room Database",
                        "WorkManager",
                        "Foreground Service",
                        "Koin",
                        "PAX SDK",
                        "TapLink SDK",
                        "AWS Amplify",
                        "MVI Architecture"
                    ]
                }
            ],
            "overview": "A merchant app that receives payment requests from external systems and processes credit card transactions, listening on a static IP.",
            "responsibilities": [
                "Built the application codebase from scratch using MVI architecture, Jetpack Compose, and Koin.",
                "Built a payment module with PAX SDK supporting sale, authorization, transaction adjustment, and batch settlement on PAX devices.",
                "Built a payment module with TapLink SDK to support card payments on SUNMI devices.",
                "Researched JPMorgan Chase API to integrate payment processing into the app.",
                "Integrated AWS Amplify to handle cloud data storage and API communication with the backend.",
                "Implemented safeguards against double charges by tracking each request's transaction state and rejecting duplicate payment requests.",
                "Implemented the connection service to listen and handle payment requests reliably, processing around 200 transactions/day."
            ],
            "links": []
        },
        {
            "name": "QOrder",
            "meta": [
                {
                    "label": "Tech stack",
                    "value": [
                        "Android",
                        "Java",
                        "Executor",
                        "Material 3",
                        "PAX SDK"
                    ]
                }
            ],
            "overview": "A retail application similar to a point-of-sale system for the U.S. market, including payment processing directly in the app.",
            "responsibilities": [
                "Implemented a new auth-capture transaction workflow.",
                "Implemented surcharge calculation for credit and debit payments in line with current U.S. regulations.",
                "Resolved a recurring duplicate-transaction bug affecting live payment processing.",
                "Researched PAX SDK to improve payment features including sale, authorization, transaction adjustment, and batch settlement in both online and offline modes.",
                "Built a product barcode scanning feature to speed up order entry.",
                "Migrated UI components to Material 3."
            ],
            "links": []
        },
        {
            "name": "Spin",
            "meta": [
                {
                    "label": "Tech stack",
                    "value": [
                        "Jetpack Compose",
                        "Foreground Service",
                        "DataStore",
                        "WorkManager",
                        "Koin",
                        "MVVM Architecture"
                    ]
                }
            ],
            "overview": "A utility app that listens for IP address changes on the device and syncs the updated IP to the server to support the POS system.",
            "responsibilities": [
                "Implemented core application logic to detect and sync IP changes reliably and promptly.",
                "Handled edge cases across various network transition scenarios to minimize missed IP-sync events."
            ],
            "links": []
        },
        {
            "name": "Yakult Health Care",
            "meta": [
                {
                    "label": "Tech stack",
                    "value": [
                        "Navigation Component",
                        "Google Fit API",
                        "AWS Amplify",
                        "Amazon DynamoDB",
                        "Custom Charts",
                        "Hilt",
                        "Clean Architecture"
                    ]
                }
            ],
            "overview": "An app for tracking sleep and walking activity, then summarizing data and giving advice to users in reports.",
            "responsibilities": [
                "Integrated Google Fit API for tracking steps and sleep data.",
                "Integrated AWS Amplify to store user data on Amazon DynamoDB and handle API calls to the backend.",
                "Optimized application startup time by lazy-loading nav host destinations with ViewStub and flattening the UI hierarchy.",
                "Cloned and customized MPAndroidChart to build custom bar charts for daily/weekly activity reports."
            ],
            "links": []
        },
        {
            "name": "KDS",
            "meta": [
                {
                    "label": "Tech stack",
                    "value": [
                        "Flutter",
                        "GoRouter",
                        "Platform Channels",
                        "BLoC",
                        "Clean Architecture"
                    ]
                }
            ],
            "overview": "A kitchen display system that receives and displays orders from POS applications, helping kitchen staff track and manage order status in real time.",
            "responsibilities": [
                "Migrated the application from Xamarin to Flutter, improving performance and long-term maintainability.",
                "Built a complex grid UI to display orders in real time, handling around 50 orders/minute during peak load.",
                "Handled a continuous, high-frequency stream of incoming order data from multiple applications across the POS system.",
                "Implemented new order fulfillment workflows based on application settings."
            ],
            "links": [
                {
                    "label": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=com.blogic.blogickds"
                }
            ]
        },
        {
            "name": "Apricot",
            "meta": [
                {
                    "label": "Tech stack",
                    "value": [
                        "Java",
                        "Gradle Build Variants & Flavors",
                        "Google AdMob",
                        "Google Play Billing"
                    ]
                }
            ],
            "overview": "A news application that provides free and premium content.",
            "responsibilities": [
                "Integrated Google AdMob and Google Play Billing to monetize content in apps.",
                "Researched and implemented build variants and product flavors to customize UI and configuration for each app."
            ],
            "links": []
        },
        {
            "name": "Side Projects (solo-built)",
            "items": [
                {
                    "name": "Lockit",
                    "overview": "App-lock utility using AccessibilityService to detect the foreground app and overlay a secure lock screen.",
                    "meta": [
                        {
                            "label": "Tech stack",
                            "value": [
                                "Jetpack Compose",
                                "Navigation Compose",
                                "DataStore",
                                "AccessibilityService",
                                "MVI"
                            ]
                        }
                    ],
                    "links": [
                        {
                            "label": "Google Play",
                            "url": "https://play.google.com/store/apps/details?id=io.edenx.applock"
                        }
                    ]
                },
                {
                    "name": "Qik Font",
                    "overview": "Typography tool for images.",
                    "meta": [
                        {
                            "label": "Tech stack",
                            "value": [
                                "Jetpack Compose",
                                "Room",
                                "Kotlin Flow",
                                "Hilt"
                            ]
                        }
                    ],
                    "links": [
                        {
                            "label": "Google Play",
                            "url": "https://play.google.com/store/apps/details?id=io.edenx.qikfont"
                        }
                    ]
                },
                {
                    "name": "Color Battle",
                    "overview": "Reaction-speed mini game.",
                    "meta": [
                        {
                            "label": "Tech stack",
                            "value": [
                                "Jetpack Compose",
                                "Navigation Compose",
                                "Hilt",
                                "Kotlin Serialization",
                                "Google AdMob",
                                "MVI"
                            ]
                        }
                    ],
                    "links": [
                        {
                            "label": "Google Play",
                            "url": "https://play.google.com/store/apps/details?id=io.edenxwhistle.fingerchallenge"
                        }
                    ]
                }
            ]
        }
    ],
    "education": [
        {
            "school": "University of Information Technology - VNU-HCM",
            "date": "2017 - 2022",
            "location": "Ho Chi Minh City, Vietnam",
            "degree": "Engineer in Computer Networks and Communications"
        }
    ],
    "skills": [
        {
            "group": "Mobile",
            "items": [
                "Android SDK",
                "Kotlin",
                "Java",
                "Coroutines",
                "Navigation Component",
                "Room",
                "WorkManager",
                "Hilt",
                "Modularization",
                "Flutter"
            ]
        },
        {
            "group": "Architecture",
            "items": [
                "MVVM",
                "Clean Architecture",
                "MVI"
            ]
        },
        {
            "group": "Services",
            "items": [
                "Firebase",
                "Google Play Billing",
                "Google AdMob"
            ]
        },
        {
            "group": "Tools",
            "items": [
                "Android Studio",
                "Git",
                "Jenkins",
                "Agentic Skills",
                "Claude Code",
                "Multi-agent Workspace"
            ]
        }
    ],
    "languages": [
        "Vietnamese (Native)",
        "English (TOEIC 640 LR + 270 SW)"
    ]
};

export default DEFAULT_CV_DATA;
