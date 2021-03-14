// @desc  logs request to console
const logger = (req, res, next) => {
  console.log();
  next();
}