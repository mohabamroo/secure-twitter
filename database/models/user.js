import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import bcrypt from "bcryptjs";

var UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
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

UserSchema.pre("save", function(next) {
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

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

UserSchema.plugin(beautifyUnique);

export default mongoose.model("User", UserSchema);
