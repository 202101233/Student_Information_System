var { Student, Admin, Faculty, Degree, Branch, Course, Program, Semester, Transcript, Announcement,
    Course_Allotment, Course_Enrollment, Result } = require('../Model/model');


exports.homepage = (req, res) => {
    res.render("index.ejs");
}

exports.g_adminlogin = (req, res) => {
    res.render("adminlogin.ejs");
}

exports.g_facultylogin = (req, res) => {
    res.render("facultylogin.ejs");
}

exports.g_studentlogin = (req, res) => {
    res.render("studentlogin.ejs");
}

exports.p_adminlogin = async (req, res) => {         //passport??????
    try {
        // check if the user exists
        const user = await Admin.findOne({ a_emailid: req.body.a_email });
        if (user) {
            //check if password matches
            const result = req.body.password === user.Password;
            if (result) {
                res.render("adminhome.ejs");
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

exports.p_facultylogin = async (req, res) => {
    try {
        // check if the user exists
        const user = await Faculty.findOne({ f_emailid: req.body.f_email });
        if (user) {
            //check if password matches
            const result = req.body.password === user.Password;
            if (result) {
                res.render("facultyhome.ejs");
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
        const user = await Student.findOne({ s_emailid: req.body.s_email });
        if (user) {
            //check if password matches
            const result = req.body.password === user.Password;
            if (result) {
                res.render("studenthome.ejs");
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
        const admin = await Admin.findOne({ _id: req.user });
        res.render("adminhome.ejs", { admin });
    } catch (err) {
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client or logging it.
    }
});

exports.g_facultyhome = (isLoggedInfaculty, async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ _id: req.user });
        res.render("facultyhome.ejs", { faculty });
    } catch (err) {
        console.error(err);
        // Handle the error appropriately, such as sending an error response to the client or logging it.
    }
})

exports.g_studenthome = (isLoggedInstudent, async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user });
        res.render("studenthome.ejs", { student });
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
        const newstudent = new Student({
            firstname: req.body.name.split(" ")[0],
            middlename: req.body.name.split(" ")[1],
            lastname: req.body.name.split(" ")[2],
            Email_id: req.body.email,

        })

        await newstudent.save();
        res.redirect("adminhome");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding course data");
    }
})

// Admin Course Management

exports.g_viewcourse = async (req, res) => {
    try {
        const courses = await Course.find({}).exec();
        res.render("viewcourse.ejs", { course: courses });
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

        res.render("viewprogram.ejs", { program: programs });
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

        res.redirect("viewprogram");

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
        res.render("addprogram.ejs", { degrees, branch, courses });

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

// exports.g_viewsemester = async (req,res) => {
//     try{
//         res.render("semesterdetails.ejs");
//     } catch(err){
//         res.status(500).send("Internal Server Error");
//     }
// }



// Admin Fee Management

//admin announcement

exports.g_admin_announcement = async (req, res) => {
    try {
        const announcement = await Announcement.find({}).exec();
        res.render("admin-announcement.ejs", { announcement });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

exports.p_add_announcement = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;

        const newannouncement = {
            Title: title,
            Description: description,
            expireAt: new Date(due_date),

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
        const ID = req.student.id;           //user here means student or not?
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
