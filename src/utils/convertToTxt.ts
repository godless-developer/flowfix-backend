import fs from "fs";
import mammoth from "mammoth";
import XLSX from "xlsx";
import pdfParse from "pdf-parse";

//xls ,xlsx , pdf ,docx
export const convertToTxt = async ({
  input,
}: {
  input: { filePath: string; fileName: string };
}) => {
  const { filePath, fileName } = input;

  let converted = "";

  const fileType = fileName.split(".")[1];

  switch (fileType) {
    case "docx":
      const result = await mammoth.extractRawText({ path: filePath });
      converted = result.value;
      break;
    case "xls":
    case "xlsx":
      {
        const workbook = XLSX.readFile(filePath);
        converted = workbook.SheetNames.map((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          return XLSX.utils.sheet_to_csv(sheet);
        }).join("\n\n");
      }
      break;
    case "pdf":
      {
        const result = fs.readFileSync(filePath);
        const res2 = await pdfParse(result);
        converted = res2.text;
      }
      break;
  }

  return converted;
};
