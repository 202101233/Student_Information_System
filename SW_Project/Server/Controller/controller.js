var { Student, Admin, Faculty, Degree, Branch, Course, Program, Transcript, Announcement,
    Course_Allotment, Attendance, Grade, Course_Enrollment, Result } = require('../Model/model');
const { proppatch, use } = require('../Routes/router');

const path = require("path");
const bcrypt = require("bcryptjs");
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
        if (file) {
            callback(null, './Assets/uploads/');
        }
    },

    // destination:"./asserts/uploads/",

    //add back to extension
    filename: function (request, file, callback) {
        if (file) {
            callback(null, Date.now() + file.originalname);
        }
        else {
            callback(null, "NA");
        }
    },
});

const upload = multer({
    storage: Storage,
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
            const result = await bcrypt.compare(req.body.f_password, user.Password);
            //const result = await req.body.f_password === user.Password;
            
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
            const loggedstudent = await bcrypt.compare(req.body.s_password, user.Password);
            console.log(req.body.s_password);
            console.log(user.Password);
            // const loggedstudent = req.body.s_password === user.Password;
            console.log("tttrrr");
            console.log(loggedstudent);
            if (loggedstudent) {
                const secret = "sagar1";
                const token = await jwt.sign({ "name": user.firstname, "email_id": user.Email_id }, secret);
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
        const user = await Faculty.find({ Email_id: email })

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
        const student = await Student.find({ Email_id: email });
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
                auth: {
                    user: '202101234@daiict.ac.in',
                    pass: 'jhluwxctbddwqruz'
                },
                tls: {
                    rejectUnauthorized: false
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
        const degree = await Degree.find({}).exec();
        const branch = await Branch.find({}).exec();

        res.render("Admin/addsemester.ejs", { degree, branch });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching program data .....");
    }
}

async function processExcelJSFile(filepath, req) {
    const workbook = new ExcelJS.Workbook();     //??workbook or Workbook??
    await workbook.xlsx.readFile(filepath);

    const workshhet = workbook.getWorksheet(1);
    const course_data = [];
    // console.log(req.body);
    // console.log("continueee");

    workshhet.eachRow(async (row, rownumber) => {

        if (rownumber > 1) {
            const course_code = row.getCell(1).value;
            const course_type = row.getCell(2).value;
            const faculty_assign = row.getCell(3).value;

            // const obj1 = await Course.findOne({ Course_code: course_id });
            // const obj2 = await Faculty.findOne({ fullname: faculty_assign });
            // console.log(obj1);
            // console.log(obj2);
            course_data.push({
                // Program_associate: existingProgram._id,
                // Batch: batch,
                // Date_created: new Date(),
                // Courseallocate: {
                Course_code: course_code,
                Course_type: course_type,
                Faculty_assigned: faculty_assign,
                // },
                // Semester_name: Semester_n,
            });
        }
    });

    return course_data;
}

exports.p_addsemester = async (req, res) => {
    try {
        console.log(req.body);
        console.log("continueeee");
        console.log(req.file)
        // console.log("complete");
        const filepath = req.file.path;
        const course = await processExcelJSFile(filepath, req);
        // // console.log("continueeee");

        const degree = req.body.degree;
        const branch = req.body.branch;
        const batch = req.body.batch;
        const Semester_n = req.body.name;

        const existingProgram = await Program.findOne({
            DegreeOffered: degree,
            BranchOffered: branch,
        });

        if (!existingProgram) {
            // Handle the case when the Program does not exist
            console.error('Program not found based on degree and branch names.');
            return course; // or throw an error, depending on your use case
        }

        console.log(course);
        const semester = {
            Program_associate: existingProgram._id,
            Batch: batch,
            Date_created: new Date(),
            Semester_name: Semester_n,
            Courseallocate: course
        }
        console.log(semester);
        await Course_Allotment.insertMany(semester);

        // req.session.semester = semester;
        const title = "SUCCESS";
        const message = "New semester added Successfully!";
        const icon = "success";
        const href = "/adminhome";
        res.render("Admin/alert.ejs", { title, message, icon, href });

        //res.send(semester);

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
            res.render("Admin/alert.ejs", { title, message, icon, href });

            return res.status(400).send("New password and confirm password do not match!");
        }
        const user = await Admin.findOne({ Email_id: email });
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
            res.render("Admin/alert.ejs", { title, message, icon, href });

            return res.status(401).send("Old password is incorrect!");
        }

        const hashedpwd = await bcrypt.hash(newpwd, saltRounds);
        user.Password = hashedpwd;
        await user.save();

        const title = "SUCCESS";
        const message = "Password changed successfully!";
        const icon = "success";
        const href = "/adminhome";
        res.render("Admin/alert.ejs", { title, message, icon, href });


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
        const user = await Faculty.find({ Email_id: email })

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
        const user = await Faculty.find({ Email_id: email });

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
        const last_sem = await Course_Allotment.find().sort({ Date_created: -1 });
        // console.log(last_sem[0]);
        const semester_name = last_sem[0].Semester_name;
        // console.log(semester_name);

        // const f_name = req.Faculty.id;
        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id: email });

        const f_name = user[0].fullname;
        console.log(user)

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
                    Course_code: "$Courseallocate.Course_code" // Include the Course_upload field from Courseallocate
                }
            }
        ]);
        // console.log(coursesTaught);
        const courses=[];
        for(var i=0; i<coursesTaught.length;i++)
        {
            const x= coursesTaught[i].Course_code;
            const obj= await Course.findOne({Course_code: x});
            courses.push(obj);
        }
        console.log(courses);
        // res.send(correct);

        res.render("Faculty/coursegrade.ejs", { courses, semester_name, user });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching data");
    }
}



