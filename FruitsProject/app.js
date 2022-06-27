const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB");

// Fruits schema for structuring fruits data
const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});

// People schema for structure frits data
// const people = new mongoose.Schema({
//     name: String,
//     age: Number
// })


const Fruit = mongoose.model("fruit", fruitSchema);
// const Person = mongoose.model("person", people);

const fruit = new Fruit({
    name: "Peaches",
    rating: 10,
    review: "yummy"
})

// fruit.save();


// Fruit.updateOne({_id: "622f56126c5fc156195a73b1"}, 
//     {name: "peach"}, (err) => {
//         if (err) {
//             console.log(err);
//         }else{
//             console.log("sucess");
//         }
// }) 

// Fruit.deleteOne(
//     {_id: "622f56126c5fc156195a73b1"}, (err) => {
//         if (err) {
//             console.log(err);
//         }else {
//             console.log("Deleted successfully");
//         }
// })

Fruit.deleteMany({name: "Apple"},
        (err) => {
            if (err) {
                console.log(err);
            }else {
                console.log("deleter all of the document with the name apple");
            }
})

Fruit.find((err, fruits) => {
    if (err) {
        console.log(err);
    }else {
        mongoose.connection.close();
        fruits.forEach((fruit) => {
            console.log(`${fruit.name} \t ${fruit.review}`);
        })
    }

})