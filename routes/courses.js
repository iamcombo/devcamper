const express = require('express');
const {
  getCourses,
} = require('../controller/courses');

const router = express.Router();

router
  .route('/')
  .get(getCourses)
  // .post(createBootcamp)

// router
//   .route('/:id')
//   .get(getBootcamp)
//   .put(updateBootcamp)
//   .delete(deleteBootcamp)

// router
//   .route('/radius/:zipcode/:distance')
//   .get(getBootcampsInRadius)

module.exports = router;