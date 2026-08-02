export const PRODUCT_QUERY_CONFIG = {
  searchableFields: [
    "name",
    "description",
  ] as const,

  sortableFields: [
    "name",
    "price",
    "stock",
    "createdAt",
  ] as const,

  selectableFields: [
    "name",
    "description",
    "price",
    "stock",
    "images",
    "categoryId",
    "slug",
    "sku",
    "createdAt",
    "updatedAt",
  ] as const,
};