var { Student, Admin, Faculty, Degree, Branch, Course, Program, Transcript, Announcement,
    Course_Allotment, Attendance, Grade, Course_Enrollment, Result } = require('../Model/model');
const { proppatch, use } = require('../Routes/router');

const path = require("path");
const bcrypt=require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const XLXS = require("xlsx");
const ExcelJS = require("exceljs");
const multer = require("multer");
const validator = require('validator');
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
app.use(cookieParser());


const saltRounds = 10;

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
            const result = await bcrypt.compare(req.body.a_password, user.Password);
            if (result) {
                console.log("nik");
                //res.render("Admin/adminhome.ejs",{admin : user});
                //res.redirect('/adminhome');
                // JWT 
                // console.log("KKK");
                // console.log(user.admin_name);
                // console.log(user.Email_id);
                // console.log("UUU");

                const secret = "sagar";
                const token = await jwt.sign({ "name": user.admin_name, "email_id": user.Email_id }, secret);
                console.log("YYY");
                console.log(token);
                console.log("TTT");
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });

                console.log("HHH");

                const stored_token = req.cookies.jwtoken;

                console.log(stored_token);
                console.log("KK");
                const verify_one = jwt.verify(token, secret);
                console.log(verify_one);
                // console.log(jwt.verify())
                res.redirect("/adminhome");
                //console.log("nik");

            } else {
                res.status(400).json({ error: "Password doesn't match" });
                console.log("nik");
            }
        } else {
            console.log(req.body);
            res.status(400).json({ error: "User doesn't exist" });
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
                const secret = "sagar";
                const token = await jwt.sign({ "name": user.name, "email_id": user.Email_id }, secret);
                console.log("YYY");
                console.log(token);
                console.log("TTT");
                res.cookie("f_jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });

                console.log("HHH");

                const stored_token = req.cookies.f_jwtoken;

                console.log(stored_token);
                console.log("KK");
                const verify_one = jwt.verify(token, secret);
                console.log(verify_one);
                res.redirect("/facultyhome");
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
        // console.log("XXX");
        // const data = req.body;
        // const email_student = data.s_email;
        // const pass = data.s_password;
        // console.log(email_student);
        // console.log(pass)
        const user = await Student.findOne({ Email_id: req.body.s_email });

       
        console.log("YYY");
        console.log(user);
        if (user) {
            //check if password matches

            const loggedstudent = req.body.s_password === user.Password;
            console.log("tttrrr");
            console.log(loggedstudent);
                if(loggedstudent)
                {
                    const secret = "sagar1";
                const token = await jwt.sign({ "name": user.firstname, "email_id": user.Email_id}, secret);
                //console.log("YYY");
                console.log(token);
                console.log("TTT");
                res.cookie("jwtokenstudent", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });

                console.log("HHH");

                const stored_token = req.cookies.jwtokenstudent;

                console.log(stored_token);
                console.log("KK");
                const verify_one = jwt.verify(stored_token, secret);
                console.log(verify_one);
                // console.log(jwt.verify())
                res.redirect("/studenthome");
                //res.render("Student/studenthome.ejs",{student: user});
                //console.log("nik");
                }
                 else {
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
        console.log("jay");
        console.log(req.body);
        console.log("jay");
        const adm = await Admin.findOne({ _id: req.user });
        // console.log(adm);
        res.render("Admin/adminhome.ejs", { admin: adm });
    } catch (err) {
        console.log("nikErr");
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client or logging it.
    }
});

exports.g_facultyhome = (isLoggedInfaculty, async (req, res) => {
    try {
        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id :email})

        res.render("Faculty/facultyhome.ejs", { user });
    } catch (err) {
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client or logging it.
    }
})

exports.g_studenthome = (isLoggedInstudent, async (req, res) => {
    try {
        const Student_token = req.cookies.jwtokenstudent;
        const verified_student = jwt.verify(Student_token, "sagar1");
        const email = verified_student.email_id;
        const student = await Student.find({Email_id: email});
        res.render("Student/studenthome.ejs", { student });
    } catch (err) {
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client or logging it.
    }
})

// Admin Functionality

exports.g_studentregistration = (isLoggedInstudent, (req, res) => {
    res.render("Admin/studentregistration.ejs");
})

