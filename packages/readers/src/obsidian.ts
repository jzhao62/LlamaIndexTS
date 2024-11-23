import { type BaseReader, Document } from "@llamaindex/core/schema";
import * as fs from "node:fs";
import path from "node:path";
import { MarkdownReader } from "./markdown";

export class ObsidianReader implements BaseReader<Document> {
  protected inputDir: string;
  protected docs: Document[] = [];

  constructor(inputDir: string) {
    this.inputDir = inputDir;
  }

  private traverse = async (dir: string) => {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const filepath = path.join(dir, file.name);
      if (file.isDirectory() && !file.name.startsWith(".")) {
        await this.traverse(filepath);
      } else if (file.isFile() && file.name.endsWith(".md")) {
        const content = await new MarkdownReader().loadData(filepath);
        this.docs.push(...content);
      }
    }
  };

  async loadData(): Promise<Document[]> {
    await this.traverse(this.inputDir);
    return this.docs;
  }
}
