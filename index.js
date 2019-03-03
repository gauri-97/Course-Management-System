const express= require("express")
const joi=require("joi")
var app=express();
var port=3000;
var userDetails={
    'gauri':{
        'name':'Gauri Singh',
        'type':'Student',
        'password':'1234',
        'registered':['CSE1001','ENG1001']
    },
    'teacher':{
        'name':'teacher',
        'type':'Faculty',
        'password':'1234',
    }
    
}
var courses={
    'CSE1001':{
        'title':"Programming",
        'numStud':6,
        'startDate':"2019-04-03",
        'status':'active'
    },
    'ECM1002':{
        'title':"Machine learning",
        'numStud':4,
        'startDate':"2019-03-05",
        'status':'active'
    },
    'ECE1001':{
        'title':"Hardware",
        'numStud':6,
        'startDate':"2019-03-03",
        'status':'active'
    },
    'ENG1001':{
        'title':"English",
        'numStud':10,
        'startDate':"2019-03-02",
        'status':'active'
    },
    'PHY1001':{
        'title':"Physics",
        'numStud':3,
        'startDate':"2019-02-08",
        'status':'active'
    }

}
// to get the date
var today = new Date(); 
var dd = today.getDate(); 
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
var today=dd+"-"+mm+'-'+yyyy;
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
            if(dict.type==="Student")
            dict.registered=[];
            userDetails[result.value.username]=dict;
            if(dict.type==="Student")
            {
                var username=result.value.username;
                var userdetails=userDetails[username]
                res.render('studenthome',{courses,username,userdetails})
            }
            else{
                var username=result.value.username;
                res.render('facultyhome',{courses,username})
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
                    var userdetails=userDetails[username]
                    res.render('studenthome',{courses,username,userdetails})
                }
                else{
                var username=result.value.username;
                res.render('facultyhome',{courses,username});
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
    if(details.numStud<5)
    {
        details.status="inactive"
    }
    res.render('course',{id,details,flag})
})
// to register a student in a course
app.post('/register',(req,res)=>{
    const schema = {
        username: joi.string().min(4).required(),
        register: joi.string().required(),
        courseid:  joi.string().required()
    }
    
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(404).send(result.error.details[0].message);
    } else {
        if(result.value.register==="Yes"){
                var username=result.value.username;
            if (username in userDetails) {
                userDetails[username].registered.push(result.value.courseid);
                courses[result.value.courseid].numStud++;
                var userdetails=userDetails[username]
                res.render('studenthome',{courses,username,userdetails,message:"The course was successfully registered"})          
            }
            res.status(404).send('Username Not found');
        }
        else
        {
            res.send("The course was not registered")
        }
    }
})
app.post('/deletecourse',(req,res)=>{
    const schema = {
        username: joi.string().min(4).required(),
        delete: joi.string().required(),
        courseid:  joi.string().required()
    }
    
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(404).send(result.error.details[0].message);
    } else {
        if(result.value.delete ==="Yes"){
                var username=result.value.username;
            if (username in userDetails) {

                var userdetails=userDetails[username]
                if(userdetails.type==='Student'){
                    index=userdetails.registered.indexOf(result.value.courseid)
                    if(index!=-1){
                        userdetails.registered.splice(index,1)
                    }
                }
                res.render('studenthome',{courses,username,userdetails,message:"The course was successfully de-registered"})          
            }
            res.status(404).send('Username Not found');
        }
        else
        {
            res.send("The course was not deleted")
        }
    }
})

app.get('/coursedetails/:id',(req,res)=>{
    var id=req.params.id;
    var details=courses[id];
    var start=details.startDate;
    
    if(new Date(today) > new Date(start))
    {
        if(details.numStud<5)
        details.status="Inactive due to less students"
        else
        details.status="Registration Closed"
    }
    res.render('coursedetails',{id,details})
})
app.get('/add',(req,res)=>{
res.render('add');
});

app.post('/add',(req,res)=>{
    const schema = {
        username: joi.string().min(4).required(),
        id: joi.string().min(3).required(),
        title: joi.string().min(2).required(),
        startDate: joi.required(),
        status: joi.string().required(),
    }
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(404).send(result.error.details[0].message);
    } else {
        var username=result.value.username;
        if(username in userDetails){
            if (result.value.id in courses) {
                res.render('add',{message:"Course Id already exist"});
            }
            else{
                var dict={}
                dict.title=result.value.title;
                dict.startDate=result.value.startDate;
                dict.status=result.value.status;
                dict.numStud=0;
                courses[result.value.id]=dict;
                res.render('facultyhome',{courses,username,message:"Successfully added the course"})
            }        
        }
        res.status(404).send('Username Not found');
    }
})
app.get('/delete',(req,res)=>{
    res.render('delete');
    });
app.post('/delete',(req,res)=>{
    const schema = {
        username: joi.string().min(4).required(),
        delete: joi.string().min(2),
        id:joi.string().required()
    }
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(404).send(result.error.details[0].message);
    } else {
        var username=result.value.username;
        if(username in userDetails){
            if(result.value.id in courses){
                if(result.value.delete==="Yes" ){
                    var id=result.value.id;
                    var temp={}
                    for(var course in courses){
                        if(course!==id){
                            temp[course]=JSON.parse(JSON.stringify(courses[course]))
                        }
                    }
                    courses=JSON.parse(JSON.stringify(temp));
                    temp=JSON.parse(JSON.stringify(userDetails))
                    for(var stud in temp){
                        if(temp[stud]['type']==='Student'){
                            var index = temp[stud]['registered'].indexOf('CSE1001')
                            if(index !== -1) {
                            temp[stud]['registered'].splice(index, 1)
                            }
                        }
                    }
                    res.render('facultyhome',{courses,username,message:"Successfully deleted the course"})
                }
                else{
                    res.render('facultyhome',{courses,username,message:"The course was not deleted"})
                }
            }
            else{
                res.render('delete',{message:"Course Id does not exist"});
            }
        }
        res.status(404).send('Username Not found');
   
    }
});

app.get('*',(req,res)=>{
res.send("This is not a valid URL");
});
app.post('*',(req,res)=>{
    res.send("This is not a valid URL");
    });
app.listen(port)
console.log("Course Management System is up and running on Port :",port);
