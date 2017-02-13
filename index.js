var express = require('express')

var app = express();
var Web3 = require('web3');
var Tx = require('ethereumjs-tx')
var keythereum = require("keythereum");

app.set('port', (process.env.PORT || 8000))
app.use(express.static(__dirname + '/public'));

var config = require('./config/settings');


var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Location));

var message = 'VISA';

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
  var nonceHex = web3.toHex(nonce);
  var gasPrice = web3.eth.gasPrice;

  //This is not implemented
  //var gasLimit = web3.eth.gasLimit;
  //Will get the gasLimit from latest transaction
  var transactionLatest = web3.eth.getBlock('latest');
  var gasLimit = transactionLatest.gasLimit;


  //Get the price in hex for rawTx
  var gasPriceHex = web3.toHex(gasPrice);
  var gasLimitHex = web3.toHex(gasLimit);
  var gas = 200000;
  var value = 1;


  var rawTx = {
    nonce: nonceHex,
    from: from,
    to: to,
    value: value,
    gas: gas,
    //100000
    gasPrice: gasPriceHex,
    //20000000000
    gasLimit:  gasLimitHex,
    //4712388,100000
    data: data
  };
  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();

  console.log('From: -', from, 'To:- ', to, 'Data: ', data,'GasPrice: ',gasPriceHex,'Gas Limit',gasLimit);

  web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
    if (!err)
      console.log(hash);
  });

}
