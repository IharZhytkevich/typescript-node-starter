import { Router } from "express";
import { ApiController } from "../controllers/apiController";
import * as passportConfig from "../config/passport";

export class ApiRouter {
  public router: Router;
  public apiController: ApiController = new ApiController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    // For TEST only ! In production, you should use an Identity Provider !!
    this.router.get("/", this.apiController.getApi);
    this.router.get(
      "/facebook",
      passportConfig.isAuthenticated,
      passportConfig.isAuthorized,
      this.apiController.getFacebook
    );
  }
}
