"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
class DataStore {
    constructor() {
        const storePath = (0, path_1.join)(process.cwd(), "./conf/");
        if (fs_1.default.existsSync(storePath) === false) {
            fs_1.default.mkdirSync(storePath);
        }
        if (fs_1.default.existsSync(storePath + "./main.json") === false) {
            fs_1.default.writeFileSync(storePath + "./main.json", JSON.stringify({ calenders: {} }));
        }
    }
    getFileNameFor(Year) {
        return (0, path_1.join)(process.cwd(), `./conf/${Year}.json`);
    }
    GetEventsFor(Year) {
        const file = this.getFileNameFor(Year);
        if (fs_1.default.existsSync(file) === false) {
            return null;
        }
        const contents = fs_1.default.readFileSync(file).toString("utf-8");
        return JSON.parse(contents);
    }
    hasEventsFor(Year) {
        const file = this.getFileNameFor(Year);
        if (fs_1.default.existsSync(file) === false) {
            return false;
        }
        const contents = fs_1.default.readFileSync(file).toString();
        if (contents.length === 0)
            return false;
        const races = JSON.parse(contents);
        if (races.length === 0)
            return false;
        return true;
    }
    SetEventsFor(Year, Events) {
        if (Events.length === 0)
            return;
        const file = this.getFileNameFor(Year);
        fs_1.default.writeFileSync(file, JSON.stringify(Events), { encoding: "utf-8" });
    }
}
exports.DataStore = DataStore;
exports.default = new DataStore();
