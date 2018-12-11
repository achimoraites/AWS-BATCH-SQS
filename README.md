# AWS-BATCH-SQS

Batch Sending data to a dynamodb table using sqs queue
<br>
   1. Send a number of books to the sqs queue
   2. queueProcessor pulls the data from the queue
   3. the data are inserted gradually to avoid exceeding dynamodb limits
   4. user gets notified when proccessing ends (all data have been inserted in table)
<br>
<img src='batch-sqs-img.png' alt='Project diagram'>