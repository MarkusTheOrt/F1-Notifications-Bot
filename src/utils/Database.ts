import { Collection, Db, MongoClient } from "mongodb";
import Config from "../Config.js";
import { Message, Setting, Weekend } from "./Types.js";

class Database {
  private client: MongoClient;
  private db: Db | undefined;

  private messages: Collection<Message> | undefined;
  private weekends: Collection<Weekend> | undefined;
  private settings: Collection<Setting> | undefined;

  constructor() {
    this.client = new MongoClient(Config.mongoUrl);
  }
  public async Connect() {
    try {
      await this.client.connect();

      this.db = this.client.db(Config.mongoDb);
      this.messages = this.db.collection("messages");
      this.weekends = this.db.collection("weekends");
      this.settings = this.db.collection("settings");

      console.log("Database Connected!");
    } catch (e) {
      console.log("Database Error");
    }
  }

  get Messages() {
    return this.messages;
  }

  get Weekends() {
    return this.weekends;
  }

  get Settings() {
    return this.settings;
  }
}

export default new Database();
