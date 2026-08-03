const SKU_PREFIX = "PRD";

const SKU_PADDING = 6;

export function generateSKU(
  sequence: number
): string {
  return `${SKU_PREFIX}-${sequence
    .toString()
    .padStart(SKU_PADDING, "0")}`;
}