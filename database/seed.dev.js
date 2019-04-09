import seeder from "mongoose-seed";
import authDocuments from "./seeds_data/development/auth";
import doctorDocuments from "./seeds_data/development/doctors";
import userDocuments from "./seeds_data/development/users";

// Password: test1234
seeder.connect("mongodb://localhost/Medico", () => {
  seeder.loadModels([
    "src/models/doctor.js",
    "src/models/user.js",
    "src/models/auth.js",
    "src/models/chatRequest.js"
  ]);

  seeder.clearModels(["Auth", "Doctor", "User", "ChatRequest"], () => {
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});

const data = [
  { model: "Doctor", documents: doctorDocuments },
  { model: "User", documents: userDocuments },
  { model: "Auth", documents: authDocuments }
];
