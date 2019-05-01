import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import mongoosePaginate from "mongoose-paginate";

var tweetReactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["retweet", "like"]
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tweetId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }]
});

tweetReactionSchema.plugin(mongoosePaginate);
tweetReactionSchema.plugin(beautifyUnique);

export default mongoose.model("TweetReaction", tweetReactionSchema);
