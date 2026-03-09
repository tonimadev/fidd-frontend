export interface TutorialStep {
  text: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: string[];
}
