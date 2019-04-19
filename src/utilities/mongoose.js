import mongoose from "mongoose";

const mongooseConnect = cb => {
  const mongo_uri =
    "mongodb://team37:test1234@ds127190.mlab.com:27190/secure-twitter";
  mongoose.connect(mongo_uri, { useNewUrlParser: true });

  mongoose.connection.on("connected", () => {
    console.log(("Mongoose default connection is open to ", mongo_uri));
    if (cb) cb();
  });

  mongoose.connection.on("error", err => {
    console.log(`Mongoose default connection has occured ${err} error`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose default connection is disconnected");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log(
        "Mongoose default connection is disconnected due to application termination"
      );
      process.exit(0);
    });
  });
};

export default mongooseConnect;
