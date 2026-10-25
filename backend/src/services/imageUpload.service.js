import {v2 as cloudinary} from 'cloudinary';
import ApiError from '../utils/ApiError.js';
const configured=()=>Boolean(process.env.CLOUDINARY_CLOUD_NAME&&process.env.CLOUDINARY_API_KEY&&process.env.CLOUDINARY_API_SECRET);
export function uploadImage(buffer,folder='ink-ideas'){
 if(!configured()) throw new ApiError(503,'Image uploads are not configured on the server (set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET).');
 cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
 return new Promise((resolve,reject)=>{const stream=cloudinary.uploader.upload_stream({folder,resource_type:'image'},(err,result)=>{if(err)return reject(err);resolve({url:result.secure_url,publicId:result.public_id})});stream.end(buffer)});
}

export async function deleteImage(publicId){
 if(!publicId||!configured()) return;
 try{cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});await cloudinary.uploader.destroy(publicId)}catch{/* orphaned asset is not worth failing the request */}
}
