const ClientNotificationSubscription = require("../models/client_notification_subscription");
const { NotificationClient } = require("../models/notification_client");

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

  return {
    status: 200,
    message: "notification subscription saved",
  };
};

module.exports = {
  countNotificationService,
  subscribeNotificationService,
};
