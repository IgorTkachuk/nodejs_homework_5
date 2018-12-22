const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/users');
const NewsCtrl = require('../controllers/news');

router.get('/', function(req, res, next){
    console.log('You are in /api router');
    res.json({success: true});
})

router.post('/saveNewUser', async(req, res) => {
    try{
        console.log("saveNewUser: req.body", req.text);
        const result = await UserCtrl.saveNewUser(JSON.parse(req.text));
        res.json(result);
    } catch(err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    }
});

router.post('/login', async(req, res) => {
    try{
        console.log("login: req.body", req.text);
        const reqJSON = (JSON.parse(req.text));
        const result = await UserCtrl.loginUser(reqJSON);
        if ( reqJSON.remembered ) {
            res.cookie('access_token', result.access_token, {
                maxAge: 7 * 60 * 60 * 1000,
                path: '/',
                httpOnly: false,
              });
        }
        res.json(result);
    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    }
});

router.post('/authFromToken', async (req,res) => {
    try {
        const access_token = req.cookies.access_token;
        const result = await UserCtrl.getUserFromToken(access_token);
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    }
});

router.put('/updateUser/:id', async (req, res) => {
    try {
        console.log("updateUser: req.body", req.text, req.params.id);
        const result = await UserCtrl.updateUser( { ...JSON.parse(req.text), id: req.params.id });
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    } 
});

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        console.log("deleteUser: req.body", req.params.id);
        const result = await UserCtrl.deleteUser( { id: req.params.id });
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    } 
});

router.get('/getNews', async (req, res) => {
    try {
        const result = await NewsCtrl.getNews();
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    } 
});

router.post('/newNews', async (req, res) => {
    try {
        const result = await NewsCtrl.saveNews(JSON.parse(req.text));
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    } 
});

router.put('/updateNews/:id', async (req, res) => {
    try {
        const result = await NewsCtrl.updateNews({ ...JSON.parse(req.text), id: req.params.id });
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    }
})

router.delete('/deleteNews/:id', async (req, res) => {
    try {
        console.log("deleteNews: req.body", req.params.id);
        const result = await NewsCtrl.deleteNews( { id: req.params.id });
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    } 
});

router.get('/getUsers', async(req, res) => {
    try{
        const result = await UserCtrl.getUsers();
         res.json(result);
    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    }
});

router.put('/updateUserPermission/:id', async (req, res) => {
    try {
        console.log("updateUserPermission: req.body", req.text, req.params.id);
        const result = await UserCtrl.updateUserPermission(JSON.parse(req.text));
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    } 
});

router.post('/saveUserImage/:id', async (req, res) => {
    try {
        const result = await UserCtrl.saveUserImage(req);
        res.json(result);

    } catch (err) {
        console.error('err', err);
        res.json({
            success: false,
            message: 'Internal error'
        });
    } 
});

module.exports = router;