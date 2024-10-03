Projeto para agendamento de contato e registro de atendimentos realizados
Arquitetura em 3 camadas.
Linguagens e ferramentas utilizadas:
  Front: TypeScript
         Next.JS
         Tailwind
  Back: NODE.js

Instale o NODE.js
https://nodejs.org/en/download/package-manager

Start do projeto pela API 
  Foi usado no ambiente de desenvolvimento do projeto
    npm init (criar o projeto)
  Bibliotecas
    npm i express bcrypt body-parser cors dotenv jsonwebtoken mysql
    npm i --save-dev nodemon
 Produção 
   crie o .env com os dados da sua base de dados na pasta raiz da API
     EX Mysql ou MariaDB
      DB_HOST=bancos.hospedado.com
      DB_PORT=3306
      DB_DATABASE=nome do banco
      DB_USERNAME=usuario do banco
      DB_PASSWORD=senhado usuario dobanco
      REFRESH=hash de controle
      TOKEN=hash de controle
 
 Dentro da pasta API execute     
   execute npm install
   execute npm start

Utilize a rota rota de teste para verificar a disponibilidade da API
EX http://crmgalago.us.to:8001/api/vendedores/teste

OBS: dependendo da versão do NODE utilizado o bcrypt pode ter divergencia 
para solucionar utilize
  rm -rf node_modules
  npm install

Se a API estiver disponivel e acessivel utiize o pm2 para deixa-la permanentemente executando 
  npm install pm2 -g
  pm2 start npm --name "FRONTcrmgalago" -- start


Start API 
  Foi usado no ambiente de desenvolvimento
    Start do projeto pelo Client
      npx create-next-app@latest
        opções ativadas TypeScript - ESlint - Tailwind CSS - src directory - App Router
    Bibliotecas
      npm install react-axios
      npm install --save react-spinners
      npm install --save react-toastify
      npm i react-toggle-dark-mode
      npm install react-icons --save
      npm i react-google-charts
  
  Produção
    Dentro da pasta do front EX Cliente/frontapp 
      Altere o arquivo axios.ts
        export const makeRequest = axios.create({
            baseURL:'http://localhost:8001/api/' /* altere para o endereço da API*/
        });
      Crie o arquivo .env NEXT_PUBLIC_WEBSOCKET_URL='ws://localhost:8001' /* altere para o endereço da API*/
      Execute:  
      npm install
      npm start
  
  Teste o acesso no endereço da sua aplicação.   


