const Push = require('pushover-notifications');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

'use strict';

module.exports.hello = async event => {

  const push = new Push({
    user: process.env['PUSHOVER_USER'],
    token: process.env['PUSHOVER_TOKEN'],
  });

  const msg = {
    message: 'omg node test',
    title: 'well this is from a lambda',
    sound: 'magic',
    device: 'all',
    priority: 1,
  };

  let result;

  try {
    result = await (new Promise((resolve, reject) => {
      push.send(msg, (err, data) => err ? reject(err) : resolve(data));
    }));
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
