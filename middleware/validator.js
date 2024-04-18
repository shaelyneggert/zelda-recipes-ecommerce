const Item = require('../models/item');
const mongoose = require('mongoose');

exports.validateId = (req, res, next)=>{
    const id  = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }
    if (mongoose.Types.ObjectId.isValid(id)) {
        next(); 
    } else {
        const err = new Error('Invalid ObjectId');
        err.status = 400;
        next(err); 
    }
}