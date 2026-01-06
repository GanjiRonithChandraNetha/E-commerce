import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'../profilePics');
    },
    filename(req,file,cb){
        const profile_id = req.user.profile_id;
        console.log(file);
        console.log(path.extname(file.originalname));
        cb(null,profile_id+(path.extname(file.originalname)));
    }
})

export const upload = multer({
    storage:storage,
    fileFilter(req,file,cb){
        if(file.mimetype.startsWith("image/"))
            cb(null,true);
        else cb(null,false);
    },
    limits:300*1024
})
