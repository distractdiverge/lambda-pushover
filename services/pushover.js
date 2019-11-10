const Push = require('pushover-notifications');

const getClient = (appToken, userToken) => new Push({
    user: userToken,
    token: appToken,
});

const sendMessageAsync = (pushClient, message) => new Promise((resolve, reject) => 
    pushClient.send(message, (err, data) => err ? reject(err) : resolve(data))
);

const sendMessage = (appToken, userToken, message) =>
    sendMessageAsync(getClient(appToken, userToken), message);

module.exports = {
    sendMessage,
};