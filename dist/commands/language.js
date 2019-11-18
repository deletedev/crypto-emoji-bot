"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const telegraf_1 = require("telegraf");
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const crypto_1 = require("../helpers/crypto");
function setupLanguage(bot) {
    bot.command('start', ctx => {
        ctx.replyWithHTML(ctx.i18n.t('hello'), {
            reply_markup: languageKeyboard(),
        });
    });
    bot.action(localesFiles().map(file => file.split('.')[0]), async (ctx) => {
        let user = ctx.dbuser;
        user.language = ctx.callbackQuery.data;
        user = await user.save();
        const message = ctx.callbackQuery.message;
        const anyI18N = ctx.i18n;
        anyI18N.locale(ctx.callbackQuery.data);
        await ctx.telegram.editMessageText(message.chat.id, message.message_id, undefined, ctx.i18n.t('language_selected'), telegraf_1.Extra.HTML(true));
        const key = crypto_1.GenerateRandomKey();
        await ctx.telegram.sendMessage(message.chat.id, ctx.i18n.t('first_private_key', { key }), telegraf_1.Markup
            .keyboard([ctx.i18n.t('encrypt'), ctx.i18n.t('keys')])
            .oneTime()
            .resize()
            .extra());
    });
}
exports.setupLanguage = setupLanguage;
function languageKeyboard() {
    const locales = localesFiles();
    const result = [];
    locales.forEach((locale, index) => {
        const localeCode = locale.split('.')[0];
        const localeName = js_yaml_1.safeLoad(fs_1.readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8')).name;
        if (index % 2 == 0) {
            if (index === 0) {
                result.push([telegraf_1.Markup.callbackButton(localeName, localeCode)]);
            }
            else {
                result[result.length - 1].push(telegraf_1.Markup.callbackButton(localeName, localeCode));
            }
        }
        else {
            result[result.length - 1].push(telegraf_1.Markup.callbackButton(localeName, localeCode));
            if (index < locales.length - 1) {
                result.push([]);
            }
        }
    });
    return telegraf_1.Markup.inlineKeyboard(result);
}
function localesFiles() {
    return fs_1.readdirSync(`${__dirname}/../../locales`);
}
//# sourceMappingURL=language.js.map