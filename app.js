const express = require("express")
const { connectDb, getDd } = require("./db")
const { ObjectId } = require("mongodb")

//initlize express app
const app = express()
app.use(express.json())
//db connection


let db
connectDb((error) => {
    if (!error) {
        app.listen(3000, () => {
            console.log("app listening to port 3000")
        })
        db = getDd()
    }
})
//routes
app.get("/book", (req, res) => {

    //add a query parameter if not passed make it 0
    const page=req.query.p || 0
    const bookPerPage=2

    let books = []
    db.collection('books')
        .find() //return a cursor and use toArray and forEach
        //fetch the document in batches it will have around 100 object/data
        .sort({ author: 1 })
        .skip(page*bookPerPage)
        .limit(bookPerPage)
        .forEach(element => {
            books.push(element)
        })
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({ error: 'coud not send document' })
        })
})

app.get("/book/:id", (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then(document => {
                res.status(200).json({ document })
            })
            .catch(err => {
                res.status(500).json({ error: "could not fetch Document" })
            })

    }
    else {
        res.status(500).json({ msg: "Invalid Id Type" })
    }
    // req.params.id
})

app.post("/addbook",(req,res)=>{
   const book= req.body
   db.collection('books')
   .insertOne(book)
   .then(result=>{
    res.status(201).json(result)
    console.log("Book Added Sucessfully");
   })
   .catch(err=>{
    console.log(err)
    res.status(500).json({msg:'Coud Not Create Document'})
   })
})

app.delete("/deleteBook/:id", (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid Id Type" });
    }

    db.collection('books')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
            res.status(200).json({ msg: "Book deleted successfully" });
        })
        .catch(err => {
            console.error("Error deleting book:", err);
            res.status(500).json({ error: "Could not delete document" });
        });
});

app.patch("/editBook/:id", (req, res) => {
    const update = req.body;
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: "Invalid Id Type" });
    }

    db.collection('books')
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
        .then(result => {
            res.status(200).json({ msg: "Book Updated successfully" });
        })
        .catch(err => {
            console.error("Error updating book:", err);
            res.status(500).json({ error: "Could not update document" });
        });
});
