export interface ChatGenerationReturn {
  id: number;
  dateCreated: Date;
}

export interface IncomingUserPrompt {
  text: string;
  imagePaths?: string[];
  useSystemPrompt?: boolean;
}

export interface EditUserPrompt {
  text?: string;
  imagePaths?: string[];
  useSystemPrompt?: boolean;
}
