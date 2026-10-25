import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
 title:{type:String,trim:true,maxlength:180,default:""},
 content:{type:String,trim:true,default:"",maxlength:30000},
 imageUrl:{type:String,default:""},
 imagePublicId:{type:String,default:""},
 caption:{type:String,trim:true,maxlength:500,default:""},
 author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
 likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
 comments:[{user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},text:{type:String,trim:true,required:true,maxlength:1000},createdAt:{type:Date,default:Date.now}}]
},{timestamps:true});
export default mongoose.model("Post",postSchema);
