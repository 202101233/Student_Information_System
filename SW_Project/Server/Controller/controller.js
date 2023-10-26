var {Student,Admin,Faculty,Degree,Branch,Course,Program,Semester,fee_structure,fee_history,
    Transcript,Announcement,Course_Allotment,Result}= require('../Model/model');


exports.Homepage = (req,res) => {
    res.render("index.ejs");
}

exports.g_adminlogin = (req,res) => {
    res.render("adminlogin.ejs");
}

exports.g_facultylogin = (req,res) => {
    res.render("facultylogin.ejs");
}

exports.g_studentlogin = (req,res) => {
    res.render("studentlogin.ejs");
}

exports.p_adminlogin = async (req,res) => {
    try {   
		// check if the user exists
		const user = await Admin.findOne({ username: req.body.username });
		if (user) {
			//check if password matches
			const result = req.body.password === user.password;
			if (result) {
				res.render("adminhome");
			} else {
				res.status(400).json({ error: "password doesn't match" });
			}
		} else {
			res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
}

exports.p_facultylogin = async (req,res) => {
    try {   
		// check if the user exists
		const user = await Faculty.findOne({ username: req.body.username });
		if (user) {
			//check if password matches
			const result = req.body.password === user.password;
			if (result) {
				res.render("facultyhome");
			} else {
				res.status(400).json({ error: "password doesn't match" });
			}
		} else {
			res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
}

exports.p_studentlogin = async (req,res) => {
    try {   
		// check if the user exists
		const user = await Student.findOne({ username: req.body.username });
		if (user) {
			//check if password matches
			const result = req.body.password === user.password;
			if (result) {
				res.render("studenthome");
			} else {
				res.status(400).json({ error: "password doesn't match" });
			}
		} else {
			res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
}

exports.g_adminhome = (isLoggedInadmin, (req,res) => {
    res.render("adminhome.ejs");
})

exports.g_facultyhome = (isLoggedInfaculty, (req,res) => {
    res.render("facultyhome.ejs");
})

exports.g_studenthome = (isLoggedInstudent, (req,res) => {
    res.render("studenthome.ejs");
})

exports.g_viewcourse = async (req,res) => {
    try{
        const courses = await Course.find({}).exec();
        res.render("viewcourse.ejs", { course : courses});
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while fetching course data");
    }  
}

exports.p_viewcourse = async (req,res) => {
    try {
        if(req.body.edit)
        {
            const course = await Course.findOne({ _id : req.body.edit}).exac();
            res.render("updatecourse.ejs", {course});
        }
        else {
            await Course.deleteOne({ _id : req.body.delete }).exec();
            const course = await Course.find({});
            res.redirect("viewcourse");
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while fetching course data");
    }
}

exports.p_updatecourse = async (req,res) => {
    try {
        const filter = { _id: req.body.edit };
        const update = {
            Course_name: req.body.name,
            Course_credit: req.body.credit,
            Course_code: req.body.code
        };

        await Course.updateOne(filter, update);
        res.redirect("viewcourse");

    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while fetching course data");
    }
}

exports.g_addcourse = (req,res) => {
    res.render("addcourse");
}

exports.p_addcourse = async (req,res) => {
    try {
        const newcourse= new Course({
            Course_name: req.body.name,
            Course_credit: req.body.credit,
            Course_code: req.body.code 
        })

        await newcourse.save();
        res.redirect("viewcourse");
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while adding course data");
    }
}

exports.g_viewdegree = async (req,res) => {
    try{
        const degrees = await Degree.find({}).exec();
        res.render("viewdegree.ejs", { degree : degrees});
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }      
}

exports.p_viewdegree = async (req,res) => {
    try {
        if(req.body.edit)
        {
            const degree = await Degree.findOne({ _id : req.body.edit}).exac();
            res.render("updatedegree.ejs", {degree});
        }
        else {
            await Degree.deleteOne({ _id : req.body.delete }).exec();
            const degree = await Degree.find({});
            res.redirect("viewdegree");
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.p_updatedegree = async (req,res) => {
    try{
        const filter = { _id : req.body.edit};
        const update = {
        Degree_name : req.body.name
        };

        await Degree.updateOne(filter,update);
        res.redirect("viewdegree");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching degree data");
    }
}

exports.g_adddegree = async (req,res) => {
    res.render("viewdegree");
}

exports.p_adddegree = async (req,res) => {
    try{
        const newdegree = new Degree ({
            Degree_name : req.body.name
        });

        await newdegree.save();
        res.redirect("viewdegree");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding degree data");   
    }
}


exports.g_viewbranch = async (req,res) => {
    try{
        const branchs = await Branch.find({}).exec();
        res.render("viewbranch.ejs", { degree : branchs});
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while fetching branch data");
    }      
}

exports.p_viewbranch = async (req,res) => {
    try {
        if(req.body.edit)
        {
            const branchs = await Branch.findOne({ _id : req.body.edit}).exac();
            res.render("updatebranch.ejs", {branchs});
        }
        else {
            await Branch.deleteOne({ _id : req.body.delete }).exec();
            const branch = await Branch.find({});
            res.redirect("viewbranch");
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("An error occured while fetching branch data");
    }
}

exports.p_updatebranch = async (req,res) => {
    try{
        const filter = { _id : req.body.edit};
        const update = {
        Branch_name : req.body.name
        };

        await Branch.updateOne(filter,update);
        res.redirect("viewbrach");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while fetching branch data");
    }
}

exports.g_addbranch = async (req,res) => {
    res.render("viewbranch");
}

exports.p_addbranch = async (req,res) => {
    try{
        const newbranch = new Branch ({
            Branch_name : req.body.name
        });

        await newbranch.save();
        res.redirect("viewbranch");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occured while adding branch data");   
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