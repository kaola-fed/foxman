const Freemarker = require('freemarker.js');
const path = require('path');

// const freemarker = new Freemarker(
//     {
//         viewRoot: path.resolve(__dirname, '..', 'example', 'template'),
//         options: {
//         }
//     });



// freemarker.render('index.ftl' , {}, function (err, data, out) {
//     console.log(data);
// });

var fm = new Freemarker({
  viewRoot: path.resolve(__dirname, '..','example','template'),
  options: {
    /** for fmpp */
  }
});

// Single template file
fm.render('index.ftl', {}, function(err, html, output) {
    console.log(html)
  //...
});
