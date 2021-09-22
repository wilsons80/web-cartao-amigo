var fs  = require('fs');

const targetPath = './src/environments/configuracao.ts';
const heroku = `export const configuracao = {
   ambiente: '${process.env.AMBIENTE}'
}`;

console.log('The arquivo `configuracao.ts` será escrito com o conteúdo: \n');
console.log(heroku);

fs.writeFile(targetPath, heroku, (err, result) => {
   if(err){
      console.log('Falha ao escrever arquivo');
   }else {
	  console.log(`Angular configuracao.ts file gerado em ${targetPath} \n`);
   }
});