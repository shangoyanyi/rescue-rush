
class ServiceWorkerHelper {
    constructor() {
        console.log(`[${this.constructor.name}] Initialized.`);
    }

    async checkPushSubscription() {
        if (!('serviceWorker' in navigator)) {
            console.warn(`[${this.constructor.name}] 瀏覽器不支援 Service Worker`);
            return null;
        }

        if (!('PushManager' in window)) {
            console.warn(`[${this.constructor.name}] 瀏覽器不支援 Push API`);
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                console.log(`[${this.constructor.name}] 找到 PushSubscription:`, subscription);
                return subscription;
            } else {
                console.log(`[${this.constructor.name}] 尚未訂閱 Web Push`);
                return null;
            }
        } catch (error) {
            console.error(`[${this.constructor.name}] 檢查推播訂閱時發生錯誤:`, error);
            return null;
        }
    }
}

export default new ServiceWorkerHelper();
  