export interface Tool {
  name: string;
  desc: string;
  author: string;
  stars: number;
  license: string;
  lang: string;
  url: string;
  install: string;
  ru?: boolean;
  category: string;
  tags: string[];
}

export const cliTools: Tool[] = [];
