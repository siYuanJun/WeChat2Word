
export interface ScriptConfig {
  urls: string[];
  includeImages: boolean;
  savePath: string;
  concurrency: number;
  filenameTemplate: string;
  useProxy: boolean;
}

export interface GeneratedScript {
  code: string;
  requirements: string[];
  usageInstructions: string;
}
