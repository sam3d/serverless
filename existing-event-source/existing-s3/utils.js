'use strict';

function getLambdaArn(region, accountId, functionName) {
  return `arn:aws:lambda:${region}:${accountId}:function:${functionName}`;
}

module.exports = {
  getLambdaArn,
};
