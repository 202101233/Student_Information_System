const express = require("express");
const route = express.Router()

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

route.get('/studentregistration', controller.g_studentregistration);
route.post('/studentregistration', controller.p_studentregistration);

route.get('/viewcourse', controller.g_viewcourse);
route.post('/viewcourse', controller.p_viewcourse);

route.post('/updatecourse', controller.p_updatecourse);
route.get('/addcourse', controller.g_addcourse);
route.post('/addcourse', controller.p_addcourse);

route.get('/viewdegree' , controller.g_viewdegree);
route.post('/viewdegree', controller.p_viewdegree);

route.post('/updatedegree', controller.p_updatedegree);
route.get('/adddegree', controller.g_adddegree);
route.post('/adddegree', controller.p_adddegree);

route.get('/viewbranch' , controller.g_viewbranch);
route.post('/viewbranch', controller.p_viewbranch);

route.post('/updatebranch', controller.p_updatebranch);
route.get('/addbranch', controller.g_addbranch);
route.post('/addbranch', controller.p_addbranch);

route.get('/viewprogram',controller.g_addprogram);
route.post('/viewprogram',controller.p_addprogram);

// route.post('/updateprogram', controller.p_updateprogram);
route.get('/addprogram', controller.g_addprogram);
route.post('/addprogram', controller.p_addprogram);

route.get('/viewsemester', controller.g_viewsemester);
// route.post('/viewsemester', controller.p_viewsemester);

// route.get('/addsemester', controller.g_addsemester);
// route.post('/addsemester', controller.p_addsemester);

route.get('/admin-announcement', controller.g_admin_announcement);
route.post('/admin-announcement', controller.p_admin_announcement);

route.get('/changepwdadmin', controller.g_changepwdadmin);
route.post('/changepwdadmin', controller.p_changepwdadmin);

route.delete('/logoutadmin', controller.logoutadmin);
route.delete('/logoutfaculty', controller.logoutfaculty);
route.delete('/logoutstudent', controller.logoutstudent);

// Faculty Functionality

route.get('/viewfaculty', controller.g_viewfaculty);
// route.post('/viewfaculty', controller.p_viewfaculty);

// route.post('/updatefaculty', controller.updatefaculty);

route.get('/changepwdfaculty', controller.g_changepwdfaculty);
route.post('/changepwdfaculty', controller.p_changepwdfaculty);

route.get('/changepwdstudent', controller.g_changepwdstudent);
route.post('/changepwdstudent', controller.p_changepwdstudent);



//forgot password

// route.get('/forgotpwd', controller.g_forgotpwd);   // this is common for all 3 users

// route.post('/forgotpwdfaculty', controller.p_forgotpwdfaculty);  //email enter, mail send with reset link
// route.get('/resetpwd/:id/:token', controller.g_resetpwd);  //is it common for all???
// route.post('/resetpwd/:id/:token', controller.p_resetpwdfaculty);



// Student Functionality

// route.get('')

module.exports = route