import Client from "./Client.js";
import Config from "../Config.js";
import Database from "./Database.js";
import { TextChannel } from "discord.js";
import { MinDate } from "./DateTool.js";

Client.on("ready", async () => {
  for (;;) {
    const messages = Database.Messages?.find({});

    while (await messages?.hasNext()) {
      const message = await messages?.next();
      if (message === undefined || message === null) continue;

      const msgDate = new MinDate(message.date).get().getTime();

      if (Math.abs(Date.now() - msgDate) < 30 * 60 * 1000) {
        continue;
      }

      const Channel = Client.channels.cache.get(Config.channel) as TextChannel;
      if (Channel === null) continue;
      try {
        await Channel.messages.delete(message.messageId);
        await Database.Messages?.deleteOne({ _id: message._id });
      } catch {
        console.log("Database error while deleting.");
      }
    }

    await new Promise((resolve) => setTimeout(resolve, Config.interval * 1000));
  }
});
/**
 *
 */
export default null;
