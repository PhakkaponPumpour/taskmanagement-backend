// import Mongoose in NodeJS (npm install mongoose)
const mongoose = require("mongoose");
const conn = async () => {
  try {
    // connect mongodb by use MONGO_URL in .env 
    const response = await mongoose.connect(`${process.env.MONGO_URL}`);
    if (response) {
      console.log("Connected to Mongo MotherFucker DB");
    }
  } catch (error) {
    console.log(error);
  }
};

conn();
