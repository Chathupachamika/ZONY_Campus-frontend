interface AIResponse {
    candidates?: {
      content?: {
        parts?: { text: string }[];
      };
    }[];
    responseMessage?: string; 
  }
  