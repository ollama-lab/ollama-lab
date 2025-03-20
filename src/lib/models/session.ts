export interface Session {
  id: number;
  profileId: number;
  title: string | null;
  dateCreated: Date;
  currentModel: string;
  isH2h: boolean,
}

export type Role = "system" | "assistant" | "user" | "tool";

export type TransmissionStatus = "preparing" | "sending" | "sent" | "not sent";

export interface Chat {
  id: number;
  sessionId: number;
  role: Role;
  content: string;
  imageCount: number;
  dateSent?: Date;
  dateEdited?: Date;
  status: TransmissionStatus;
  agentId?: number;

  model?: string;

  versions?: number[] | null;

  thinking?: boolean;
  thoughts?: string | null;
  thoughtFor?: number | null;
}

export interface ChatHistory {
  chats: Chat[];
}

export type SessionRenameReturn = null | {
  id: number;
  title: string | null;
};

export type SessionCurrentModelReturn = null | {
  id: number;
  currentModel: string | null;
};

export type SessionMode = "normal" | "h2h";
