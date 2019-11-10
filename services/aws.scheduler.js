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

    const cwevents = new aws.CloudWatchEvents({ apiVersion: '2015-10-07' });
    const params = {
        Name: 'TEST_SCHEDULED_EVENT',
        RoleArn: '',
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