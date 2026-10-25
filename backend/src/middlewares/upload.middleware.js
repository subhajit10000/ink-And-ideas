import multer from 'multer';
import ApiError from '../utils/ApiError.js';
const upload = multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024},fileFilter:(req,file,cb)=>{if(!file.mimetype?.startsWith('image/'))return cb(new ApiError(400,'Only image files are allowed.'));cb(null,true)}});
export default upload;
