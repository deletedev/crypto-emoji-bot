"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const models_1 = require("../models");
const Key_1 = require("../models/Key");
async function attachUser(ctx, next) {
    const dbuser = await models_1.findUser(ctx.from.id);
    const keys = (await Key_1.KeyModel.find({ user: dbuser }));
    ctx.dbuser = dbuser;
    ctx.keys = keys;
    next();
}
exports.attachUser = attachUser;
//# sourceMappingURL=attachUser.js.map