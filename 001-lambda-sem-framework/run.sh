# 1. criar as politicas.json

# 2. criar a role na aws
aws iam create-role \
  --role-name lambda-exemplo \
  --assume-role-policy-document file://politicas.json \
  | tee logs/role.log

# 3. criar o zip do arquivo js (da function)
zip function.zip index.js

# 4. criar a function
aws lambda create-function \
  --function-name hello-cli \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime nodejs12.x \
  --role arn:aws:iam::064619513893:role/lambda-exemplo \
  | tee logs/lambda-create.log

# 5. invocar a function
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec.log