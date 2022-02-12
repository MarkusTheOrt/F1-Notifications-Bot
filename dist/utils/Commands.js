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
exports.Commands = void 0;
const discord_js_1 = require("discord.js");
const Client_1 = __importDefault(require("./Client"));
class Commands {
    Register() {
        Client_1.default.on("messageCreate", (message) => {
            this.ParseMessage(message);
        });
    }
    ParseMessage(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Only allow Administrators on a server
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.permissions.has("ADMINISTRATOR")))
                return;
            // Discard messages from Bots
            if (message.author.bot)
                return;
            if (message.mentions.has(Client_1.default.user.id, { ignoreEveryone: true }) === false)
                return;
            const cmdArgs = message.cleanContent.split(" ");
            if (cmdArgs.length < 1)
                return;
            if (cmdArgs[1].toLowerCase() === "set" && cmdArgs.length > 1) {
                if (isNaN(parseInt(cmdArgs[2])) === true) {
                    yield message.reply({ embeds: [this.ErrorEmbed(1, cmdArgs[2])] });
                    return;
                }
                if (message.attachments.size === 0) {
                    yield message.reply({ embeds: [this.ErrorEmbed(2, "")] });
                }
            }
        });
    }
    ErrorEmbed(type, arg) {
        const embed = new discord_js_1.MessageEmbed();
        embed.setColor(Math.random() * (0xffffff - 0));
        switch (type) {
            case 1:
                embed.setTitle("Invalid argument supplied");
                embed.setDescription(`Received Argument \`${arg}\` - Expected a full year number e.g \`2024\``);
                return embed;
            case 2:
                embed.setTitle("No Attachments supplied.");
                embed.setDescription("The `set` command requires a file attached.");
                embed.addField("e.g.:", '```json\n[{ \n\t"name": ":flag_bh: Bahrain",\n\
\t"sessions": {\n\
\t\t"FP1": "2022-03-18T12:00:00Z",\n\
\t\t"FP2": "2022-03-18T15:00:00Z",\n\
\t\t"FP3": "2022-03-19T12:00:00Z",\n\
\t\t"Qualifying": "2022-03-19T15:00:00Z",\n\
\t\t"Race": "2022-03-20T15:00:00Z"\n\
\t}\n}]```');
                return embed;
            default:
                embed.setTitle("Unknown Error Ocurred");
                embed.setDescription("Unknown or Undefined Error ocurred during Execution of your command.");
                return embed;
                break;
        }
    }
}
exports.Commands = Commands;
exports.default = new Commands();
