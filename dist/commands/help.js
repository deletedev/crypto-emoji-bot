"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setupHelp(bot) {
    bot.command(['help', 'start'], ctx => {
        ctx.replyWithHTML(ctx.i18n.t('hello'));
    });
}
exports.setupHelp = setupHelp;
//# sourceMappingURL=help.js.map