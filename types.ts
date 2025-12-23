
export interface ScriptConfig {
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
