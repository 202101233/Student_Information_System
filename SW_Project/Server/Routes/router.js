const express = require("express");
const route = express.Router()

const controller = require('../Controller/controller');

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

route.get('/viewcourse', controller.g_viewcourse);
route.post('/viewcurse', controller.p_viewcourse);

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

