import { useEffect } from "react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";

const NotificationListener = () => {
  useEffect(() => {
    try {
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        encrypted: true,
      });

      const channel = pusher.subscribe("event-channel");

      channel.bind("new-notification", (data) => {
        if (data?.title && data?.message) {
          toast.info(`📢 ${data.title}: ${data.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "custom-toast",
          });
        } else {
          console.warn("Incomplete notification data:", data);
        }
      });

      channel.bind("pusher:subscription_error", (err) => {
        console.error("❌ Pusher subscription error:", err);
        toast.error("🔌 Failed to connect to notification service.");
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
    } catch (err) {
      console.error("🔧 Pusher initialization error:", err);
    }
  }, []);

  return null;
};

export default NotificationListener;
