// Initializing all the require things for express app
const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
const app =express();

const dotenv = require('dotenv');
dotenv.config();

app.use(express.static("public"));
// to pass the data send by the user during signup
app.use(bodyparser.urlencoded({extended:true}));

// creating get funciton to take and send the request 
app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req, res){
    // setting up the variable to store the values send by the signup page
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    console.log(firstname, lastname, email);
// creating the object and it's members so to pass the details.
    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    // this will stringify the json data into structured way
    const jsonData = JSON.stringify(data);

    // we are taking these url from mailchimp/developer from the url section to create the list connection to post the data and stored in the form of list.here on "us21" of url we use 21 from the last digit of our api us21, whatever is there we always have to write the same number. 
    const url ="https://us21.api.mailchimp.com/3.0/lists/3e753e2b3b";
    option={
        method:"POST",
    // here we are creating the authentication by using any string and our apikey as password, we will get the syntax from the nodejs documentation.
        // auth: "pkg:fe71eb15fc1febde3acaa5e863f3c3ec-us21"
        auth: process.env.API_KEY
    }

    // now creating the https request to get the response from the server and get it as data
    const request = https.request(url,option,function(response){

        // const status = response.statusCode;   //The following code snipet is used to print the statusCode of the code
        // console.log(status);

        // now checking the status code and response accordingly as success and failure..
        if (response.statusCode=== 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    // this is to write the json data and to end it.
    // request.write(jsonData);
    request.end();
    
});

// Redirecting the failure page to home page
app.post("/failure",function(req,res){
    res.redirect("/");
})



// running the port in app.listen on port 3000;
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});





// this is the end of the code
