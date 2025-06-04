import express from 'express';

class ExpressApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.start();
  }

  private start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}

export default ExpressApp;
