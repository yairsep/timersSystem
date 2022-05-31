const mongoose = require("mongoose")
const autoIncrement = require("mongoose-auto-increment");

mongoose
    .connect(
        'mongodb://mongo:27017/expressmongo',
        {useNewUrlParser: true}
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

autoIncrement.initialize(mongoose.connection)
