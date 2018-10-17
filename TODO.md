## Login

POST /user
```
{
    "email": "string",
    "password": "string"
}
```

Validações:
- Email está cadastrado?
- Senha está certa?

200
```
{
    "userToken": "string" (pode ser o id do usuario, algo que dê pra buscar as infos dele)
}
```
--

## Register
POST /user/register
```
{
    "email": "string",
    "password": "string"
    "checkPassword": "string"
}
```

Validações:
- Email já foi usado?
- Senha e confirmação da senha são iguais? (opcional, vou fazer essa validação no app também)

200
```
{
    "userToken": "string" (pode ser o id do usuario, algo que dê pra buscar as infos dele)
}
```
--

## Join session

### Join as guest
POST /sessions/join

```
{
    "sessionId": "string"
}
```

Validações:
- Sessão existe?

--

### Join as user
POST /sessions/join\
Header:
```
"Authenticated": "userToken"
```

```
{
    "sessionId": "string"
}
```

Validações:
- Sessão existe?
- Sessão está ativa?
- Email é de algum usuário?

Obs.: setar no usuário a sessão que ele acabou de entrar. Mas antes, verificar se `session == ""`, caso contrário verificar se o usuário era dono da sessão que ele estava. Caso fosse, alterar o campo `isActive` para `false`.

--

## Create session
POST /sessions\
Header:
```
"Authenticated": "userToken"
```
Body:
```
{
    "pin": "string",
    "time": "string"
}
```

Validações:
- Email está cadastrado?
- Usuário está conectado em alguma sessão?

Obs.: setar no usuário a sessão que ele acabou de entrar num campo de sessão atual e na lista das sessões criadas por ele. Mas antes, verificar se `session == ""`, caso contrário verificar se o usuário era dono da sessão que ele estava. Caso fosse, alterar o campo `isActive` para `false`.


## Fetch sessions

### Fetch sessions created by user
GET /sessions/\
Header:
```
"Authenticated": "userToken"
```

Validações:
- Token é valido? (usuario existe?)

200 (retorna apenas sessões criadas pelo usuário)
```
{
    "sessions": [
        "string",
        "string",
        ...
        "string"
    ]
}
```

### Fetch active sessions
GET /sessions/active

Validações:
- Token é valido? (usuario existe?)

200 (retorna todas as sessões ativas)
```
{
    "sessions": [
        "string",
        "string",
        ...
        "string"
    ]
}
```
--

## Tratamento de erros

Caso ocorra algum erro retornar status do erro e um json no seguinte formato
```
{
    "message": "string"
}
```
com uma mensagem descrevendo pq ocorreu o erro.
Obs.: é bom ter uma mensagem padrão pra caso passe por todas validações mas ainda dê erro, algo como
```
{
    "message": "Oops! Algo deu errado"
}
```
