const express= require("express")
const joi=require("joi")
var app=express();
var port=3000;
var credz={}
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('views', './views');
app.set('view engine','pug');

app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/login',(req,res)=>{
    var username=req.body["username"];
    var password=req.body["password"];
});

app.get('*',(req,res)=>{
res.send("This is not a valid URL");
});
app.post('*',(req,res)=>{
    res.send("This is not a valid URL");
    });
app.listen(port)
console.log("Course Management System is up and running on Port :",port);