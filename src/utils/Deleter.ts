import Client from "./Client";
import Config from "../Config";
import { Db } from "mongodb";
import Database from "./Database";
import { TextChannel } from "discord.js";
import moment from "moment";

Client.on("ready", async () => {
  while (true) {
    const messages = Database.Messages?.find({});

    while (await messages?.hasNext()) {
      const message = await messages?.next();
      if (message === undefined || message === null) continue;

      // Delete messages after 30 minutes.
      if (moment(message.date).diff(moment.now()) < 30 * 60 * 1000) continue;
      const Channel = (await Client.channels.fetch(
        Config.channel
      )) as TextChannel;
      if (Channel === null) continue;
      const msg = await Channel.messages.fetch(message.messageId);
      if (msg === null) continue;
      await msg.delete();
    }

    await new Promise((resolve) =>
      setTimeout(resolve, Config.interval * 5 * 1000)
    );
  }
});

export default null;
