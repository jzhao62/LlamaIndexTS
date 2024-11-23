import { ObsidianReader } from "@llamaindex/readers/obsidian";

const obsidianReader = new ObsidianReader(
  "/home/jingyi/Documents/jingyi-vault",
);

obsidianReader.loadData().then((documents) => {
  documents.forEach((doc) => {
    console.log(`document (${doc.id_}):`, doc.getText());
  });
});
