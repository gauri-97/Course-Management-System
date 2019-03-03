# Course-Management-System

I have created a webapp which helps students and faculties to manage courses.

---SignUp---

-New users can add their details and select if they are students or faculties, accordingly the respective home pages open
-username for each user is required to be unique.

---Student features---
 
Student can view:
 
-List of Registered courses
-List of available courses
-The student can click on available courses and register to the new ones and de-register from the already registered courses


----Faculty features----
 
Faculties can view
-List of all available courses
-The faculty can click on available courses and see the course details and delete the course
-The faculty can also add new courses or delete existing courses

-----The courses-----
   
-Each course has a start date and if the course start date has passed and number of registered students <5, the course becomes inactive
once the course starts new users can't register the course
 
----Libraries to be installed---

Use the following commands to install the external libraries:

```npm install express```
 
```npm install joi```

```npm install pug```

The app runs on port 3000
