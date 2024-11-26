const { NotificationClient } = require("../models/notification_client")

const countNotificationService= async(client_id)=>{
    const notificationSchema= await NotificationClient.findAll({
        where:{
            is_read: false,
            client_id
        }
    });
    return notificationSchema.length;
}

module.exports= {
    countNotificationService
}