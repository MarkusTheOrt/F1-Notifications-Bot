import fs from "fs";
import { join } from "path";
import { Race } from "./Types";

export class DataStore {
  constructor() {
    const storePath = join(process.cwd(), "./conf/");
    if (fs.existsSync(storePath) === false) {
      fs.mkdirSync(storePath);
    }
    if (fs.existsSync(storePath + "./main.json") === false) {
      fs.writeFileSync(
        storePath + "./main.json",
        JSON.stringify({ calenders: {} })
      );
    }
  }

  private getFileNameFor(Year: number) {
    return join(process.cwd(), `./conf/${Year}.json`);
  }

  public GetEventsFor(Year: number): Race[] | null {
    const file = this.getFileNameFor(Year);
    if (fs.existsSync(file) === false) {
      return null;
    }
    const contents = fs.readFileSync(file).toString("utf-8");
    return JSON.parse(contents);
  }

  public hasEventsFor(Year: number): boolean {
    const file = this.getFileNameFor(Year);
    if (fs.existsSync(file) === false) {
      return false;
    }
    const contents = fs.readFileSync(file).toString();
    if (contents.length === 0) return false;
    const races: Race[] = JSON.parse(contents);
    if (races.length === 0) return false;
    return true;
  }

  public SetEventsFor(Year: number, Events: Race[]) {
    if (Events.length === 0) return;
    const file = this.getFileNameFor(Year);
    fs.writeFileSync(file, JSON.stringify(Events), { encoding: "utf-8" });
  }
}

export default new DataStore();
