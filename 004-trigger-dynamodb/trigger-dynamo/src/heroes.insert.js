const uuid = require('uuid');

class Handler {
  constructor({ dynamoDBSvc }) {
    this.dynamoDBSvc = dynamoDBSvc;
    this.dynamoDBTable = process.env.DYNAMODB_TABLE;
  }

  insertItem(data) {
    return this.dynamoDBSvc.put(data).promise();
  }

  prepareData(dbParameters) {
    const params = {
      TableName: this.dynamoDBTable,
      Item: {
        ...dbParameters,
        id: uuid.v1(),
        createdAt: new Date().toISOString(),
      },
    };
    return params;
  }

  handlerSuccess(responseData) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(responseData),
    };
    return response;
  }

  handlerError(responseData) {
    const response = {
      statusCode: responseData.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: `Couldn't create item!`,
    };
    return response;
  }

  async main(event) {
    try {
      const data = JSON.parse(event.body);
      const dbParams = this.prepareData(data);
      await this.insertItem(dbParams);
      return this.handlerSuccess(dbParams.Item);
    } catch (error) {
      console.error('Deu ruim --- ', error.stack);
      return this.handlerError({ statuscode: 500 });
    }
  }
}

//factory
const AWS = require('aws-sdk');
const dynamoDB = AWS.DynamoDB.DocumentClient();
const handler = new Handler({
  dynamoDBSvc: dynamoDB,
});
module.exports = handler.main.bind(handler);
