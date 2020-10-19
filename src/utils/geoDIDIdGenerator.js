/* eslint-disable*/
import web3 from 'web3';

export default function geoDIDIdGenerator(address, stacId) {
  const bytesHex = web3.utils.soliditySha3(address, stacId);
  // convert hexademical value to a decimal string
  return BigInt(bytesHex).toString(10);
}
