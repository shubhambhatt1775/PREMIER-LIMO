const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const subscribeToPush = async (api) => {
    try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.error('Service Worker or Push Manager not supported');
            return;
        }

        const registration = await navigator.serviceWorker.ready;

        // Check for permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.error('Notification permission not granted');
            return;
        }

        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
        };

        const subscription = await registration.pushManager.subscribe(subscribeOptions);

        // Send subscription to backend
        await api.post('/auth/subscribe', { subscription });
        console.log('Push subscription successful');
    } catch (error) {
        console.error('Error subscribing to push:', error);
    }
};
