let express = require("express");
let mongo = require("mongoose");
let cors=require("cors")
let app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());
let port = 3000;
let localhostip = "127.0.0.1:5500";
mongo.connect("mongodb://127.0.0.1:27017/HomeService").then((data) => {
    if (data.STATES.connected) {
        console.log("connected to database");
    }
    else {
        console.log("db connection failed");
    }
})
let registerScema = new mongo.Schema({
    name: String,
    emailid: String,
    password: String
})
let register = mongo.model("UserData", registerScema)
let serviceschema = new mongo.Schema({
    name: String,
    contact: Number,
    email: String,
    service: String,
    address: String,
    status : String
})
let dbservice = mongo.model("ServiceData", serviceschema);
let contactScema=new mongo.Schema({
    name : String,
    email : String,
    message : String
})
let contactdb=mongo.model("ContactForm",contactScema)
app.get("/", (req, res) => {
    console.log("server is accessed");
    res.write("server start");
    res.end();
})
app.post("/submit", (req, res) => {
    let name = req.body.Name;
    let number = req.body.Contact;
    let email = req.body.Email;
    let service = req.body.Service;
    let address = req.body.Address;
    // console.log(`name = ${name}\nnumber= ${number}\nemail = ${email}\nproperty = ${property}\n property name = ${propertyname}`);
    let newservice = new dbservice({
        name: name,
        contact: number,
        email: email,
        service: service,
        address: address,
        status : "Requested"
    })
    newservice.save().then((data) => {
        console.log(data);
    })
    console.log("form submited");
    res.send(`<script>alert("Request Submited");window.location.href="http://${localhostip}/main.html"</script>`)

})
app.post('/register', (req, res) => {
    let getname = req.body.name;
    let getemailid = req.body.emailid;
    let getpassword = req.body.password;
    let existcheck = register.find({ emailid: getemailid });
    existcheck.then((result) => {
        let length1 = result.length;
        if (length1 == 0) {
            let registered = new register({
                'name': getname,
                'emailid': getemailid,
                'password': getpassword
            });
            registered.save()
                .then(() => {
                    console.log('User Account created successfuly');
                    res.send(`<script>alert('Account Created Successful');window.location.href = 'http://${localhostip}/login.html';</script>`)
                })
                .catch((err) => {
                    console.log("error occurs in data adding to database")
                });
        } else {
            res.send(`<script>alert('Account already exists with this mailid');window.location.href='http://${localhostip}/index.html'</script>`);
        }
    });
})
app.post('/login', (req, res) => {
    let getmailid = req.body.emailid
    let getpassword = req.body.password;
    if (getmailid == "admin" && getpassword == "admin") {
        res.send(`<script>window.location.href="http://${localhostip}/admin.html"</script>`)
    }
    else if (getmailid == "service" && getpassword == "service") {
        res.send(`<script>window.location.href="http://${localhostip}/servise.html"</script>`)
    }
    else {
        register.find({ emailid: getmailid, password: getpassword })
            .then((result) => {
                length1 = result.length;
                let loginedname = "";
                let loginedemailid = "";
                if (length1 == 0) {
                    res.send(`<script>alert('Invalid Email Id or Password');window.location.href='http://${localhostip}/login.html'</script>`)
                }
                else {
                    res.send(`<script>alert('Login Sucessful');window.location.href='http://${localhostip}/main.html'</script>`)
                }
            })
            .catch((err) => {
                console.log("Error Occurs in Login" + err);
                res.send(`<script>alert("Error Occurs in Login");window.location.href="https://${localhostip}/login.html"</script>`)
            })
    }
})

app.get("/admindata",(req,res)=>{
    dbservice.find().then((data)=>{
        res.send(data)
    })
    
})
app.get("/servicedata",(req,res)=>{
    dbservice.find().then((data)=>{
        res.send(data)
    })
})

app.get("/delete",(req,res)=>{
    let name=req.query.name;
    let contact=req.query.contact;
    let service=req.query.service;
    dbservice.deleteOne({name:name,contact:contact,service:service}).then((data)=>{
        if(data.deletedCount>=1){
            res.json({"deleted":true})
        }
        else{
            res.json({"deletd":false})
        }
    })
})

app.get("/statuschange",(req,res)=>{
    let name=req.query.name;
    let contact=req.query.contact;
    let service=req.query.service;
    let status=req.query.status
    console.log(`Delete ${name} ${service}`)
    dbservice.updateOne({name:name,contact:contact,service:service},{status:status}).then((data)=>{
        console.log(data)
        if(data.modifiedCount>=1){
            res.json({"modified":true})
        }
        else{
            res.json({"modified":false})
        }
    })
})

app.get("/contactdata",(req,res)=>{
    contactdb.find({}).then((data)=>{
        console.log("Conatact datas acessed");
        res.json(data);
    })
})
app.post("/contact",(req,res)=>{
    let name=req.body.name;
    let email=req.body.email;
    let message=req.body.message;
    let newForm=new contactdb({name : name,email:email,message:message});
    newForm.save().then((data)=>{
        console.log(data);
        res.send(`<script>alert("Contact form submited");window.location.href="http://127.0.0.1:5500/main.html"</script>`)
    })
    
})

app.listen(port, (err) => {
    if (err) {
        console.log("Error occurs at server");
    }
    else {
        console.log("Server running at port " + port)
    }
})


process.on("uncaughtException", (err) => {
    console.log(`Error Occurs at the server side\n ${err}`)
})