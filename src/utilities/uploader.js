import multer from "multer";
import uuid from "uuid";
import mime from "mime";
import mkdirp from "mkdirp";

const generateFileId = mimetype =>
  `${uuid.v4()}.${mime.getExtension(mimetype)}`;

const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { referenceId } = req.currentUser;
      // TODO: conditional on PROD vs. DEV
      const directoryPath = `./${process.env.MEDIA_DIR}/${referenceId}/${
        file.fieldname
      }`;
      mkdirp(directoryPath, function(err) {
        if (err) {
          console.log("Media upload error: ", err);
          return cb(null, false);
        } else {
          return cb(null, directoryPath);
        }
      });
    },
    filename: (req, file, cb) => cb(null, generateFileId(file.mimetype))
  })
});

export const doctorMedia = uploader.fields([
  { name: "certificates", maxCount: 4 },
  { name: "licenses", maxCount: 4 },
  { name: "awards", maxCount: 4 },
  { name: "identity", maxCount: 4 },
  { name: "degrees", maxCount: 4 },
  { name: "gallery", maxCount: 4 }
]);
