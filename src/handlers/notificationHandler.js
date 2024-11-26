const webPush = require('../../configurations/webPush');
const notificationService= require('../services/notificationService')

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

const notificationCountHandler= async(req,res)=>{
  const count= await notificationService.countNotificationService(req.query?.client_id);
  res.status(200).send({
    count
  })
}

module.exports= {subscribe, notificationCountHandler}
