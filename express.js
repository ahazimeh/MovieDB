const express = require('express');
const port = 3000;
const app = express();
app.listen(port, function () {
    console.log("Server is running on "+ port +" port");
});
app.get(URL,function(req,res){
    res.send('ok');
})