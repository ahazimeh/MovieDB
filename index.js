const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const port = 3000;
const app = express();
var ObjectId = require('mongodb').ObjectID;
app.listen(port, function () {
    console.log("Server is running on "+ port +" port");
});


const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]
var users = [
    {username:'ali',password:'123456'},
    {username:'amira',password:'123456'}
]
var user = [
    {username:'ali',password:'123456'}
]
var admins = [
    {username:'admin',password:'_strongpassword'}
]
var admin = [
    {username:'admin',password:'_strongpassword'}
]

function authenticate(){
    let i = 0;
    for(i=0;i<users.length;i++){
        if(user[0].username === users[i].username && user[0].password === users[i].password)
        break;
    }
    if(i==users.length)return false;return true;
}
function authenticateAdmin(){
    let i = 0;
    for(i=0;i<admins.length;i++){
        if(admin[0].username === admins[i].username && admin[0].password === admins[i].password)
        break;
    }
    if(i==users.length)return false;return true;
}
var connectionString = 'mongodb+srv://root:12[]aszsa@cluster0.svlvw.mongodb.net/test?retryWrites=true&w=majority'
app.use(bodyParser.urlencoded({ extended: true }))
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('test');
    var quotesCollection = db.collection('test');



    
    // quotesCollection.insertOne(movies[1])
    app.post('/movies/create',function(req,res){
        if(authenticate() || authenticateAdmin()){
        if(!(/([0-9]{4})/.test(req.query.year)) || typeof(req.query.year)==="undefined" || req.query.year==""||typeof(req.query.title)==="undefined" || req.query.title=="")
        res.status(403).send("error:true, message:you cannot create a movie without providing a title and a year");
        else{
        var rating = 4;
        if(/([0-9]+)/.test(req.query.rating))
        rating = req.query.rating;
        movies.push({ _id:1,title: req.query.title, year: req.query.year, rating: rating });


        quotesCollection.insertOne({title: req.query.title, year: req.query.year, rating: rating })
        .then(result => {
            console.log(result)
          })
          .catch(error => console.error(error))
        res.status(200).send(movies);
    }
}
else
res.send("Acess Denied");
    });


    app.get('/movies/read',function(req,res){
        if(authenticate() || authenticateAdmin()){
        db.collection('test').find().toArray()
    .then(results => {
    res.status(200).send(results)
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    });



    app.get('/movies/read/by-date',function(req,res){
        if(authenticate() || authenticateAdmin()){
        db.collection('test').find().toArray()
    .then(results => {
    res.status(200).send(results.sort(function(a,b){
        return a.year - b.year;
    }))
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    });


    app.get('/movies/read/by-rating',function(req,res){
        if(authenticate() || authenticateAdmin()){
        db.collection('test').find().toArray()
    .then(results => {
    res.status(200).send(results.sort(function(a,b){
        return a.rating - b.rating;
    }))
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    });



    app.get('/movies/read/by-title',function(req,res){
        if(authenticate() || authenticateAdmin()){
        db.collection('test').find().toArray()
    .then(results => {
    res.status(200).send(results.sort(function(a,b){
        return a.title.localeCompare(b.title);
    }))
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    });

    


    app.delete('/movies/delete/:id',function(req,res){
        if(authenticate() || authenticateAdmin()){

        quotesCollection.findOneAndDelete(
            { _id: ObjectId(req.params.id) }
          )
          .then(result => {
            res.status(200).send(result);
        })
            .catch(error => console.error(error))
        }
        else
        res.send("Acess Denied");

    });


    app.get('/movies/read/id/:id',function(req,res){
        if(authenticate() || authenticateAdmin()){
        db.collection('test').find({ _id: ObjectId(req.params.id) } ).toArray()
    .then(results => {
    res.status(200).send(results)
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    
        
    });




    app.put('/movies/update/:id',function(req,res){
        if(authenticate() || authenticateAdmin()){
            if((/([0-9]{4})/.test(req.query.year)))
            quotesCollection.findOneAndUpdate(
                { _id: ObjectId(req.params.id) }
                ,
                {
                  $set: {
                    year: req.query.year
                  }
                },
                {
                  upsert: true
                }
              )
                .then(result => {
                    
                })
                .catch(error => console.error(error))

            if(!(typeof(req.query.title)==="undefined" || req.query.title==""))
            quotesCollection.findOneAndUpdate(
                { _id: ObjectId(req.params.id) }
                ,
                {
                  $set: {
                    title: req.query.title
                  }
                },
                {
                  upsert: true
                }
              )
                .then(result => {
                    
                })
                .catch(error => console.error(error))

            if(!(typeof(req.query.rating)==="undefined" || req.query.rating==""))
            quotesCollection.findOneAndUpdate(
                { _id: ObjectId(req.params.id) }
                ,
                {
                  $set: {
                    rating: req.query.rating
                  }
                },
                {
                  upsert: true
                }
              )
                .then(result => {
                    
                })
                .catch(error => console.error(error))




            // movies[req.params.id-1].rating = req.query.rating;

            res.status(200).send("updated");
        // }
    }
    else
    res.send("Acess Denied");
    });
    








  })
  
  .catch(console.error)



app.get('/test',function(req,res){
    res.status(200).send('ok');
    
    
});


app.get('/time',function(req,res){
    var today = new Date();
    var hours,minutes;
    if(today.getHours<10)
    hours = "0"+today.getHours();
    else
    hours = ""+today.getHours();
    if(today.getMinutes()<10)
    minutes = "0"+today.getMinutes();
    else
    minutes = ""+today.getMinutes();
    var time = hours + ":" + minutes;
    res.status(200).send(time);
});
app.get("/hello",function(req,res){
    res.status(200).send("Hello");
});
app.get("/hello/:id",function(req,res){
    res.status(200).send("Hello, "+req.params.id);
});

app.get('/search',function(req,res){
    if(req.query.s=="" ||typeof(req.query.s)=="undefined"){
        res.status(500).send("error:true, you have to provide a search");
    }
    else{
        res.status(200).send("ok, data:"+req.query.s);
        
    }
});

// app.post('/movies/create',function(req,res){
//     if(!(/([0-9]{4})/.test(req.query.year)) || typeof(req.query.year)==="undefined" || req.query.year==""||typeof(req.query.title)==="undefined" || req.query.title=="")
//     res.status(403).send("error:true, message:you cannot create a movie without providing a title and a year");
//     var rating = 4;
//     if(/([0-9]+)/.test(req.query.rating))
//     rating = req.query.rating;
//     movies.push({ title: req.query.title, year: req.query.year, rating: rating });
//     res.send(movies);
// });

// app.get('/movies/read',function(req,res){
//     res.status(200).send(movies);
// });

// app.put('/movies/update/:id',function(req,res){
//     if(req.params.id<=0 || req.params.id>movies.length)
//     res.status(404).send("error:true, message:the movie "+req.params.id+" does not exist");
//     else{
//         if((/([0-9]{4})/.test(req.query.year)))
//         movies[req.params.id-1].year = req.query.year;
//         if(!(typeof(req.query.title)==="undefined" || req.query.title==""))
//         movies[req.params.id-1].title = req.query.title;
//         if(!(typeof(req.query.rating)==="undefined" || req.query.rating==""))
//         movies[req.params.id-1].rating = req.query.rating;
//         res.status(200).send(movies);
//     }
// });

// app.delete('/movies/delete/:id',function(req,res){
//     if(req.params.id<=0 || req.params.id>movies.length)
//     res.status(404).send("error:true, message:the movie "+req.params.id+" does not exist");
//     else{
//         movies.splice(req.params.id-1,1);
//         res.status(200).send(movies);
//     }
// });


// app.get('/movies/read/by-date',function(req,res){
//     res.send(movies.sort(function(a,b){
//         return a.year - b.year;
//     }));
// });

// app.get('/movies/read/by-rating',function(req,res){
//     res.send(movies.sort(function(a,b){
//         return a.rating - b.rating;
//     }));
// });
// app.get('/movies/read/by-title',function(req,res){
//     res.send(movies.sort(function(a,b){
//         return a.title.localeCompare(b.title);
//     }));
// });


// app.get('/movies/read/id/:id',function(req,res){
//     if(req.params.id<=0 || req.params.id>movies.length)
//     res.status(404).send("error:true, message:the movie "+req.params.id+" does not exist");
//     else
//     res.send(movies[req.params.id-1]);

    
// });
app.get('/users/read',function(req,res){
    if(authenticateAdmin()){
    res.status(200).send(users);
}
else
res.send("Access Denied");
});
app.put('/users/update/:id',function(req,res){
    if(authenticateAdmin()){
    if(req.query.username !="" && typeof(req.query.username)!="undefined" )
    users[req.params.id-1].username = req.query.username;
    if(req.query.password !="" && typeof(req.query.password)!="undefined" )
    users[req.params.id-1].password = req.query.password;
    res.status(200).send(users[req.params.id-1]);
}
else
res.send("Access Denied")
});

app.post('/users/create',function(req,res){
    if(authenticateAdmin()){
    if(req.query.username !="" && typeof(req.query.username)!="undefined" && req.query.password !="" && typeof(req.query.password)!="undefined"){
    users.push({username:req.query.username,password:req.query.password});
    res.status(200).send("created");
    }
    else
    res.status(403).send("Please enter a username and password");
}
else
res.send("Access Denied")

});

app.delete('/users/delete/:id',function(req,res){
    if(authenticateAdmin()){
    if(req.params.id<=0 || req.params.id>users.length)
    res.status(404).send("User id is not available");
    else{
        users.splice(req.params.id-1,1);
        res.status(200).send("User Deleted");
    }
}
else
res.send("Access Denied");

});
