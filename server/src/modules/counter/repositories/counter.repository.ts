export interface ICounterRepository {
  getNextSequence(key: string): Promise<number>;
  ensureAtLeast(key: string, sequence: number): Promise<number>;
}
