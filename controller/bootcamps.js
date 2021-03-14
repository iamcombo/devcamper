const Bootcamp = require('../model/Bootcamp');

// @desc  Get all bootcamps 
// @route GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = async(req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    data: bootcamps
  })
}

// @desc  Get single bootcamps 
// @route GET api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async(req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp) return res.status(400).json({success: false});
  res.status(200).json({
    data: bootcamp
  })
}

// @desc  create single bootcamp
// @route POST api/v1/bootcamps/
// @access  Public
exports.createBootcamp = async(req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  })
}

// @desc  update bootcamp
// @route PUT api/v1/bootcamps/
// @access  Public
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({success: true, msg: 'hello'});
}

// @desc  delete bootcamp
// @route DELETE api/v1/bootcamps/
// @access  Public
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({success: true, msg: 'hello'});
}