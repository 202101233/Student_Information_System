const mongoose = require('mongoose');
const express = require("express");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');
const session = require("express-session");


const app = express();

app.use(require("connect-flash")());
const StudentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    middlename: String,
    lastname: {
        type: String,
        required: true,
    },
    stud_id: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNo: String,
    Gender: {
        type: String,
        // enum: ['Male', 'Female', 'Other'],
    },
    DOB: Date,
    Email_id: {
        type: String,
        required: true,
        unique: true,
        // match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    },
    Address: String,
    Parent_Email_Id: {
        type: String,
        // match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    },
    Password: {
        type: String,
        required: true,
        // unique: true,
    },
    Batch: {
        type: String,
        required: true,
    },
    Blood_Group: {
        type: String,
        // enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    },
    Profile_image: Buffer,
    ProgramRegistered: {
        type: mongoose.Schema.Types.ObjectId, ref: "Program",
    },
    Fee_Paid: {
        type: Boolean,
        default: false,
    },
});



const FacultySchema = new mongoose.Schema({
   
    fullname: {
        type: String,
        required: true,
    },
    phoneNo: String,
    DOB: Date,
    Gender: {
        type: String,
        // enum: ['Male', 'Female', 'Other'],
    },
    Email_id: {
        type: String,
        required: true,
        unique: true,
        // match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    },
    
    Education: {
        type: String,
        required: true
    },

    Password: {
        type: String,
        required: true,
        unique: true,
    },
    
    Faculty_block: {
        type: String,
        required: true,
    },
    Profile_image: Buffer,
});



const AdminSchema = new mongoose.Schema({
    admin_name : {
        type : String,
        required : true,
    },
    Email_id: {
        type: String,
        required: true,
        unique: true,
        // match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    },
    Password: {
        type: String,
        required: true,
        // unique: true,
    },
});

const DegreeSchema = new mongoose.Schema({
    Degree_name: {
        type: String,
        required: true,
    },
});

const BranchSchema = new mongoose.Schema({
    Branch_name: {
        type: String,
        required: true,
    },
});

const CourseSchema = new mongoose.Schema({
    Course_Name: {
        type: String,
        required: true,
    },
    Course_code: {
        type: Number,
        required: true,
        unique: true,
    },
    Course_credit: {
        type: Number,
        required: true,
    }
});


const ProgramSchema = new mongoose.Schema({
    DegreeOffered: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Degree",
        required: true,
    },
    BranchOffered: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    CourseOffered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    }],
});


// const SemesterSchema = new mongoose.Schema({
//     Sem_name: {
//         type: String,
//         required: true,
//     },
//     DateCreated: Date,
//     Sem_Type: {
//         type: Boolean,
//         required: true,
//     },
//     ProgramOffered: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Program",
//         required: true,
//     }],
// });


var fee_structureSchema = new mongoose.Schema({
    program_fee : { type : mongoose.Schema.Types.ObjectId, ref : "Program"},
    Fee_structure : Map,
})

// var fee_historySchema = new mongoose.Schema({
//     SrudentEnroll : { type : mongoose.Schema.Types.ObjectId, ref : "Student"},
//     SemesterFee : { type : mongoose.Schema.Types.ObjectId, ref : "Semester"},
//     Feestatus : Boolean,
//     Date_Of_payment : Date
// })


const AnnouncementSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,

    },
    Description: {
        type: String,
        required: true,
    },
    Due_Date: {
        type: Date,
        required: true,
    },
});


const TranscriptSchema = new mongoose.Schema({
    Student_details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true, // Add this if it's required
    },
    Courses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true, // Add this if it's required
        },
        grade: String, // You can specify the data type for grades
    }],
    Totalcredit: Number,
    CPI: Number,
});



const Course_AllotmentSchema = new mongoose.Schema({
    Program_associate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
        required: true,
    },
    // CourseAssigned: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Course",
    //     required: true,
    // },
    // FacultyAssigned: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Faculty",
    //     required: true,
    // },
    // SemesterAssigned: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Semester",
    //     required: true,
    // },
    Semester_name : {
        type : String,
        required : true
    },
    Date_created : {
        type : Date,
        required : true
    },

    Batch : {
        type : String,
        required : true
    },

    Courseallocate : [{
        Course_upload: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        Course_type : {
            type : Boolean,
            required : true
        },
        Faculty_assigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: true,
        },
    }]
});


const AttendanceSchema = new mongoose.Schema({
    A_courseEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    Attendance_data : [{
        Student_enrolled: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        Present_days : {
            type : Number,
            required : true
        },
        Total_days : {
            type : Number,
            required : true
        }
    }]
});

const GradeSchema = new mongoose.Schema({
    G_courseEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    Grade_data : [{
        Student_enrolled: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        Grade : {
            type : Number,
            required : true
        }
    }]
});


const Course_EnrollmentSchema = new mongoose.Schema({
    
    studentEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    semesterEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseAllotment",
        required: true,
    },

    courseEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    }],

    // grade: Number,
    // attendance: {
    //     type: Number,
    //     // min: 0,
    //     // max: 100,
    // },
    // dateEnrolled: Date,
});

const ResultSchema = new mongoose.Schema({
    Student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    Semester: String, // You might want to add validation for the format here
});

StudentSchema.plugin(passportLocalMongoose);
AdminSchema.plugin(passportLocalMongoose);
FacultySchema.plugin(passportLocalMongoose);

const Student = mongoose.model("Student", StudentSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Faculty = mongoose.model("Faculty", FacultySchema);
const Degree = mongoose.model("Degree", DegreeSchema);
const Branch = mongoose.model("Branch", BranchSchema);
const Course = mongoose.model("Course", CourseSchema);
const Program = mongoose.model("Program", ProgramSchema);
// const Semester = mongoose.model("Semester", SemesterSchema);
// const fee_structure = mongoose.model("fee_structure", fee_structureSchema);
// const fee_history = mongoose.model("fee_history", fee_historySchema);
const Transcript = mongoose.model("Transcript", TranscriptSchema);
const Announcement = mongoose.model("Announcement", AnnouncementSchema);
const Course_Allotment = mongoose.model("Course_Allotment", Course_AllotmentSchema);
const Attendance = mongoose.model("Attendance", AttendanceSchema);
const Grade = mongoose.model("Grade", GradeSchema);
const Course_Enrollment = mongoose.model("Course_Enrollment", Course_EnrollmentSchema);
const Result = mongoose.model("Result", ResultSchema);


// Set up Passport configuration
passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

passport.use(new LocalStrategy(Faculty.authenticate()));
passport.serializeUser(Faculty.serializeUser());
passport.deserializeUser(Faculty.deserializeUser());

app.use(
	session({
	  name: "user-session", // Set a unique name for sessions
	  secret: "your-secret-key",
	  resave: false,
	  saveUninitialized: false,
	  // You can also specify additional session options here
	})
  );


  app.use(require("connect-flash")());

app.use(passport.initialize());
app.use(passport.session());


module.exports = {Student,Admin,Faculty,Degree,Branch,Course,Program,Transcript,Announcement,
    Course_Allotment,Attendance,Grade,Course_Enrollment,Result};
