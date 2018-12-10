'use strict';
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const uuid = require('uuid');
// helpers
const { entry } = require('./helpers/sqsHelper');

// inserts books in the queue
module.exports.batchInsert = async event => {

  // 1) Send a number of books to the sqs queue
  // 2) queueProcessor pulls the data from the queue
  // 3) the data are inserted gradually to avoid exceeding dynamodb limits
  // 4) user gets notified when proccessing ends (all data have been inserted in table)
  // ------------------------------------------------------------------------------------ //

  try {
   
    // params for a batch send
    const params = (Entries) => ({
      Entries,
      QueueUrl: process.env.QUEUEURL /* required */
    });

    // generate elements
    const numberOfBooks = 100;
    let books = [];
    const actions = [];
    for (let i=0;i<numberOfBooks;i++) {
      books.push( entry(i, {isbn: uuid.v4(),title: `title#${uuid.v1()}`}) );
      if (i % 5 == 0) {
      // send batch
        actions.push(sqs.sendMessageBatch(params(books)).promise());
        // delete contents so far
        books = [];
      }
    }

    await Promise.all(actions);


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
