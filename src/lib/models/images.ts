export interface ImagePreview {
  path: string;
  mime: string;
  base64: string;
}

export interface ImageReturn {
  id: number;
  origin: string | null;
  base64: string;
  mime: string;
}
