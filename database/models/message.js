import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import mongoosePaginate from "mongoose-paginate";

var messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  request: { type: Boolean, default: true }
});

messageSchema.plugin(mongoosePaginate);
messageSchema.plugin(beautifyUnique);

export default mongoose.model("Message", messageSchema);
