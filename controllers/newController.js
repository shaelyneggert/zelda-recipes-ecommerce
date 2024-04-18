const model = require('../models/item');
const { v4: uuidv4 } = require('uuid');

exports.index = (req, res, next) => {
    const query = req.query.query;
    if (query) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
        const regex = new RegExp(query, 'i'); // i = case insensitive 
        model.find(
                { $or: [
                    { title: { $regex: regex }}, 
                    { details: { $regex: regex }}
                ]})
            .sort({ price: 1 })
            .then(items => {
                if (items.length === 0) {
                    return res.render('error', { error: { message: 'No items found matching your query: ' + query } });
                } else {
                    res.render('items', { items });
                }
            })
            .catch(err => next(err));
    } else {
        model.find()
            .sort({ price: 1 })
            .then(items => {
                res.render('items', { items });
            })
            .catch(err => next(err));
    }
};


// GET /stories/new: send html form for creating new item aka new.html
exports.new = (req, res) => {
    res.render('new'); 
};

// POST /items: create a new item
exports.create = (req, res, next) => {
    let items = new model(req.body);
    console.log(req.file.filename);
    items.image = '/images/' + req.file.filename;
    items.seller = req.session.user;

    items.save()
    .then((items)=> {
        req.flash('success', 'Item uploaded successfully!');
        res.redirect('/items');
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
}



exports.showItem = (req, res, next) => {
    const id = req.params.id;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item=> {
        if(item) {
            console.log(item.seller);
            return res.render('item', { item }); 
        } else {
            let err = new Error('Cannot find a item with id ' + id);
            err.status = 404;
            next(err);
            return;
        }
        
    })
    .catch(err=>next(err));
};

// GET /new/:id/edit: send html form for editting an exisiting item
exports.edit = (req, res, next)=> {
    const id = req.params.id;
    model.findById(id)
    .then(item=> {
        if(item) {
            res.render('./item/edit', {item});
        } else {
            let err = new Error('Cannot find a item with id ' + id);
            err.status = 404;
            next(err);
            return;
        }
        
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let item = req.body; 
    let id = req.params.id;
    if (req.file) {
        item.image = '/images/' + req.file.filename;
    }
    model.findByIdAndUpdate(id, item, {useFindandModify: false, runValidators: true})
    .then(item => {
        if (item) {
            req.flash('success', 'Item updated successfully!');
            res.redirect('/items/' + id);
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

// DELETE /new/:id -- delete the item identified by the id
exports.delete = (req, res, next)=>{
    let id = req.params.id;
    model.findByIdAndDelete(id, {useFindandModify: false})
    .then(item => {
        if (item) {
            req.flash('success', 'Item deleted successfully!');
            res.redirect('/items');
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};
