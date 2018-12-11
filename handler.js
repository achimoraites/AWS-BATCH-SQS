'use strict';
// helper
const { sendBatchedMessages } = require('./helpers/sqsHelper');

// inserts books in the queue
module.exports.batchInsert = async () => {

  try {
    // NOTIFICATION FEATURE
    //    get user_email
    //    create a topic for user
    //    subscribe user to topic
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
