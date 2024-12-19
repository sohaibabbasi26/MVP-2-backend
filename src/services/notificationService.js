const CustomerNotificationSubscription = require("../models/candidate_notification_subscription");
const ClientNotificationSubscription = require("../models/client_notification_subscription");
const { NotificationClient } = require("../models/notification_client");
const webPush = require("../../configurations/webPush");
const { NotificationCandidates } = require("../models/notification_candidates");

const countNotificationService = async (client_id) => {
  const notificationSchema = await NotificationClient.findAll({
    where: {
      is_read: false,
      client_id,
    },
  });
  return notificationSchema.length;
};

const subscribeNotificationService = async (
  subscription,
  user_id,
  user_role
) => {
  if (user_role === "client") {
    const existingClientSubscription =
      await ClientNotificationSubscription.findOne({
        where: {
          client_id: user_id,
        },
      });
    if (existingClientSubscription) {
      await existingClientSubscription.update({
        endpoint: subscription?.endpoint?.toString(),
        p256dh: subscription?.keys?.p256dh?.toString(),
        auth: subscription?.keys?.auth?.toString(),
      });
    } else {
      await ClientNotificationSubscription.create({
        client_id: user_id,
        endpoint: subscription?.endpoint?.toString(),
        p256dh: subscription?.keys?.p256dh?.toString(),
        auth: subscription?.keys?.auth?.toString(),
      });
    }
  }

  if (user_role === "candidate") {
    const existingCustomerSubscription =
      await CustomerNotificationSubscription.findOne({
        where: {
          customer_id: user_id,
        },
      });
    if (existingCustomerSubscription) {
      await existingCustomerSubscription.update({
        endpoint: subscription?.endpoint?.toString(),
        p256dh: subscription?.keys?.p256dh?.toString(),
        auth: subscription?.keys?.auth?.toString(),
      });
    } else {
      await CustomerNotificationSubscription.create({
        customer_id: user_id,
        endpoint: subscription?.endpoint?.toString(),
        p256dh: subscription?.keys?.p256dh?.toString(),
        auth: subscription?.keys?.auth?.toString(),
      });
    }
  }

  return {
    status: 200,
    message: "notification subscription saved",
  };
};

const sendNotificationToClient = async (
  client_id,
  notificationClientPayload
) => {
  // const clientSubcription = await ClientNotificationSubscription.findOne({
  //   where: {
  //     client_id,
  //   },
  // });

  // const fetchedClientSubscription = {
  //   endpoint: clientSubcription.endpoint,
  //   keys: {
  //     p256dh: clientSubcription.p256dh,
  //     auth: clientSubcription.auth,
  //   },
  // };

  // webPush
  //   .sendNotification(fetchedClientSubscription, notificationClientPayload)
  //   .then(() => console.log("DONEEE"))
  //   .catch((error) => {
  //     console.error("Error sending notification:", error);
  //     //res.status(500).send(error);
  //   });

  await NotificationClient.create({
    ...notificationClientPayload,
    client_id,
  });
};

const sendNotificationToCustomer = async (
  customer_id,
  notificationClientPayload
) => {
  await NotificationCandidates.create({
    ...notificationClientPayload,
    customer_id,
  });
  // const customerSubcription = await CustomerNotificationSubscription.findOne({
  //   where: {
  //     customer_id,
  //   },
  // });

  // const fetchedCustomerSubscription = {
  //   endpoint: customerSubcription.endpoint,
  //   keys: {
  //     p256dh: customerSubcription.p256dh,
  //     auth: customerSubcription.auth,
  //   },
  // };

  // webPush
  //   .sendNotification(fetchedCustomerSubscription, notificationClientPayload)
  //   .then(() => console.log("DONEEE"))
  //   .catch((error) => {
  //     console.error("Error sending notification:", error);
  //     //res.status(500).send(error);
  //   });
};

module.exports = {
  countNotificationService,
  subscribeNotificationService,
  sendNotificationToClient,
  sendNotificationToCustomer,
};
