const sha256 = require("js-sha256");
const Web3 = require("web3");
const axios = require('axios').default;
const User = require('../models/users');
const Wallet = require('../models/wallet');
const user = require('../controllers/users');
const Moralis = require('moralis/node');
const config = require('../config');
const encryptLogin = (message) => {
    const salt = Date.now() * Math.random() * 1000;
    const salt2 = (Math.random() + 1).toString(36).substring(7);
    return sha256(salt + message + salt2);
  };


 async function checkUserHaveNFT(address){
    try {
        const serverUrl = config.serverUrl;
        const appId = config.appId;
        Moralis.start({ serverUrl, appId });
      const options = { address: address, chain: config.chain };
      const NFTs = await Moralis.Web3.getNFTs(options);
      const wallet=await Wallet.findOne({type:'activeType'}).exec();
        for (let i = 0; i < wallet.whiteListedNFTaddresses.length; i++) {
            const new_NFTs = NFTs.filter(
              (v) =>
                Web3.utils.toChecksumAddress(v.token_address) ===
                Web3.utils.toChecksumAddress(wallet.whiteListedNFTaddresses[i])
            );
            if(new_NFTs.length>0){
                return true;
            }

            }


          }



      catch(err){
      }
      return false
    }



exports.nonce=(req, res) => {
const userWallet = req.body.wallet;
const nonceKey = encryptLogin(
    userWallet + config.saltHash + Math.random() * 1000
);
res.send({ nonce: nonceKey });

};


const findUser = async (username) => {
    return await axios.post(`${global.db_app_url}api/v1/search/user`, { username })
    .then(function (response) {
        return {
            status: true,
            message: 'User found.',
            user: response.data.user
        }
    })
    .catch(function(error) {
        return {
            status: false,
            message: 'User not found.'
        };
    });
};

const createUser = async (user) => {
    return await axios.post(`${global.db_app_url}api/v1/create/user`, user)
    .then(function (response) {
        return true;
    })
    .catch(function(error) {
        return false;
    });
};

exports.auth=async(req, res) => {
    axios.post(`${global.db_app_url}api/v1/wallet/`, { type: 'activeType' })
    .then(async function (response) {
        if (response.status) {
            const { wallet } = response.data;

            const web3 = new Web3(config.rpcUrl);
            const authUser = web3.eth.accounts.recover(req.body.nonce, req.body.sign);
            if(wallet.activeType=='disabled'){
                res.send({status:'disabled'})
            }
            else if (wallet.activeType=='nft'){
                if(await checkUserHaveNFT(Web3.utils.toChecksumAddress(authUser))){
                    User.findOne({wallet:authUser}).exec((err, users) => {
                        if(users){
                            user.find({body:{wallet:authUser}},res)
                        }
                        else{
                            user.create({body:{wallet:authUser,username:authUser+config.walletUsernameKey,online:false}},res)
                        }
                    })
                }
                else{
                    res.send({status:'not-on-whitelist'})
                }
            }
            else{

                const user = await findUser(authUser+config.walletUsernameKey);
                if (user.status) {
                    // if user found. run relevant apis.
                    res.status(200).send({
                        status: true,
                        message: 'User found.',
                        wallet: authUser
                    });
                } else {
                    createUser({
                        username: authUser+config.walletUsernameKey,
                        email: authUser+config.walletEmailKey,
                        wallet_id: authUser
                    })
                    .then((api_res) => {
                        res.status(200).send({
                            status: api_res.status,
                            message: api_res.status ? 'User created successfully' : 'Unable to create user.',
                            wallet: authUser
                        });
                    });
                }

                // const jwt = encryptLogin(authUser);
                // User.findOne({wallet:authUser}).exec((err, users) => {
                //     if(users){
                //         user.find({body:{wallet:authUser}},res)
                //     }
                //     else{
                //         user.create({body:{wallet:authUser,username:authUser+config.walletUsernameKey,online:false}},res)
                //     }
                // })
            }
        }

    })
    .catch(function (error) {
        console.log('error', error);
    });

    // Wallet.findOne({type:'activeType'}).exec(async(err, wallet) => {
    //     const web3 = new Web3(config.rpcUrl);
    //     const authUser = web3.eth.accounts.recover(req.body.nonce, req.body.sign);
    //     if(wallet.activeType=='disabled'){
    //         res.send({status:'disabled'})
    //     }
    //     else if (wallet.activeType=='nft'){
    //
    //         if(await checkUserHaveNFT(Web3.utils.toChecksumAddress(authUser))){
    //             User.findOne({wallet:authUser}).exec((err, users) => {
    //                 if(users){
    //                     user.find({body:{wallet:authUser}},res)
    //                 }
    //                 else{
    //                     user.create({body:{wallet:authUser,username:authUser+config.walletUsernameKey,online:false}},res)
    //                 }
    //                 })
    //         }
    //         else{
    //             res.send({status:'not-on-whitelist'})
    //         }
    //     }
    //     else{
    //
    //        // const jwt = encryptLogin(authUser);
    //         User.findOne({wallet:authUser}).exec((err, users) => {
    //         if(users){
    //             user.find({body:{wallet:authUser}},res)
    //         }
    //         else{
    //             user.create({body:{wallet:authUser,username:authUser+config.walletUsernameKey,online:false}},res)
    //         }
    //         })
    //     }
    // });






};

exports.getwalletStatus=async(req, res) => {
    Wallet.findOne({type:'activeType'}).exec((err, wallet) => {
        res.send({
        whitelist:wallet.whiteListedNFTaddresses,
        status:wallet.activeType
    })
    });
};


exports.setwalletactiveTypeStatus=async(req, res) => {
    Wallet.updateOne({type:'activeType'}, { activeType: req.body.activeType }).exec((err, response) => {
		if (err) {
			return res.status(500).send(err);
		}
		return res.status(200).send({ message: 'success' });
	});
};
exports.setwalletwhitelistAdd=async(req, res) => {

    await Wallet.updateOne({type:'activeType'}, {
            $push:{
                whiteListedNFTaddresses:req.body.nftAddress
                    } }).exec();
        res.send({message:'success'})




};
exports.setwalletwhitelistRemove=async(req, res) => {
    const wallet=await Wallet.findOne({type:'activeType'}).exec();
    let newWallet=wallet.whiteListedNFTaddresses.filter((val)=>val!==req.body.nftAddress)
    await Wallet.updateOne({type:'activeType'}, {
        whiteListedNFTaddresses:newWallet
                }).exec();
 res.send({message:'success'})
}
