
module.exports = {

  // sqs batch send entry
  entry (i, book) {
    return {
      Id: `batch_${i}`, /* required */
      MessageBody: JSON.stringify(book), /* required */
      DelaySeconds: 0
    };
  }

};