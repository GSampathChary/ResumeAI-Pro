import type { AnalysisResponse, ResumeProfile } from "@/src/lib/types";

export const sampleJobDescription = `Software Developer
Company: ICAR - Indian Institute of Rice Research (IIRR)
Duration: Dec 2024 - Present

Designed and developed cross-platform web and mobile applications using Flutter, Python, and Spring Boot.
Built RESTful APIs and integrated backend services with PostgreSQL databases.
Developed AI-powered crop disease detection solutions using TensorFlow, Keras, and TFLite models.
Collaborated with scientists and stakeholders to gather requirements and deliver user-focused software solutions.
Optimized application performance, fixed bugs, and implemented new features to improve user experience.
Integrated authentication, role-based access control, image processing, and cloud-based data management.
Participated in code reviews, testing, deployment, and maintenance of production applications.
Worked with Git for version control and followed Agile development practices.`;

export const sampleResumeText = `GANNOJU SAMPATH CHARY
AI & Full Stack Developer
gsampathchary454@gmail.com | +91 8639556268 | Hyderabad, Telangana, India
github.com/GSampathChary | linkedin.com/in/sampath-chary

Professional Summary
AI & Full Stack Developer with 1.8+ years of experience independently designing, developing, training, deploying, and maintaining production-ready AI applications end-to-end. Expertise across Flutter, React.js, Python, Spring Boot, FastAPI, TensorFlow, PyTorch, and PostgreSQL, with strong hands-on experience in Computer Vision, Deep Learning, and REST API development.

Core Competencies
Artificial Intelligence & ML | Computer Vision & Deep Learning | Full Stack Development | Mobile App Development | REST API & Backend Design | Database Design | Model Deployment & Optimization | Production Deployment

Technical Skills
Languages: Python, Java, JavaScript, SQL, Dart
Frontend: Flutter, React.js, HTML5, CSS3, Bootstrap
Backend: Spring Boot, FastAPI, REST APIs
AI / ML: TensorFlow, PyTorch, Keras, ONNX Runtime, TFLite, OpenCV, Scikit-learn
Database: PostgreSQL, MySQL, Firebase
Tools: Docker, Git, GitHub, Postman, Google Play Console

Experience
Young Professional - I (AI & Full Stack Developer)
ICAR - Indian Institute of Rice Research (IIRR), Hyderabad
Dec 2024 - Present

Independently designed and developed a complete AI-powered web and mobile application.
Developed responsive mobile applications using Flutter and built admin/scientist portals with React.js.
Designed scalable backend services using Spring Boot and FastAPI, and developed secure REST APIs.
Integrated trained Deep Learning models using PyTorch, TensorFlow, and ONNX Runtime inference pipelines.
Designed the PostgreSQL database schema, optimized API/query performance, and managed authentication and role-based access.
Collaborated with agricultural scientists to refine datasets and improve real-world model prediction accuracy.
Independently deployed applications to production servers and published the Android app on the Google Play Store.

Education
B.Tech, Computer Science | 2019 - 2023
Gurunanak Institutions Technical Campus, Hyderabad, TS`;

export const defaultProfile: ResumeProfile = {
  source_filename: "GSampathChary_resume (1).docx",
  file_type: "docx",
  raw_text: sampleResumeText,
  contact: {
    name: "GANNOJU SAMPATH CHARY",
    email: "gsampathchary454@gmail.com",
    phone: "+91 8639556268",
    location: "Hyderabad, Telangana, India",
    links: ["github.com/GSampathChary", "linkedin.com/in/sampath-chary"],
  },
  summary:
    "AI & Full Stack Developer with production experience across Flutter, React.js, Python, FastAPI, Spring Boot, TensorFlow, PyTorch, and PostgreSQL.",
  strengths: [
    "Strong ownership and end-to-end delivery",
    "Production deployment experience",
    "Cross-functional collaboration",
    "Applied AI and ML capability",
  ],
  weaknesses: [
    "Testing evidence is light or absent",
    "Impact metrics could be quantified more clearly",
  ],
  sections: [
    { title: "Summary", items: ["AI & Full Stack Developer with 1.8+ years of experience..."] },
    { title: "Skills", items: ["Python", "React.js", "Flutter", "FastAPI", "Spring Boot", "TensorFlow"] },
    { title: "Experience", items: ["ICAR - Indian Institute of Rice Research (IIRR)"] },
    { title: "Education", items: ["B.Tech, Computer Science"] },
  ],
  skills: [
    "Python",
    "React.js",
    "Flutter",
    "FastAPI",
    "Spring Boot",
    "TensorFlow",
    "PyTorch",
    "PostgreSQL",
    "Git",
    "Docker",
    "REST APIs",
  ],
  experience_highlights: [
    "Independently designed and developed a complete AI-powered web and mobile application.",
    "Built secure REST APIs and backend services.",
    "Integrated trained deep learning models into production inference pipelines.",
  ],
  projects: [
    "RAISE - Rice AI Stress Evaluator",
    "Flutter mobile app with React.js admin portal",
  ],
  education: ["B.Tech, Computer Science", "Gurunanak Institutions Technical Campus"],
  certifications: ["Google Play Console deployment"],
  languages: ["English", "Telugu"],
};

