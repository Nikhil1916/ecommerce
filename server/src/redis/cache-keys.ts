export const CacheKeys = {
  product: (id: string) => `product:${id}`,

  productSlug: (slug: string) => `product:slug:${slug}`,

  products: (page: number, limit: number) =>
    `products:page:${page}:limit:${limit}`,
} as const;