"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const typegoose_1 = require("@typegoose/typegoose");
class User {
}
__decorate([
    typegoose_1.prop({ required: true, index: true, unique: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: 'en' }),
    __metadata("design:type", String)
], User.prototype, "language", void 0);
exports.User = User;
// Get User model
exports.UserModel = typegoose_1.getModelForClass(User, {
    schemaOptions: { timestamps: true },
});
// Get or create user
async function findUser(id) {
    let user = await exports.UserModel.findOne({ id });
    if (!user) {
        try {
            user = await new exports.UserModel({ id }).save();
        }
        catch (err) {
            user = await exports.UserModel.findOne({ id });
        }
    }
    return user;
}
exports.findUser = findUser;
//# sourceMappingURL=User.js.map