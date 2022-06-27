const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date");
const app = express();
const PORT = 4100;



// Using ejs as the view engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static("public"))

// Creating a connection to the database
mongoose.connect("mongodb://localhost:27017/todolistDB");

// Schema for holding the todo item
const itemsSchema = {
    name: String
}


// Creating a model based on the itemsSchema
const Item = mongoose.model("Item", itemsSchema);

// Creating new item
const item1 = new Item({
    name: "Welcom to your todolist!"
})
const item2 = new Item({
    name: "Hit the + button to add a new item."
})
const item3 = new Item({
    name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {

    
    
    // Reading data form the todolist database
    Item.find({}, (err, foundItems) => {

        if (foundItems.length === 0) {
            // Add the defults item to the database 
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                }else {
                    console.log("Items inserted sucessfully.");
                }
            });
            res.redirect("/");
        }else {
            res.render("list", {
                listTitle: "Today",
                newListItems: foundItems
            });
        }
 
    });

    
})

app.get("/:customListName", (req, res) => {
    const customeListName = _.capitalize(req.params.customListName);

    List.findOne({name: customeListName}, (err, result) => {
        if (!err) {
            if (!result) {
                const list = new List({
                    name: customeListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customeListName);
            }else {
                res.render("list", {
                    listTitle: result.name,
                    newListItems: result.items
                })
            }
        }
    
    })
})

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    })

    if (listName === "Today") {
        item.save();
        res.redirect("/")
    }else {
        List.findOne({name: listName}, (err, list) => {
            if (err) {
                console.log("Undable to save to the list");
            }
            list.items.push(item);
            list.save();
            res.redirect("/"+listName);
        })
    }


    
})

app.post("/delete", (req, res) => {
    const checkedItemID =  req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemID, (err) => {
            if (err) {
                console.log(err);
            }else {
                console.log("Item deleted successfully.");
                res.redirect("/");
            }
        })
    }else {
        List.findOneAndUpdate({name: listName},
                             {$pull: {items: {_id: checkedItemID}}},
                            (err, list) => {
                                if (!err) {
                                    res.redirect("/"+listName);
                                }
                            }
        )
    }
    
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})