const settings = require('./services/settings');
const scheduler = require('./services/aws.scheduler');
const pushover = require('./services/pushover');

module.exports.execute = async event => {
  const pushoverConfig = settings.getPushoverConfig();

  const msg = {
    message: 'omg node test',
    title: 'well this is from a lambda',
    sound: 'magic',
    device: 'all',
    priority: 1,
  };

  let result;

  try {
    result = await pushover.sendMessage(
      pushoverConfig.appToken,
      pushoverConfig.userToken,
      msg,
    );
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      })
    };
  }

  try {
    await scheduler.schedule(scheduler.randMinutesInFuture());
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      })
    };
  }

  const response = {
    message: 'Success, message sent and event scheduled',
    pushoverResult: result,
  };
  
  return {
    statusCode: 200,
    body: JSON.stringify(response, null, 2 ),
  };
};
