import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {uploadImage,deleteImage} from "../services/imageUpload.service.js";
const AUTHOR_FIELDS="username firstName lastName profilePhoto";
const populateAll=(q)=>q.populate("author",AUTHOR_FIELDS).populate("comments.user",AUTHOR_FIELDS);
const pubUser=(u)=>u?{_id:u._id,username:u.username,firstName:u.firstName,lastName:u.lastName,profilePhoto:u.profilePhoto}:null;
const shape = (p, uid) => { const o=p.toObject(); const {likes=[],comments=[],...rest}=o; return {...rest, author:pubUser(p.author), likeCount:likes.length, liked:!!uid&&likes.some(l=>String(l)===String(uid)), comments:comments.map(c=>({_id:c._id,text:c.text,createdAt:c.createdAt,user:pubUser(c.user&&c.user.firstName?c.user:null)}))}; };
export const listPosts = asyncHandler(async(req,res)=>{
 const filter={};
 if(typeof req.query.username==="string"&&req.query.username){const u=await User.findOne({username:req.query.username.toLowerCase()}); if(!u)return res.json({success:true,data:[]}); filter.author=u._id;}
 const posts=(await populateAll(Post.find(filter)).sort({createdAt:-1}).limit(200)).filter(p=>p.author);
 res.set('Cache-Control','no-store');
 res.json({success:true,data:posts.map(p=>shape(p,req.user?._id))});
});
export const createPost = asyncHandler(async(req,res)=>{
 const {title="",content="",caption=""}=req.body||{}; let imageUrl=req.body.imageUrl||"", imagePublicId="";
 if(req.file){const uploaded=await uploadImage(req.file.buffer,'ink-ideas/posts');imageUrl=uploaded.url;imagePublicId=uploaded.publicId;}
 if(!String(content).trim()&&!String(imageUrl).trim()) throw new ApiError(400,"Write some content or upload an image.");
 const post=await Post.create({title,content,imageUrl,imagePublicId,caption,author:req.user._id});
 await post.populate("author",AUTHOR_FIELDS);
 res.status(201).json({success:true,message:"Post published",data:shape(post,req.user._id)});
});
export const updatePost = asyncHandler(async(req,res)=>{
 const post=await Post.findById(req.params.id);
 if(!post) throw new ApiError(404,"Post not found");
 if(String(post.author)!==String(req.user._id)) throw new ApiError(403,"You can edit only your own posts.");
 for(const key of ["title","content","caption"]) if(req.body[key]!==undefined) post[key]=req.body[key];
 if(req.file){const uploaded=await uploadImage(req.file.buffer,'ink-ideas/posts');await deleteImage(post.imagePublicId);post.imageUrl=uploaded.url;post.imagePublicId=uploaded.publicId;}
 if(!String(post.content).trim()&&!String(post.imageUrl).trim()) throw new ApiError(400,"A post needs some content or an image.");
 await post.save(); await post.populate("author",AUTHOR_FIELDS); await post.populate("comments.user",AUTHOR_FIELDS);
 res.json({success:true,message:"Post updated",data:shape(post,req.user._id)});
});
export const deletePost = asyncHandler(async(req,res)=>{
 const post=await Post.findById(req.params.id);
 if(!post) throw new ApiError(404,"Post not found");
 if(String(post.author)!==String(req.user._id)&&req.user.role!=="admin") throw new ApiError(403,"You can delete only your own posts.");
 await deleteImage(post.imagePublicId); await post.deleteOne(); res.json({success:true,message:"Post deleted"});
});
export const adminActivity = asyncHandler(async(req,res)=>{
 const [users,posts]=await Promise.all([
 User.find({}).select("-password -otp -otpExpiry -otpPurpose").sort({createdAt:-1}).limit(500),
 populateAll(Post.find({})).sort({createdAt:-1}).limit(500)
 ]);
 res.json({success:true,data:{users,posts:posts.map(p=>shape(p,req.user._id)),stats:{users:users.length,posts:posts.length}}});
});

const loadPost=async(id)=>{ if(!mongoose.isValidObjectId(id)) throw new ApiError(404,"Post not found"); const post=await Post.findById(id); if(!post) throw new ApiError(404,"Post not found"); return post; };
const respond=async(post,req,message)=>{ await post.populate("author",AUTHOR_FIELDS); await post.populate("comments.user",AUTHOR_FIELDS); return {success:true,message,data:shape(post,req.user._id)}; };
export const toggleLike = asyncHandler(async(req,res)=>{
 const post=await loadPost(req.params.id); const uid=String(req.user._id);
 const i=post.likes.findIndex(l=>String(l)===uid);
 if(i>=0) post.likes.splice(i,1); else post.likes.push(req.user._id);
 await post.save(); res.json(await respond(post,req,i>=0?"Like removed":"Post liked"));
});
export const addComment = asyncHandler(async(req,res)=>{
 const text=String(req.body?.text||"").trim();
 if(!text) throw new ApiError(400,"Comment cannot be empty.");
 if(text.length>1000) throw new ApiError(400,"Comment is too long (max 1000 characters).");
 const post=await loadPost(req.params.id);
 post.comments.push({user:req.user._id,text}); await post.save();
 res.status(201).json(await respond(post,req,"Comment added"));
});
export const deleteComment = asyncHandler(async(req,res)=>{
 const post=await loadPost(req.params.id); const c=post.comments.id(req.params.commentId);
 if(!c) throw new ApiError(404,"Comment not found");
 const allowed=String(c.user)===String(req.user._id)||String(post.author)===String(req.user._id)||req.user.role==="admin";
 if(!allowed) throw new ApiError(403,"You cannot delete this comment.");
 c.deleteOne(); await post.save(); res.json(await respond(post,req,"Comment deleted"));
});
