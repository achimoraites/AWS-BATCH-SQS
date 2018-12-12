const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const uuid = require('uuid');

// LOCAL HELPERS

// sendMessageBatch params for an array of entries
/**
   * sendMessageBatch params for an array of entries
   * @param Entries the entries array to send in a batch
   * @returns Object
   */
const params = (Entries) => ({
  Entries,
  QueueUrl: process.env.QUEUEURL /* required */
});

// sqs batch send entry
/**
   * Creates an entry for sqs sendMessageBatch the function configures the delay
   * so the messages can be sent in a way that will not exceed the dynamodb limits .
   * If batchSize is 5 then every 5 entries will have a delay that is the same multiple of 5
   * first 5 will have a delay of 5, next 5 will have 10 and so on..
   * @param i the number of the element's position 
   * @param book the element that will be inserted
   * @param batchSize the size of each batch : this value is used to dynamically configure the delay
   * @returns Object
   */
const entry = (i, book, batchSize) => {
  return {
    Id: `batch_${i}`, /* required */
    MessageBody: JSON.stringify(book), /* required */
    // returns the nearest multiple of batchSize for delayment
    DelaySeconds: Math.ceil(i/batchSize) * batchSize
  };
};


module.exports = {

  /**
   * Generates messages for sqs and
   * uses sendMessageBatch to send them
   * @param numOfElements the number of the total elements to be generated
   * @param batchSize the size of each batch containing messages
   * @param topic the topic the current user is subscribed to
   * @returns {Promise}
   */
  sendBatchedMessages(numOfElements, batchSize, topic) {
    let books = [];
    const actions = [];
    for (let i=0;i<numOfElements;i++) {
      // add the book as an sqs entry for sendMessageBatch
      books.push( entry(i, {isbn: uuid.v4(),title: `title#${uuid.v1()}`}, batchSize) );
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
    // now send the final element to let the lambda know we have finished
    books.push(  entry(numOfElements + batchSize, { finished: true, topic }, batchSize) );
    actions.push(sqs.sendMessageBatch(params(books)).promise());

    return Promise.all(actions);
  }

};