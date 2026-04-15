const sampleResumeData = {
  personalInfo: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    website: 'alexjohnson.dev',
    summary:
      'Passionate full stack engineer with 5 years of experience building scalable web applications. Skilled in React, Node.js and PostgreSQL with a strong focus on clean code and team collaboration.',
  },
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'New York, USA',
      startDate: 'Jan 2022',
      endDate: 'Present',
      description:
        'Led a team of 5 engineers to build and maintain core infrastructure services. Reduced API response time by 40% through query optimisation and caching strategies.',
    },
    {
      title: 'Software Engineer',
      company: 'Stripe',
      location: 'San Francisco, USA',
      startDate: 'Jun 2019',
      endDate: 'Dec 2021',
      description:
        'Built and maintained payment processing features used by over 2 million merchants. Collaborated closely with product and design teams to ship high-quality features on time.',
    },
  ],
  education: [
    {
      degree: 'BSc',
      field: 'Computer Science',
      institution: 'Massachusetts Institute of Technology',
      gpa: '3.9',
      startDate: '2015',
      endDate: '2019',
    },
  ],
  skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'AWS', 'REST APIs', 'Git'],
  projects: [
    {
      title: 'JobPilot',
      url: 'github.com/jobpilot',
      description:
        'Full stack job application tracker and resume builder built with React, Express and PostgreSQL.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    },
    {
      title: 'OpenMetrics',
      url: 'github.com/openmetrics',
      description:
        'Open source analytics dashboard for monitoring API performance and uptime in real time.',
      technologies: ['Vue.js', 'Python', 'Redis', 'Docker'],
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Developer — Associate',
      issuer: 'Amazon Web Services',
      date: '2022',
    },
    {
      name: 'Google Professional Cloud Architect',
      issuer: 'Google Cloud',
      date: '2023',
    },
  ],
  section_order: [
    'personalInfo',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
  ],
};

export default sampleResumeData;
