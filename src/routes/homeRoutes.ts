import { Router } from "express";
import { HomeController } from "../controllers/homeController";

export class homeRouter {
  public router: Router;
  public homeController: HomeController = new HomeController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get("/", this.homeController.index);
  }
}