exports.p_coursegrade = async (req, res) => {
    try {
        console.log("AAAAAAAAAAAAAAA00");
        const filepath = req.file.path;
        // console.log("BBBBBBBBBBBBBBBBBBBBBB");
        const grade = await processExcelJSFile(filepath,req);
        console.log(grade);
        //await Grade.insertMany(grade);

        const course = req.body.course;

        console.log("helloo");
        const coursegrade = {
            G_courseEnrolled: course,
            Grade_data: grade,
            
        }
        console.log(coursegrade);
        // console.log("helo complete");
        //await Grade.insertMany(coursegrade);

        // req.session.semester = semester;
        const title = "SUCCESS";
        const message = "Grade uploaded successfully!";
        const icon = "success";
        const href = "/facultyhome";
        res.render("Admin/alert.ejs", { title, message, icon, href });
        //req.session.grade = grade;

        //res.render("Faculty/coursegrade.ejs", { courses, semester_name, user });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding grade data");
    }
}

// exports.p_addgrade = (upload.single('excelfile'), async (req, res) => {
//     try {
//         const filepath = req.file.path;
//         const grade = await processExcelJSFile(filepath, req);
//         console.log(grade);
//         //await Grade.insertMany(grade);

//         //req.session.grade = grade;

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("An error occured while adding grade data");
//     }
// })


exports.g_courseattendence = async (req, res) => {
    try {
        const last_sem = await Course_Allotment.find().sort({ Date_created: -1 });
        // console.log(last_sem[0]);
        const semester_name = last_sem[0].Semester_name;
        // console.log(semester_name);

        // const f_name = req.Faculty.id;
        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id: email });

        const f_name = user[0].fullname;
        console.log(user)

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
                    Course_code: "$Courseallocate.Course_code" // Include the Course_upload field from Courseallocate
                }
            }
        ]);
        // console.log(coursesTaught);
        const courses=[];
        for(var i=0; i<coursesTaught.length;i++)
        {
            const x= coursesTaught[i].Course_code;
            const obj= await Course.findOne({Course_code: x});
            courses.push(obj);
        }
        console.log(courses);
        // res.send(correct);

        res.render("Faculty/courseattendence.ejs", { courses, semester_name, user });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching data");
    }
}



