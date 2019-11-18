"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dirtyI18N = require('telegraf-i18n');
const i18n = new dirtyI18N({
    directory: `${__dirname}/../../locales`,
    defaultLanguage: 'en',
    sessionName: 'session',
    useSession: false,
    allowMissing: false,
});
function setupI18N(bot) {
    bot.use(i18n.middleware());
    bot.use((ctx, next) => {
        const anyI18N = ctx.i18n;
        anyI18N.locale(ctx.dbuser.language);
        next();
    });
}
exports.setupI18N = setupI18N;
//# sourceMappingURL=i18n.js.map