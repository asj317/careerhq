const dotenv=require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const port = 3000
const filter = require("./views/filter.js");
const SCareer = require("./views/specificCareer.js");


const app = express();
app.use(express.static("Public"))

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
  extended: true
}));

//connecting mongodb server
const uri = process.env.MONGOID;
async function connect() {

  try {
    await mongoose.connect(uri);
   //console.log("Successful conection to mongodb");

  } catch (error) {
    //console.log(error);
  }
}

connect();

const userSchema = {
  email: String,
  password: String
};

const User = new mongoose.model("User", userSchema);

app.post('/filter', function (req, res) {
  const skills = req.body.skills;
  const interest = req.body.interests;
  const popular = req.body.popular;
  const government = req.body.government;
  const freelancing = req.body.freelancing;
  const array = [];

  for (var i = 0; i < filter.length; i++) {
    if (skills == filter[i].Skills || interest == filter[i].Interest || popular == filter[i].Popular || government == filter[i].Government || freelancing == filter[i].Freelancing) {
      array.push(filter[i]);
    }
  }
  const arrayString = JSON.stringify(array);

  res.redirect('/filters?array=' + encodeURIComponent(arrayString));
});



app.post('/career', function (req, res) {
  var a = req.body.myPet;
  res.redirect("/career/" + a);
})

app.get('/career/:title', function (req, res) {
  var title = req.params.title;
  for (var i = 0; i < SCareer.length; i++) {
    if (title == SCareer[i].title) {
      break;
    }
  }
  res.render("separateCareer", { thought: SCareer[i].thought, i1: SCareer[i].i1, i2: SCareer[i].i2, u: SCareer[i].u, title: SCareer[i].title, overview: SCareer[i].overview, entrance_exam_details: SCareer[i].entrance_exam_details, roles_and_responsibilities: SCareer[i].roles_and_responsibilities, work_opportunities: SCareer[i].work_opportunities, recommended_courses_and_colleges: SCareer[i].recommended_courses_and_colleges, general_education_path: SCareer[i].general_education_path, skills_and_personality_traits: SCareer[i].skills_and_personality_traits, expert_advise: SCareer[i].expert_advice, salary: SCareer[i].salary });
})


app.get('/filters', function (req, res) {
  const arrayString = req.query.array;
  if (arrayString) {
    try {
      const array = JSON.parse(arrayString);
      res.render("filterpage", { array: array });
    } catch (error) {
      // console.error(error);

      res.redirect("/filter");
    }
  } else {

    window.alert("No data found for applied filters ");
    res.redirect("/filter");
  }
});


app.get('/filter', function (req, res) {
  res.render("filterpage", { array: filter });
})

app.get('/mainpage', function (req, res) {
  res.render("mainpage");
})


app.get('/', function (req, res) {
  res.sendFile(__dirname + "/homepage.html");
})

app.get('/quizz', function (req, res) {
  res.sendFile(__dirname + "/Q/Quizz/quizz.html")
})

app.get("/login", function (req, res) {
  res.render("login");
})


app.get('/signup', function (req, res) {
  res.render("signup");
})


app.post("/signup", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save();
  res.render("login");

});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("mainpage");
        }
        else {

          return res.status(401).send('<script>alert("Incorrect email or password."); window.location.href="/signup";</script>');
        }
      }
    })
});



app.listen(port, () => {
  // console.log(`http://localhost:${port}`)
})