exports.p_courseattendence =  async (req, res) => {
    try {
        // console.log(req.body);
        console.log("continueeee");
        // console.log(req.file);
        // console.log("complete");
        const filepath = req.file.path;
        const attendence = await processExcelJSFile(filepath, req);
        console.log(attendence);

        const course = req.body.course;
       
 
        console.log("helloo");
        const courseattendence = {
            A_courseEnrolled: course,
            Attendance_data: attendence,
            
        }
        console.log(courseattendence);
        // console.log("helo complete");
        await Attendance.insertMany(courseattendence);

        // req.session.semester = semester;
        const title = "SUCCESS";
        const message = "New semester added Successfully!";
        const icon = "success";
        const href = "/facultyhome";
        res.render("Admin/alert.ejs", { title, message, icon, href });

        //res.send(semester);

    } catch (err) {
        console.log(err);
        console.error("Error occured while proccesing and uploading semester data");
        res.status(500).send("Error occured while proccesing and uploading semester data");
    }
    
}

async function processExcelJSFile(filepath) {           //for attendence
    const workbook = new ExcelJS.Workbook();     //??workbook or Workbook??
    await workbook.xlsx.readFile(filepath);

    const workshhet = workbook.getWorksheet(1);
    const attendence_data = [];
    // console.log(req.body);
    // console.log("continueee");

    workshhet.eachRow(async (row, rownumber) => {

        if (rownumber > 1) {
            const stu_id = row.getCell(1).value;
            const present_d = row.getCell(2).value;
            const total_d = row.getCell(3).value;

            
            attendence_data.push({
                
                Student_enrolled: stu_id,
                Present_days: present_d,
                Total_days: total_d,
                
            });
            // console.log(Student_enrolled);

        }
    });

    return attendence_data;
    
}


exports.g_changepwdfaculty = async (req, res) => {
    try {
        const stored_token = req.cookies.f_jwtoken;
        const verify_one = jwt.verify(stored_token, "sagar");
        const email = verify_one.email_id;
        const user = await Faculty.find({ Email_id: email });
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
            const href = "/changepwdfaculty";
            res.render("Admin/alert.ejs", { title, message, icon, href });

            return res.status(400).send("New password and confirm password do not match!");
        }
        const user = await Faculty.findOne({ Email_id: email });
        console.log(user);
        // console.log(oldpwd);
        // console.log(user.Password);

        const pwdinvalid = await bcrypt.compare(oldpwd, user.Password);
        console.log("PWD");
        if (pwdinvalid) {
            const title = "ERROR";
            const message = "Old Passward is incorrect!";
            const icon = "error";
            const href = "/changepwdfaculty";
            res.render("Admin/alert.ejs", { title, message, icon, href });

            return res.status(401).send("Old password is incorrect!");
        }

        const hashedpwd = await bcrypt.hash(newpwd, saltRounds);
        
        user.Password = hashedpwd;
        await user.save();

        const title = "SUCCESS";
        const message = "Password changed successfully!";
        const icon = "success";
        const href = "/facultyhome";
        res.render("Admin/alert.ejs", { title, message, icon, href });


        res.status(200).send("Password changed successfully!");

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
        const student = await Student.find({ Email_id: email });
        const program = await Program.findById(student[0].ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');

        // const program = await Program.findById(student.ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');
        // console.log("ssssss");
        // console.log(program);
        // console.log("eeeee");
        res.render("Student/student-profile.ejs", { student, program });

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

    } catch (err) {
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
        const student = await Student.find({ Email_id: email });
        console.log("start");
        console.log(student);
        console.log("end");
        const program = await Program.findById(student[0].ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');
        console.log("ssssss");
        console.log(program);
        console.log("eeeee");

        res.render("Student/student-profile.ejs", { student, program });

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
        const last_sem = await Course_Allotment.find().sort({ Date_created: -1 });
        const sem_name = last_sem[0].Semester_name;

        //const ID = res.Student.id;
        const stored_token = req.cookies.jwtokenstudent;
        const verify_one = jwt.verify(stored_token, "sagar1");
        const email = verify_one.email_id;
        const user = await Student.find({ Email_id: email });
        // console.log(user[0]);
 
       
        const p_name = user[0].ProgramRegistered;
        const batch = user[0].Batch;
        // console.log(p_name);
        // console.log(batch);

        const coursesTaught = await Course_Allotment.aggregate([
            {
                $match: { Semester_name: sem_name, Program_associate: p_name._id, Batch: batch } // Match the documents with the specified semester name
            },
            {
                $unwind: "$Courseallocate" // Deconstruct the Courseallocate array
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    Course_code: "$Courseallocate.Course_code",
                    Course_type: "$Courseallocate.Course_type"// Include the Course_upload field from Courseallocate
                }
            }
        ]);
        const courses=[];
        for(var i=0; i<coursesTaught.length;i++)
        {
            const x= coursesTaught[i].Course_code;
            const obj= await Course.findOne({Course_code: x});
            courses.push(obj);
        }
        // console.log(courses);
        // console.log(coursesTaught);

        res.render("Student/student-course-registration.ejs", { courses, sem_name, p_name, batch, coursesTaught  });
    } catch (err) {
        res.status(500).send("An error occured while registering course");
    }
}

