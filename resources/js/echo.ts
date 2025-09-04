// resources/js/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window { Echo: any ; Pusher: typeof Pusher; }
}

window.Pusher = Pusher;



const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  wsHost: import.meta.env.VITE_PUSHER_HOST ?? window.location.hostname,
  wsPort: Number(import.meta.env.VITE_PUSHER_PORT ?? 6001),
  wssPort: Number(import.meta.env.VITE_PUSHER_PORT ?? 6001),
  forceTLS:true,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: '/broadcasting/auth',
});

export default echo;
