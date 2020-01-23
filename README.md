# AWS-BATCH-SQS
## Description
An illustration of using the Serverless framework to create a simple Micro Service for AWS.

The service adds books in Dynamo DB gradually to simulate some/all of the following scenarios:
- To not exceed the Dynamo DB rate limits
- Processing of the books is time consuming 
- User should be notified when all processing is done


## How it works
Batch Sending data to a dynamodb table using sqs queue
<br>
   1. Send a number of books to the sqs queue
   2. queueProcessor pulls the data from the queue
   3. the data are inserted gradually to avoid exceeding dynamodb limits
   4. user gets notified when proccessing ends (all data have been inserted in table)
<br>
<img src='batch-sqs-img.png' alt='Project diagram'>