exports.p_studentregistration = (isLoggedInstudent, async (req, res) => { ////  mail valu baki
    try {

        if (req.body.email.split("@")[1] != "daiict.ac.in") {
            const title = "ERROR";
            const message = "Invalid Email";
            const icon = "error";
            const href = "/studentregistration";
            res.render("Admin/alert.ejs", { title, message, icon, href });

        }

        const ID = req.body.email.split("@")[0];
        const batch = req.body.email.substr(0, 4);
        // console.log(ID);
        // console.log(batch);
        // console.log(req.body.email)
        const student = await Student.findOne({ Email_id: req.body.email });
        // console.log(student);

        if (student) {
            // console.log(student)
            // res.send("student already exist");
            const title = "ERROR";
            const message = "Student Email already exists";
            const icon = "error";
            const href = "/studentregistration";
            res.render("Admin/alert.ejs", { title, message, icon, href });
        }
        else {
            console.log("hiiii");
            const randompass = generatePass();
            const hashedPassward = await bcrypt.hash(randompass, saltRounds);

            const newstudent = new Student({
                firstname: req.body.name.split(" ")[0],
                middlename: req.body.name.split(" ")[1],
                lastname: req.body.name.split(" ")[2],
                stud_id: ID,
                Email_id: req.body.email,
                Password: hashedPassward,
                Batch: batch
            })
            // console.log(newstudent);
            await newstudent.save();
            // res.send("save sucecssfully");

            let transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 587,
                auth:{
                    user:'202101234@daiict.ac.in',
                    pass:'jhluwxctbddwqruz'
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
    
            const mailOptions = {
                from: '202101234@daiict.ac.in', // Sender's email address
                to: req.body.email,//'202101234@daiict.ac.in', // Recipient's email address
                subject: "Account Created", // Subject of the email
                text: 'This is a test email sent from Node.js using Nodemailer.',
                html: `
                    <h2> Your student account has been created. </h2>
                    <p> Here are information : </p>
                    <p> <b> Email ID : </b> ${req.body.email} </p>
                    <p> <b> Password : </b> ${hashedPassward} </p> 
                    <a href= "http://localhost:8010/studentlogin">Click here to login</a>       
                    `, 
              };

              console.log("mail continue again");
    
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error('Error:', error);
                } else {
                  console.log('Email sent:', info.response);
                }
                
                // Close the transporter after sending the email
                //transporter.close();
              });

            // await transporter.sendMail(mailoption);
            console.log("student add sucessfully");
            // res.redirect("adminhome");

            const title = "SUCCESS";
            const message = "Student added successfully!";
            const icon = "success";
            const href = "/adminHome";
            res.render("Admin/alert.ejs", { title, message, icon, href });
            res.redirect("adminhome");
        }
    } catch (err) {
        console.error(err);
        const title = "ERROR";
        const message = "Unknown error ocurred!";
        const icon = "error";
        const href = "/adminHome";
        res.render("Admin/alert.ejs", { title, message, icon, href });
    }
})


function generatePass() {
    var pass = " ";
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 10; i++) {
        var char = Math.floor(Math.random() + str.length + 1);
        pass += str.charAt(char);
    }
    return pass;

}
// Admin Course Management

exports.g_viewcourse = async (req, res) => {
    try {
        const courses = await Course.find({}).exec();
        console.log(courses);
        res.render("Admin/viewcourse.ejs", { course: courses });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching course data");
    }
}

