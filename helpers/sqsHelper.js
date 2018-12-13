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
    DelaySeconds: Math.ceil(i / batchSize) * batchSize
  };
};

/**
   * generates books for batch sending to sqs queue
   * @param numOfElements the number of elements to generate
   * @param batchSize the size of each batch to send to queue
   * @returns Object
   */
const booksGenerator = (numOfElements, batchSize) => {
  const books = [];
  for (let i=0;i<numOfElements;i++) {
    // add the book as an sqs entry for sendMessageBatch
    books.push( entry(i, {isbn: uuid.v4(),title: `title#${uuid.v1()}`}, batchSize) );
  }
  return books;
};


module.exports = {

  /**
   * Generates messages for sqs and
   * uses sendMessageBatch to send them
   * @param numOfElements the number of the total elements to be generated
   * @param batchSize the size of each batch containing messages, max: 10
   * @param topic the topic the current user is subscribed to
   * @returns {Promise}
   */
  sendBatchedMessages(numOfElements, batchSize, topic) {
    if (batchSize > 10) throw new Error(`batchSize should be no more than 10 , current batchSize: ${batchSize}`);
    const actions = [];
    let chunk = [];
    const books = booksGenerator(numOfElements, batchSize);

    // send in chunks
    for (const i in books) {
      chunk.push(books[i]);
      // if true it's time to send a batch!
      if (Number.parseInt(i) % batchSize == 0) {
      // send batch
        actions.push(sqs.sendMessageBatch(params(chunk)).promise());
        // delete contents so far
        chunk = [];
      }
    }

    // in case we still have some books in chunk
    if (chunk.length > 0) {
      actions.push(sqs.sendMessageBatch(params(chunk)).promise());
      // clean up
      chunk = [];
    }

    // now send the final element to let the lambda know we have finished
    chunk.push(  entry(numOfElements + batchSize, { finished: true, topic }, batchSize) );
    actions.push(sqs.sendMessageBatch(params(chunk)).promise());

    return Promise.all(actions);
  }

};