
import { Page, AppSettings } from './types';

// Helper to generate UUIDs (simplified for constants)
const uuid = () => Math.random().toString(36).substring(2, 9);

export const DEFAULT_SETTINGS: AppSettings = {
  appName: 'The Woodlands Law Firm Portal',
  appIcon: 'layout',
  background: 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black',
  headerStyle: 'bg-slate-900/60'
};

export const BACKGROUND_PRESETS = [
  { name: 'Default Dark', value: 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black' },
  { name: 'Midnight Blue', value: 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black' },
  { name: 'Deep Forest', value: 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-950 to-black' },
  { name: 'Royal Purple', value: 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950 via-slate-950 to-black' },
  { name: 'Slate Grey', value: 'bg-slate-900' },
];

export const HEADER_PRESETS = [
  { name: 'Glass Dark', value: 'bg-slate-900/60' },
  { name: 'Glass Light', value: 'bg-white/10' },
  { name: 'Solid Dark', value: 'bg-slate-900' },
  { name: 'Solid Blue', value: 'bg-blue-900/80' },
];

export const INITIAL_PAGES: Page[] = [
  {
    id: 'home',
    title: 'Home Dashboard',
    description: 'Central hub for firm resources, news, and daily operations.',
    widgets: [
      {
        id: uuid(),
        title: 'Firm Resources',
        type: 'bookmarks',
        size: 'medium',
        viewStyle: 'grid',
        gridItemSize: 'large',
        bookmarks: [
          { id: uuid(), title: 'Office 365', url: 'https://www.office.com', description: 'Email, OneDrive, and Office Apps' },
          { id: uuid(), title: 'Clio', url: 'https://www.clio.com', description: 'Case Management System' },
          { id: uuid(), title: 'Slack', url: 'https://slack.com', description: 'Internal Communication' },
          { id: uuid(), title: 'Zoom', url: 'https://zoom.us', description: 'Video Conferencing' },
          { id: uuid(), title: 'ADP', url: 'https://www.adp.com', description: 'Payroll & HR' },
          { id: uuid(), title: 'DocuSign', url: 'https://www.docusign.com', description: 'E-Signatures' },
        ]
      },
      {
        id: uuid(),
        title: 'Legal Research',
        type: 'bookmarks',
        size: 'medium',
        viewStyle: 'detailed',
        gridItemSize: 'large',
        bookmarks: [
          { id: uuid(), title: 'Westlaw', url: 'https://legal.thomsonreuters.com/en/products/westlaw', description: 'Primary legal research database' },
          { id: uuid(), title: 'LexisNexis', url: 'https://www.lexisnexis.com', description: 'Legal research and analytics' },
          { id: uuid(), title: 'Google Scholar', url: 'https://scholar.google.com', description: 'Free case law search' },
          { id: uuid(), title: 'Cornell LII', url: 'https://www.law.cornell.edu', description: 'Legal Information Institute' },
        ]
      },
      {
        id: uuid(),
        title: 'Courts & Filing',
        type: 'bookmarks',
        size: 'small',
        viewStyle: 'list',
        gridItemSize: 'large',
        bookmarks: [
          { id: uuid(), title: 'PACER', url: 'https://pacer.uscourts.gov', description: 'Public Access to Court Electronic Records' },
          { id: uuid(), title: 'Supreme Court', url: 'https://www.supremecourt.gov', description: 'SCOTUS Opinions and Dockets' },
          { id: uuid(), title: 'State Courts', url: 'https://www.ncsc.org', description: 'National Center for State Courts' },
          { id: uuid(), title: 'USPTO', url: 'https://www.uspto.gov', description: 'Patent and Trademark Office' },
        ]
      },
      {
        id: uuid(),
        title: 'News & Updates',
        type: 'bookmarks',
        size: 'large',
        viewStyle: 'list',
        gridItemSize: 'large',
        bookmarks: [
          { id: uuid(), title: 'SCOTUSblog', url: 'https://www.scotusblog.com', description: 'Supreme Court of the United States Blog' },
          { id: uuid(), title: 'ABA Journal', url: 'https://www.abajournal.com', description: 'American Bar Association News' },
          { id: uuid(), title: 'Law.com', url: 'https://www.law.com', description: 'Legal News and Analysis' },
          { id: uuid(), title: 'Wall Street Journal', url: 'https://www.wsj.com', description: 'Financial News' },
          { id: uuid(), title: 'New York Times', url: 'https://www.nytimes.com', description: 'Daily News' },
        ]
      }
    ]
  },
  {
    id: 'litigation',
    title: 'Litigation Tools',
    description: 'Specialized tools for e-discovery, document review, and trial prep.',
    widgets: [
      {
        id: uuid(),
        title: 'E-Discovery',
        type: 'bookmarks',
        size: 'full',
        viewStyle: 'grid',
        gridItemSize: 'large',
        bookmarks: [
          { id: uuid(), title: 'Relativity', url: 'https://www.relativity.com', description: 'E-Discovery Platform' },
          { id: uuid(), title: 'Logikcull', url: 'https://www.logikcull.com', description: 'Cloud-based Discovery' },
          { id: uuid(), title: 'Everlaw', url: 'https://www.everlaw.com', description: 'Modern Litigation Support' },
        ]
      }
    ]
  }
];
