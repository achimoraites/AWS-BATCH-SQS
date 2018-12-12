const AWS = require('aws-sdk');
const sns = new AWS.SNS();

module.exports = { 
  subscribeToTopic(email,TopicArn) {
    const params = {
      Protocol: 'EMAIL', /* required */
      TopicArn, /* required */
      Endpoint: email
    };
    return sns.subscribe(params).promise();
  }
};