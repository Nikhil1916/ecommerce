import * as XLSX from "xlsx";
import { ExcelParser } from "./excel.parser";

export class XlsxParser implements ExcelParser {
  async parse(
    filePath: string,
  ): Promise<Record<string, unknown>[]> {
    const workbook = XLSX.readFile(filePath);

    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new Error("Excel file contains no sheets");
    }

    const worksheet =
      workbook.Sheets[firstSheetName];

    const rows =
      XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        {
          defval: null,
        },
      );

    return rows;
  }
}