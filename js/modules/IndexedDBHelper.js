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
                    db.createObjectStore('userData', { keyPath: "id", autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('notifications')) {
                    db.createObjectStore('notifications', { keyPath: "id", autoIncrement: true });
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

    
    /** 🔥 刪除整個 IndexedDB */
    async deleteDatabase() {
        return new Promise((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(this.dbName);
            
            deleteRequest.onsuccess = () => {
                console.log(`✅ IndexedDB '${this.dbName}' 已刪除`);
                resolve(true);
            };

            deleteRequest.onerror = (event) => {
                console.error(`❌ 刪除 IndexedDB '${this.dbName}' 失敗:`, event.target.error);
                reject(event.target.error);
            };

            deleteRequest.onblocked = () => {
                console.warn(`⚠️ 刪除 IndexedDB '${this.dbName}' 被擋住，請關閉所有使用該 DB 的頁面後再試`);
            };
        });
    }   
}

export default new IndexedDBHelper();