exports.p_viewcourse = async (req, res) => {
    try {
        if (req.body.edit) {
            const course = await Course.findOne({ _id: req.body.edit });
            res.render("Admin/updatecourse.ejs", { course });
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
        const filter = { _id: req.body.id };
        const update = {
            Course_Name: req.body.name,
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
    res.render("Admin/addcourse.ejs");
}

exports.p_addcourse = async (req, res) => {
    // res.send("helloo");
    try {

        const newcourse = new Course({
            Course_Name: req.body.name,
            Course_code: req.body.code,
            Course_credit: req.body.credit,
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
        res.render("Admin/viewdegree.ejs", { degree: degrees });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.p_viewdegree = async (req, res) => {
    try {
        if (req.body.edit) {
            const degree = await Degree.findOne({ _id: req.body.edit });
            res.render("Admin/updatedegree.ejs", { degree });
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
        const filter = { _id: req.body.id };
        const update = {
            Degree_name: req.body.name
        };

        await Degree.updateOne(filter, update);
        res.redirect("/viewdegree");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while updating degree data");
    }
}

exports.g_adddegree = async (req, res) => {
    res.render("Admin/adddegree.ejs");
}

exports.p_adddegree = async (req, res) => {
    try {
        const newdegree = new Degree({
            Degree_name: req.body.name
        });

        await newdegree.save();
        res.redirect("/viewdegree");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding degree data");
    }
}

// Admin Branch Management

exports.g_viewbranch = async (req, res) => {
    try {
        const branches = await Branch.find({}).exec();
        res.render("Admin/viewbranch.ejs", { branch: branches });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching branch data");
    }
}

exports.p_viewbranch = async (req, res) => {
    try {
        if (req.body.edit) {
            console.log("Branchhhh");
            const branch = await Branch.findOne({ _id: req.body.edit });
            console.log(branch);
            res.render("Admin/updatebranch.ejs", { branch });
        }
        else {
            await Branch.deleteOne({ _id: req.body.delete }).exec();
            //const branch = await Branch.find({});
            res.redirect("/viewbranch");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching branch data");
    }
}

exports.p_updatebranch = async (req, res) => {
    try {
        const filter = { _id: req.body.id };
        const update = {
            Branch_name: req.body.name
        };
        console.log(filter);
        console.log(update);
        await Branch.updateOne(filter, update);
        res.redirect("/viewbranch");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while updating branch data");
    }
}

exports.g_addbranch = async (req, res) => {
    res.render("Admin/addbranch.ejs");
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
            .populate('DegreeOffered BranchOffered CourseOffered')
            .exec();

        res.render("Admin/viewprogram.ejs", { program: programs });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching program data .....");
    }
}

exports.p_viewprogram = async (req, res) => {
    try {

        await Program.deleteOne({ _id: req.body.delete }).exec();
        //const programs = await Program.find({})
        //.populate('DegreeOffered Branchoffered Courseoffered') 
        //.exec();

        res.redirect("viewprogram");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching program data");
    }
}

exports.g_addprogram = async (req, res) => {
    try {
        const degrees = await Degree.find({}).exec();
        const branches = await Branch.find({}).exec();
        const courses = await Course.find({}).exec();
        res.render("Admin/addprogram.ejs", { degrees, branches, courses });
        console.log("hellooo");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding program data");
    }
}

exports.p_addprogram = async (req, res) => {
    try {
        const { degree, branch, courses } = req.body;
        console.log(degree.Degree_name);

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

// exports.g_viewsemester = async (req, res) => {
//     try {
//         res.render("Admin/admin-semester.ejs");
//     } catch (err) {
//         res.status(500).send("Internal Server Error");
//     }
// }

// exports.p_viewsemester = async (req, res) => {
//     try {
//         await Course_Allotment.deleteOne({ _id: req.body.delete }).exec();
//         //const course = await Course.find({});
//         res.redirect("viewsemester");
//     } catch (err) {
//         res.status(500).send("Internal Server Error");
//     }
// }

exports.g_addsemester = async (req, res) => {
    try {
        const programs = await Program.find({})
            .populate('DegreeOffered BranchOffered CourseOffered')
            .exec();

            // console.log(programs);

        res.render("Admin/addsemester.ejs", { program: programs });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching program data .....");
    }
}

async function processExcelJSFile(filepath, req) {
    const workbook = new ExcelJS.Workbook();     //??workbook or Workbook??
    await workbook.xlsx.readFile(filepath);

    const workshhet = workbook.getWorksheet(1);
    const sem_data = [];
    // console.log(req.body);
    const batch = req.body.batch;
   
    const degree = req.body.degree;
    // console.log( req.body.degree);
    const branch = req.body.branch;
    const Semester_n = req.body.name;
    // console.log("continueee");
    const existingProgram = await Program.findOne({
        DegreeOffered: degree ,
        BranchOffered: branch,
    });
    if (!existingProgram) {
        // Handle the case when the Program does not exist
        console.error('Program not found based on degree and branch names.');
        return sem_data; // or throw an error, depending on your use case
    }

    workshhet.eachRow(async (row, rownumber) => {

        if (rownumber > 1) {
            const course_id = row.getCell(1).value;
            const course_type = row.getCell(2).value;
            const faculty_assign = row.getCell(3).value;

            // const obj1 = await Course.findOne({ Course_code: course_id });
            // const obj2 = await Faculty.findOne({ fullname: faculty_assign });
            // console.log(obj1);
            // console.log(obj2);
            sem_data.push({
                Program_associate: existingProgram._id,
                Batch: batch,
                Date_created: new Date(),
                Courseallocate: {
                    Course_upload: course_id,
                    Course_type: course_type,
                    Faculty_assigned:  faculty_assign,
                },
                
                Semester_name: Semester_n,
            });
        }
    });

    return sem_data;
}

exports.p_addsemester = async (req, res) => {
    try {
        console.log(req.body);
        console.log("continueeee");
        console.log(req.file)
        // console.log("complete");
        const filepath = req.file.path;
        const semester = await processExcelJSFile(filepath, req);
        // // console.log("continueeee");
        await Course_Allotment.insertMany(semester);
        // console.log(semester);
        // req.session.semester = semester;
        res.send(semester);

    } catch (err) {
        console.log(err);
        console.error("Error occured while proccesing and uploading semester data");
        res.status(500).send("Error occured while proccesing and uploading semester data");
    }
};

// async function processExcelFile(filepath, req) {
//     const workbook = new Excel.Workbook();     //??workbook or Workbook??
//     await workbook.xlsx.readFile(filepath);

//     const workshhet = workbook.getWorksheet(1);
//     const sem_data = [];

//     const batch = req.body.batch;
//     const degree = req.body.degree;
//     const branch = req.body.branch;
//     const Semester_n = req.body.name;
//     const existingProgram = await Program.findOne({
//         DegreeOffered: { name: degree },
//         BranchOffered: { name: branch },
//     });
//     if (!existingProgram) {
//         // Handle the case when the Program does not exist
//         console.error('Program not found based on degree and branch names.');
//         return sem_data; // or throw an error, depending on your use case
//     }

//     workshhet.eachRow(async (row, rownumber) => {

//         if (rownumber > 1) {
//             const course_id = row.getCell(1).value;
//             const course_type = row.getCell(2).value;
//             const faculty_assign = row.getCell(3).value;

//             const obj1 = await Course.find({ Course_code: course_id });
//             const obj2 = await Faculty.find({ fullname: faculty_assign });

//             sem_data.push({
//                 Program_associate: existingProgram._id,
//                 Batch: batch,
//                 Date_created: new Date(),
//                 Courseallocate: {
//                     Course_upload: obj1._id,
//                     Course_type: course_type,
//                     Faculty_assigned:  obj2._id,
//                 },
                
//                 Semester_name: Semester_n,
//             });
//         }
//     });
//     return sem_data;
// }

// Admin Fee Management

// Admin announcement

exports.g_admin_announcement = async (req, res) => {
    try {
        const announcement = await Announcement.find({}).exec();
        res.render("Admin/admin-announcement.ejs", { announcement });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.p_addmin_announcement = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;

        const newannouncement = new Announcement({
            Title: title,
            Description: description,
            Due_Date: due_date
        });
    //    console.log(req.body);
     


        await newannouncement.save();
        res.redirect("adminhome");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding announcement");
    }
}

exports.g_changepwdadmin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.user });
        console.log(admin);
        res.render("Admin/changepwdadmin", { admin });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.p_changepwdadmin = async (req, res) => {
    try {
       const stored_token = req.cookies.jwtoken;
       console.log(stored_token);
       const verify_one = jwt.verify(stored_token, "sagar");
       console.log(verify_one);
       const email = verify_one.email_id;

        const { oldpwd, newpwd, confirmpwd } = req.body;
        console.log(req.body);

        if (newpwd != confirmpwd)                   //new password  check strong
        {
            const title = "ERROR";
            const message = "New password and confirm password do not match!";
            const icon = "error";
            const href = "/changepwdadmin";
            res.render("alert.ejs", { title, message, icon, href });

            return res.status(400).send("New password and confirm password do not match!");
        }
        const user = await Admin.findOne({Email_id : email});
        // console.log(user);
        // console.log(oldpwd);
        // console.log(user.Password);

        const pwdinvalid = await bcrypt.compare(oldpwd, user.Password);
        // console.log(pwdvalid);
        if (pwdinvalid) {
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
        console.log("hellloooo");
        const stored_token = req.cookies.f_jwtoken;
        // console.log(stored_token);
        const verify_one = jwt.verify(stored_token, "sagar");
        // console.log(verify_one);
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id :email})
        
        //console.log(ID);
        console.log(user);
        res.render("Faculty/viewprofilefaculty.ejs", { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching faculty data");
    }
}

exports.g_updatefaculty = async (req, res) => {
    try {
        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id :email});

        res.render("Faculty/editprofilefaculty.ejs", { user });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while updating faculty data");
    }
}

exports.p_updatefaculty = async (req, res) => {
    try {
        //const validphone = validatePhoneNumber.validate(req.body.mobileNO)
        if (req.body.mobileNO.length!=10) {
            const title = "ERROR";
            const message = " Mobile no is invalid";
            const icon = "error";
            const href = "/updatefaculty";
            res.status(401).render("alert.ejs", { title, message, icon, href });
        }

        // const validemail = validator.(req.body.myemail);
        // if (!validemail) {
        //     const title = "ERROR";
        //     const message = " Email ID is invalid";
        //     const icon = "error";
        //     const href = "/updatefaculty";
        //     res.status(401).render("alert.ejs", { title, message, icon, href });
        // }

        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id :email});

        const update = {
            fullname: req.body.fullname,
            phoneNo: req.body.mobileNO,
            Email_id: req.body.myemail,
            DOB: req.body.dob,
            Gender: req.body.gender,
            Education: req.body.degree,
            Faculty_Block: req.body.fb
        }


        await Faculty.updateOne({_id:user[0]._id} , update);
        
        const title = "SUCCESS";
        const message = "Faculty details updated!";
        const icon = "success";
        const href = "/viewfaculty";
        res.render("Admin/alert.ejs", { title, message, icon, href });


    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while updating faculty data");
    }
}

exports.g_coursegrade = async (req, res) => {
    try {
        const last_sem = await Course_Allotment.find().sort({ Date_created: -1 }).limit(1);
        const semester_name = last_sem.Semester_name;

        // const f_name = req.Faculty.id;

        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id :email});
        const f_name = user.fullname;

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

        res.render("Faculty/coursegrade.ejs", { coursesTaught, semester_name, user });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching data");
    }
}

exports.p_coursegrade = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.body.mycheckbox });
        res.render("Faculty/addgrade.ejs", { course });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding grade data");
    }
}

