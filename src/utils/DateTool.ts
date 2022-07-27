import Constants from "./Constants";

export class MinDate {
  private original: string;
  private check: boolean;
  private date: Date;

  constructor(inDate: string) {
    this.original = inDate;
    this.check = Constants.dateMatch.test(this.original);
    this.date = new Date(this.original);
  }

  get isValid() {
    return this.check;
  }

  get() {
    return this.date;
  }
}
