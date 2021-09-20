const uuid = require('uuid');
const Joi = require('joi');
const decoratorValidator = require('./util/decoratorValidator');
const globalEnum = require('./util/globalEnum');

class Handler {
  constructor({ dynamoDBSvc }) {
    this.dynamoDBSvc = dynamoDBSvc;
    this.dynamoDBTable = process.env.DYNAMODB_TABLE;
  }

  static validator() {
    return Joi.object({
      nome: Joi.string().max(100).min(2).required(),
      poder: Joi.string().max(20).min(2).required(),
    });
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
      const data = event.body;

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
module.exports = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  globalEnum.ARG_TYPE.BODY
);
