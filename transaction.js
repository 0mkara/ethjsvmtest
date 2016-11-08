/***
VM transaction test
***/
var ethJSUtil = require('ethereumjs-util');
var EthJSTX = require('ethereumjs-tx');
var EthJSBlock = require('ethereumjs-block');
var EthJSVM = require('ethereumjs-lib').VM;
var ethJSABI = require('ethereumjs-abi');

var vmBlockNumber = 1150000;
var BN = ethJSUtil.BN;
var VM = new EthJSVM(null, null, { activatePrecompiles: true, enableHomestead: true });
var vmAccounts = [];
var privateKey = new Buffer('3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511', 'hex');
var address = ethJSUtil.privateToAddress(privateKey);
var bytecode = '60606040526040516104e43803806104e4833981016040528080518201919060200150505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b8060016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100b257805160ff19168380011785556100e3565b828001600101855582156100e3579182015b828111156100e25782518260005055916020019190600101906100c4565b5b50905061010e91906100f0565b8082111561010a57600081815060009055506001016100f0565b5090565b50505b506103c4806101206000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480633c43ec391461005257806341c0e1b514610119578063cfae32171461012d5761004d565b610002565b34610002576100ab6004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506101ad565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561010b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100025761012b6004805050610274565b005b346100025761013f6004805050610308565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561019f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60206040519081016040528060008152602001508160016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061021057805160ff1916838001178555610241565b82800160010185558215610241579182015b82811115610240578251826000505591602001919060010190610222565b5b50905061026c919061024e565b80821115610268576000818150600090555060010161024e565b5090565b50505b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561030557600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b602060405190810160405280600081526020015060016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103b55780601f1061038a576101008083540402835291602001916103b5565b820191906000526020600020905b81548152906001019060200180831161039857829003601f168201915b505050505090506103c1565b9056'
address = '0x' + address.toString('hex');
vmAccounts[address] = { privateKey: privateKey, nonce: 0 };

function runTransactions(txObj, privateKey, callback) {
    console.log("Running transaction");
    var tx = new EthJSTX(txObj);
    tx.sign(privateKey);
    VM.runTx({ tx: tx, skipBalance: true, skipNonce: true }, function(err, cb) {
        callback(err, cb);
    });
};

/*VM.stateManager.putAccountBalance(address, 'f00000000000000001', function(error, callback) {
    var tx = new EthJSTX({
            nonce: new BN(vmAccounts[address].nonce++),
            gasPrice: new BN(1),
            gasLimit: new BN(3000000, 10),
            value: new BN(0, 10),
            data: bytecode
        });
    tx.sign(vmAccounts[address].privateKey);
    var block = new EthJSBlock({
            header: {
                timestamp: new Date().getTime() / 1000 | 0,
                number: vmBlockNumber
            },
            transactions: [],
            uncleHeaders: []
        });
    VM.runTx({ block: block, tx: tx, skipBalance: true, skipNonce: true }, function(error, result) {
        console.log('address: ' + result.createdAddress.toString('hex'));
        // cfae3217 (greet)
        // 3c43ec390000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000 (changeGreet)
        buffer = Buffer.concat([ ethJSABI.methodID('changeGreet', ['string']), ethJSABI.rawEncode(['string'], ['Hello']) ]).toString('hex')
        var tx = new EthJSTX({
                nonce: new BN(vmAccounts[address].nonce++),
                gasPrice: new BN(1),
                gasLimit: new BN(3000000, 10),
                to: new Buffer(result.createdAddress.toString('hex'), 'hex'),
                value: new BN(0, 10),
                data: new Buffer(buffer, 'hex')
            });
        tx.sign(vmAccounts[address].privateKey);
        var block = new EthJSBlock({
                header: {
                    timestamp: new Date().getTime() / 1000 | 0,
                    number: vmBlockNumber
                },
                transactions: [],
                uncleHeaders: []
            });
        VM.runTx({ block: block, tx: tx, skipBalance: true, skipNonce: true }, function(error, result) {
            console.log(error);
            console.log(result);
        });
    });
});*/
function runTransactionTest() {
    console.log("Running test");
    var transactionObj = {
        nonce: new BN(vmAccounts[address].nonce),
        gasPrice: new BN(1),
        gasLimit: new BN(3000000, 10),
        value: new BN(0, 10),
        data: bytecode
    };
    VM.on('step', function(data) {
        console.log('logging step');
        //console.log(data);
    });
    VM.stateManager.putAccountBalance(address, 'f00000000000000001', function(error, callback) {
        VM.stateManager.getAccountBalance(new Buffer(address, 'hex'), function(error, callback) {
            if(!error) {
                if(error == null) {
                    runTransactions(transactionObj, vmAccounts[address].privateKey, function(error, callback) {
                        console.log("Error " + error);
                        console.log(callback);
                    });
                }
            }
        });
    });
}
runTransactionTest();
