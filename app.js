const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        messsge: 'Welcome my api'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
jwt.verify(req.token, 'secretkey', (err, authData)=>{
    if(err){
        res.sendStatus(403);
    } else {
        res.json({
            message: 'post created',
            authData
        });
    }
});

   
});

app.post ('/api/login', (req, res)=>{

    const user = {
        id:1,
        username: 'brad',
        email: 'wellyandriani97@gmail.com'
    }

    jwt.sign({user}, 'secretkey', {expiresIn: '30s'}, (err, token) => {
        res.json({
            token
        });
    });
});


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer [1];
        req.token = bearerToken;
        next();
    }
    else{
            res.sendStatus(403);
        }
    }


app.listen(5000, () => console.log('server started on port 5000'));