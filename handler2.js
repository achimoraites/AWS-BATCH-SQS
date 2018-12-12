'use strict';
const AWS = require('aws-sdk');
const dynamoDC = new AWS.DynamoDB.DocumentClient({});
// helper
// const { sendBatchedMessages } = require('./helpers/sqsHelper');

// gets books from the queue and insert them in table
// sends an email via sns to notify the user
module.exports.queueProcessor = async event => {

  // queueProcessor pulls the data from the queue
  // data are inserted in the table
  // the data are inserted gradually to avoid exceeding dynamodb limits
  // ------------------------------------------------------------------------------------ //

  const params = ({isbn, title}) => ({
    TableName: process.env.TABLE_NAME,
    Item: {
      isbn,
      title
    }
  }); 

  try {
    // read records from the queue
    const { Records } = event;
    const actions = [];
    Records.forEach(record => {
      // if true we are done
      if('finished' in record.body) {

        return;
      }
      // insert to dynamodb table
      actions.push( dynamoDC.put(params(JSON.parse(record.body))).promise() );
    });

    await Promise.all(actions);
    

    return {
      statusCode: 200,
      body: {
        message: `${actions.length} items inserted !`
      },
    };
   
  } catch (error) {
    return {
      statusCode: 400,
      error
    };
  }


};
