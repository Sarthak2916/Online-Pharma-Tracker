const express = require('express');
const cors = require('cors');
const app=express();
require("dotenv").config();
const PORT=process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`server started at port: ${PORT}`);
})

const registerRouter = require('./routes/user.registerRouter');
const loginRouter = require('./routes/user.loginRouter');
const inventoryRouter = require('./routes/inventoryRouter');
const billRouter = require('./routes/billRouter');
const messageRouter = require('./routes/messageRouter');

app.use('/register',registerRouter);
app.use('/login',loginRouter);
app.use('/inventory',inventoryRouter);
app.use('/billing',billRouter);
app.use('/customer',messageRouter);
const dbConnect = require('./config/database.config')
dbConnect();

app.get('/',(req,res)=>{
    res.send("Welcome.")
})