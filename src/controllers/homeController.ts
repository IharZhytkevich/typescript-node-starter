import { Request, Response } from "express";

/**
 * Home page.
 * @route GET /
 */

export class HomeController {
  public index(req: Request, res: Response): void {
    res.render("home", { title: "Home" });
  }
}
