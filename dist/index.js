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
const Client_1 = __importDefault(require("./utils/Client"));
const Commands_1 = __importDefault(require("./utils/Commands"));
Client_1.default.on("ready", () => {
    console.log("Bot is connected as " + Client_1.default.user.tag);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    Commands_1.default.Register();
    yield Client_1.default.login("OTQyMTIxOTUwNzc4NjM0MjQw.Ygf5cA.XbyFcWKzu_RmilAYZYmS8YfZVzs");
    (_a = Client_1.default.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        status: "dnd",
        activities: [
            {
                name: "for a new Session",
                type: "LISTENING",
            },
        ],
    });
}))().catch((e) => console.error(e));
