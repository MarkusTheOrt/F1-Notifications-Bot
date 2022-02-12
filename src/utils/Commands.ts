import { Message, MessageEmbed, MessageMentions } from "discord.js";
import Client from "./Client";
import DataStore from "./DataStore";

type CmdErr = "InvalidArg" | "";

export class Commands {
  public Register() {
    Client.on("messageCreate", (message) => {
      this.ParseMessage(message);
    });
  }

  private async ParseMessage(message: Message<boolean>) {
    // Only allow Administrators on a server
    if (!message.member?.permissions.has("ADMINISTRATOR")) return;
    // Discard messages from Bots
    if (message.author.bot) return;

    if (
      message.mentions.has(Client.user!.id, { ignoreEveryone: true }) === false
    )
      return;

    const cmdArgs = message.cleanContent.split(" ");
    if (cmdArgs.length < 1) return;
    if (cmdArgs[1].toLowerCase() === "set" && cmdArgs.length > 1) {
      if (isNaN(parseInt(cmdArgs[2])) === true) {
        await message.reply({ embeds: [this.ErrorEmbed(1, cmdArgs[2])] });
        return;
      }
      if (message.attachments.size === 0) {
        await message.reply({ embeds: [this.ErrorEmbed(2, "")] });
      }
    }
  }

  private ErrorEmbed(type: number, arg: string): MessageEmbed {
    const embed = new MessageEmbed();
    embed.setColor(Math.random() * (0xffffff - 0));
    switch (type) {
      case 1:
        embed.setTitle("Invalid argument supplied");
        embed.setDescription(
          `Received Argument \`${arg}\` - Expected a full year number e.g \`2024\``
        );

        return embed;
      case 2:
        embed.setTitle("No Attachments supplied.");
        embed.setDescription("The `set` command requires a file attached.");
        embed.addField(
          "e.g.:",
          '```json\n[{ \n\t"name": ":flag_bh: Bahrain",\n\
\t"sessions": {\n\
\t\t"FP1": "2022-03-18T12:00:00Z",\n\
\t\t"FP2": "2022-03-18T15:00:00Z",\n\
\t\t"FP3": "2022-03-19T12:00:00Z",\n\
\t\t"Qualifying": "2022-03-19T15:00:00Z",\n\
\t\t"Race": "2022-03-20T15:00:00Z"\n\
\t}\n}]```'
        );
        return embed;
      default:
        embed.setTitle("Unknown Error Ocurred");
        embed.setDescription(
          "Unknown or Undefined Error ocurred during Execution of your command."
        );
        return embed;
        break;
    }
  }
}

export default new Commands();
