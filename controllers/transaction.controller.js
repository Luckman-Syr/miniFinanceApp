// define model
const {
    Rekening,
    User,
    Transaction
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
        amount: 'number|default:0',
        transaction_to: 'string|empty:false',
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

    // get user from token
    const user = req.user;

    // find the rekening
    const rekening = await Rekening.findOne({
        where: {
            user_id: user.id
        }
    });

    // if rekening not found, return error message
    if (!rekening) {
        return res.status(400).json({
            status: 'error',
            message: 'Rekening not found'
        });
    }

    // compare the pin
    const validPin = await bcrypt.compare(req.body.pin, rekening.pin);
    if (!validPin) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid pin'
        });
    }

    // check if the balance is enough
    if (rekening.total_money < req.body.amount) {
        return res.status(400).json({
            status: 'error',
            message: 'Insufficient balance'
        });
    }

    // find the transaction to
    const transactionTo = await Rekening.findOne({
        where: {
            no_rekening: req.body.transaction_to
        }
    });

    // if transaction to not found, return error message
    if (!transactionTo) {
        return res.status(400).json({
            status: 'error',
            message: 'Transaction to not found'
        });
    }

    // update rekening
    await Rekening.update({
        total_money: rekening.total_money - req.body.amount
    }, {
        where: {
            id: rekening.id
        }
    });

    // update transaction to
    await Rekening.update({
        total_money: transactionTo.total_money + req.body.amount
    }, {
        where: {
            id: transactionTo.id
        }
    });

    // create a new transaction
    await Transaction.create({
        amount: req.body.amount,
        transaction_to: req.body.transaction_to,
        rekening_id: rekening.id
    });

    // return success message
    return res.status(201).json({
        status: 'success',
        message: 'Transaction sucessfully'
    });
}


module.exports = {
    create
}