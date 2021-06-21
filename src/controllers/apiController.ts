import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/user";

export class ApiController {
  /**
   * List of API examples.
   * @route GET /api
   */
  public getApi(req: Request, res: Response): void {
    res.render("api/index", {
      title: "API Examples",
    });
  }

  /**
   * Facebook API example.
   * @route GET /api/facebook
   */
  public getFacebook(req: Request, res: Response, next: NextFunction): void {
    const user = req.user as UserDocument;
    const token = user.tokens.find((token) => token.kind === "facebook");
    graph.setAccessToken(token.accessToken);
    graph.get(
      `${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`,
      (err: Error, results: graph.FacebookUser) => {
        if (err) {
          return next(err);
        }
        res.render("api/facebook", {
          title: "Facebook API",
          profile: results,
        });
      }
    );
  }
}
