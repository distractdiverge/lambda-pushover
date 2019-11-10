const aws = require('aws-sdk');
const moment = require('moment');

const putRuleAsync = (cwevents, params) => new Promise((resolve, reject) =>
    cwevents.putRule(params, (err, data) =>
        err
            ? reject(err)
            : resolve(data)
    )
);

const randInt = (min, max) => Math.floor(Math.random() * max) + min;
const randMinutesInFuture = () => moment().add(randInt(1, 59), 'minutes');

const schedule = (date) => {
    aws.config.update({
        region: 'us-east-1',
    });
    aws.config.getCredentials((err) => {
        if (err) {
            console.error(`Error Getting Credentials: ${err}`);
        } else {
            console.log(`Access Key: ${aws.config.credentials.accessKeyId}`);
            console.log(`Secret Access Key: ${aws.config.credentials.secretAccessKey}`);
        }
    });
    const cwevents = new aws.CloudWatchEvents({ apiVersion: '2015-10-07' });
    const params = {
        Name: 'TEST_SCHEDULED_EVENT',
        
        // TODO: Get ARN from serverless somehow
        RoleArn: 'arn:aws:iam::117243655954:role/lambda-pushover-dev-us-east-1-lambdaRole',
        ScheduleExpression: moment(date).format('cron(m H d M Y)'),
        State: 'ENABLED',
    };

    return putRuleAsync(cwevents, params);
};

module.exports = {
    putRuleAsync,
    randInt,
    randMinutesInFuture,
    schedule,
};