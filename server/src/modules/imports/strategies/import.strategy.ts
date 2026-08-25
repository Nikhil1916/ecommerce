export interface ImportStrategy {
  validate(
    row: Record<string, unknown>,
    rowNumber: number,
  ): Promise<void>;

  import(
    row: Record<string, unknown>,
  ): Promise<void>;
}