exports.p_addgrade = (upload.single('excelfile'), async (req, res) => {
    try {
        const filepath = req.file.path;
        const grade = await processExcelFile(filepath);

        await Grade.insertMany(grade);

        req.session.grade = grade;

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding grade data");
    }
})

async function processExcelFile(filepath) {
    const workbook = new Excel.workbook();
    await workbook.xlsx.readfile(filepath);

    const workshhet = workbook.getWorksheet(1);
    const grade_data = [];
    // const obj = req.body._id;

    // const course_name = obj.course_name;             // Optional
    // const course_code = obj.course_code;

    workshhet.eachRow(async (row, rownumber) => {

        if (rownumber > 1) {
            const student_id = row.getCell(1).value;
            const marks = row.getCell(2).value;

            const obj = await Student.find({ stud_id: student_id });

            grade_data.push({
                courseEnrolled: course_code,
                stud_id: obj._id,
                grade: marks
            });
        }
    });
    return grade_data;
}

exports.g_courseattendence = async (req, res) => {
    try {
        const last_sem = await Course_Allotment.find().sort({ Date_created: -1 }).limit(1);
        const semester_name = last_sem.Semester_name;

        // const f_name = req.Faculty.id;
        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id :email});

        const f_name = user.fullname;

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

        res.render("Faculty/courseattendence.ejs", { coursesTaught, semester_name, user });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching data");
    }
}

