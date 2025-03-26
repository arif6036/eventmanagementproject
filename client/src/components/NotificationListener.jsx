
import { useEffect } from "react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";

const NotificationListener = () => {
  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("event-channel");

    channel.bind("new-notification", (data) => {
      toast.info(`📢 ${data.title}: ${data.message}`);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return null;
};

export default NotificationListener;
