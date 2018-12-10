
module.exports = {

  // sqs batch send entry
  entry (id, book) {
    return {
      Id: `batch ${id}`, /* required */
      MessageBody: JSON.stringify(book), /* required */
      DelaySeconds: 0,
      MessageAttributes: {
        '<String>': {
          DataType: 'String', /* required */
          StringValue: 'STRING_VALUE'
        }
      }
    };
  }

};