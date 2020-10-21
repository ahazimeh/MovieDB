const express = require('express');
const port = 3000;
const app = express();
app.listen(port, function () {
    console.log("Server is running on "+ port +" port");
});

const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]
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
    if(typeof(req.query.s)=="undefined")
    res.send("aa");
    if(req.query.s==""){
        res.status(500).send("error:true, you have to provide a search");
    }
    else{
        res.status(200).send("ok, data:"+req.query.s);
        
    }
});

app.get('/movies/create',function(req,res){
    
});

app.get('/movies/read',function(req,res){
    res.status(200).send(movies);
});

app.get('//movies/update',function(req,res){
    
});

app.get('/movies/delete',function(req,res){
    
});