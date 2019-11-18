"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Config dotenv
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../.env` });
// Dependencies
const bot_1 = require("./helpers/bot");
const checkTime_1 = require("./middlewares/checkTime");
const crypto_1 = require("./commands/crypto");
const i18n_1 = require("./helpers/i18n");
const main_1 = require("./commands/main");
const attachUser_1 = require("./middlewares/attachUser");
// Check time
bot_1.bot.use(checkTime_1.checkTime);
// Attach user
bot_1.bot.use(attachUser_1.attachUser);
// Setup localization
i18n_1.setupI18N(bot_1.bot);
// Setup commands
main_1.setupStart(bot_1.bot);
crypto_1.setupCipher(bot_1.bot);
// Start bot
bot_1.bot.startPolling();
// Log
console.info('Bot is up and running');
//# sourceMappingURL=app.js.map