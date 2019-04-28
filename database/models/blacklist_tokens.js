import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";

var tokenSchema = new mongoose.Schema({
  token: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

tokenSchema.plugin(beautifyUnique);

export default mongoose.model("BlacklistToken", tokenSchema);
