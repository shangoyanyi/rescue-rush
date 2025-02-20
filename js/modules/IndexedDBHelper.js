import { openDB } from './libs/google/index-min.js';

class IndexedDBHelper {
    constructor(dbName = 'pwaDatabase', version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.dbPromise = this.initDB();
    }

    async initDB() {
        return openDB(this.dbName, this.version, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains('userData')) {
                    db.createObjectStore('userData', { keyPath: 'key' });
                }
            }
        });
    }

    /** 🔥 通用存儲方法 */
    async set(storeName, key, value) {
        const db = await this.dbPromise;
        return db.put(storeName, { key, value });
    }

    /** 🔥 通用讀取方法 */
    async get(storeName, key) {
        const db = await this.dbPromise;
        const data = await db.get(storeName, key);
        return data ? data.value : null;
    }

    /** 🔥 通用刪除方法 */
    async delete(storeName, key) {
        const db = await this.dbPromise;
        return db.delete(storeName, key);
    }

    /** 🔥 清除整個 store */
    async clear(storeName) {
        const db = await this.dbPromise;
        return db.clear(storeName);
    }

    /** 🔥 取得 store 內所有資料 */
    async getAll(storeName) {
        const db = await this.dbPromise;
        return db.getAll(storeName);
    }
}

export default new IndexedDBHelper();
