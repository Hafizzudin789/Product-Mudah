/*
// Import the following in the implementation class
import encryption from "../../../util/encrypt";
import * as des from "../../../encryption/des";
import * as rsa from "../../../encryption/rsa";
//Sample statement to encrypt password
// samplepublicKey2048  = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo8nRC93BSBG8kuLSkoL2\nLx5Eni3Zuc48p01jetrUl3i/6krO5YwUbnPleYdkIocfYlyLDSICExADxabBTwNJ\nPbeFtmpFCjQYstwzKko1r3yJVJuZArKBPPeXSRmGEPZR7TO+TItXU2lfbTRhQUyF\nySN+Z7tpqKBXpIQURaVpVfpV7SeJWif+uKMUU8beC0QlkhSvHiOqgBHWjSsRXuDZ\nErjpyPSdakZoXneKyGe90DYaUqfOL5hwJonRHjv7N0arHzbzUDPaX8OMqPUBePbS\ns3w57tq+8Q/A/TPo/O1aHSZ3Bns3Xag8moNEORiJ/uexv8EoISVWOz7eR51K14zP\nHwIDAQAB\n-----END PUBLIC KEY-----';
//const encryptPassword = encryption(store().login.forgotCredentialData.pinSuccessData.username, password, store().login.tokens.publicKey);
*/

var pidCrypt = require("pidcrypt");
var pidCryptUtil = require("pidcrypt/pidcrypt_util");
var XORCipher = require("./XORCipher");
require("pidcrypt/rsa");
require("pidcrypt/asn1");
const _enCryptPassword = (publicKey, userName, password) => {
    var crypted = "";
    var params = certParser(publicKey);
    if (params.b64) {
        var key = pidCryptUtil.decodeBase64(params.b64);
        //new RSA instanced
        var rsa = new pidCrypt.RSA();
        //RSA encryption
        //ASN1 parsing
        var asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(key));
        var tree = asn.toHexTree();
        //setting the public key for encryption
        rsa.setPublicKeyFromASN(tree);
        //var t = new Date();  // timer
        // XOR encryption
        var XORCypted = XORCipher.encode(userName, password);
        // RSA enCryption for XOR encrypted password
        crypted = rsa.encrypt(XORCypted.trim());
        return crypted;
    } else {
        console.log(console.DEBUG, "Login::_enCryptPassword", "Unable to find public key");
        return "";
    }
};
const certParser = (cert) => {
    var lines = cert.split("\n");
    var read = false;
    var b64 = false;
    var flag = "";
    var retObj = {};
    retObj.info = "";
    retObj.salt = "";
    retObj.iv = "";
    retObj.b64 = "";
    retObj.aes = false;
    retObj.mode = "";
    retObj.bits = 0;
    for (var i: number = 0; i < lines.length; i++) {
        flag = lines[i].substr(0, 10);
        if (i === 1 && flag !== "Proc-Type" && flag.indexOf("M") === 0) {
            //unencrypted cert?
            b64 = true;
        }
        switch (flag) {
            case "-----BEGIN":
                read = true;
                break;
            case "Proc-Type":
                if (read) {
                    retObj.info = lines[i];
                }
                break;
            case "DEK-Info:":
                if (read) {
                    var tmp = lines[i].split(",");
                    var dek = tmp[0].split(": ");
                    var aes = dek[1].split("-");
                    retObj.aes = aes[0] === "AES" ? true : false;
                    retObj.mode = aes[2];
                    retObj.bits = parseInt(aes[1], 10);
                    retObj.salt = tmp[1].substr(0, 16);
                    retObj.iv = tmp[1];
                }
                break;
            case "":
                if (read) {
                    b64 = true;
                }
                break;
            case "-----END ":
                if (read) {
                    b64 = false;
                    read = false;
                }
                break;
            default:
                if (read && b64) {
                    let a = (retObj.b64 += pidCryptUtil.stripLineFeeds(lines[i]));
                }
        }
    }
    return retObj;
};
export default (userName, password, publicKey) => {
    var publicKey2048 = "-----BEGIN PUBLIC KEY-----\n" + publicKey.trim() + "\n-----END PUBLIC KEY-----";
    var passwordEncrypt = _enCryptPassword(publicKey2048, userName, password);
    return passwordEncrypt;
};
