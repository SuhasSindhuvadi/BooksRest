const { MongoClient } = require("mongodb")
let dbconn
// const password="rEPYJmfkF9eX2voD"
// const url="mongodb+srv://suhassj101:rEPYJmfkF9eX2voD@books.7rz4bnq.mongodb.net/?retryWrites=true&w=majority&appName=Books"
const url="mongodb://localhost:27017/BooksStore"
module.exports = {
    connectDb: (cb) => {
        MongoClient.connect(url)
            .then((client) => {
                dbconn=client.db()
                console.log("connection sucessfull")
                return cb()
            })
            .catch(error=>{
                console.log(error)
                return cb(error)
            })
    },
    getDd: () => {
     return dbconn
    }
}