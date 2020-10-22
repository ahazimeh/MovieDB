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
function authenticate(){
    let i = 0;
    for(i=0;i<users.length;i++){
        if(user[0].username === users[i].username && user[0].password === users[i].password)
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
    app.get('/movies/create',function(req,res){
        if(authenticate()){
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
        res.send(movies);
    }
}
else
res.send("Acess Denied");
    });


    app.get('/movies/read',function(req,res){
        if(authenticate()){
        db.collection('test').find().toArray()
    .then(results => {
    res.send(results)
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    });



    app.get('/movies/read/by-date',function(req,res){
        if(authenticate()){
        db.collection('test').find().toArray()
    .then(results => {
    res.send(results.sort(function(a,b){
        return a.year - b.year;
    }))
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    });


    app.get('/movies/read/by-rating',function(req,res){
        if(authenticate()){
        db.collection('test').find().toArray()
    .then(results => {
    res.send(results.sort(function(a,b){
        return a.rating - b.rating;
    }))
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    });



    app.get('/movies/read/by-title',function(req,res){
        if(authenticate()){
        db.collection('test').find().toArray()
    .then(results => {
    res.send(results.sort(function(a,b){
        return a.title.localeCompare(b.title);
    }))
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    });

    


    app.get('/movies/delete/:id',function(req,res){
        if(authenticate()){

        quotesCollection.findOneAndDelete(
            { _id: ObjectId(req.params.id) }
          )
          .then(result => {
            // res.send(result);
        })
            .catch(error => console.error(error))
        }
        else
        res.send("Acess Denied");

    });


    app.get('/movies/read/id/:id',function(req,res){
        if(authenticate()){
        db.collection('test').find({ _id: ObjectId(req.params.id) } ).toArray()
    .then(results => {
    res.send(results)
    })
    .catch(/* ... */)
}
else
res.send("Acess Denied");
    
        
    });




    app.get('/movies/update/:id',function(req,res){
        if(authenticate()){
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
                    res.send(result);
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
                    res.send(result);
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
                    res.send(result);
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
    res.send(users);
});
app.get('/users/update/:id',function(req,res){
    if(req.query.username !="" && typeof(req.query.username)!="undefined" )
    users[req.params.id-1].username = req.query.username;
    if(req.query.password !="" && typeof(req.query.password)!="undefined" )
    users[req.params.id-1].password = req.query.password;
    res.send(users[req.params.id-1]);
});




