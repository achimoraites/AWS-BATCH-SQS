'use strict';

module.exports.batchInsert = async event => {

  // 1) Send a number of books to the sqs queue
  // 2) queueProcessor pulls the data from the queue
  // 3) the data are inserted gradually to avoid exceeding dynamodb limits
  // 4) user gets notified when proccessing ends (all data have been inserted in table)


  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Items sent for processing successfully!',
      input: event,
    }),
  };

};
