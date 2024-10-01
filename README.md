# Problema

Atualmente, a maioria dos professores e professoras da rede pública de
educação não têm plataformas onde postar suas aulas e transmitir conhecimento
para alunos e alunas de forma prática, centralizada e tecnológica.

Inicialmente, foi desenvolvida uma aplicação utilizando recursos de no-code na plataforma OutSystems. No entanto, devido ao sucesso do sistema, agora é necessário expandi-lo. Para isso, foi acordado que será criado um back-end utilizando Node.js e um banco de dados, que poderá ser tanto SQL quanto NoSQL.

# Tecnologias

- NestJS, Express, PostgreSQL
- Frontend: Pendente
- DevOPS: Docker, GitHub Actions

# Instalação

### Instalação via Docker Compose

O compose irá subir dois containers um executando o mongoDB e outra para a aplicação;

```bash
# Clone o repositório
git clone https://github.com/vitorpc4/schoolpost.git

# Navegue até o diretório do projeto
cd schoolpost

# Modifique o no docker compose as variaveis de ambiente necessário.

#suba os containers

docker compose up -d
```

- Atenção, durante caso você enfrente problemas com o build sugiro que seja feito o seguinte procedimentos

```bash
# Execute
docker compose build --no-cache

# Em sequência torne a executar

docker compose up -d
```

### Modo de desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/vitorpc4/schoolpost.git

# Navegue até o diretório do projeto
cd schoolpost

# modifique crie um arquivo .env e modifique as suas variáveis

echo "NODE_ENV=development" > .env #development ou production
echo "PORT=3000"  > .env
echo "DATABASE_USER=user_db"  > .env
echo "DATABASE_PASSWORD=password_db"  > .env
echo "DATABASE_PORT=port_db"  > .env
echo "DATABASE_NAME=database_name"  > .env
echo "DATABASE_HOST=database_host"  > .env
echo "JWT_SECRET=secret_login"  > .env
echo "JWT_EXPIRES_IN=expire_token_login"  > .env
echo "JWT_SECRET_INVITE=secret_invite_link"  > .env

# Instale as dependências

npm install

# Execute a criação do banco de dados

# Será criado o banco de dados e suas respectivas tabelas
npm run db:create

# Execute o projeto

npm run start:dev
```

# Documentação da API

A documentação da API (Swagger) pode ser acessada através do caminho /swagger, por exemplo: localhost:3000/swagger. Nela, estão listados os endpoints da aplicação, e é possível realizar testes diretamente. Destaco também que você pode acessar o caminho /swagger/json, permitindo a importação para qualquer cliente REST de sua preferência, como Postman, Insomnia ou Bruno.

## Testes

Os testes unitários podem ser realizados com o Jest, e os dados são mockados. Foi implementada uma solução para injetar o repositório do TypeORM, permitindo que a função dentro do serviço retorne um valor mockado e confirme se o resultado esperado corresponde à entrada do mock.

Para executar os testes, utilize o seguinte comando:

```bash
num run test
```

## Entrega contínua (CI/CD)

Após a conclusão do merge de um PR para a branch main, o GitHub Actions iniciará o processo de build da imagem. Após a finalização, a imagem será enviada para o Docker Hub.

Link: https://hub.docker.com/r/vitorpc4/schoolpost

Vale ressaltar que esse build utilizará as informações da área de Secrets do GitHub.

# Instruções de uso

Para começar a utilizar API os seguintes passos

1. **Crie uma conta**: Acesse a rota /Auth/register para criar sua conta.

2. **Realize o login**: Acesse a rota /Auth/login. Você receberá um token de acesso com validade definida pelo valor do campo JWT_EXPIRES_IN no arquivo .env.

3. **Autentique-se no Swagger**: No Swagger, clique em "Authorize", cole o token de acesso e pressione "Authorize". Isso tornará todas as rotas disponíveis para uso.

4. **Crie uma escola**: Após a autenticação, execute um POST para a rota /school para criar uma nova escola.

5. **Crie um post**: Após criar a escola, você poderá criar um post utilizando o body da requisição e o cabeçalho (schoolId) da escola recém-criada.

# Instrução para criação de convite

Usuário administradores (Criador da escola). Pode realizar a criação de links de convites para permitir associação de outros usuários na escolha do respectivo usuário.

Para isso execute os seguintes passos

1. **Gere o convite**: Acesse a rota `/association/invite` para gerar um convite para o usuário.
2. **Receba o link do convite**: Um link de convite será gerado.

3. **Envie o link**: Compartilhe este link com o outro usuário.

4. **Autenticação necessária**: O usuário que receber o convite deve estar logado e enviar seu token de autenticação Bearer.

5. **Aceitação do convite**: Quando o usuário autenticado aceitar o convite, uma nova token de acesso será gerada para que ele consiga acessar os conteúdos da nova escola.

6. **Acesso garantido**: A partir do próximo login, ele terá acesso aos recursos da nova escola.

# Compreendendo a token

- A token de segurança é um JWT Bearer gerado com base na seed informada no arquivo `.env`. Se necessário, é possível alterá-la por questões de segurança para o próximo build.
- O payload da token contém informações de segurança utilizadas ao longo do projeto, como:

  - As escolas das quais o usuário faz parte;
    - O papel do usuário (aluno, professor ou editor);
    - Se o usuário é um administrador;
  - O ID do usuário.

- Todas essas informações são utilizadas como constantes no projeto para validar se o usuário solicitante realmente tem acesso aos dados requeridos.
