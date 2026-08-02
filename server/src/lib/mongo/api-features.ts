import { Query } from "mongoose";

export class ApiFeatures<T, TQuery extends Record<string, any>> {
  constructor(
    private query: Query<T[], T>,
    private readonly queryString: TQuery,
  ) {}

  getQuery(): Query<T[], T> {
    return this.query;
  }

  active() {
    this.query = this.query.find({
      isActive: true,
    });

    return this;
  }

  search(searchFields: readonly string[]) {
    const searchTerm = this.queryString.search;

    if (typeof searchTerm !== "string" || !searchTerm.trim()) {
      return this;
    }

    this.query = this.query.find({
      $or: searchFields.map((field) => ({
        [field]: {
          $regex: searchTerm.trim(),
          $options: "i",
        },
      })),
    });

    return this;
  }

  sort(allowedSortFields: readonly string[]) {
    const sortBy = this.queryString.sort as string | undefined;

    if (!sortBy) {
      this.query = this.query.sort({
        createdAt: -1,
      });

      return this;
    }

    if (!allowedSortFields.includes(sortBy)) {
      return this;
    }

    const order = this.queryString.order === "asc" ? 1 : -1;

    this.query = this.query.sort({
      [sortBy]: order,
    });

    return this;
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page) || 1, 1);
    const limit = Math.max(parseInt(this.queryString.limit) || 10, 1);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  limitFields(allowedFields: readonly string[]) {
    const fields = this.queryString.fields as string | undefined;

    if (!fields) {
      return this;
    }

    const selectedFields = fields
      .split(",")
      .map((field) => field.trim())
      .filter((field) => allowedFields.includes(field));

    if (selectedFields.length === 0) {
      return this;
    }

    this.query = this.query.select(selectedFields.join(" "));

    return this;
  }
}
