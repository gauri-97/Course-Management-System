const express= require("express")
const joi=require("joi")
var app=express();
var port=3000;
var userDetails={
    'ggauri97':{
        'name':'Gauri Singh',
        'type':'Student',
        'password':'1234',
        'registered':['CSE1001','ENG1001']
    }
    
}
var courses={
    'CSE1001':{
        'title':"Programming",
        'numStud':6,
        'startDate':"2019-03-04",
        'status':'active'
    },
    'ECM1002':{
        'title':"Machine learning",
        'numStud':4,
        'startDate':"2019-02-05",
        'status':'inactive'
    },
    'ECE1001':{
        'title':"Hardware",
        'numStud':6,
        'startDate':"2019-03-06",
        'status':'active'
    },
    'ENG1001':{
        'title':"English",
        'numStud':10,
        'startDate':"2019-03-06",
        'status':'active'
    },
    'PHY1001':{
        'title':"Physics",
        'numStud':6,
        'startDate':"2019-03-06",
        'status':'active'
    }

}

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('views', './views');
app.set('view engine','pug');

//For the home page
app.get('/',(req,res)=>{
    res.render('home');
})
//For the signup page , we will render the signup.pug file 
app.get('/signup',(req,res)=>{
res.render('signup');
});
app.post('/signup',(req,res)=>{
    const schema = {
        name: joi.string().min(4).required(),
        type: joi.string().required(),
        username: joi.string().min(4).required(),
        password: joi.string().required()
    }
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(404).send(result.error.details[0].message);
    } else {
        
        if (result.value.username in userDetails) {
            res.render('signup',{message:"User name is already taken please try again"});
        }
        else{
            var dict={}
            dict.name=result.value.name;
            dict.type=result.value.type;
            dict.password=result.value.password;
            dict.registered=[];
            userDetails[result.value.username]=dict;
            if(dict.type==="Student")
            {
                var username=result.value.username;
                var userdetails=userDetails[result.value.username]
                res.render('studenthome',{courses,username,userdetails})
            }
            else{
                res.render('facultyhome')
            }
        }        
    }
});
//for the login page 
app.get('/login',(req,res)=>{
    res.render('login');
})
//to get the username and password and validate the user
app.post('/login',(req,res)=>{
    const schema = {
        username: joi.string().min(4).required(),
        password: joi.string().required()
    }
    
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(404).send(result.error.details[0].message);
    } else {
        //console.log((userDetails[result.value.username].password));
        if (result.value.username in userDetails) {
            if(userDetails[result.value.username].password===result.value.password)
            {
                if(userDetails[result.value.username].type==="Student")
                {
                    var username=result.value.username;
                    var userdetails=userDetails[result.value.username]
                    res.render('studenthome',{courses,username,userdetails})
                }
                else{
                res.render('facultyhome')
                }
            }//if
            else{
                res.send("Incorrect Password");
            }//else
        }
        res.status(404).send('Username Not found');
    }
});

// to show all the available course
app.get('/course/:id/:username',(req,res)=>{
    var id=req.params.id;
    var username=req.params.username;
    var details=courses[id];
    var regCourses=userDetails[username].registered;
    var flag="no"
    regCourses.forEach(element => {
        if(element===id)
            flag="yes"
    });
    res.render('course',{id,details,flag})
})
// to register a student in a course
app.post('/register',(req,res)=>{
    const schema = {
        username: joi.string().min(4).required(),
        register: joi.string().required(),
        course:  joi.string().required()
    }
    
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(404).send(result.error.details[0].message);
    } else {
            var username=result.value.username;
        if (username in userDetails) {
            userDetails[username].registered.push(result.value.course);
            courses[result.value.course].numStud++;
            res.send("The course was successfully added");          
        }
        res.status(404).send('Username Not found');
    }
})



app.get('/getall',(req,res)=>{
res.send(userDetails);
});






app.get('*',(req,res)=>{
res.send("This is not a valid URL");
});
app.post('*',(req,res)=>{
    res.send("This is not a valid URL");
    });
app.listen(port)
console.log("Course Management System is up and running on Port :",port);