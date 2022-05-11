/**
 * @author songxiwen
 * @date  2022/5/10 21:16
 */

import { Database, Dexie, IndexableType } from 'dexie';

export const db = new Dexie('Metagraph');

export function init(): void {
  db.version(1)
    .stores({
      knowledge: '++id,name,description,entityId,type,knowledgeKey',
      // section: '++id,name,description,entityId,type,knowledgeKey'
    });
}

export function add(table: string, item: { [key: string]: IndexableType }): void {
  db.table(table)
    .add(item);
}

export function bulkAdd(table: string, items: { [key: string]: IndexableType }[]): void {
  db.table(table)
    .bulkAdd(items);
}

async function put(table: string, item: { [key: string]: IndexableType }) {
  return db.table(table).put(item);
}
