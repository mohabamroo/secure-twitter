import validate from "express-validation";

validate.options({
  allowUnknownBody: false
});

export default validate;
