# node-js-sample-blockchain

A blockchain Ethereum and Node.js app using [Express 4](http://expressjs.com/).

This app makes use of [keythereum](https://github.com/ethereumjs/keythereum/) to read a blockchain address keyobject, to recover the plaintext private key from the key object using the password that has been set during account creation.

It then uses [ethereum transaction](https://github.com/ethereumjs/ethereumjs-tx) to invoke a raw transaction on the blockchain.


## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

Make sure to change the properties in config file to your local blockchain properties.

```sh
git clone https://github.com/madhvesh/node-js-sample-blockchain.git
cd node-js-sample-blockchain
npm install
npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku(if needed)

```
heroku create
git push heroku master
heroku open
```

Alternatively, you can deploy your own copy of the app using the web-based flow:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation
