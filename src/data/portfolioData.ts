export type ProjectCategory = 'all' | 'vision' | 'systems';

export interface ProjectItem {
  id: 'indoor-nav' | 'safety-kit' | 'grid-auth';
  title: string;
  subtitle: string;
  date: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  stack: string[];
  metricValue: string;
  metricLabel: string;
  summary: string;
  highlights: string[];
  architecture: {
    input: string;
    processing: string;
    output: string;
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  focus: string;
  achievements: {
    lead: string;
    metric: string;
    detail: string;
    skills: string[];
  }[];
}

export interface SkillGroup {
  domain: string;
  items: string[];
}

export const PROFILE = {
  name: 'Niyati Singh',
  shortTitle: 'MS Computer Science, USC',
  location: 'Los Angeles, CA',
  email: 'niyatikartar@gmail.com',
  phone: '+1 (213) 829-4379',
  linkedin: 'https://www.linkedin.com/in/niyati-singh1',
  linkedinDisplay: 'linkedin.com/in/niyati-singh1',
  github: 'https://github.com/NiySingh',
  githubDisplay: 'github.com/NiySingh',
  resumeUrl: '/assets/aistudio/Niyati_Singh_Internship_Resume_362af5d8.pdf',
  headline: 'Engineering real-time vision pipelines and scalable web systems.',
  bio: 'Master of Science in Computer Science candidate at the University of Southern California (Class of 2028) and B.E. Computer Engineering graduate (9.06/10 CGPA). Focused on deploying YOLOv8 perception models, BLE indoor localization graphs, and low-latency React and Python architectures.',
};

export const KEY_METRICS = [
  {
    value: '98.0%',
    label: 'Indoor Localization Accuracy',
    context: 'BLE RSSI fingerprinting + graph routing across 8 floors',
  },
  {
    value: '97.5%',
    label: 'License Plate Recognition',
    context: '10,000+ CCTV frames processed at Bharat Electronics',
  },
  {
    value: '30,000+',
    label: 'Active Platform Users',
    context: 'Real-time autocomplete search at Hubble Connected',
  },
  {
    value: '9.06 / 10',
    label: 'Undergraduate CGPA',
    context: 'B.E. Computer Engineering, Mumbai · Now MS CS at USC',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'indoor-nav',
    title: 'Graph-Based Indoor Navigation Using BLE RSSI Localization',
    subtitle: 'Multi-floor spatial routing with live YOLOv8 obstacle avoidance and TTS guidance',
    date: 'April 2026',
    category: 'vision',
    categoryLabel: 'Computer Vision & Mobile',
    stack: ['Python', 'Kotlin', 'YOLOv8', 'OpenCV', 'BLE Beacons'],
    metricValue: '98.0%',
    metricLabel: 'Localization accuracy across 8 floors',
    summary:
      'Designed an end-to-end indoor navigation pipeline combining Bluetooth Low Energy RSSI fingerprinting, Dijkstra shortest-path routing on floor-map graphs, and on-device YOLOv8 obstacle detection.',
    highlights: [
      'Combined BLE RSSI signal fingerprinting with graph-based path planning and YOLOv8, reaching 98% indoor localization accuracy.',
      'Deployed real-time obstacle detection inside a Kotlin Android application using OpenCV and YOLOv8.',
      'Enabled multi-floor navigation across 8 building levels with Dijkstra pathfinding and live text-to-speech turn-by-turn guidance.',
    ],
    architecture: {
      input: 'BLE Beacon RSSI vectors + Android camera feed (30 FPS)',
      processing: 'RSSI fingerprint matching + Dijkstra floor-graph solver + YOLOv8 obstacle inference',
      output: 'Dynamic re-routed path + Text-to-Speech spatial cues',
    },
  },
  {
    id: 'safety-kit',
    title: 'Safety Kit Detection System',
    subtitle: 'Automated industrial PPE compliance monitoring under variable lighting',
    date: 'July 2025',
    category: 'vision',
    categoryLabel: 'Computer Vision',
    stack: ['Python', 'YOLOv8', 'OpenCV'],
    metricValue: '96.0%',
    metricLabel: 'PPE detection accuracy',
    summary:
      'Trained and hyperparameter-tuned a YOLOv8 personal protective equipment detector paired with an OpenCV video inference pipeline for continuous factory safety verification.',
    highlights: [
      'Trained and optimized a YOLOv8 PPE detection model using targeted image augmentation and hyperparameter tuning in Python, achieving 96% detection accuracy.',
      'Built a real-time Python and OpenCV video processing pipeline to classify multiple safety-equipment classes across varying lighting and environmental conditions.',
    ],
    architecture: {
      input: 'Industrial camera stream + augmented PPE training frames',
      processing: 'YOLOv8 multi-class inference + OpenCV frame preprocessing',
      output: 'Real-time bounding boxes & compliance class alerts',
    },
  },
  {
    id: 'grid-auth',
    title: 'Graphical Grid Authentication System',
    subtitle: 'Modular Flask & SQLite authentication engine with spatial grid verification',
    date: 'June 2025',
    category: 'systems',
    categoryLabel: 'Backend & Security',
    stack: ['Python', 'Flask', 'SQLite', 'HTML', 'CSS'],
    metricValue: '93.7%',
    metricLabel: 'Verification accuracy',
    summary:
      'Engineered a graphical grid-based password verification application backed by modular REST API workflows, secure session management, and persistent SQLite storage.',
    highlights: [
      'Developed a Flask authentication application supporting grid-based coordinate verification, session lifecycle management, and SQLite persistence at 93.7% verification accuracy.',
      'Architected clean REST API endpoints for user registration, spatial pattern authentication, and credential storage.',
    ],
    architecture: {
      input: 'Interactive coordinate grid sequence + user session token',
      processing: 'Flask REST API validation + hashed coordinate comparison',
      output: 'Authenticated session state persisted in SQLite',
    },
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'iiser',
    role: 'Undergraduate Research Intern',
    organization: 'Indian Institute of Science Education and Research',
    location: 'Mohali, India',
    period: 'July 2024 – April 2026',
    focus: 'Computer Vision & Indoor Localization Research',
    achievements: [
      {
        lead: 'Automated Factory Safety Monitoring',
        metric: '96% detection accuracy',
        detail:
          'Developed and deployed a YOLOv8 computer vision pipeline using Python, OpenCV, and AWS EC2 for real-time industrial hazard and safety compliance monitoring.',
        skills: ['Python', 'YOLOv8', 'OpenCV', 'AWS (EC2, S3, CloudWatch)'],
      },
      {
        lead: 'Assistive Indoor Wayfinding',
        metric: '98% localization accuracy',
        detail:
          'Integrated BLE RSSI fingerprinting, graph-based path planning, and YOLOv8 perception to deliver text-to-speech navigation guidance inside complex indoor environments.',
        skills: ['Python', 'YOLOv8', 'OpenCV', 'Kotlin'],
      },
    ],
  },
  {
    id: 'bel',
    role: 'Summer Trainee',
    organization: 'Bharat Electronics Limited',
    location: 'Panchkula, India',
    period: 'June 2025 – August 2025',
    focus: 'Intelligent Traffic & Surveillance Systems',
    achievements: [
      {
        lead: 'Automatic Number Plate Recognition',
        metric: '97.5% extraction accuracy',
        detail:
          'Built a YOLOv8-based vehicle number plate recognition pipeline using Python and OpenCV tailored for real-world CCTV surveillance feeds.',
        skills: ['Python', 'YOLOv8', 'OpenCV'],
      },
      {
        lead: 'High-Volume CCTV Frame Processing',
        metric: '10,000+ CCTV frames',
        detail:
          'Processed over 10,000 surveillance video frames using computer vision pipelines to extract vehicle license plates for automated e-challan enforcement workflows.',
        skills: ['Python', 'OpenCV', 'NumPy', 'Pandas'],
      },
    ],
  },
  {
    id: 'hubble',
    role: 'Software Engineer Intern',
    organization: 'Hubble Connected',
    location: 'Bengaluru, India (Remote)',
    period: 'April 2025 – June 2025',
    focus: 'Full-Stack Web & Product Discovery',
    achievements: [
      {
        lead: 'Real-Time Autocomplete Search',
        metric: '30,000+ users served',
        detail:
          'Implemented a low-latency autocomplete search experience using JavaScript, React.js, and REST APIs, directly streamlining product discovery across the platform.',
        skills: ['JavaScript', 'React.js', 'REST APIs'],
      },
      {
        lead: 'Scalable Component Architecture',
        metric: 'Reusable React UI system',
        detail:
          'Developed modular React.js components using useState, useEffect, and useContext to support dynamic rendering and predictable application state management.',
        skills: ['React.js', 'JavaScript', 'TypeScript'],
      },
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    domain: 'Languages',
    items: ['Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'Kotlin'],
  },
  {
    domain: 'Web & Backend Systems',
    items: ['Node.js', 'Flask', 'FastAPI', 'React.js', 'REST APIs', 'WebSockets', 'Microservices'],
  },
  {
    domain: 'Databases',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis'],
  },
  {
    domain: 'Cloud & DevOps',
    items: ['AWS (EC2, S3, CloudWatch)', 'Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'CI/CD'],
  },
  {
    domain: 'Machine Learning & Vision',
    items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'YOLOv8', 'NumPy', 'Pandas'],
  },
];

export const EDUCATION = [
  {
    degree: 'Master of Science in Computer Science',
    institution: 'University of Southern California',
    location: 'Los Angeles, CA',
    period: 'August 2026 – May 2028 (Expected)',
    note: 'Graduate focus in computer vision, machine learning systems, and distributed software engineering.',
  },
  {
    degree: 'Bachelor of Engineering in Computer Engineering',
    institution: 'Fr. C. Rodrigues Institute of Technology',
    location: 'Navi Mumbai, India',
    period: 'August 2022 – May 2026',
    note: 'CGPA: 9.06 / 10',
  },
];

export const COURSEWORK = [
  'Data Structures',
  'Computer Networks',
  'Analysis of Algorithms',
  'Database Management',
  'Artificial Intelligence',
  'Computer Architecture',
  'Operating Systems',
];
