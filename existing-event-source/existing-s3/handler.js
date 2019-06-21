'use strict';

const CfnLambda = require('cfn-lambda');
const { addPermission } = require('./permissions');
const { updateConfiguration, removeConfiguration } = require('./bucket');
const { getLambdaArn } = require('./utils');

async function AsyncCreate(cfnRequestParams) {
  const timestamp = +new Date();
  const PhysicalResourceId = `ExistingS3BucketHelper${timestamp}`;
  const { Region, AccountId } = CfnLambda.Environment;
  const { FunctionName, BucketName, BucketConfig } = cfnRequestParams;

  const lambdaArn = getLambdaArn(Region, AccountId, FunctionName);

  await addPermission({
    functionName: FunctionName,
    bucketName: BucketName,
    region: Region,
  });
  await updateConfiguration({
    lambdaArn,
    region: Region,
    functionName: FunctionName,
    bucketName: BucketName,
    bucketConfig: BucketConfig,
  });

  return {
    PhysicalResourceId,
  };
}

async function AsyncUpdate(requestPhysicalID, cfnRequestParams) {
  const { Region, AccountId } = CfnLambda.Environment;
  const { FunctionName, BucketName, BucketConfig } = cfnRequestParams;
  const PhysicalResourceId = requestPhysicalID;

  const lambdaArn = getLambdaArn(Region, AccountId, FunctionName);

  await updateConfiguration({
    lambdaArn,
    region: Region,
    functionName: FunctionName,
    bucketName: BucketName,
    bucketConfig: BucketConfig,
  });

  return {
    PhysicalResourceId,
  };
}

async function AsyncDelete(requestPhysicalID, cfnRequestParams) {
  const { Region } = CfnLambda.Environment;
  const { FunctionName, BucketName } = cfnRequestParams;
  const PhysicalResourceId = requestPhysicalID;

  await removeConfiguration({
    region: Region,
    functionName: FunctionName,
    bucketName: BucketName,
  });

  return {
    PhysicalResourceId,
  };
}

module.exports.handler = CfnLambda({
  AsyncCreate,
  AsyncUpdate,
  AsyncDelete,
  TriggersReplacement: [
    'BucketName',
  ],
});
