/**
 * @author songxiwen
 * @date  2022/5/10 21:16
 */

import { Dexie, IndexableType } from 'dexie';

export class IndexdbService {
  private db: Dexie;

  private static instance?: IndexdbService;

  static getInstance(): IndexdbService {
    return new IndexdbService();
  }

  private constructor() {
    this.db = new Dexie('Metagraph');
    this.db.version(3)
      .stores({
        knowledge: '++id,*id,name,description,entityId,type,knowledgeKey',
        repository: '++id,*id,name,content,sectionId,repositoryEntityId'
      });
  }

  async add(table: string, item: { [key: string]: IndexableType }): Promise<void> {
    await this.db.table(table)
      .add(item);
  }

  async bulkAdd(table: string, items: { [key: string]: IndexableType }[]): Promise<void> {
    await this.db.table(table)
      .bulkAdd(items);
  }

  async put(table: string, item: { [key: string]: IndexableType }): Promise<void> {
    await this.db.table(table)
      .put(item);
  }

  async get(table: string, id: string): Promise<any | undefined> {
    const result = await this.db.table(table)
      .get({
        id
      });
    console.log(result);
    if (result) {
      return result;
    }
    return undefined;
  }

  async update(table: string, id: string, item: { [key: string]: IndexableType }): Promise<number> {
    // 1 success 0 fail
    const result = await this.db.table(table)
      .update(id, item);
    return result;
  }
}