exports.p_courseattendence = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.body.mycheckbox });
        res.render("Faculty/addattendence.ejs", { course });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding attendence data");
    }
}

exports.p_addattendence = (upload.single('excelfile'), async (req, res) => {
    try {
        const filepath = req.file.path;
        const attendance = await processExcelFile(filepath);

        await Attendance.insertMany(grade);

        req.session.attendance = attendance;

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding attendence data");
    }
})

async function processExcelFile(filepath) {
    const workbook = new Excel.workbook();
    await workbook.xlsx.readfile(filepath);

    const workshhet = workbook.getWorksheet(1);
    const attendance_data = [];

    // const course_name = req.body.course_name;             // Optional
    const course_code = req.body.course_code;

    workshhet.eachRow(async (row, rownumber) => {

        if (rownumber > 1) {
            const student_id = row.getCell(1).value;
            const present_days = row.getCell(2).value;
            const total_days = row.getCell(3).value;

            const obj = await Student.find({ stud_id: student_id });

            attendance_data.push({
                courseEnrolled: course_code,
                stud_id: obj._id,
                Present_days: present_days,
                Total_days: total_days
            });
        }
    });
    return attendance_data;
}


exports.g_changepwdfaculty = async (req, res) => {
    try {
        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id :email});
        console.log(user);
        // const faculty = await Faculty.findOne({ _id: req.user });
        res.render("Faculty/changepwdfaculty.ejs", { user });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.p_changepwdfaculty = async (req, res) => {
    try {
        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id :email});
        
        // const ID = req.Faculty.id;           //user here means fsculty or not?
        const { oldpwd, newpwd, confirmpwd } = req.body;
        console.log(newpwd);

        if (newpwd != confirmpwd) {
            const title = "ERROR";
            const message = "New password and confirm password do not match!";
            const icon = "error";
            const href = "/changepwdfaculty";
            res.render("alert.ejs", { title, message, icon, href });

            return res.status(400).send("New password and confirm password do not match!");
        }
        // const user = await Faculty.findById(ID);

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
        res.redirect('/facultylogin');
    } catch (err) {
        next(err);
    }
};


