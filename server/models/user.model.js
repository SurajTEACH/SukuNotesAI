import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    
      email:{
          type: String,
          required: true,
          unique: true
      },
      credits:{
          type: Number,
          default: 1500,  // default credits kitna   bhi kar sakte hai 
          min: 0
      },
      isCreditAvailable: {
           type: Boolean,
           default: true
      },
      notes: {
           type:[mongoose.Schema.Types.ObjectId],
           ref:"Notes",
           default: []
      }
   }, {timestamps: true}
)

const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;