export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  CONVERTING = 'CONVERTING',
  SENDING_MAIL = 'SENDING_MAIL',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Language = 'Hindi' | 'Marathi' | 'English';
export type VoiceGender = 'Male' | 'Female';
export type GenerationMode = 'image' | 'video';

export interface GenerationRequest {
  file: File;
}

export interface GeneratedContent {
  originalName: string;
  convertedName: string;
  recipient: string;
  cdrUrl: string; // URL to the blob
}

// Keeping Course interface for potential future use, though not used in this specific view
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  modules: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}
