import { Router } from "express";
import { UserController } from "../controllers/userController";
import * as passportConfig from "../config/passport";

export class userRouter {
  public router: Router;
  public userController: UserController = new UserController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get("/login", this.userController.getLogin);
    this.router.post("/login", this.userController.postLogin);
    this.router.get("/logout", this.userController.logout);
    this.router.get("/forgot", this.userController.getForgot);
    this.router.post("/forgot", this.userController.postForgot);
    this.router.get("/reset/:token", this.userController.getReset);
    this.router.post("/reset/:token", this.userController.postReset);
    this.router.get("/signup", this.userController.getSignup);
    this.router.post("/signup", this.userController.postSignup);
    this.router.get(
      "/account",
      passportConfig.isAuthenticated,
      this.userController.getAccount
    );
    this.router.post(
      "/account/profile",
      passportConfig.isAuthenticated,
      this.userController.postUpdateProfile
    );
    this.router.post(
      "/account/password",
      passportConfig.isAuthenticated,
      this.userController.postUpdatePassword
    );
    this.router.post(
      "/account/delete",
      passportConfig.isAuthenticated,
      this.userController.postDeleteAccount
    );
    this.router.get(
      "/account/unlink/:provider",
      passportConfig.isAuthenticated,
      this.userController.getOauthUnlink
    );
  }
}
