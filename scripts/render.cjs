const fs = require('node:fs');
const path = require('node:path');
const Handlebars = require('handlebars');

const root = path.resolve(__dirname, '..');
const normalize = (text) => text.replace(/\r\n/g, '\n');
const template = Handlebars.compile(
  normalize(fs.readFileSync(path.join(root, 'prompt.hbs'), 'utf8')),
  { strict: true },
);
const context = {
  companyName: 'Banco Nova Era',
  clientName: 'Pedro Silva',
  firstName: 'Pedro',
  isCPF: true,
};
const check = process.argv.includes('--check');

for (const isCPF of [true, false]) {
  const filename = isCPF ? 'prompt-cpf.txt' : 'prompt-cnpj.txt';
  const output = template({ ...context, isCPF });
  const destination = path.join(root, filename);
  if (check) {
    if (!fs.existsSync(destination) || normalize(fs.readFileSync(destination, 'utf8')) !== output) {
      console.error(`${filename} está diferente do template. Execute npm run render.`);
      process.exitCode = 1;
    } else {
      console.log(`${filename}: confere com o template.`);
    }
  } else {
    fs.writeFileSync(destination, output, 'utf8');
    console.log(`${filename}: gerado.`);
  }
}
