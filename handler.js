'use strict';
const AWS = require('aws-sdk');
const sns = new AWS.SNS();
// helper
const { sendBatchedMessages } = require('./helpers/sqsHelper');

// inserts books in the queue
module.exports.batchInsert = async () => {

  try {
    // NOTIFICATION FEATURE
    //    get user_email
    const user_email = process.env.EMAIL;
    //    create a topic for user
    // const topic = await sns.createTopic(params).promise();

    // subscribe user
    const params = {
      Protocol: 'EMAIL', /* required */
      TopicArn: process.env.TOPIC, /* required */
      Endpoint: user_email
    };
    await sns.subscribe(params).promise();
   
    // ------------------------------------------------------------------------------------ //

    // send 100 books with a batch size of 5
    await sendBatchedMessages(100, 5);
    return {
      statusCode: 200,
      body: {
        message: 'Items sent for processing successfully!'
      },
    };
   
  } catch (error) {
    return {
      statusCode: 400,
      error
    };
  }


};
