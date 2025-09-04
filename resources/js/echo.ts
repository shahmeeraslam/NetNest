import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: InstanceType<typeof Echo>;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  authEndpoint: "/broadcasting/auth",
  auth: {
    headers: {
      "X-CSRF-TOKEN": document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") || "",
    },
  },
});

export default echo;
