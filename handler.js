'use strict';
// helper
const { sendBatchedMessages } = require('./helpers/sqsHelper');

// inserts books in the queue
module.exports.batchInsert = async () => {

  // 1) Send a number of books to the sqs queue
  // 2) queueProcessor pulls the data from the queue
  // 3) the data are inserted gradually to avoid exceeding dynamodb limits
  // 4) user gets notified when proccessing ends (all data have been inserted in table)
  // ------------------------------------------------------------------------------------ //

  try {
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
