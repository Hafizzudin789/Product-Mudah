var exec = require("child_process").exec;
var path = require("path");

exec(`rm -rf ${path.resolve('src', 'services')}`, function (err) {
  if (err){
    console.log(err);
    return; 
 }
  exec(`mkdir ${path.resolve('src', 'services')}`, function (err) {
    if (err){
      console.log(err);
      return; 
   }
    exec(`cat src/ServicesConfig/${process.argv[2]} > src/services/index.js`, function (err) {
      if (err){
        console.log(err);
      }
    })
  })
})

var app = exec(`node server ${process.argv[2]}`, function (err, stdout, stderr) {
    if (err) {
       console.log(err);
       return;
    }
});
var webpack = exec("node  --max_old_space_size=8192  ./node_modules/webpack/bin/webpack --watch", function (err, stdout, stderr) {
    if (err) {
       console.log(err);
       return;
    }
});
app.stdout.on("data", function(data) {
   console.log(data);
});
webpack.stdout.on("data", function(data) {
   console.log(data);
});
