const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const route = express.Router()

const multer = require("multer");
const Storage = multer.diskStorage({
    //destination for file
    destination: function (request, file, callback) {
      if(file){
        callback(null, './Assets/uploads/');
      }
    },

    // destination:"./asserts/uploads/",

    //add back to extension
    filename: function (request, file, callback) {
      if(file){  
        callback(null, Date.now() + file.originalname);
      }
      else
      {
        callback(null, "NA");
      }
    },
});

const upload = multer({ 
    storage : Storage,
});


route.use(cookieParser());

const controller = require('../Controller/controller');
const { model } = require("mongoose");

route.get('/',controller.homepage);

route.get('/adminlogin', controller.g_adminlogin);
route.get('/facultylogin', controller.g_facultylogin);
route.get('/studentlogin', controller.g_studentlogin);

route.post('/adminlogin', controller.p_adminlogin);
route.post('/facultylogin', controller.p_facultylogin);
route.post('/studentlogin', controller.p_studentlogin);

route.get('/adminhome', controller.g_adminhome);
route.get('/facultyhome', controller.g_facultyhome);
route.get('/studenthome', controller.g_studenthome);

// Admin Functionality

route.get('/admin-student-registration', controller.g_studentregistration);
route.post('/admin-student-registration', controller.p_studentregistration);

route.get('/viewcourse', controller.g_viewcourse);
route.post('/viewcourse', controller.p_viewcourse);

route.post('/editcourse', controller.p_updatecourse);
route.get('/addcourse', controller.g_addcourse);
route.post('/addcourse', controller.p_addcourse);

route.get('/viewdegree' , controller.g_viewdegree);
route.post('/viewdegree', controller.p_viewdegree);

route.post('/editdegree', controller.p_updatedegree);
route.get('/adddegree', controller.g_adddegree);
route.post('/adddegree', controller.p_adddegree);

route.get('/viewbranch' , controller.g_viewbranch);
route.post('/viewbranch', controller.p_viewbranch);

route.post('/editbranch', controller.p_updatebranch);
route.get('/addbranch', controller.g_addbranch);
route.post('/addbranch', controller.p_addbranch);

route.get('/viewprogram',controller.g_viewprogram);
route.post('/viewprogram',controller.p_viewprogram);

route.get('/addprogram', controller.g_addprogram);
route.post('/addprogram', controller.p_addprogram);

// route.get('/viewsemester', controller.g_viewsemester);
// route.post('/viewsemester', controller.p_viewsemester);

route.get('/addsemester', controller.g_addsemester);
route.post('/addsemester', controller.p_addsemester);

route.get('/admin-announcement', controller.g_admin_announcement);
route.post('/admin-announcement', controller.p_addmin_announcement);

route.get('/changepwdadmin', controller.g_changepwdadmin);
route.post('/changepwdadmin', controller.p_changepwdadmin);

route.delete('/logoutadmin', controller.logoutadmin);



// Faculty Functionality

route.get('/viewfaculty', controller.g_viewfaculty);

// route.get('/updatefaculty', controller.g_updatefaculty);
route.post('/viewfaculty', controller.p_viewfaculty);

route.get('/coursegrade', controller.g_coursegrade);
route.post('/coursegrade', controller.p_coursegrade);

route.post('/addgrade', controller.p_addgrade);

route.get('/courseattendence', controller.g_courseattendence);
route.post('/courseattendence', controller.p_courseattendence);

route.post('/addattendence', controller.p_addattendence);

route.get('/changepwdfaculty', controller.g_changepwdfaculty);
route.post('/changepwdfaculty', controller.p_changepwdfaculty);

route.delete('/logoutfaculty', controller.logoutfaculty);


//Student Functionality

route.get('/viewstudent', controller.g_viewstudent);

route.get('/updatestudent', controller.g_updatestudent);
route.post('/updatestudent', controller.p_updatestudent);

route.get('/courseregistration', controller.g_courseregistration);
route.post('/courseregistration', controller.p_courseregistration);

route.get('/viewgrade', controller.g_viewgrade);
// route.post('/viewgrade', controller.p_viewgrade);

route.get('/viewattendence', controller.g_viewattendence);
// route.post('/viewattendence', controller.p_viewattendence);

route.get('/student-announcement', controller.g_student_announcement);
route.get('/changepwdstudent', controller.g_changepwdstudent);
route.post('/changepwdstudent', controller.p_changepwdstudent);

route.delete('/logoutstudent', controller.logoutstudent);

//forgot password

// route.get('/forgotpwd', controller.g_forgotpwd);   // this is common for all 3 users

// route.post('/forgotpwdfaculty', controller.p_forgotpwdfaculty);  //email enter, mail send with reset link
// route.get('/resetpwd/:id/:token', controller.g_resetpwd);  //is it common for all???
// route.post('/resetpwd/:id/:token', controller.p_resetpwdfaculty);


module.exports = route