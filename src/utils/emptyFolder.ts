import fs from "fs-extra";
// removes all files but keeps the folder
export const emptyFolder = async (folderPath: string) => {
  await fs.emptyDir(folderPath);
};
