const mongoose = require('mongoose');

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

exports.connectDB = mongoose.connect(`${DB_HOST}/${DB_NAME}`, connectionParams)
    .then( () => {
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })
