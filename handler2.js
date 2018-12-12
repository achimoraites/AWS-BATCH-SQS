'use strict';
const AWS = require('aws-sdk');
const dynamoDC = new AWS.DynamoDB.DocumentClient({});
// helper
const { publish, deleteTopic } = require('./helpers/snsHelper');

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
    let topic = null;
    Records.forEach(record => {
      const recordObj = JSON.parse(record.body);
      // if true we are done
      if('finished' in recordObj) {
        // save topic
        topic = recordObj.topic;
        // send email to user
        actions.push(publish('Your books have been inserted!',topic));
       
        return;
      }
      // insert to dynamodb table
      actions.push( dynamoDC.put(params(recordObj)).promise() );
    });

    await Promise.all(actions);

    // remove topic if exists
    if (topic) await deleteTopic(topic);
    
    

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
