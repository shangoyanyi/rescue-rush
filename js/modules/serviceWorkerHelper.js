
class ServiceWorkerHelper {
    constructor() {
        console.log(`[${this.constructor.name}] Initialized.`);
    }

    // 檢查 web push 訂閱
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
    
    
    // 取消 web push 訂閱
    async nsubscribePushNotifications() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn("瀏覽器不支援 Web Push");
            return false;
        }
    
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
    
            if (subscription) {
                const unsubscribed = await subscription.unsubscribe();
                console.log("成功取消 Push 訂閱:", unsubscribed);
                return unsubscribed;
            } else {
                console.log("沒有可取消的 Push 訂閱");
                return false;
            }
        } catch (error) {
            console.error("取消 Push 訂閱時發生錯誤:", error);
            return false;
        }
    }    
}

export default new ServiceWorkerHelper();
  