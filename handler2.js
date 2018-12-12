'use strict';
// helpers
const { publish, deleteTopic } = require('./helpers/snsHelper');
const { batchWrite } = require('./helpers/dynamodbHelper');

// gets books from the queue and insert them in table
// sends an email via sns to notify the user
module.exports.queueProcessor = async event => {

  // queueProcessor pulls the data from the queue
  // data are inserted in the table
  // the data are inserted gradually to avoid exceeding dynamodb limits
  // ------------------------------------------------------------------------------------ //

  let topic = null;
  try {
    // read records from the queue
    const { Records } = event;
    const Books = [];
    const actions = [];
    
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
      Books.push(recordObj);
    });

    actions.push(batchWrite(Books));
    await Promise.all(actions);
    
    return {
      statusCode: 200,
      body: {
        message: `${actions.length} items inserted !`
      },
    };
   
  } catch (error) {
    await publish(`Error : ${error}`,topic);
    return {
      statusCode: 400,
      error
    };
  } finally {
    // remove topic if exists
    if (topic) await deleteTopic(topic);
  }

};
