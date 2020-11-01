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
exports.NumberIdParam = exports.StringIdParam = exports.MongoIdParam = void 0;
const class_validator_1 = require("class-validator");
class MongoIdParam {
}
__decorate([
    class_validator_1.IsMongoId(),
    __metadata("design:type", String)
], MongoIdParam.prototype, "id", void 0);
exports.MongoIdParam = MongoIdParam;
class StringIdParam {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], StringIdParam.prototype, "id", void 0);
exports.StringIdParam = StringIdParam;
class NumberIdParam {
}
__decorate([
    class_validator_1.IsNumberString(),
    __metadata("design:type", String)
], NumberIdParam.prototype, "id", void 0);
exports.NumberIdParam = NumberIdParam;
//# sourceMappingURL=index.js.map