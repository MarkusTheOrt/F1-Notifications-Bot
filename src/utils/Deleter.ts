import Client from "./Client.js";
import Config from "../Config.js";
import Database from "./Database.js";
import { TextChannel } from "discord.js";
import { MinDate } from "./DateTool.js";
import Try from "./Try.js";
import { isNone, unwrap } from "./Optional.js";

const Deleter = () => {
  Client.on("ready", async () => {
    console.log("Deleter initialized.");
    for (;;) {
      const messages = Database.Messages.find({});

      while (await messages.hasNext()) {
        const message = await Try(messages.next());
        if (isNone(message)) continue;

        const msgDate = new MinDate(unwrap(message).date).get().getTime();

        if (Math.abs(Date.now() - msgDate) < 30 * 60 * 1000) {
          continue;
        }

        const Channel = await Try(
          Client.channels.fetch(
            unwrap(message).channelId
          ) as Promise<TextChannel>
        );
        if (isNone(Channel)) {
          console.log("Couldn't Fetch channel at deletion.");
          continue;
        }
        if (
          isNone(
            await Try(
              unwrap(Channel).messages.delete(unwrap(message).messageId)
            )
          )
        ) {
          console.trace("Couldn't delete previous message.");
        }

        if (
          isNone(
            await Try(
              Database.Messages?.deleteOne({ _id: unwrap(message)._id })
            )
          )
        ) {
          console.trace("Database error deleting message thing.");
        }
      }

      await new Promise((resolve) =>
        setTimeout(resolve, Config.interval * 1000)
      );
    }
  });
};

/**
 *
 */
export default Deleter;
