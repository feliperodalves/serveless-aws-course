const decoratorValidator = (fn, schema, argsType) => {
  return async function (event) {
    const data = JSON.parse(event[argsType]);

    // abortEarly -> para mostrar os error de uma só vez
    const { error, value } = await schema.validate(data, {
      abortEarly: false,
    });

    // para alterar a instancia de arguments
    // que contém todos os argumentos passados para a função e mandar para frente (next())
    // apply vai retornar a função que será executada posteriormente
    event[argsType] = value;

    if (!error) return fn.apply(this, arguments);

    return {
      statusCode: 422,
      body: error.message,
    };
  };
};
module.exports = decoratorValidator;
