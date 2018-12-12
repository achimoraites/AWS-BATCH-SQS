const AWS = require('aws-sdk');
const sns = new AWS.SNS({apiVersion: '2010-03-31'});

// LOCAL HELPERS
const params = (Protocol, TopicArn, Endpoint) => ({
  Protocol, /* required */
  TopicArn, /* required */
  Endpoint
});

module.exports = {

  // this does not work
  createEmailTopic(Name) {
    return sns.createTopic({Name}).promise();
  },     
  subscribeEmail(email,TopicArn) {
    return sns.subscribe(params('EMAIL',TopicArn, email)).promise();
  },     
  subscribeLambda(lambda,TopicArn) {
    return sns.subscribe(params('labda',TopicArn, lambda)).promise();
  },
  unsubscribe(SubscriptionArn) {
    return sns.unsubscribe({ SubscriptionArn }).promise();
  }

};
