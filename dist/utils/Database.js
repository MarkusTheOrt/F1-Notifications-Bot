"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Database {
    constructor() {
        this.client = new mongodb_1.MongoClient(process.env.MONGO || "mongodb://localhost:27017/f1notif");
    }
    get Events() {
        return this.races;
    }
    Connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                this.db = this.client.db("f1notif");
                this.races = this.db.collection("races");
                console.log("Database Connected!");
            }
            catch (e) {
                console.log("Database Error");
            }
        });
    }
}
exports.default = new Database();
