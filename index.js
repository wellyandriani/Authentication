const express = require('express')
const app = express ()
const bodyParser = require('body-parser')
const bycript = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();

const Sequelize = require('sequelize')
const sequelize = new Sequelize('employees', 'welly', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

const account = sequelize.define('accounts', {
    'email':{
        type: Sequelize.STRING,
        primaryKey: true
    },
    'password': Sequelize.STRING,
    'password_salt': Sequelize.STRING,
    'first_name': Sequelize.STRING,
    'last_name': Sequelize.STRING
}, {
    freezeTableName: true,
})
app.get('/', (req, res) =>{
    res.send('welcome to my api')
})

app.get('/api/account', (req, res)=>{
    account.findAll().then(account => {
        res.json(account)
    })
})

const {
    check,
    validationResult
} = require('express-validation/check');


app.post('/api/account', [
    check('email').isLength({
        min: 20
    }),
    check('password').isLength({
        min : 5
    }),
    check('first_name').isLength({
        min: 5
    })
], verifyToken, (req, res)=>{
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        if(err){
            res.sendStatus(403);
        } else {
            bycript.genSalt(apa, (ipa, apo)=>{
                bycript.hash(req.body.password, apo, (ips, ipi)=>{
                    account.create({
                        email: req.body.email,
                        password: ipi,
                        password_salt: apo,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name
                    })
                    .then(newAccount => {
                        res.json({
                        "message": "insert account data success",
                        "data": newAccount,
                        authData
                        })
                    })
                })
            })
        }
    })
    
   
})

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


app.put('/api/account', (req, res)=>{
    const update = {
        email: req.body.email,
        password: req.body.password,
        password_salt: req.body.password_salt,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }
    account.update(update, {
        where: {
            email: req.body.email
        }
    })

    .then(effectedRow => {
        return account.fingOne({
            email: req.body.email
        },{
            returning: true,
            where:{}
        })
        })
        .then(DataRes => {
            res.json({
                "status": "success",
                "message": "Account change",
                "data": DataRes
            })
        })
})

app.delete('/api/employees/:email', (req, res) => {
    employees.destroy({
            where: {
                email: req.params.email
            }
        })
        .then(affectedRow => {
            if (affectedRow) {
                return {
                    "status": "success",
                    "message": "Account deleted",
                    "data": null
                }
            }

            return {
                "status": "error",
                "message": "Failed",
                "data": null
            }

        })
        .then(deleteData => {
            res.json(deleteData)
        })
})

app.listen(3000, () => console.log('App listen port 3000'))
