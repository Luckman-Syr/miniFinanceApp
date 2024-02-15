// define model
const {
    Rekening,
    User
} = require('../models');

// initialize bcrypt
const bcrypt = require('bcrypt');

// initialize validator
const Validator = require('fastest-validator');
// use validator
const v = new Validator();

const create = async (req, res) => {
    // make a schema for validation
    const schema = {
        total_money: 'number|default:0',
        user_id: 'number|empty:false',
        pin: 'string|min:6|empty:false'
    }

    // validate the request body
    const validate = v.validate(req.body, schema);

    // if there is an error, return the error message
    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    // find the user
    const user = await User.findOne({
        where: {
            id: req.body.user_id
        }
    });

    // if user not found, return error message
    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'User not found'
        });
    }

    // generate rekening number
    const rekening = Math.floor(Math.random() * 1000000000);
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const noRekening = `${rekening}${date}${month}${year}`

    // hash the pin
    const hashPin = await bcrypt.hash(req.body.pin, 10);

    // create a new rekening
    await Rekening.create({
        no_rekening: noRekening,
        user_id: req.body.user_id,
        pin: hashPin
    });

    // return success message
    return res.status(201).json({
        status: 'success',
        message: 'Rekening created'
    });
}


module.exports = {
    create
}