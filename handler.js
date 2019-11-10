const R = require('ramda');
const settings = require('./services/settings');
const scheduler = require('./services/aws.scheduler');
const pushover = require('./services/pushover');

const messageOrUnknown = R.pipe(
  R.prop('message'),
  R.defaultTo('Unknown'),
);

module.exports.execute = async event => {
  const env = settings.getEnv();
  const pushoverConfig = settings.getPushoverConfig();
  console.log(`Env: ${env}`);
  console.log(`AppToken: ${pushoverConfig.appToken}`);
  console.log(`UserToken: ${pushoverConfig.userToken}`);

  const msg = {
    message: 'omg node test',
    title: 'well this is from a lambda',
    sound: 'magic',
    device: 'all',
    priority: 0,
  };

  let pushoverResult;

  try {
    pushoverResult = await pushover.sendMessage(
      pushoverConfig.appToken,
      pushoverConfig.userToken,
      msg,
    );
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error sending a message to Pushover',
        errorMessage: messageOrUnknown(error),
      })
    };
  }

  let scheduleResult;
  try {
    scheduleResult = await scheduler.schedule(scheduler.randMinutesInFuture());
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error Scheduling the CloudWatch Event',
        errorMessage: messageOrUnknown(error),
      })
    };
  }

  const response = {
    message: 'Success, message sent and event scheduled',
    pushoverResult: result,
    scheduleResult: scheduleResult,
  };
  
  return {
    statusCode: 200,
    body: JSON.stringify(response, null, 2 ),
  };
};
