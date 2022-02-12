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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Client_1 = __importDefault(require("./Client"));
const Database_1 = __importDefault(require("./Database"));
Client_1.default.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    while (true) {
        // Update once a minute
        const events = Database_1.default.Events.find({
            notified: { $exists: false },
        });
        const now = (0, moment_1.default)().utc();
        let difference = 100000000;
        let session = null;
        while (yield (events === null || events === void 0 ? void 0 : events.hasNext())) {
            const event = yield events.next();
            if (event === null)
                continue;
            const parsed = (0, moment_1.default)(event.date);
            const diff = now.diff(parsed) / 1000;
            if (Math.abs(diff) < difference && Math.abs(diff) < 100) {
                difference = Math.abs(diff);
                session = event;
            }
        }
        if (session !== null) {
            const time = parseInt((0, moment_1.default)(session.date).format("x")) / 1000;
            session.notified = true;
            (_a = Database_1.default.Events) === null || _a === void 0 ? void 0 : _a.updateOne({ _id: session._id }, { $set: { notified: true } });
            Client_1.default.channels.cache.get("883847531631611936").send(`** <@&942179808136298516> ${session.name} ${session.type} is about to start** <t:${time}:R>`);
        }
        console.log("Pingus Butus!");
        yield new Promise((resolve) => setTimeout(resolve, 60 * 1000));
    }
}));
exports.default = null;