// Student Functionality

exports.g_viewstudent = async (req, res) => {
    try {
        //const ID = req.body.stud_id;     //Student as a schema name?.populate('ProgramRegistered')
        //const student = await Student.findOne(_id = req.user);
        const Student_token = req.cookies.jwtokenstudent;
        const verified_student = jwt.verify(Student_token, "sagar1");
        const email = verified_student.email_id;
        const student = await Student.find({Email_id: email});
        const program = await Program.findById(student[0].ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');

        // const program = await Program.findById(student.ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');
        // console.log("ssssss");
        // console.log(program);
        // console.log("eeeee");
        res.render("Student/student-profile.ejs", {student, program});
        
        //mail code

        // const output = `<p>student profile has viewed</p>
        // <h3>student details</h3>
        // <ul>
        // <li>name:${student.firstname}</li>
        // <li>ID:${student.stud_id}</li>
        // </ul>`;

        // let transporter = nodemailer.createTransport({
        //     service: "gmail",
        //     host: "smtp.gmail.com",
        //     port: 587,
        //     auth:{
        //         user:'ecampus1daiict@gmail.com',
        //         pass:'lyftuuucvamuuoye'
        //     },
        //     tls:{
        //         rejectUnauthorized:false
        //     }
        // });

        // const mailOptions = {
        //     from: 'ecampus1daiict@gmail.com', // Sender's email address
        //     to: '202101234@daiict.ac.in', // Recipient's email address
        //     subject: 'Test Email', // Subject of the email
        //     text: 'This is a test email sent from Node.js using Nodemailer.',
        //     html: output // Email body
        //   };

        //   transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //       console.error('Error:', error);
        //     } else {
        //       console.log('Email sent:', info.response);
        //     }
            
        //     // Close the transporter after sending the email
        //     transporter.close();
        //   });

          }catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
          }
}

