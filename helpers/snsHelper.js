const AWS = require('aws-sdk');
const sns = new AWS.SNS({apiVersion: '2010-03-31'});

// LOCAL HELPERS
const params = (Protocol, TopicArn, Endpoint) => ({
  Protocol, /* required */
  TopicArn, /* required */
  Endpoint
});

module.exports = {

  createTopic(Name) {
    return sns.createTopic({Name}).promise();
  }, 
  deleteTopic({ TopicArn }) {
    console.log('delete: ', TopicArn);
    return sns.deleteTopic({TopicArn}).promise();
  },
  subscribeEmail(email,{ TopicArn }) {
    return sns.subscribe(params('EMAIL',TopicArn, email)).promise();
  },
  publish(Message, { TopicArn }) {
    return sns.publish({Message, TopicArn}).promise();
  }

};
