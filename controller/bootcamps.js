const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const { geocode } = require('../utils/geocoder');
const Bootcamp = require('../model/Bootcamp');

// @desc  Get all bootcamps 
// @route GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
  let query;

  // copy req.query
  const reqQuery = {...req.query};
  console.log(reqQuery);

  // field to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // loop over removeFields and delete them from reqQuery
  removeFields.forEach(params => delete reqQuery[params]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt | gte | lt | lte | in)\b/g, match => `$${match}`);
  console.log(queryStr);

  // finding resource 
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  // select fields
  if(req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // sort 
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // executing query
  const bootcamps = await query;

  // pagination result
  const pagination = {};
  
  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if(startIndex > 0) {
    pagination.prev = {
      page: page -1,
      limit
    }
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
})

// @desc  Get single bootcamps 
// @route GET api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async(req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  
  res.status(200).json({
    data: bootcamp
  })
})

// @desc  create single bootcamp
// @route POST api/v1/bootcamps/
// @access  Public
exports.createBootcamp = asyncHandler(async(req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  })
})

// @desc  update bootcamp
// @route PUT api/v1/bootcamps/
// @access  Public
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if(!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

  res.status(200).json({data: bootcamp});
})

// @desc  delete bootcamp
// @route DELETE api/v1/bootcamps/
// @access  Public
exports.deleteBootcamp = asyncHandler(async(req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

  bootcamp.remove();

  res.status(200).json({success: true, data: {}});
})

// @desc  get bootcamps within a radius
// @route GET api/v1/bootcamps/radius/:zipcode/:distance
// @access  private
exports.getBootcampsInRadius = asyncHandler(async(req, res, next) => {
  const { zipcode, distance } = req.params;

  // get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // Divide distance by radius of the earth
  // Earth radius = 3,963mi / 6,378 km
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})