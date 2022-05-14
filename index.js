const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://HW4mongo:HW4mongo@cluster0.w5jwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

const express = require("express");
const app = express();

const AccountSchema = require("./AccountSchema");
const ActionSchema = require("./ActionSchema");

const PORT= 5555;

app.use(express.json());


async function findAccounts(typeSchema,req, res, id){
    await res.send(typeSchema.find(id));

}

app.get("/api/accounts",(req, res)=>{findAccounts(AccountSchema,req, res,"")});

async function saveAccount(req, res, next){
    const newAccount=new AccountSchema(req.body)
    console.log(newAccount);
    await newAccount.save()
    next();}

app.post(
  "/api/accounts",
  saveAccount,
  (req, res) => {
    const newAccount = req.body;
    res.send(`id ${newAccount.id} added succsesfully`);
  }
);

app.get("/api/accounts/:id",(req, res)=>{findAccounts(req, res,req.params.id)});

app.get("/api/actions",(req, res)=>{findAccounts(ActionSchema,req, res,req.params.id)});

async function updateAccount (req, res,next, id, key, newValue){
    const currentAccount=await AccountSchema.findOneAndUpdate({id:id}, {key:newValue})
    next()

}
function postFunc(rout){
    app.post(
        "/api/accounts/:id/"+rout,
        (req, res, next)=>{
            const key=""
            rout==="credit"?key=credit:key=isActive
            updateAccount(req, res, next, req.params.id,key,req.body.credit)
        },
        (req, res) => {
          res.send(`id ${req.params.id} updated succsesfully`);
        }
      );
}

postFunc("credit")
postFunc("Active")

async function depositFunc(req, res, next){
    new ActionSchema()
    next()
}
app.post(
    "/api/actions/:id/deposit",
    saveAccount,
    (req, res) => {
      res.send(`id ${req.params.id} deposited succsesfully`);
    }
  );
console.log(mongoose.connection.readyState);

app.listen(PORT)
