var fs            = require('fs');
var execProcess   = require("./exec_process.js");

execProcess.result("sh script.sh", function(err, response){
    if(!err){
	fs.writeFile('../src/environments/versions.ts', 
		     response,
		     {enconding:'utf-8',flag: 'w'}, 
		     function (err) {
			    if (err) throw err;
			    console.log('Arquivo versions.git criado com sucesso!');
		     });

    }else {
        console.log(err);
    }
});

/**
 * para executar: node main.js
 */
