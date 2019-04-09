import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import mongoosePaginate from "mongoose-paginate";

var tweetSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

tweetSchema.plugin(mongoosePaginate);
tweetSchema.plugin(beautifyUnique);

export default mongoose.model("Tweet", tweetSchema);