export const defaultAnalysis: AnalysisResponse = {
  profile: defaultProfile,
  ats: {
    overall_score: 86,
    formatting: 90,
    skills_match: 88,
    keywords: 84,
    projects: 88,
    experience: 90,
    education: 92,
    grammar: 92,
    detected_keywords: ["python", "fastapi", "postgresql", "react", "flutter"],
    missing_keywords: ["testing", "ci/cd", "aws"],
    suggestions: [
      "Add measurable impact metrics to each experience bullet.",
      "Include a dedicated testing section or mention test coverage explicitly.",
      "Tailor the opening summary to the target role.",
    ],
  },
  skills_gap: {
    detected_skills: ["Python", "React.js", "Flutter", "FastAPI", "Spring Boot", "TensorFlow", "PostgreSQL"],
    missing_skills: ["Testing", "CI/CD", "Cloud Deployment"],
    recommended_skills: ["Testing", "CI/CD", "Cloud Deployment", "System Design"],
    priority_skills: ["Testing", "CI/CD", "Cloud Deployment"],
    learning_resources: ["Official docs", "Hands-on project", "Short course or tutorial"],
  },
  interview: {
    technical: ["How would you structure a FastAPI service for file uploads and analysis?"],
    behavioral: ["Tell me about a time you owned a release end-to-end."],
    hr: ["Why do you want this role?"],
    project_based: ["Walk me through the architecture of your strongest project."],
    coding: ["Write a validation function for PDF and DOCX uploads."],
    scenario_based: ["How would you add a new LLM provider without rewriting the app?"],
  },
  linkedin: {
    headline: "AI & Full Stack Developer | Python | FastAPI | React | Flutter",
    about: "AI & Full Stack Developer building production-ready applications end-to-end.",
    skills: ["Python", "FastAPI", "React", "Flutter"],
    keywords: ["AI", "Full Stack", "Production"],
    professional_summary: "Production-focused developer with experience in AI, APIs, and deployment.",
    linkedin_id: "linkedin.com/in/sampath-chary",
    profile_updates: [
      "Headline should mirror the target role.",
      "About section should emphasize measurable outcomes.",
      "Featured projects should be aligned to the selected domain.",
    ],
  },
  cover_letter: {
    company_name: "ICAR - Indian Institute of Rice Research",
    role: "Software Developer",
    cover_letter:
      "Dear Hiring Manager,\n\nI am excited to apply for the Software Developer role. My background spans AI, backend services, mobile development, and production deployment.\n\nSincerely,\nGANNOJU SAMPATH CHARY",
  },
  job_match: {
    matching_score: 87,
    matched_keywords: ["python", "fastapi", "react", "flutter", "postgresql"],
    missing_skills: ["testing", "ci/cd"],
    suggestions: ["Mirror more job description keywords in the summary and project bullets."],
    related_jobs: [
      { title: "Full Stack Engineer", reason: "Aligned with the resume stack and broad product delivery experience.", fit_score: 91 },
      { title: "Backend Engineer", reason: "Matches API, database, and deployment skills.", fit_score: 88 },
    ],
  },
  roadmap: {
    roadmap: ["Tighten the summary", "Quantify impact", "Build one focused portfolio project"],
    courses: ["Official docs", "Hands-on tutorial"],
    projects: ["Resume parser", "ATS dashboard", "Job match analyzer"],
    certifications: ["Optional cloud or AI certification"],
  },
  metadata: {
    roles_detected: ["Developer", "Engineer"],
  },
};
