const Users = require('../db/models/users');
const uuidv4 = require('uuid/v4');
const bCrypt = require('bcryptjs');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const util = require('util');

exports.saveNewUser = ({
    username,
    surName,
    firstName,
    middleName,
    password,
    image,
    permissionId,
    permission
}) => new Promise( async (resolve, reject) =>{
    try {
        if (!username || !password) {
            resolve({
                success: false,
                message: 'username and password requires'
            });
            return;
        }

        let existedUser = await Users.find({username: username}).countDocuments();

        if(existedUser) {
            resolve({
                success: false,
                message: 'username already exist'
            });
            return;
        }

        const objUser = {
            username,
            surName,
            firstName,
            middleName,
            // password,
            image: image || 'assets/img/no-user-image-big.png',
            permission,
            // access_token: 'RTYrvcb65h7865f4gh6546d4hFdg656'
        };

        let newUser = new Users(objUser);
        newUser.setPassword(password);

        const access_token = uuidv4();
        newUser.setToken(access_token);

        let result = await newUser.save();

        let responceResult = {
            id: result._id,
            permissionId: result.permissionId,
            password: result.password,
            access_token: result.access_token
        }

        // resolve({...objUser, ...responceResult});
        resolve(result);


    } catch (err) {
        reject(err);
    }
});

exports.loginUser = ({
    username,
    password
}) => new Promise( async (resolve, reject) => {
    try{
        if (!username || !password) {
            resolve({
                success: false,
                message: 'username and password requires'
            });
            return;
        }

        let foundedUsers = await Users.find({username}).countDocuments();

        if(!foundedUsers) {
            resolve({
                success: false,
                message: 'user with this nickname is not found in our database'
            });
            return;
        }

        const user = await Users.findOne({username});

        if( user.validPassword(password) ) {
            resolve(user);
        } else {
            resolve({
                success: false,
                message: 'incorrect password for this user'
            });
        }

    } catch (err) {
        reject(err);
    }
});

exports.getUserFromToken = (access_token) => new Promise ( async (resolve, reject) => {
    try{
        let foundedUsers = await Users.find({access_token}).countDocuments();

        if(!foundedUsers) {
            resolve({
                success: false,
                message: 'session with this token is not found'
            });
            return;
        }

        const user = await Users.findOne({access_token});
        resolve(user.toObject());

    } catch (err) {
        reject(err);
    }
})

exports.updateUser = ({
    firstName,
    middleName,
    surName,
    oldPassword,
    password,
    id
}) => new Promise ( async (resolve, reject) => {
    try{
        let foundedUsers = await Users.find({_id: id}).countDocuments();

        if(!foundedUsers) {
            resolve({
                success: false,
                message: 'user with this id and correct password is not found'
            });
            return;
        }

        let toChange = {};

        if (firstName) toChange.firstName = firstName;
        if (middleName) toChange.middleName = middleName;
        if (surName) toChange.surName = surName;
        if (password) toChange.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);;

        console.log(toChange);

        const user = await Users.findByIdAndUpdate(
            id,
            {
                $set: toChange
            },
            {new: true}
        );
        resolve(user);

    } catch (err) {
        reject(err);
    }
})

exports.getUsers = () => new Promise( async (resolve, reject) => {
    try{
        const users = await Users.find();
        resolve(users);
    } catch (err) {
        reject(err);
    }
});

exports.deleteUser = ({id}) => new Promise( async (resolve, reject) => {
    try{
        const result = await Users.deleteOne({_id: id});
        resolve(result);
    } catch (err) {
        reject(err);
    }
});

exports.updateUserPermission = (param) => new Promise ( async (resolve, reject) => {
    try{
        let user = await Users.findOne({permissionId: param.permissionId});

        if(!user) {
            resolve({
                success: false,
                message: 'user with this paramsId is not found'
            });
            return;
        }

        const result = await Users.findByIdAndUpdate(
            user._id,
            {
                $set: _.merge(user.toObject(), param)
            },
            {new: true}
        );
        resolve(result);

    } catch (err) {
        reject(err);
    }
})

exports.saveUserImage = (req) => new Promise ( async (resolve, reject) => {
    try{
        const userId = req.params.id;
        let form = new formidable.IncomingForm();
        let upload = path.join(process.cwd(), 'dist', 'upload');

        if (!fs.existsSync(upload)){
            fs.mkdirSync(upload);
        }

        form.multiples = true;
        form.uploadDir = upload; 

        form.parse(req, async (err, fields, files) => {

            const image = files[userId];

            if (err) {
                resolve({
                    success: false,
                    message: 'form-data parsing error'
                });
                return;
            }

            fileName = path.join(upload, image.name);

            fs.rename(image.path, fileName, err => {
                if (err) {
                    resolve({
                        success: false,
                        message: 'file rename error'
                    });
                    return;
                }
            });

            let user = await Users.findOne({_id: userId});

            if(!user) {
                resolve({
                    success: false,
                    message: 'user with this Id is not found'
                });
                return;
            }

            let dir = fileName.substr(fileName.indexOf('upload'));
            const result = await Users.findByIdAndUpdate(
                userId,
                {
                    $set: _.merge(user.toObject(), {image: dir})
                },
                {new: true}
            );
            resolve({path: dir});

        });

    } catch (err) {
        reject(err);
    }
})