exports.g_updatestudent = async (req, res) => {
    try {
        //const ID = req.user;
        const Student_token = req.cookies.jwtokenstudent;
        const verified_student = jwt.verify(Student_token, "sagar1");
        const email = verified_student.email_id;
        const student = await Student.find({Email_id: email});
        console.log("start");
        console.log(student);
        console.log("end");
        const program = await Program.findById(student[0].ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');
        console.log("ssssss");
        console.log(program);
        console.log("eeeee");

        res.render("Student/student-profile.ejs", { student,program});

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

        const ID = req.student.id;
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

exports.g_courseregistration = async (req, res) => {
    try {
        const last_sem = await Course_Allotment.find().sort({ Date_created: -1 }).limit(1);
        const sem_name = last_sem.Semester_name;

        //const ID = res.Student.id;

        const student = await Student.findOne(_id = req.user);
        const p_name = student.ProgramRegistered;
        const batch = student.Batch;

        const coursesTaught = await Course_Allotment.aggregate([
            {
                $match: { Semester_name: sem_name, Program_associate: p_name, Batch: batch } // Match the documents with the specified semester name
            },
            {
                $unwind: "$Courseallocate" // Deconstruct the Courseallocate array
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    Course_upload: "$Courseallocate.Course_upload",
                    Course_type: "$Courseallocate.Course_type"// Include the Course_upload field from Courseallocate
                }
            }
        ]);

        res.render("Student/student-course-registration.ejs", { coursesTaught, sem_name, p_name, batch });
    } catch (err) {
        res.status(500).send("An error occured while registering course");
    }
}

exports.p_courseregistration = async (req, res) => {
    try {
        if (req.body.register.length !== 6) {
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
            studentEnrolled: student,
            semesterEnrolled: semester,
            courseEnrolled: courses
        })

        await newCourseEnrollment.save();
        const title = "SUCCESS";
        const message = "Course Registration completed!";
        const icon = "success";
        const href = "/viewstudent";
        res.render("alert.ejs", { title, message, icon, href });

    } catch (err) {
        res.status(500).send("An error occured while course registration");
    }
}

// See grade

exports.g_viewgrade = async (req, res) => {
    try {
        //const ID = req.user;

        //const student = await Student.findOne(_id = req.user);
        const Student_token = req.cookies.jwtokenstudent;
        const verified_student = jwt.verify(Student_token, "sagar1");
        const email = verified_student.email_id;
        const student = await Student.find({Email_id: email});
        // const program = await Program.findById(student.ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');
        const p_name =await Program.findById(student[0].ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');;
        // const batch = user.Batch;
        console.log("hello");
        console.log(p_name);
        console.log("by");
        const sem_enroll = await Course_Enrollment.aggregate([
            {
                $match: {studentenrolled: student[0]._id}     // batch or student????Program_associate: p_name,batch: Batch
            }
            // {
            //     $project: {
            //         _id: 0, // Exclude the _id field from the result
            //         Semester_name: Course_Allotment.find().sort({ Date_created: -1 }).limit(1)
            //     }
            // }
        ])

        console.log("eeee");
        console.log(sem_enroll);
        console.log("eeee");
        res.render("Student/result.ejs", {student, sem_enroll});
    } catch (err) {
        res.status(500).send("An error occured while fetching semester data");
    }
}


exports.g_viewattendence = async (req, res) => {
    try {
        //const ID = req.Student.id;

        const student = await Student.findOne(_id = req.user);
        const p_name = student.ProgramRegistered;
        const batch = student.Batch;

        const sem_enroll = await Course_Allotment.aggregate([
            {
                $match: { Program_associate: p_name, Batch: batch }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    Semester_name: "Semester_name"
                }
            }
        ])
        res.render("Student/student-attendance.ejs", { sem_enroll });
    } catch (err) {
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

exports.g_student_announcement = async (req, res) => {
    try {
        const student = await Student.findOne(_id = req.user);
        const announcements = await Announcement.find({}).exec();

        const Curr_date = new Date();

        const valid_announcement = [];

        for (const announcement of announcements) {
            if (announcement.Due_Date > Curr_date) {
                valid_announcement.push(announcement);
            }
            else {
                await Announcement.deleteOne({ _id: announcement._id });
            }
        }
        console.log("eeeee");
        console.log(valid_announcement);
        console.log("eeeee");
        res.render("Student/student-announcement.ejs", {student, valid_announcement });
    } catch (err) {
        res.status(500).send("An error occured while fetching announcement data");
    }
}

// Change Pwd Student
exports.g_changepwdstudent = async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user });
        res.render("Student/changepwdstudent.ejs", { student });
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
        const href = "/viewstudent";
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