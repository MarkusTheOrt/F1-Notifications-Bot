import Client from "./Client";
import Config from "../Config";
import Database from "./Database";
import { TextChannel } from "discord.js";
import moment from "moment";

Client.on("ready", async () => {
  while (true) {
    const messages = Database.Messages?.find({});

    while (await messages?.hasNext()) {
      const message = await messages?.next();
      if (message === undefined || message === null) continue;

      // Only delete Messages that are older than 30 Minutes.
      if (Math.abs(moment(message.date).diff(moment.now())) < 30 * 60 * 1000)
        continue;

      const Channel = Client.channels.cache.get(Config.channel) as TextChannel;
      if (Channel === null) continue;
      try {
        await Channel.messages.delete(message.messageId);
        await Database.Messages?.deleteOne({ _id: message._id });
      } catch {}
    }

    await new Promise((resolve) => setTimeout(resolve, Config.interval * 1000));
  }
});
/**
 *
 */
export default null;
