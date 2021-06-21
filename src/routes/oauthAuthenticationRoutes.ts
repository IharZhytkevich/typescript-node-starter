import { Router } from "express";
import passport from "passport";
import { OAuthAuthenticationController } from "../controllers/oauthAuthenticationController";

export class OAuthAuthenticationRouter {
  public router: Router;
  public apiController: OAuthAuthenticationController = new OAuthAuthenticationController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get(
      "/facebook",
      passport.authenticate("facebook", { scope: ["email", "public_profile"] })
    );
    this.router.get(
      "/facebook/callback",
      passport.authenticate("facebook", { failureRedirect: "/login" }),
      (req, res) => {
        res.redirect(req.session.returnTo || "/");
      }
    );
  }
}
