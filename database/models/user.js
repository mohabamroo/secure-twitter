import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import bcrypt from "bcryptjs";

var authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  refreshToken: { type: String, required: true },
  name: {
    type: String,
    required: true
  },
  country: String,
  address: String,
  phoneNumber: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false,
    enum: ["male", "female"]
  },
  birthDate: {
    required: false,
    type: Date
  },
  private: {
    type: Boolean,
    default: false
  }
});

authSchema.pre("save", function(next) {
  const auth = this;
  if (auth) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      auth.password = hash;
      next();
    });
  } else {
    next();
  }
});

authSchema.plugin(beautifyUnique);

export default mongoose.model("User", authSchema);
