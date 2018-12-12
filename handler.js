'use strict';
// helpers
const { sendBatchedMessages } = require('./helpers/sqsHelper');
const { subscribeEmail, createTopic } = require('./helpers/snsHelper');

// NOTE: this will be triggered by api gateway in the future
// inserts books in the queue
module.exports.batchInsert = async () => {

  try {
    // NOTIFICATION FEATURE

    const user_email = process.env.EMAIL;
    const user = user_email.split('@');
    console.log('user', user[0]);
    // const topic = process.env.TOPIC;

    // create topic
    const topic = await createTopic(user[0]);
    console.log('topic', topic);

    // subscribe user
    await subscribeEmail(user_email, topic);
    // ------------------------------------------------------------------------------------ //

    // send 100 books with a batch size of 5 
    await sendBatchedMessages(100, 5, topic);
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
