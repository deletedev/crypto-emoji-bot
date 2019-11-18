"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { match } = require('telegraf-i18n');
function setupCipher(bot) {
    bot.hears(match('encrypt'), ctx => {
        ctx.reply(ctx.i18n.t('just_send_message'));
    });
}
exports.setupCipher = setupCipher;
//# sourceMappingURL=code.js.map