const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
   sender: {
       type: String
   },
   text: {
       type: String
   }
},
{
    timestamps: true
})

module.exports = (db) => {
    if (db?.models?.message) {
        return db.models.message;
    } else {
        return mongoose.model("messages", MessageSchema);
    }
}