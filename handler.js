'use strict';
// helpers
const { sendBatchedMessages } = require('./helpers/sqsHelper');
const { subscribeEmail } = require('./helpers/snsHelper');

// inserts books in the queue
module.exports.batchInsert = async () => {

  try {
    // NOTIFICATION FEATURE
    //    get user_email
    const user_email = process.env.EMAIL;
    const topic = process.env.TOPIC;

    // subscribe user
    await subscribeEmail(user_email, topic);
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
