"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ecoji = require('ecoji-js');
const crypto = require("crypto");
function GenerateRandomKey() {
    const CRYPTED_ECOJI = ecoji.encode(crypto
        .randomBytes(40)
        .toString('hex')
        .slice(0, 32));
    return CRYPTED_ECOJI;
}
exports.GenerateRandomKey = GenerateRandomKey;
function encrypt(text, key) {
    key = ecoji.decode(key);
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return ecoji.encode(iv.toString('hex') + ':' + encrypted.toString('hex'));
}
exports.encrypt = encrypt;
function decrypt(text, key) {
    text = ecoji.decode(text);
    key = ecoji.decode(key);
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
exports.decrypt = decrypt;
//let hw = encrypt("Как дела ваши ммммммммммм?", CRYPTED_ECOJI)
//console.log(`KEY: ${CRYPTED_ECOJI}\n\nENCODED STRING: ${hw}\n\nDECODED STRING: ${decrypt(hw, CRYPTED_ECOJI)}`)
//# sourceMappingURL=crypto.js.map