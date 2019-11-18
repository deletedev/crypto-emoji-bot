"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function checkTime(ctx, next) {
    if (ctx.updateType === 'message') {
        if (new Date().getTime() / 1000 - ctx.message.date < 5 * 60) {
            next();
        }
        else {
            console.log(`Ignoring message from ${ctx.from.id} at ${ctx.chat.id} (${new Date().getTime() / 1000}:${ctx.message.date})`);
        }
    }
    else {
        next();
    }
}
exports.checkTime = checkTime;
//# sourceMappingURL=checkTime.js.map