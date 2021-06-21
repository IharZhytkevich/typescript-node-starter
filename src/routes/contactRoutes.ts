import { Router } from "express";
import { ContactController } from "../controllers/contactController";

export class ContactRouter {
  public router: Router;
  public contactController: ContactController = new ContactController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get("/", this.contactController.getContact);
    this.router.post("/", this.contactController.postContact);
  }
}
