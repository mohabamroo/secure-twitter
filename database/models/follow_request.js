import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";

var followSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  followedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  approved: {
    type: Boolean,
    default: false
  }
});

followSchema.plugin(beautifyUnique);

export default mongoose.model("FollowRequest", followSchema);
