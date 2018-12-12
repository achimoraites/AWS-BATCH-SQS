const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB;


// LOCAL HELPERS

// create put request item
const putBookItem = ({isbn, title}) => ({
  
  PutRequest: {
    Item: {
      "isbn": {
        S: isbn
      }, 
      "title": {
        S: title
      }
    }
  }
  
});

// create items array
const processBooks = Books => Books.map(book => putBookItem(book));

const params = Books => ({
  RequestItems: {
    "Books": Books
  }
});

module.exports = {

  batchWrite(Books) {
    return dynamoDB.batchWriteItem( params(processBooks(Books)) ).promise();
  }

};
