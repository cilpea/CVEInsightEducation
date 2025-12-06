export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface CVELog {
  id: string;
  system: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  score: number;
  date: string;
}

export interface CNAPartner {
  name: string;
  logo: string; // Using placeholder or simple text
}

export type SeverityLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Critical';

export interface CVSSFactors {
  attackVector: number; // Network vs Local
  complexity: number; // Low vs High
  privileges: number; // None vs High
  userInteraction: number; // None vs Required
  confidentiality: number;
  integrity: number;
  availability: number;
}
