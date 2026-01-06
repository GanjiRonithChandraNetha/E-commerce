import { Router } from "express"
import {
    viewProfile,
    updateEditableCredentials,
    updateProfilePic
} from "../controllers/profile.controllers.js"
import { upload } from "../utilites/multer.js";

const profileRouter = Router();
profileRouter.get("/view-profile",viewProfile);
profileRouter.put("/update-profile",updateEditableCredentials);
profileRouter.put("/update-profile-pic",upload.single("image"),updateProfilePic);

export default profileRouter;