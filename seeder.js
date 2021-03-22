const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: './config/config.env' });

// load models
const Bootcamp = require('./model/Bootcamp');
const Course = require('./model/Course');

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// read json file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

// Import into DB
const importData = async() => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);

    console.log(`Data imported...`.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

// delete data
const deleteData = async() => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();

    console.log(`Data destroyed...`.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

if(process.argv[2] === '-i') {
  // node seeder -i
  importData();
} else if(process.argv[2] === '-d') {
   // node seeder -d
  deleteData();
}