exports.p_courseregistration = async (req, res) => {
    try {
        
        // console.log(req.body);
        
        if (req.body.register.length !== 5) {
            const title = "ERROR";
            const message = "Please select only 5 courses!";
            const icon = "error";
            const href = "/courseregistration";
            res.render("Admin/alert.ejs", { title, message, icon, href });
        }
       else{
        const stored_token = req.cookies.jwtokenstudent;
        const verify_one = jwt.verify(stored_token, "sagar1");
        const email = verify_one.email_id;
        const user = await Student.find({ Email_id: email });
       
        // console.log(user[0]);

        const last_sem = await Course_Allotment.find().sort({ Date_created: -1 });
        const sem_name = last_sem[0].Semester_name;

        // const semester = await Course_Allotment.findById(req.body.sem);

        const courses = req.body.register;
        // console.log(courses);

        const newCourseEnrollment = new Course_Enrollment({
            studentEnrolled: user[0]._id,
            semesterEnrolled: sem_name,
            courseEnrolled: courses
        })
        // console.log(newCourseEnrollment);
       
        await newCourseEnrollment.save();
        
        const title = "SUCCESS";
        const message = "Course Registration completed!";
        const icon = "success";
        const href = "/viewstudent";
        res.render("Admin/alert.ejs", { title, message, icon, href });
    }
    } catch (err) {
        console.error(err);
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
        const student = await Student.find({ Email_id: email });
        const program = await Program.findById(student.ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');
        const p_name = await Program.findById(student[0].ProgramRegistered).populate('DegreeOffered BranchOffered CourseOffered');;
        // const batch = user.Batch;
        console.log("hello");
        console.log(p_name);
        console.log("by");
        const sem_enroll = await Course_Enrollment.aggregate([
            {
                $match: { studentenrolled: student[0]._id }     // batch or student????Program_associate: p_name,batch: Batch
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
        res.render("Student/result.ejs", { student, sem_enroll, program });
    } catch (err) {
        res.status(500).send("An error occured while fetching semester data");
    }
}


exports.g_viewattendence = async (req, res) => {
    try {
        //const ID = req.Student.id;

        const Student_token = req.cookies.jwtokenstudent;
        const verified_student = jwt.verify(Student_token, "sagar1");
        const email = verified_student.email_id;
        const student = await Student.find({ Email_id: email });

        const p_name = student.ProgramRegistered;
        const batch = student.Batch;

        const last_sem = await Course_Allotment.find().sort({ Date_created: -1 });
        const sem_name = last_sem[0].Semester_name;
        //console.log(student[0]);
        console.log(student[0].stud_id);
        // console.log(sem_name);

        const courses = await Course_Enrollment.findOne({Student_enrolled : student._id, semesterEnrolled : sem_name});
        if(!courses)
        {
            const title = "ERROR";
            const message = "Student has not registered yet!";
            const icon = "error";
            const href = "/studenthome";
            res.render("Admin/alert.ejs", { title, message, icon, href });

            return res.status(400).send("Student has not registered yet!");
        }
        //console.log(courses);

        const enrolledcourse = courses.courseEnrolled;
        console.log(enrolledcourse);
        //console.log(student.Email_id);
        const data = await Attendance.aggregate([
            {
                $unwind :  "$Attendance_data"
            },
            {
                $match :{ "Attendance_data.Student_enrolled" : student[0].stud_id,}
            },
            {
                $lookup: {
                    from: 'enrolledcourse', // Replace 'courses' with the appropriate collection name for Course model
                    localField: 'A_courseEnrolled',
                    foreignField: '_id',
                    as: 'courseDetails'
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    P_days : '$Attendance_data.Present_days',
                    T_days : '$Attendance_data.Total_days' // Include the Course_upload field from Courseallocate
                }
            }
        ])
        console.log("Hello");
        console.log(data);
        
        // for(let i=0;i<enrolledcourse.length; i++)
        // {
        //     const courseID = enrolledcourse[i];
        //     //console.log(courseID);

        //     const data = await Attendance.find({
        //         A_courseEnrolled : enrolledcourse,
        //         'Attendance_data' : {
        //             $elemMatch : {
        //                 'Student_enrolled' : student[0].stud_id
        //             }
        //         }
        //     }).exec();
        // }
        // //console.log(data);
        const Courses = [];
        for(let i=0;i<enrolledcourse.length;i++)
        {
            const x = enrolledcourse[i];
            const obj = await Course.findById(x);
            Courses.push(obj);
        }
        
        res.render("Student/student-attendance.ejs", { sem_name , data, student, Courses });
    } catch (err) {
        console.error(err);
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
        res.render("Student/student-announcement.ejs", { student, valid_announcement });
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
        const stored_token = req.cookies.jwtokenstudent;
        console.log(stored_token);
        const verify_one = jwt.verify(stored_token, "sagar1");
        console.log(verify_one);
        const email = verify_one.email_id;

        const { oldpwd, newpwd, confirmpwd } = req.body;
        console.log(req.body);

        if (newpwd != confirmpwd)                   //new password  check strong
        {
            const title = "ERROR";
            const message = "New password and confirm password do not match!";
            const icon = "error";
            const href = "/changepwdstudent";
            res.render("Admin/alert.ejs", { title, message, icon, href });

            return res.status(400).send("New password and confirm password do not match!");
        }
        const user = await Student.findOne({ Email_id: email });
        console.log(user);

        const pwdinvalid = await bcrypt.compare(oldpwd, user.Password);

        if (pwdinvalid) {
            const title = "ERROR";
            const message = "Old Passward is incorrect!";
            const icon = "error";
            const href = "/changepwdstudent";
            res.render("Admin/alert.ejs", { title, message, icon, href });

            return res.status(401).send("Old password is incorrect!");
        }

        const hashedpwd = await bcrypt.hash(newpwd, saltRounds);
        user.Password = hashedpwd;
        await user.save();

        const title = "SUCCESS";
        const message = "Password changed successfully!";
        const icon = "success";
        const href = "/studenthome";
        res.render("Admin/alert.ejs", { title, message, icon, href });
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