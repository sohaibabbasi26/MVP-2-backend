const webPush = require("../../configurations/webPush");
const notificationService = require("../services/notificationService");

const subscribe = async (req, res) => {
  const { subscription, user_id, user_role } = req.body;
  console.log("Subscription received:", subscription);
  console.log(user_id)
  console.log(user_role)
  // const payload = JSON.stringify({
  //   title: "Welcome!",
  //   body: "You are subscribed to notifications.",
  // });
  //console.log(subscription);
  const result = await notificationService.subscribeNotificationService(
    subscription,
    user_id,
    user_role
  );

  res.status(result.status).send({...result});

  // webPush
  //   .sendNotification(subscription, payload)
  //   .then(() => res.status(201).send({ success: true }))
  //   .catch((error) => {
  //     console.error("Error sending notification:", error);
  //     res.status(500).send(error);
  //   });
};

const notificationCountHandler = async (req, res) => {
  const count = await notificationService.countNotificationService(
    req.query?.client_id
  );
  res.status(200).send({
    count,
  });
};

module.exports = { subscribe, notificationCountHandler };
