const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://newHW4:newHW4@cluster0.amuqt.mongodb.net/?retryWrites=true&w=majority"
);

require("dotenv").config()

const express = require("express");
const app = express();

const AccountSchema = require("./AccountSchema");
const ActionSchema = require("./ActionSchema");

//const PORT = 5555;

app.use(express.json());

async function findAccounts(typeSchema, req, res, id) {
  const accountsList=await typeSchema.find(id)
  let htmlTag=""
  accountsList.forEach(element => {
      let list=``
      Object.entries(element).forEach(entry=>{
        list+=`<li>${entry}</li>`
      })
  });
  console.log(accountsList);
    res.send(accountsList);
}

app.get("/api/accounts",async (req, res) => {
    await findAccounts(AccountSchema, req, res, {})
});

async function saveAccount(req, res, next) {
  const newAccount = new AccountSchema(req.body);
  console.log(newAccount);
  await newAccount.save();
  next();
}

app.post("/api/accounts", saveAccount, (req, res) => {
  const newAccount = req.body;
  res.send(`id ${newAccount.id} added succsesfully`);
});

app.get("/api/accounts/:id",async (req, res) => {
  const newAccount = new AccountSchema(req.body);
  await findAccounts(AccountSchema, req, res, {id:req.params.id});
});

app.get("/api/actions",async (req, res) => {
  await findAccounts(ActionSchema, req, res, {});
});
/*
async function updateAccount(req, res, next, id, key, newValue) {
     await AccountSchema.findOneAndUpdate(
    { id },
    { [key]: newValue }
  );
  next();
}
function postFunc(rout) {
  app.post(
    "/api/accounts/:id/" + rout,
    (req, res, next) => {
      const key = "";
      rout === "credit" ? (key = credit) : (key = isActive);
      updateAccount(req, res, next, body.id, key, req.body.credit);
    },
    (req, res) => {
      res.send(`id ${req.params.id} updated succsesfully`);
    }
  );
}

postFunc("credit");
postFunc("active");*/

app.post(
    "/api/accounts/:id",
    async    (req, res, next) => {
        let body=req.body
      body.active?body["active"]=body["isActive"]:
      await AccountSchema.findOneAndUpdate(
        { id:req.params.id },body);
      next();
    },
    (req, res) => {
      res.send(`id ${req.params.id} updated succsesfully`);
    }
  );

async function depositFunc(req, res, next) {
  new ActionSchema({ ...req.body, actionType: "deposit" });
  await AccountSchema.findOneAndUpdate(
    { id: req.body.account },
    { cash: parseInt(req.body.amount) }
  );
  next();
}
app.post("/api/actions/:id/deposit", depositFunc, (req, res) => {
  res.send(`id ${req.params.id} deposited succsesfully`);
});

async function withdrawFunc(req, res, next) {
  new ActionSchema({ ...req.body, actionType: "withdraw" });
  await AccountSchema.findOneAndUpdate(
    { id: req.body.account },
    { cash: parseInt(req.body.amount) }
  );
  next();
}
app.post("/api/actions/:id/withdraw", withdrawFunc, (req, res) => {
  res.send(`id ${req.params.id} withdrawed succsesfully`);
});

console.log(mongoose.connection.readyState);

app.listen(process.env.PORT);

