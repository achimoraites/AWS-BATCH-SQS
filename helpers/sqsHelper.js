const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const uuid = require('uuid');

// local  helpers
const params = (Entries) => ({
  Entries,
  QueueUrl: process.env.QUEUEURL /* required */
});
// sqs batch send entry
const entry = (i, book) => {
  return {
    Id: `batch_${i}`, /* required */
    MessageBody: JSON.stringify(book), /* required */
    DelaySeconds: 0
  };
};


module.exports = {

  /**
   * Generates messages for sqs and
   * uses sendMessageBatch to send them
   * @param numOfElements the number of the total elements to be generated
   * @param batchSize the size of each batch containing messages
   * @returns {Promise}
   */
  sendBatchedMessages(numOfElements, batchSize) {
    let books = [];
    const actions = [];
    for (let i=0;i<numOfElements;i++) {
      // add the book as an sqs entry for sendMessageBatch
      books.push( entry(i, {isbn: uuid.v4(),title: `title#${uuid.v1()}`}) );
      // if true it's time to send a batch!
      if (i % batchSize == 0) {
      // send batch
        // console.log(params(books));
        actions.push(sqs.sendMessageBatch(params(books)).promise());
        // delete contents so far
        books = [];
      }
    }
    // in case we still have some books
    if (books.length > 0) {
      actions.push(sqs.sendMessageBatch(params(books)).promise());
    }

    return Promise.all(actions);
  }

};