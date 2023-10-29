const mongoose = require('mongoose');


var StudentSchema = new mongoose.Schema({
    firstname : String,
    middlename : String,
    lastname : String,
    stud_id : String,
    phoneNo : String,
    Gender : String,
    DOB : Date,
    Email_id : String,
    Address : String,
    Parent_Email_Id : String,
    Passward : String,
    Batch : String,
    Blood_Group : String,
    Profile_image : Buffer,
    ProgramRegistered : { type : mongoose.Schema.Types.ObjectId, ref: "Program"},
    Fee_Paid : Boolean          //paid : 1 and unpaid : 0
})

var FacultySchema = new mongoose.Schema({
    fullname : String,
    //Faculty_id : String,
    phoneNo : String,
    Gender : String,
    Email_id : String,
    Address : String,
    Passward : String,
    Faculty_block : String,
    Profile_image : Buffer,
    //JoiningDate : Date   
})

var AdminSchema = new mongoose.Schema({
    Email_id : String,
    Passward : String
})

var DegreeSchema = new mongoose.Schema({
    Degree_name : String
})

var BranchSchema = new mongoose.Schema({
    Branch_name: String,
})

var CourseSchema = new mongoose.Schema({
    Course_Name : String,
    Course_code : Number,
    Course_credit : Number,
    Course_Type : Boolean           // Core : 1 and Elective : 0
})

var ProgramSchema = new mongoose.Schema({
    DegreeOffered : { type : mongoose.Schema.Types.ObjectId, ref: "Degree"},
    BranchOffered : { type : mongoose.Schema.Types.ObjectId, ref: "Branch"},
    CourseOffered : [{ type : mongoose.Schema.Types.ObjectId, ref: "Course"}],
})

var SemesterSchema = new mongoose.Schema({
    Sem_name : String,
    DateCreated: Date,
    Sem_Type : Boolean,               // Autumn : 1 and Winter : 0
    ProgramOffered : [{ type : mongoose.Schema.Types,ObjectId, ref: "Program"}]
})

// var fee_structureSchema = new mongoose.Schema({
//     program_fee : { type : mongoose.Schema.Types.ObjectId, ref : "Program"},
//     Fee_structure : Map,
// })

// var fee_historySchema = new mongoose.Schema({
//     SrudentEnroll : { type : mongoose.Schema.Types.ObjectId, ref : "Student"},
//     SemesterFee : { type : mongoose.Schema.Types.ObjectId, ref : "Semester"},
//     Feestatus : Boolean,
//     Date_Of_payment : Date
// })

var AnnouncementSchema = new mongoose.Schema({
    Title : String,
    Description : String,
    Created_Date : Date
})

var TranscriptSchema = new mongoose.Schema({
    Student_detials : {type : mongoose.Schema.type.ObjectID, ref : "Student"},
    Courses : [CourseSchema],
    Totalcredit : Number,
    CPI : Number,
})

var Course_AllotmentSchema = new mongoose.Schema({
    ProgramAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
    CourseAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    FacultyAssigned: { type: mongoose.Schema.Types.ObjectId,ref: "Faculty"},
    SemesterAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  });

var Course_EnrollmentSchema = new mongoose.Schema({
    courseEnrolled: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    studentEnrolled: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    semesterEnrolled: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
    grade: Number,
    attendance: { type: Number, min: 0, max: 100 },
    dateEnrolled: Date,
  });

var ResultSchema = new mongoose.Schema({
    Student : { type : mongoose.Schema.type.ObjectID, ref : "Student"},
    Semester : String,
})


const Student = mongoose.model("Student", StudentSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Faculty = mongoose.model("Faculty", FacultySchema);
const Degree = mongoose.model("Degree", DegreeSchema);
const Branch = mongoose.model("Branch", BranchSchema);
const Course = mongoose.model("Course", CourseSchema);
const Program = mongoose.model("Program", ProgramSchema);
const Semester = mongoose.model("Semester", SemesterSchema);
// const fee_structure = mongoose.model("fee_structure", fee_structureSchema);
// const fee_history = mongoose.model("fee_history", fee_historySchema);
const Transcript = mongoose.model("Transcript", TranscriptSchema);
const Announcement = mongoose.model("Announcement", AnnouncementSchema);
const Course_Allotment = mongoose.model("Course_Allotment", Course_AllotmentSchema);
const Course_Enrollment = mongoose.model("Course_Enrollment", Course_EnrollmentSchema);
const Result = mongoose.model("Result", ResultSchema);


module.exports = {Student,Admin,Faculty,Degree,Branch,Course,Program,Semester,Transcript,Announcement,
    Course_Allotment,Result};
