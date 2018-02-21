var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('admin/pages/pagesList');
});

router.get('/edit', function(req, res) {
    res.render('admin/pages/pageEdit');
});

router.post('/edit', function(req, res) {
    console.log(req.params, req.body);
    //res.send("post request")
});

router.get('/delete', function(req, res) {
    if (req.query) {
        res.render('admin/pages/pagesList');
    }

});




module.exports = router;
