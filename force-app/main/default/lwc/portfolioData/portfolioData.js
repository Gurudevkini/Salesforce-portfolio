/**
 * Single source of truth for portfolio content.
 * Edit this file (and the Custom Labels) to update the site; components contain no copy.
 *
 * Anything written as "[ADD ...]" is a deliberate placeholder for details that were not
 * provided. Search the repo for "[ADD" to find every one.
 */
import ASSETS from '@salesforce/resourceUrl/GurudevKiniAssets';
import NAME from '@salesforce/label/c.Portfolio_Name';
import ROLE from '@salesforce/label/c.Portfolio_Role';
import TAGLINE from '@salesforce/label/c.Portfolio_Tagline';
import EMAIL from '@salesforce/label/c.Portfolio_Email';
import LINKEDIN_URL from '@salesforce/label/c.Portfolio_LinkedIn_Url';
import GITHUB_URL from '@salesforce/label/c.Portfolio_GitHub_Url';

// Files inside force-app/.../staticresources/GurudevKiniAssets/
export const RESUME_FILE = 'Gurudev-Kini-Resume.pdf';
export const PROFILE_IMAGE_FILE = 'profile.jpg';

export const profile = {
    name: NAME,
    role: ROLE,
    tagline: TAGLINE,
    status: 'Computer Science & Engineering student',
    focus: [
        'Full-stack development',
        'React',
        'JavaScript',
        'Java',
        'C++',
        'SQL',
        'Backend development',
        'AI engineering',
        'Computer networks'
    ],
    email: EMAIL,
    githubUrl: GITHUB_URL,
    linkedinUrl: LINKEDIN_URL,
    resumeUrl: `${ASSETS}/${RESUME_FILE}`,
    photoUrl: `${ASSETS}/${PROFILE_IMAGE_FILE}`
};

export const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'github', label: 'GitHub' },
    { id: 'involvement', label: 'Involvement' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
];

export const about = {
    paragraphs: [
        'I am a Computer Science & Engineering student who likes to understand how things work at their core, then build something practical on top of that understanding. Most of my work is full-stack: React front ends, Node and Express APIs, and MongoDB and Redis behind them.',
        'I care about the parts users never see: caching strategy, authentication, API design and deployment. I also enjoy working closer to the metal, which is why I am building a deep packet inspection system in C++.'
    ],
    pillars: [
        {
            id: 'fullstack',
            title: 'Full-stack development',
            body: 'React and Tailwind on the front end; Node.js, Express and REST APIs on the back end; deployed across Vercel and Render.'
        },
        {
            id: 'dsa',
            title: 'Problem solving and DSA',
            body: 'Java and C++ for data structures and algorithms, applied to practical problems such as collision-resistant ID generation and cache design.'
        },
        {
            id: 'ai',
            title: 'AI engineering',
            body: 'AI-powered products: prompt-to-website generation through OpenRouter, and an XGBoost-based stock recommendation service behind a FastAPI inference layer.'
        },
        {
            id: 'networks',
            title: 'Computer networks',
            body: 'A C++ deep packet inspection project that analyzes traffic and applies network policies.'
        },
        {
            id: 'community',
            title: 'Community and open source',
            body: 'Open-source contributor since 2024, General Secretary at Canara Engineering College, and technical coordinator for the Aakriti 2026 college fest.'
        }
    ]
};

/**
 * Project fields:
 *  - result: one measurable outcome shown beside the project
 *  - highlights: short, factual bullets
 *  - links.live / links.github: shown only when they start with http(s)
 */
