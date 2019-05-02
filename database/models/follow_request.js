import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import mongoosePaginate from "mongoose-paginate";

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
followSchema.plugin(mongoosePaginate);

export default mongoose.model("FollowRequest", followSchema);
