import { CounterModel } from "../models/counter.model";
import { ICounterRepository } from "./counter.repository";

export class MongoCounterRepository
  implements ICounterRepository
{
  async getNextSequence(key: string): Promise<number> {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: key },
      { $inc: { sequence: 1 } },
      {
        upsert: true,
        returnDocument: "after",
      },
    ).lean();

    if (!counter) {
      throw new Error(`Failed to allocate counter sequence: ${key}`);
    }

    return counter.sequence;
  }

  async ensureAtLeast(
    key: string,
    sequence: number,
  ): Promise<number> {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: key },
      { $max: { sequence } },
      {
        upsert: true,
        returnDocument: "after",
      },
    ).lean();

    if (!counter) {
      throw new Error(`Failed to synchronize counter: ${key}`);
    }

    return counter.sequence;
  }
}
