import { Project, Award, Testimonial } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'The Nexus Commercial Hub',
    category: 'Commercial Architecture',
    year: '2024',
    location: 'Mumbai, India',
    description: 'A state-of-the-art commercial complex featuring sustainable modular construction and integrated smart-building infrastructure.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
    stats: [
      { label: 'Area', value: '450,000 sq.ft' },
      { label: 'Efficiency', value: '92%' },
      { label: 'Timeline', value: '18 Months' }
    ]
  },
  {
    id: '2',
    title: 'Industrial Logistics Park',
    category: 'Infrastructure',
    year: '2023',
    location: 'Gujarat, India',
    description: 'Large-scale industrial facility designed for maximum throughput and structural longevity, utilizing advanced civil engineering techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070',
    stats: [
      { label: 'Span', value: '120m Clear' },
      { label: 'Load', value: '15T/sqm' },
      { label: 'Sustainability', value: 'LEED Gold' }
    ]
  },
  {
    id: '3',
    title: 'Maavis Corporate HQ',
    category: 'Interior Fit-out',
    year: '2023',
    location: 'Bangalore, India',
    description: 'A premium interior design project reflecting the core values of Maavis Projects: transparency, efficiency, and modern aesthetics.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069',
    stats: [
      { label: 'Workstations', value: '250+' },
      { label: 'Design Style', value: 'Minimalist' },
      { label: 'Materials', value: 'Sustainable' }
    ]
  }
];

export const AWARDS: Award[] = [
  { year: '2024', title: 'Excellence in Civil Engineering', organization: 'National Construction Council' },
  { year: '2023', title: 'Sustainable Design of the Year', organization: 'Green Building Forum' },
  { year: '2022', title: 'Innovation in Modular Construction', organization: 'Global Infrastructure Summit' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rajesh Khanna',
    role: 'CEO',
    company: 'Nexus Group',
    content: 'The level of precision and commitment to timelines shown by the Principal Designer at Maavis is unparalleled in the industry.',
    avatarUrl: 'https://i.pravatar.cc/150?u=rajesh'
  },
  {
    name: 'Sarah Mitchell',
    role: 'Project Director',
    company: 'Global Logistics',
    content: 'Transforming complex infrastructure requirements into elegant architectural solutions is where they truly excel.',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
  }
];

export const PHILOSOPHY = {
  title: 'Precision in Every Beam, Purpose in Every Space.',
  description: 'At Maavis Projects, we don\'t just build; we engineer environments. Our approach combines the rigor of civil construction with the soul of architectural design, ensuring that every project is as functional as it is visually striking.'
};

export const SKILLS = [
  'Civil Construction',
  'Modular Buildings',
  'Infrastructure Design',
  'Interior Fit-outs',
  'Project Management',
  'Sustainable Engineering',
  'BIM Modeling',
  'Structural Analysis'
];
