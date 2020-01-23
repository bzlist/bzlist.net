self.addEventListener("push", (event) => {
  console.log("a");
  const data = event.data.json();

  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    tag: data.tag,
    icon: "/images/icon/512.png",
    vibrate: [200, 100, 200],
    badge: "https://spyna.it/icons/android-icon-192x192.png",
    actions: [
      {
        action: "join",
        title: "Join"
      },
      {
        action: "close",
        title: "Close"
      }
    ]
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
});
