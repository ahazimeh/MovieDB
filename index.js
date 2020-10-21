const express = require('express');
const port = 3000;
const app = express();
app.listen(port, function () {
    console.log("Server is running on "+ port +" port");
});


app.get('/test',function(req,res){
    res.send('{status:200, message:"ok"}');
    
});

app.get('/time',function(req,res){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();

    res.send('{status:200, message:'+time+'}');
});