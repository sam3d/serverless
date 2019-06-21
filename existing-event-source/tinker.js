'use strict';

const { addPermission } = require('./existing-s3/permissions');
const { updateConfiguration, removeConfiguration } = require('./existing-s3/bucket');
const { getLambdaArn } = require('./existing-s3/utils');

async function main() {
  const properties = {
    FunctionName: 'serverless-existing-s3-function',
    BucketName: 'serverless-existing-s3-bucket',
    BucketConfig: {
      Event: 's3:ObjectCreated:Put',
      Rules: [
        { Prefix: 'uploads' },
        { Suffix: '.jpeg' },
      ],
    },
  };

  const region = 'us-east-1';
  const accountId = '377024778620';
  const lambdaArn = getLambdaArn(region, accountId, properties.FunctionName);

  // await addPermission({
  //   functionName: properties.FunctionName,
  //   bucketName: properties.BucketName,
  //   region,
  // });

  await updateConfiguration({
    lambdaArn,
    functionName: properties.FunctionName,
    bucketName: properties.BucketName,
    bucketConfig: properties.BucketConfig,
    region,
  });
}

main();
