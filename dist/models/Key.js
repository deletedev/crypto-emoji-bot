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
let Key = class Key {
};
__decorate([
    typegoose_1.prop({ required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Key.prototype, "user", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Key.prototype, "key", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Key.prototype, "name", void 0);
Key = __decorate([
    typegoose_1.index({ user: 1, key: 1 }, { unique: true })
], Key);
exports.Key = Key;
// Get User model
exports.KeyModel = typegoose_1.getModelForClass(Key, {
    schemaOptions: { timestamps: true },
});
//# sourceMappingURL=Key.js.map