const FCM = require('fcm-node');
const Voter = require("../models/Voter");
const serverKey = "AAAAm_0Piq0:APA91bEvH3HVMzlVWqZLW5noa65vMuRQ5ZrmrTZDMzvGtCcy9I8QSXakzsgWhFmEkGBTRaoYz0zcZMeC0Wl5yVOTTb6eznFC6QVjwwEBO6CHWgKPAuTRLNGkrWPjRlX74TiZqTJ5BUWl";


const fcm = new FCM(serverKey);


const sendNotification=async(token, title, body)=>{
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        notification: {
            title: title,
            body: body
        },
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err);
        } else {
            console.log("Push notification sent to token:"+token, response);
        }
    });
}

const sendPushNotificationToElectionVoters = async (electionId, title, message) => {

    console.log('HERE');
    const voters = await Voter.find({ election: electionId });



    for (const voter of voters) {
        const { notification_token: token } = voter;
        const title = 'Election Update';
        const body = message;
        
        // Send the notification
        if(token!='')sendNotification(token, title, body);
      }

}


module.exports = {
    sendPushNotificationToElectionVoters,
  };

