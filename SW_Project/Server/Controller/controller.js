var { Student, Admin, Faculty, Degree, Branch, Course, Program, Transcript, Announcement,
    Course_Allotment, Attendance,Grade,Course_Enrollment, Result } = require('../Model/model');
const { proppatch, use } = require('../Routes/router');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const path = require("path");



exports.homepage = (req, res) => {
    res.render("user-choice");
}

exports.g_adminlogin = (req, res) => {
    res.render("Admin/adminlogin.ejs");
}

exports.g_facultylogin = (req, res) => {
    res.render("Faculty/facultylogin.ejs");
}

exports.g_studentlogin = (req, res) => {
    res.render("Student/studentlogin.ejs");
}

exports.p_adminlogin = async (req, res) => {         //passport??????
    try {
        // check if the user exists
        const user = await Admin.findOne({ Email_id: req.body.a_email });
        if (user) {
            console.log("nik");
            console.log(user)
            console.log(user.admin_name)
            //check if password matches
            const result = req.body.a_password === user.Password;
            if (result) {
                console.log("nik");
                // res.render("../views/Admin/adminhome.ejs",{admin : user});
                res.redirect('/adminhome');
                console.log("nik");
                
            } else {
                res.status(400).json({ error: "Password doesn't match" });
                console.log("nik");
            }
        } else {
            console.log(req.body);
            res.status(400).json({ error: "User doesn't exist"});
        }
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.p_facultylogin = async (req, res) => {
    try {
        // check if the user exists
        const user = await Faculty.findOne({ Email_id: req.body.f_email });
        if (user) {
            //check if password matches
            const result = req.body.f_password === user.Password;
            if (result) {
                res.render("Faculty/facultyhome.ejs", {faculty : user});
            } else {
                res.status(400).json({ error: "Password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.p_studentlogin = async (req, res) => {
    try {
        // check if the user exists
        console.log("XXX");
        const data = req.body;
        const email_student=data.s_email;
        const pass = data.s_password;
        console.log(email_student);
        console.log(pass)
        const user = await Student.findOne({ Email_id: req.body.s_email });
        console.log("YYY");
        console.log(user);
        if (user) {
            //check if password matches
            
            if (req.body.s_password === user.Password) {
                res.render("Student/studenthome.ejs",{student : user});
            } else {
                res.status(400).json({ error: "Password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.g_adminhome = (isLoggedInadmin, async (req, res) => {
    try {
        console.log(req);
        const admin = await Admin.findOne({ _id: req.user });
        console.log("nik");
        res.render("../views/Admin/adminhome.ejs", { admin });
    } catch (err) {
        console.log("nikErr");
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client or logging it.
    }
});

exports.g_facultyhome = (isLoggedInfaculty, async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ _id: req.user });
        res.render("Faculty/facultyhome.ejs", { faculty });
    } catch (err) {
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client or logging it.
    }
})

exports.g_studenthome = (isLoggedInstudent, async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user });
        res.render("Student/studenthome.ejs", { student });
    } catch (err) {
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client or logging it.
    }
})

// Admin Functionality

exports.g_studentregistration = (isLoggedInstudent, (req, res) => {
    res.render("studentregistration.ejs");
})

exports.p_studentregistration = (isLoggedInstudent, async (req, res) => { ////  mail valu baki
    try {

        if(req.body.email.split("@")[1]!="daiict.ac.in"){
            const title = "ERROR";
            const message = "Invalid Email";
            const icon = "error";
            const href = "/studentregistration";
            res.render("alert.ejs", { title, message, icon, href });

        }

        const ID = req.body.email.split("@")[0];
        const Batch = req.body.email.substr(0,4);

        const student = await Student.findOne({ email : req.body.email});

        if(!student){
            const title = "ERROR";
            const message = "Student Email already exists";
            const icon = "error";
            const href = "/studentregistration";
            res.render("alert.ejs", { title, message, icon, href });
        }
        else {
            const randompass = generatePass();
            const hashedPassward = await bcrypt.hash(randompass,saltRounds);

            const newstudent = new Student({
                firstname: req.body.name.split(" ")[0],
                middlename: req.body.name.split(" ")[1],
                lastname: req.body.name.split(" ")[2],
                Email_id: req.body.email,
            })

            await newstudent.save();

            const transporter = nodemailer.createTransport({
                service : "gmail",
                host : "smtp.gmail.com",
                port : "587",
                tls : {
                    ciphers : "SSLv3",
                    rejectUnauthorized : false,
                },
                auth : {
                    user : "e-campus-daiict@gmail.com",
                    pass : process.env.GMAILPASSWORD,                    // env file?????????
                }
            });


            const mailoption = {
                from : "e-campus-daiict@gmail.com",
                to : req.body.email,
                Subject : "Account Created",
                html : `
                <h2> Your student account has been created. </h2>
                <p> Here are information : </p>
                <p> <b> Email ID : </b> ${req.body.email} </p>
                <p> <b> Password : </b> ${randomPass} </p> 
                <a href= >Click here to login</a>       
                `,                                                          // change link
            }

            await transporter.sendMail(mailoption);

            const title = "SUCCESS";
            const message = "Student added successfully!";
            const icon = "success";
            const href = "/adminHome";
            res.render("alert.ejs", { title, message, icon, href });
        }
    } catch (err) {
        console.error(err);
        const title = "ERROR";
        const message = "Unknown error ocurred!";
        const icon = "error";
        const href = "/adminHome";
        res.render("alert.ejs", { title, message, icon, href });
    }
})


function generatePass(){
    var pass = " ";
    var str= "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for(let i=1;i<=10;i++){
        var char = Math.floor(Math.random() + str.length() + 1);
        pass+=str.charAt(char);
    }
    return pass;

}
// Admin Course Management

exports.g_viewcourse = async (req, res) => {
    try {
        const courses = await Course.find({}).exec();
        res.render("../Views/Admin/viewcourse.ejs", { course: courses });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching course data");
    }
}

exports.p_viewcourse = async (req, res) => {
    try {
        if (req.body.edit) {
            const course = await Course.findOne({ _id: req.body.edit }).exac();
            res.render("updatecourse.ejs", { course });
        }
        else {
            await Course.deleteOne({ _id: req.body.delete }).exec();
            //const course = await Course.find({});
            res.redirect("viewcourse");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching course data");
    }
}

exports.p_updatecourse = async (req, res) => {
    try {
        const filter = { _id: req.body.edit };
        const update = {
            Course_name: req.body.name,
            Course_credit: req.body.credit,
            Course_code: req.body.code
        };

        await Course.updateOne(filter, update);
        res.redirect("viewcourse");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while updating course data");
    }
}

exports.g_addcourse = (req, res) => {
    res.render("addcourse.ejs");
}

exports.p_addcourse = async (req, res) => {
    try {
        const newcourse = new Course({
            Course_name: req.body.name,
            Course_credit: req.body.credit,
            Course_code: req.body.code
        })

        await newcourse.save();
        res.redirect("viewcourse");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding course data");
    }
}

// Admin Degree Management

exports.g_viewdegree = async (req, res) => {
    try {
        const degrees = await Degree.find({}).exec();
        res.render("viewdegree.ejs", { degree: degrees });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.p_viewdegree = async (req, res) => {
    try {
        if (req.body.edit) {
            const degree = await Degree.findOne({ _id: req.body.edit }).exac();
            res.render("updatedegree.ejs", { degree });
        }
        else {
            await Degree.deleteOne({ _id: req.body.delete }).exec();
            // const degree = await Degree.find({});
            res.redirect("viewdegree");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.p_updatedegree = async (req, res) => {
    try {
        const filter = { _id: req.body.edit };
        const update = {
            Degree_name: req.body.name
        };

        await Degree.updateOne(filter, update);
        res.redirect("viewdegree");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while updating degree data");
    }
}

exports.g_adddegree = async (req, res) => {
    res.render("viewdegree.ejs");
}

exports.p_adddegree = async (req, res) => {
    try {
        const newdegree = new Degree({
            Degree_name: req.body.name
        });

        await newdegree.save();
        res.redirect("viewdegree");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding degree data");
    }
}

// Admin Branch Management

exports.g_viewbranch = async (req, res) => {
    try {
        const branches = await Branch.find({}).exec();
        res.render("viewbranch.ejs", { branch: branches });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching branch data");
    }
}

exports.p_viewbranch = async (req, res) => {
    try {
        if (req.body.edit) {
            const branch = await Branch.findOne({ _id: req.body.edit }).exac();
            res.render("updatebranch.ejs", { branch });
        }
        else {
            await Branch.deleteOne({ _id: req.body.delete }).exec();
            //const branch = await Branch.find({});
            res.redirect("viewbranch");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching branch data");
    }
}

exports.p_updatebranch = async (req, res) => {
    try {
        const filter = { _id: req.body.edit };
        const update = {
            Branch_name: req.body.name
        };

        await Branch.updateOne(filter, update);
        res.redirect("viewbrach");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while updating branch data");
    }
}

exports.g_addbranch = async (req, res) => {
    res.render("viewbranch.ejs");
}

exports.p_addbranch = async (req, res) => {
    try {
        const newbranch = new Branch({
            Branch_name: req.body.name
        });

        await newbranch.save();
        res.redirect("viewbranch");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding branch data");
    }
}

// Admin Program Management

exports.g_viewprogram = async (req, res) => {
    try {
        const programs = await Program.find({})
            .populate('DegreeOffered Branchoffered Courseoffered')
            .exec();

        res.render("../views/Admin/viewprogram.ejs", { program: programs });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching program data");
    }
}

exports.p_viewprogram = async (req, res) => {
    try {

        await Program.deleteOne({ _id: req.body.delete }).exec();
        //const programs = await Program.find({})
        //.populate('DegreeOffered Branchoffered Courseoffered') 
        //.exec();

        res.redirect("/viewprogram");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching program data");
    }
}

exports.g_addprogram = async (req, res) => {
    try {
        const degrees = await Degree.find({}).exec();
        const branch = await Branch.find({}).exec();
        const courses = await Course.find({}).exec();
        res.render("../views/Admin/addprogram.ejs", { degrees, branch, courses });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding program data");
    }
}

exports.p_addprogram = async (req, res) => {
    try {
        const { degree, branch, courses } = req.body;

        const newPrpgram = new Program({
            DegreeOffered: degree,
            BranchOffered: branch,
            CourseOffered: courses   // more than one course   ????
        });

        await newPrpgram.save();
        res.redirect("viewProgram");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding program data");
    }
}

// Admin Semester Manegement

exports.g_viewsemester = async (req,res) => {
    try{
        res.render("semesterdetails.ejs");
    } catch(err){
        res.status(500).send("Internal Server Error");
    }
}

exports.p_viewsemester = async (req,res) => {
    try{
        await Course_Allotment.deleteOne({ _id: req.body.delete }).exec();
        //const course = await Course.find({});
        res.redirect("viewsemester");
    } catch(err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.g_addsemester = async (req,res) => {
    try{
        res.render("addsemester.ejs");
    } catch(err){
        res.status(500).send("Internal Server Error");
    }
}

exports.p_addsemester = (upload.single('excelfile'), async (req,res) => {
    try{
        const filepath = req.file.path;
        const semsester = await processExcelFile(filepath);

        await Course_Allotment.insertMany(semsester);

        req.session.semsester = semsester;

    } catch(err){
        console.err("Error occured while proccesing and uploading semester data");
        res.status(500).send("Error occured while proccesing and uploading semester data");
    }
});

async function processExcelFile(filepath){
    const workbook = new Excel.workbook();
    await workbook.xlsx.readfile(filepath);

    const workshhet = workbook.getWorksheet(1);
    const sem_data= [];
    
    const batch = req.body.Batch;
    const program = req.body.Program;
    const Semester_n = req.body.S_name;

    workshhet.eachRow(async (row,rownumber) => {

        if(rownumber>1){
            const course_id = row.getCell(1).value;
            const course_type = row.getCell(2).value;
            const faculty_assign = row.getCell(3).value;

            const obj1 = await Course.find({ Course_code : course_id});
            const obj2 = await Faculty.find({ fullname : faculty_assign});

            sem_data.push({
                Program_associate : program,
                Batch : batch,
                Date_created : new Date(),
                Course_code : obj1._id,
                Course_type : course_type,
                Faculty_Assigned : obj2._id,
                Semester_name : Semester_n,
            });
        }
    });
    return sem_data;
}
// Admin Fee Management

// Admin announcement

exports.g_admin_announcement = async (req, res) => {
    try {
        const announcement = await Announcement.find({}).exec();
        res.render("admin-announcement.ejs", { announcement });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.p_addmin_announcement = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;

        const newannouncement = {
            Title: title,
            Description: description,
            Due_date : due_date,
        }

        await newannouncement.save();
        res.redirect("admin-announcement");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding announcement");
    }
}

exports.g_changepwdadmin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.user });
        res.render("changepwdadmin.ejs", { admin });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.p_changepwdadmin = async (req, res) => {
    try {
        const ID = req.Admin.id;           //user here means admin or not?
        const { oldpwd, newpwd, confirmpwd } = req.body;

        if (newpwd != confirmpwd)                   //new password  check strong
        {
            const title = "ERROR";
            const message = "New password and confirm password do not match!";
            const icon = "error";
            const href = "/changepwdadmin";
            res.render("alert.ejs", { title, message, icon, href });

            return res.status(400).send("New password and confirm password do not match!");
        }
        const user = await Admin.findById(ID);

        const pwdvalid = await bcrypt.compare(oldpwd, user.Password);

        if (!pwdvalid) {
            const title = "ERROR";
            const message = "Old Passward is incorrect!";
            const icon = "error";
            const href = "/changepwdadmin";
            res.render("alert.ejs", { title, message, icon, href });

            return res.status(401).send("Old password is incorrect!");
        }

        const hashedpwd = await bcrypt.hash(newpwd, saltRounds);
        user.Password = hashedpwd;
        await user.save();

        const title = "SUCCESS";
        const message = "Password changed successfully!";
        const icon = "success";
        const href = "/adminhome";
        res.render("alert.ejs", { title, message, icon, href });


        res.status(200).send("Password changed successfully!");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while changing password!");
    }
}

exports.logoutadmin = async (req, res, next) => {
    try {
        req.logOut(req.user);
        res.redirect('/adminlogin');
    } catch (err) {
        next(err);
    }
};


// faculty profile


exports.g_viewfaculty = async (req, res) => {
    try {
        const ID = req.Faculty.id;
        const user = await Faculty.findById(ID);

        res.render("viewfaculty.ejs", { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.g_updatefaculty = async (req, res) => {
    try {
        const ID = req.Faculty.id;
        const user = await Faculty.findById(ID);

        res.render("updatefaculty.ejs", { user });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.p_updatefaculty = async (req, res) => {
    try {
        const validphone = validatePhoneNumber.validate(req.body.mobileNO)
        if (!validphone) {
            const title = "ERROR";
            const message = " Mobile no is invalid";
            const icon = "error";
            const href = "/updatefaculty";
            res.status(401).render("alert.ejs", { title, message, icon, href });
        }

        const validemail = validator.validate(req.body.myemail);
        if (!validemail) {
            const title = "ERROR";
            const message = " Email ID is invalid";
            const icon = "error";
            const href = "/updatefaculty";
            res.status(401).render("alert.ejs", { title, message, icon, href });
        }

        const ID = req.Faculty.id;
        const update = {
            fullname: req.body.fullname,
            phoneNo: req.body.mobileNO,
            Email_id: req.body.myemail,
            DOB: req.body.dob,
            Gender: req.body.gender,
            Education: req.body.education
        }


        await Faculty.updateOne({ ID, update }).exec();

        const title = "SUCCESS";
        const message = "Faculty details updated!";
        const icon = "success";
        const href = "/viewfaculty";
        res.render("alert.ejs", { title, message, icon, href });


    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.g_coursegrade = async (req,res) => {
    try{
        const last_sem = await Course_Allotment.find().sort({Date_created:-1}).limit(1);
        const semester_name = last_sem.Semester_name;

        const f_name = req.Faculty.id;

        const coursesTaught = await Course_Allotment.aggregate([
            {
                $match: { Semester_name: semester_name } // Match the documents with the specified semester name
            },
            {
                $unwind: "$Courseallocate" // Deconstruct the Courseallocate array
            },
            {
                $match: { "Courseallocate.Faculty_assigned": f_name } // Match the documents with the specified faculty
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    Course_upload: "$Courseallocate.Course_upload" // Include the Course_upload field from Courseallocate
                }
            }
        ]);

        res.render("coursegrade.ejs", { coursesTaught , semester_name});
    } catch(err){
        console.error(err);
        res.status(500).send("An error occured while adding grade data");
    }
}

exports.p_coursegrade = async (req,res) => {
    try{
        const course =await Course.findOne({ _id :req.body.mycheckbox });
        res.render("addgrade.ejs", {course}); 
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while adding grade data");
    }
}

exports.p_addgrade = (upload.single('excelfile'), async (req,res) => {
    try{
        const filepath = req.file.path;
        const grade = await processExcelFile(filepath);

        await Grade.insertMany(grade);

        req.session.grade = grade;

    } catch(err){
        console.error(err);
        res.status(500).send("An error occured while adding grade data");
    }
})

async function processExcelFile(filepath){
    const workbook = new Excel.workbook();
    await workbook.xlsx.readfile(filepath);

    const workshhet = workbook.getWorksheet(1);
    const grade_data= [];
    // const obj = req.body._id;

    // const course_name = obj.course_name;             // Optional
    // const course_code = obj.course_code;

    workshhet.eachRow(async (row,rownumber) => {

        if(rownumber>1){
            const student_id = row.getCell(1).value;
            const marks = row.getCell(2).value;

            const obj = await Student.find({ stud_id : student_id});

            grade_data.push({
                courseEnrolled : course_code,
                stud_id : obj._id,
                grade : marks
            });
        }
    });
    return grade_data;
}

exports.g_courseattendence = async (req,res) => {
    try{
        const last_sem = await Course_Allotment.find().sort({Date_created:-1}).limit(1);
        const semester_name = last_sem.Semester_name;

        const f_name = req.Faculty.id;

        const coursesTaught = await Course_Allotment.aggregate([
            {
                $match: { Semester_name: semester_name } // Match the documents with the specified semester name
            },
            {
                $unwind: "$Courseallocate" // Deconstruct the Courseallocate array
            },
            {
                $match: { "Courseallocate.Faculty_assigned": f_name } // Match the documents with the specified faculty
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    Course_upload: "$Courseallocate.Course_upload" // Include the Course_upload field from Courseallocate
                }
            }
        ]);

        res.render("courseattendence.ejs", { coursesTaught , semester_name});
    } catch(err){
        console.error(err);
        res.status(500).send("An error occured while adding attendence data");
    }
}

exports.p_courseattendence = async (req,res) => {
    try{
        const course =await Course.findOne({ _id :req.body.mycheckbox });
        res.render("addattendence.ejs", {course}); 
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while adding attendence data");
    }
}

exports.p_addattendence = (upload.single('excelfile'), async (req,res) => {
    try{
        const filepath = req.file.path;
        const attendance = await processExcelFile(filepath);

        await Attendance.insertMany(grade);

        req.session.attendance = attendance;

    } catch(err){
        console.error(err);
        res.status(500).send("An error occured while adding attendence data");
    }
})

async function processExcelFile(filepath){
    const workbook = new Excel.workbook();
    await workbook.xlsx.readfile(filepath);

    const workshhet = workbook.getWorksheet(1);
    const attendance_data= [];
    
    // const course_name = req.body.course_name;             // Optional
    const course_code = req.body.course_code;

    workshhet.eachRow(async (row,rownumber) => {

        if(rownumber>1){
            const student_id = row.getCell(1).value;
            const present_days = row.getCell(2).value;
            const total_days = row.getCell(3).value;

            const obj = await Student.find({ stud_id : student_id});

            attendance_data.push({
                courseEnrolled : course_code,
                stud_id : obj._id,
                Present_days : present_days,
                Total_days : total_days 
            });
        }
    });
    return attendance_data;
}


exports.g_changepwdfaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ _id: req.user });
        res.render("changepwdfaculty.ejs", { faculty });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.p_changepwdfaculty = async (req, res) => {
    try {
        const ID = req.Faculty.id;           //user here means fsculty or not?
        const { oldpwd, newpwd, confirmpwd } = req.body;

        if (newpwd != confirmpwd) {
            const title = "ERROR";
            const message = "New password and confirm password do not match!";
            const icon = "error";
            const href = "/changepwdfaculty";
            res.render("alert.ejs", { title, message, icon, href });

            return res.status(400).send("New password and confirm password do not match!");
        }
        const user = await Faculty.findById(ID);

        const pwdvalid = await bcrypt.compare(oldpwd, user.Password);

        if (!pwdvalid) {
            const title = "ERROR";
            const message = "Old Password is incorrect!";
            const icon = "error";
            const href = "/changepwdfaculty";
            res.render("alert.ejs", { title, message, icon, href });

            return res.status(401).send("Old password is incorrect!");
        }

        const hashedpwd = await bcrypt.hash(newpwd, saltRounds);
        user.Password = hashedpwd;
        await user.save();

        const title = "SUCCESS";
        const message = "Password changed successfully!";
        const icon = "success";
        const href = "/facultyhome";
        res.render("alert.ejs", { title, message, icon, href });


        res.status(200).send("Password changed successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while changing password!");
    }
}

exports.logoutfaculty = async (req, res, next) => {
    try {
        req.logOut(req.user);
        res.redirect('/facultylogin.ejs');
    } catch (err) {
        next(err);
    }
};


// Student Functionality

exports.g_viewstudent = async (req, res) => {
    try {
        const ID = req.Student.id;     //Student as a schema name?
        const user = await Student.findById(ID).populate('ProgramRegistered');

        const program = await Program.findById(user.ProgramRegistered).populate('DegreeOffered BranchOffered');
        res.render("viewstudent.ejs", { user, program });


    } catch (err) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.g_updatestudent = async (req, res) => {
    try {
        const ID = req.Student.id;
        const user = await Student.findById(ID);

        res.render("updatestudent.ejs", { user });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.p_updatestudent = async (req, res) => {
    try {
        const validphone = validatePhoneNumber.validate(req.body.mobileNO)
        if (!validphone) {
            const title = "ERROR";
            const message = " Mobile no is invalid";
            const icon = "error";
            const href = "/viewstudent";
            res.status(401).render("alert.ejs", { title, message, icon, href });
        }

        const validemail = validator.validate(req.body.myemail);
        if (!validemail) {
            const title = "ERROR";
            const message = " Email ID is invalid";
            const icon = "error";
            const href = "/viewstudent";
            res.status(401).render("alert.ejs", { title, message, icon, href });
        }

        const ID = req.Student.id;
        const update = {
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            phoneNo: req.body.mobileNO,
            Email_id: req.body.email_id,
            DOB: req.body.dob,
            Gender: req.body.gender,
            Address: req.body.address,
            Blood_Group: req.body.bloodgroup,
            Parent_Email_id: req.body.p_email_id,    // profile picture??????????/

        }


        await Student.updateOne({ ID, update }).exec();

        const title = "SUCCESS";
        const message = "Student details updated!";
        const icon = "success";
        const href = "/viewstudent";
        res.render("alert.ejs", { title, message, icon, href });


    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while updating profile");
    }
}

// Course Registration

exports.g_courseregistration = async (req,res) => {
    try{
        const last_sem = await Course_Allotment.find().sort({Date_created : -1}).limit(1);
        const sem_name = last_sem.Semester_name;

        const ID = res.Student.id;

        const user = await Student.findnyId(ID);
        const p_name = user.ProgramRegistered;
        const batch = user.Batch;

        const coursesTaught = await Course_Allotment.aggregate([
            {
                $match: { Semester_name: sem_name, Program_associate : p_name, Batch : batch } // Match the documents with the specified semester name
            },
            {
                $unwind: "$Courseallocate" // Deconstruct the Courseallocate array
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    Course_upload: "$Courseallocate.Course_upload",
                    Course_type : "$Courseallocate.Course_type"// Include the Course_upload field from Courseallocate
                }
            }
        ]);

        res.render("courseregistration.ejs", { coursesTaught , sem_name, p_name, batch});
    } catch(err){
        res.status(500).send("An error occured while registering course");
    }
}

exports.p_courseregistration = async (req,res) => {
    try{
        if(req.body.register.length!==6) {
            const title = "ERROR";
            const message = "Please select only 6 courses!";
            const icon = "error";
            const href = "/courseregistration";
            res.render("alert.ejs", { title, message, icon, href });
        }

        const student = await Student.findById(req.user);
        const semester = await Course_Allotment.findById(req.body.sem);

        const courses = req.body.register;

        const newCourseEnrollment = new Course_Enrollment({
            studentEnrolled : student,
            semesterEnrolled : semester,
            courseEnrolled : courses
        })
 
        await newCourseEnrollment.save();
        const title = "SUCCESS";
        const message = "Course Registration completed!";
        const icon = "success";
        const href = "/studenthome";
        res.render("alert.ejs", { title, message, icon, href });

    } catch(err) {
        res.status(500).send("An error occured while course registration");
    }
}

// See grade

exports.g_viewgrade = async (req,res) => {
    try{
        const ID = req.Student.id;

        const user = await Student.findById(ID);
        const p_name = user.ProgramRegistered;
        // const batch = user.Batch;

        const sem_enroll = await Course_Enrollment.aggregate([
            {
                $match : {Program_associate : p_name, studentenrolled : user}     // batch or student????
            },
            {
                $project: {
                _id: 0, // Exclude the _id field from the result
                Semester_name : "Semester_name"
                }   
            }
        ])
        res.render("viewgrade.ejs", { sem_enroll });
    } catch(err){
        res.status(500).send("An error occured while fetching semester data");
    }
}

exports.g_viewattendence = async (req,res) => {
    try{
        const ID = req.Student.id;

        const user = await Student.findById(ID);
        const p_name = user.ProgramRegistered;
        const batch = user.Batch;

        const sem_enroll = await Course_Allotment.aggregate([
            {
                $match : {Program_associate : p_name, Batch : batch}
            },
            {
                $project: {
                _id: 0, // Exclude the _id field from the result
                Semester_name : "Semester_name"
                }   
            }
        ])
        res.render("viewattendence.ejs", { sem_enroll });
    } catch(err){
        res.status(500).send("An error occured while fetching semester data");
    }
}

// exports.p_viewattendence= async (req, res) => {
//     try{
//         const ID =req.Student.id;
//         const sem_select = req.Course_Allotment.Semester_name;

//         const user = await Student.findById(ID);

//         const courseEnrollments = await Course_Enrollment.find({
//             studentEnrolled : user,
//             semesterEnrolled :  sem_select

//         }).populate('courseEnrolled');

//         // const attendenceDate = [];
//         const attendencedata = await Attendance.aggregate([
//             {
//                 $match: { Semester_name: semester_name } // Match the documents with the specified semester name
//             },
//             {
//                 $unwind: "$Courseallocate" // Deconstruct the Courseallocate array
//             },
//             {
//                 $match: { "Courseallocate.Faculty_assigned": f_name } // Match the documents with the specified faculty
//             },
//             {
//                 $project: {
//                     _id: 0, // Exclude the _id field from the result
//                     Course_upload: "$Courseallocate.Course_upload" // Include the Course_upload field from Courseallocate
//                 }
//             }
//         ]);





//     }catch(err){
//         res.status(500).send("An error occured while fetching semester data");
// }

// View Announcement

exports.g_student_announcement = async (req,res) => {
    try{
        const announcements = await Announcement.find({}).exec();

        const Curr_date = new Date();

        const valid_announcement = [];

        for(const announcement of announcements){
            if(announcement.Due_data > Curr_date){
                valid_announcement.push(announcement);
            }
            else{ 
                await Announcement.deleteOne({ _id : announcement._id});
            }
        }
        res.render("student-announcement.ejs", {announcements : valid_announcement});
    } catch (err){
        res.status(500).send("An error occured while fetching announcement data");
    }
}

// Change Pwd Student
exports.g_changepwdstudent = async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user });
        res.render("changepwdstudent.ejs", { student });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.p_changepwdstudent = async (req, res) => {
    try {
        const ID = req.Student.id;           //user here means student or not?
        const { oldpwd, newpwd, confirmpwd } = req.body;

        if (newpwd != confirmpwd) {
            const title = "ERROR";
            const message = "New password and confirm password do not mathch!";
            const icon = "error";
            const href = "/changepwdstudent";
            res.render("alert.ejs", { title, message, icon, href });

            return res.status(400).send("New password and confirm password do not mathch!");
        }
        const user = await Admin.findById(ID);

        const pwdvalid = await bcrypt.compare(oldpwd, user.Password);

        if (!pwdvalid) {
            const title = "ERROR";
            const message = "Old Password is incorrect!";
            const icon = "error";
            const href = "/changepwdstudent";
            res.render("alert.ejs", { title, message, icon, href });

            return res.status(401).send("Old password is incorrect!");
        }

        const hashedpwd = await bcrypt.hash(newpwd, saltRounds);
        user.Password = hashedpwd;
        await user.save();

        const title = "SUCCESS";
        const message = "Password changed successfully!";
        const icon = "success";
        const href = "/studenthome";
        res.render("alert.ejs", { title, message, icon, href });


        res.status(200).send("Password changed successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while changing password!");
    }
}

exports.logoutstudent = async (req, res, next) => {
    try {
        req.logOut(req.user);
        res.redirect('/studentlogin');
    } catch (err) {
        next(err);
    }
};

isvalidpwd = (password) => {

    if (!(password.length >= 8 && password.length <= 15)) {
        return false;
    }

    if (password.indexOf(" ") !== -1) {
        return false;
    }


}
function isLoggedInadmin(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/adminlogin");
}

function isLoggedInfaculty(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/facultylogin");
}
function isLoggedInstudent(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/studentlogin");
}

// exports.g_forgotpwd = async (req, res) => {
//     res.render("forgotpwd.ejs"); // Render a page to enter the email
// };