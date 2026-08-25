export interface ExcelParser {
  parse(filePath: string): Promise<Record<string, unknown>[]>;
}