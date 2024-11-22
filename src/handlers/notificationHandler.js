const webPush = require('../../configurations/webPush')

const subscribe = (req, res) => {
  const subscription = req.body;
  console.log("Subscription received:", subscription);
  const payload = JSON.stringify({
    title: "Welcome!",
    body: "You are subscribed to notifications.",
  });
  webPush
    .sendNotification(subscription, payload)
    .then(() => res.status(201).send({ success: true }))
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).send(error);
    });
};

module.exports= {subscribe}
