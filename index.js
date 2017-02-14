var express = require('express')

var app = express();
var Web3 = require('web3');
var Tx = require('ethereumjs-tx')
var keythereum = require("keythereum");

app.set('port', (process.env.PORT || 8000))
app.use(express.static(__dirname + '/public'));

var config = require('./config/settings');


var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Location));

var message = web3.sha3('VISA');

if(web3.isConnected()) {
 sendRawTransaction(config.fromAccount,config.toAccount,message);
}

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})



function sendRawTransaction(fromAddress,toAddress,data) {

  var datadir = config.dataDirectory;
  var keyObject = keythereum.importFromFile(fromAddress, datadir);
  var privateKey = keythereum.recover(config.password, keyObject);

  var from = fromAddress;
  var to =  toAddress;

  var nonce =  web3.eth.getTransactionCount(from) ;
  var gasPrice = web3.eth.gasPrice;
  //Will get the gasLimit from latest transaction
  var transactionLatest = web3.eth.getBlock('latest');
  var gasLimit = transactionLatest.gasLimit;


  //Get the price in hex for submitting i rawTx
  var gasPriceHex = web3.toHex(gasPrice);
  var gasLimitHex = web3.toHex(gasLimit);
  var nonceHex = web3.toHex(nonce);

  //Not transferring any ether so setting it to 0
  var value = 0;

  //Get the estimated gas for this transaction, here data is just hash..if this is a smart contract replace with solidity code
  var gas = web3.eth.estimateGas({from:from,to:to,value:value,data: data});

  var rawTx = {
    nonce: nonceHex,
    from: from,
    to: to,
    value: value,
    gas: gas,
    gasPrice: gasPriceHex,
    gasLimit:  gasLimitHex,
    data: data
  };
  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
    if (!err)
      console.log('Transaction Hash: ',hash);
  });

}
