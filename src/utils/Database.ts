import { Collection, Db, MongoClient } from "mongodb";
import Config from "../Config.js";
import { some, Option, none, unwrap } from "./Optional.js";
import { Message, Setting, Weekend } from "./Types.js";

class Database {
  private client: MongoClient;
  private db: Option<Db> = none;

  private messages: Option<Collection<Message>> = none;
  private weekends: Option<Collection<Weekend>> = none;
  private settings: Option<Collection<Setting>> = none;

  constructor() {
    this.client = new MongoClient(Config.mongoUrl);
  }
  public async Connect() {
    try {
      await this.client.connect();

      this.db = some(this.client.db(Config.mongoDb));
      this.messages = some(unwrap(this.db).collection("messages"));
      this.weekends = some(unwrap(this.db).collection("weekends"));
      this.settings = some(unwrap(this.db).collection("settings"));

      console.log("Database Connected!");
    } catch (e) {
      console.log("Database Error");
    }
  }

  get Messages() {
    return unwrap(this.messages);
  }

  get Weekends() {
    return unwrap(this.weekends);
  }

  get Settings() {
    return unwrap(this.settings);
  }
}

export default new Database();
