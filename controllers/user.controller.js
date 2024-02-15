// initialize models
const {
    User,
    RefreshToken
} = require('../models');
// initialize validator
const Validator = require('fastest-validator');
// initialize jsonwebtoken
const {
    sign
} = require('jsonwebtoken');
// initialize mailing
const {
    sendingMail
} = require('./mail.controller');
// initialize bcrypt
const bcrypt = require('bcrypt');
const v = new Validator();

// initialize environment variable
const {
    JWT_SECRET,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REFRESH_TOKEN_EXPIRED,
    JWT_SECRET_REFRESH,
    email
} = process.env;

const register = async (req, res) => {
    // make a schema for validation
    const schema = {
        name: 'string|empty:false',
        email: 'email|empty:false',
        password: 'string|min:6',
    }

    // validate the request body
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    // check if email already exists
    const checkEmail = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    // if email already exists, return error message
    if (checkEmail) {
        return res.status(400).json({
            status: 'error',
            message: 'Email already exists'
        });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create user
    const data = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        verified: req.body.verified
    })

    // send email verification
    sendingMail({
        from: email,
        to: req.body.email,
        subject: "Email Verification",
        text: `Hello, ${req.body.name}, please verify your email by clicking this link: http://localhost:3000/api/v1/verify/verify-email?email=${req.body.email}&key=${hashedPassword}`
    })

    return res.status(201).json({
        status: 'success',
        message: 'User created',
        data
    });
}

const login = async (req, res) => {
    // make a schema for validation
    const schema = {
        email: 'email|empty:false',
        password: 'string|min:6',
    }

    // validate the request body
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    // check if email exists
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    // if email not found, return error message
    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid login'
        });
    }

    // compare the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid login'
        });
    }

    // check if user is verified
    if (!user.verified) {
        return res.status(400).json({
            status: 'error',
            message: 'User not verified'
        });
    }

    // create token
    const token = sign({
        id: user.id,
        email: user.email,
    }, JWT_SECRET, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRED
    });

    // create refresh token use it if the token is expired
    const refreshToken = sign({
        id: user.id,
        email: user.email,
    }, JWT_SECRET_REFRESH, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRED
    });

    // save refresh token to database
    await RefreshToken.create({
        token: refreshToken,
        user_id: user.id
    })

    return res.status(200).json({
        status: 'success',
        message: 'User logged in',
        data: {
            token
        }
    });
}

const updateVerif = async (req, res) => {
    // Get the email and key from the query
    const email = req.query.email;
    const key = req.query.key;

    // Find the user by email
    const user = await User.findOne({
        where: {
            email: email
        }
    });

    // If user not found, return error message
    if (user.password != key) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid key'
        });
    }

    // Update the user to verified
    user.verified = true;
    await user.save();
    return res.status(200).json({
        status: 'success',
        message: 'User verified'
    });
}

const forgotPasswordVerify = async (req, res) => {
    const email = req.body.email;

    // Find the user by email
    const user = await User.findOne({
        where: {
            email: email
        }
    });

    // If user not found, return error message
    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'User not found'
        });
    }

    // Send email reset password
    sendingMail({
        from: email,
        to: req.body.email,
        subject: "Reset Password",
        text: `Hello, ${req.body.name}, please reset your password by clicking this link: http://localhost:3000/api/v1/users/change-password?email=${req.body.email}&key=${user.password}`
    })

    // Return success message
    return res.status(200).json({
        status: 'success',
        message: 'Reset password link sent'
    });
}


const changePassword = async (req, res) => {
    // Get the email and key from the query
    const email = req.query.email;
    const key = req.query.key;

    // Find the user by email
    const checkUser = await User.findOne({
        where: email
    })

    // If user not found, return error message
    if (key != checkUser.password) {
        return res.status(400).json({
            error: "error",
            message: "key invalid"
        })
    }

    // Make a schema for validation
    const schema = {
        password: 'string|min:6',
        passwordCheck: 'string|min:6'
    }

    // Validate the request body
    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res.status(400).json({
            status: "error",
            message: validate
        })
    }

    // Check if password and password check is the same
    if (req.body.password != req.body.passwordCheck) {
        return res.status(400).json({
            status: "error",
            message: "password and password check not valid"
        })
    }

    // Encrypt the password
    enkripsiPass = bcrypt.hash(req.password, 10);

    // Update the user password
    await User.update({
        password: enkripsiPass
    })

    return res.status(200).json({
        status: "success",
        message: "Password Changed"
    })
}

const logout = async (req, res) => {
    const userId = req.body.user_id;
    const user = await User.findByPk(userId);

    // If user not found, return error message
    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'User not found'
        });
    }

    // Delete the refresh token
    await RefreshToken.destroy({
        where: {
            user_id: userId
        }
    });

    return res.status(200).json({
        status: 'success',
        message: 'User logged out'
    });
}

module.exports = {
    register,
    login,
    updateVerif,
    forgotPasswordVerify,
    changePassword,
    logout
}