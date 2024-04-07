import React, { useState, useEffect } from "react";
import { toast } from "./components/ui/use-toast";
import { Toaster } from "./components/ui/toaster";
import { onMessageListener, requestPermission } from "./firebase";

function Notification() {
  const [notification, setNotification] = useState({ title: "", body: "" , image:"" });
  const notify = () =>
    toast({
      title: `${notification.title}`,
      description: `${notification.body}`,
      // action: <img className="w-14 h-12 rounded-sm" src={notification.image} alt="" />,
    });

  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  requestPermission();
  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
        image: payload?.notification?.image,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster />;
}
export default Notification;
