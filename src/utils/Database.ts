import { Collection, Db, MongoClient } from "mongodb";
import Session from "./Types";

class Database {
  private client: MongoClient;
  private db: Db | undefined;
  private races: Collection<Session> | undefined;

  get Events() {
    return this.races;
  }

  constructor() {
    this.client = new MongoClient(
      process.env.MONGO! || "mongodb://localhost:27017/f1notif"
    );
  }
  public async Connect() {
    try {
      await this.client.connect();
      this.db = this.client.db("f1notif");
      this.races = this.db.collection("races");
      console.log("Database Connected!");
    } catch (e) {
      console.log("Database Error");
    }
  }
}

export default new Database();
