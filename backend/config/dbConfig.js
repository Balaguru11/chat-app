const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;

exports.connect = async () => {
  await mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`DB connected`);
    })
    .catch((err) => console.log(err));
};