export const projects = [
    {
        id: 'pagemint',
        title: 'PageMint',
        kind: 'AI website builder SaaS',
        featured: false,
        summary:
            'A full-stack AI website generator that turns natural-language prompts into responsive multi-page web applications, which users can then edit in the browser.',
        result: { value: '< 200 ms', label: 'for cached generations, down from 4 to 5 minutes' },
        highlights: [
            'Streams generated code into an in-browser Monaco editor, with live preview and project management.',
            'Redis caching for recurring prompts and session data.',
            'Firebase OAuth, HTTP-only JWT cookies and a custom isAuth middleware; Razorpay payment integration.',
            'Modular MVC backend: 11 REST APIs, 4 route modules and 3 Mongoose models, deployed as a monorepo on Vercel and Render.'
        ],
        stack: [
            'React.js',
            'Tailwind CSS',
            'Node.js',
            'Express.js',
            'MongoDB',
            'Redis',
            'OpenRouter API',
            'Firebase Auth',
            'JWT',
            'Razorpay',
            'Monaco Editor'
        ],
        links: {
            live: 'https://page-mint.vercel.app/',
            github: 'https://github.com/Gurudevkini/PageMint'
        }
    },
    {
        id: 'linksense',
        title: 'LinkSense',
        kind: 'Production URL shortener',
        featured: false,
        summary:
            'A full-stack URL shortener with custom aliases and Nanoid-generated short URLs, managing 1,000+ unique links with fast, collision-resistant identifiers.',
        result: { value: '83%', label: 'lower lookup latency, from 120 ms to under 20 ms' },
        highlights: [
            'Redis cache-aside redirection cut MongoDB read operations by over 80%.',
            'Google Safe Browsing integration for multi-layer malicious URL filtering, with an in-memory fallback store to keep redirects available.',
            'Link analytics and a REST API for creating and resolving links.'
        ],
        stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redis', 'Nanoid'],
        links: {
            live: 'https://link-sense.vercel.app/',
            github: 'https://github.com/Gurudevkini/LinkSense'
        }
    },
    {
        id: 'stockly',
        title: 'Stockly',
        kind: 'Stock recommendation platform',
        featured: false,
        summary:
            'A machine-learning platform that turns an investment amount, risk appetite and sector preferences into personalized portfolio recommendations.',
        result: { value: '2,318', label: 'NSE-listed companies processed' },
        highlights: [
            'Engineered 39 technical indicators (including RSI, MACD and VWAP distance) and trained an XGBoost model with 1,200 boosting rounds to predict 120-day returns.',
            'Dual-service backend: a Node.js/Express API gateway in front of a Python/FastAPI inference service.',
            'React and TypeScript interface with multi-sector filtering across 20 industry sectors.'
        ],
        stack: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'Python', 'FastAPI', 'XGBoost'],
        links: {
            live: '',
            github: 'https://github.com/Gurudevkini/Stockly'
        }
    },
    {
        id: 'dpi',
        title: 'Deep Packet Inspection System',
        kind: 'Computer networks and systems project',
        featured: true,
        summary:
            'A C++ network traffic inspection system that analyzes packets and applies network policies.',
        result: { value: '[ADD METRIC]', label: 'Throughput, rules supported, or similar' },
        highlights: [
            'Packet inspection: [ADD IMPLEMENTATION DETAIL]',
            'Website and domain filtering: [ADD IMPLEMENTATION DETAIL]',
            'Traffic monitoring: [ADD IMPLEMENTATION DETAIL]',
            'Bandwidth control and policy enforcement: [ADD IMPLEMENTATION DETAIL]'
        ],
        stack: ['C++', 'Computer Networks'],
        links: {
            live: '',
            github: '[ADD REPOSITORY URL]'
        }
    }
];

export const involvement = [
    {
        id: 'gensec',
        period: 'Sep 2025 – Present',
        role: 'General Secretary',
        org: 'Canara Engineering College',
        points: [
            'Represent student interests to faculty and administration.',
            'Coordinate and drive student-led initiatives.',
            'Collaborate with college leadership on campus policy.',
            'Support campus activities and community engagement.'
        ]
    },
    {
        id: 'aakriti',
        period: 'Jan 2026 – Mar 2026',
        role: 'Technical Main Coordinator',
        org: 'Aakriti 2026 college fest',
        points: [
            'Coordinated 12+ technical events for 200+ participants.',
            'Managed end-to-end logistics and team communication.',
            'Oversaw judging criteria, scheduling and execution.',
            'Resolved real-time issues during live event days.'
        ]
    },
    {
        id: 'cr',
        period: '2023 – 2025',
        role: 'Class Representative',
        org: 'Canara Engineering College',
        points: [
            'Represented student interests across two academic years.',
            'Managed peer communication with department faculty.',
            'Coordinated academic schedules and announcements.',
            'Supported student welfare and conflict resolution.'
        ]
    },
    {
        id: 'oss',
        period: '2024 – Present',
        role: 'Open Source Contributor',
        org: 'GitHub public projects',
        points: [
            'Raised issues, submitted pull requests and reviewed code.',
            'Built reusable components shared with the community.',
            '160+ contributions tracked on the GitHub contribution graph.'
        ]
    }
];

export const skillGroups = [
    {
        id: 'languages',
        label: 'Languages',
        items: ['JavaScript', 'Java', 'C++', 'Python', 'SQL', 'TypeScript']
    },
    { id: 'frontend', label: 'Front end', items: ['React.js', 'Tailwind CSS'] },
    {
        id: 'backend',
        label: 'Back end',
        items: ['Node.js', 'Express.js', 'REST APIs', 'FastAPI', 'JWT and Firebase authentication']
    },
    { id: 'data', label: 'Databases', items: ['MongoDB', 'Redis', 'SQL'] },
    {
        id: 'ai',
        label: 'AI and machine learning',
        items: ['OpenRouter API', 'XGBoost', 'Feature engineering']
    },
    {
        id: 'cs',
        label: 'Computer science',
        items: ['Data structures and algorithms', 'Computer networks']
    },
    {
        id: 'tools',
        label: 'Tools and platforms',
        items: ['Git and GitHub', 'Docker', 'Vercel', 'Render', 'Razorpay']
    }
];

export const contact = {
    intro: 'I am open to collaborations and opportunities. The quickest way to reach me is the form below, or through LinkedIn.'
};
