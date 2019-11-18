"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TelegrafBot = require('telegraf');
exports.bot = new TelegrafBot(process.env.TOKEN);
exports.bot.telegram.getMe().then(botInfo => {
    const anybot = exports.bot;
    anybot.options.username = botInfo.username;
});
//# sourceMappingURL=bot.js.map