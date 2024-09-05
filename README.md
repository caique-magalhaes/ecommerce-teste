<h1>Ecommerce fastapi com tortoise-orm</h1>

<p>Ecommerce com Fastapi , tortoise ,Fastapi_email,jwt para gerar o token e pillow para upload de imagem.
Esse ecommerce para teste no qual o adm pode criar os produtos e fazer upload de imagens , foi utilizado
o tortoise o orm para configurar o servidor e salvar como sqlite. Nao vinculei metodos de pagamentos e nem
calculos de fretes, esse ecommerce foi feito para revisao de conteudo relacionado ao fastapi e Javascript.</p>


<h2>Instalando venv</h2>
<p>dentro da pasta em que baixou os arquivos
inicie o comando abaixo:</p>

```
python3 venv -m venv 
```

<h1>Ativando venv</h1>

```
windows -> venv\Scripts\activate.bat
linux -> source venv/bin/activate
mac -> venv/bin/activate
```
<h1>Instalando Dependencias</h1>
<p>com a venv ativa execute o codigo abaixo:</p>

```
pip install -r requirements.txt
```
<h1>iniciar o app:</h1>

```
uvicorn app.main:app --reload
```
<h2>Configurando O envio de E-mail de verificacao</h2>
<p>Para configurar o envio de e-mail de verificacao para utilizar o seu e-mail dentro da 
  pasta app do projeto baixado entre no arquivo verify_email.py e configura para seu email seguindo os passos abaixo:</p>


  ```
  conf = ConnectionConfig(
    MAIL_USERNAME='seu email',
    MAIL_PASSWORD='sua senha',
    MAIL_FROM='seu email',
    MAIL_PORT=587,
    MAIL_SERVER="servidor smtp do seu servico de email",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)
  ```


