# 1. Instalar o Serverless Framework
npm install -g serverless

# 2. Verificar versão
sls -v

# 3. Iniciar um projeto
sls

# 4. Sempre fazer deploy do projeto
sls deploy

# 5. Invocar a função
sls invoke -f hello
sls invoke local -f hello

# 6. Visualizar logs
sls logs -f hello -t

# 6. Configurar Dashibard Serverless
sls remove