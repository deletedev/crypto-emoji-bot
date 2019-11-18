"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const telegraf_1 = require("telegraf");
const Key_1 = require("../models/Key");
const crypto_1 = require("../helpers/crypto");
const { match } = require('telegraf-i18n');
function setupCipher(bot) {
    bot.hears(match('encrypt'), ctx => {
        ctx.reply(ctx.i18n.t('just_send_message'));
    });
    bot.action('nothing', async (ctx) => {
        ctx.answerCbQuery();
    });
    bot.action(/^enc_/, async (ctx) => {
        const message = ctx.callbackQuery.message;
        const data = ctx.callbackQuery.data;
        const keyid = data.slice(4);
        const key = await Key_1.KeyModel.findById(keyid);
        if (!key) {
            return await ctx.reply('key_not_exists');
        }
        const encrypted = crypto_1.encrypt(message.text, key.key);
        if (encrypted.length > 1800) {
            ctx.deleteMessage();
            return await ctx.reply(ctx.i18n.t('too_many_emoji'));
        }
        return await ctx.telegram.editMessageText(message.chat.id, message.message_id, undefined, encrypted);
    });
    bot.hears(match('keys'), async (ctx) => {
        await ctx.reply(ctx.i18n.t('loading_string'), KeyBoard(ctx, true, false));
        await ctx.reply(`${ctx.i18n.t('select_key')}`, {
            reply_markup: await inlineKeyboardAllKeys(ctx),
        });
    });
    bot.on('text', async (ctx) => {
        var _a, _b;
        if (((_b = (_a = ctx) === null || _a === void 0 ? void 0 : _a.keys) === null || _b === void 0 ? void 0 : _b.length) < 1) {
            return await ctx.reply(ctx.i18n.t('no_keys'), KeyBoard(ctx, false, true));
        }
        return await ctx.reply(ctx.message.text, {
            reply_markup: await inlineKeyboardEncryptString(ctx),
        });
    });
}
exports.setupCipher = setupCipher;
function KeyBoard(ctx, encrypt, keys) {
    const result = [];
    if (!encrypt && !keys) {
        result.push(ctx.i18n.t('encrypt'), ctx.i18n.t('keys'));
    }
    if (encrypt) {
        result.push(ctx.i18n.t('encrypt'));
    }
    if (keys) {
        result.push(ctx.i18n.t('keys'));
    }
    return telegraf_1.Markup
        .keyboard([result])
        .oneTime()
        .resize()
        .extra();
}
async function inlineKeyboardAllKeys(ctx) {
    let result = '';
    const keyboardresult = [];
    await Promise.all(ctx.keys.map((i, k) => {
        result = `${result}${k + 1}. ${i.name} `;
        keyboardresult.push([
            telegraf_1.Markup.callbackButton(`${k + 1}. ${i.name}`, i._id.toString()),
        ]);
    }));
    keyboardresult.push([
        telegraf_1.Markup.callbackButton(ctx.i18n.t('generate_new_key'), 'new_key'),
    ]);
    return telegraf_1.Markup.inlineKeyboard(keyboardresult);
}
async function inlineKeyboardEncryptString(ctx) {
    const keyboardresult = [];
    keyboardresult.push([telegraf_1.Markup.callbackButton(ctx.i18n.t('select_key'), 'nothing')]);
    await Promise.all(ctx.keys.map((i, k) => {
        keyboardresult.push([
            telegraf_1.Markup.callbackButton(`${i.name} 🔑`, `enc_${i._id.toString()}`),
        ]);
    }));
    return telegraf_1.Markup.inlineKeyboard(keyboardresult);
}
//# sourceMappingURL=crypto.js.map