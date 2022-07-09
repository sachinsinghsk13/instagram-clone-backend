import { Request, Response } from "express";

class UserProfileController {
    public protectedTest(req: Request, res: Response) {
        res.json({test: "testing controller"});
    }
}

const profileController: UserProfileController = new UserProfileController();
export default profileController;
