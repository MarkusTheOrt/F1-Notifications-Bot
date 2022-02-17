import { Collection, Db, MongoClient } from "mongodb";
import Config from "../Config";
import Session, { Message } from "./Types";

class Database {
  private client: MongoClient;
  private db: Db | undefined;
  private races: Collection<Session> | undefined;
  private messages: Collection<Message> | undefined;

  get Events() {
    return this.races;
  }

  get Messages() {
    return this.messages;
  }

  constructor() {
    this.client = new MongoClient(Config.mongoUrl);
  }
  public async Connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(Config.mongoDb);
      this.races = this.db.collection("races");
      this.messages = this.db.collection("messages");
      console.log("Database Connected!");
    } catch (e) {
      console.log("Database Error");
    }
  }
}

export default new Database();
