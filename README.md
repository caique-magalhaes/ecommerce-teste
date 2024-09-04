#ecommerce fastapi com tortoise-orm

Ecommerce com Fastapi , tortoise ,Fastapi_email,jwt para gerar o token e pillow para upload de imagem.
Esse ecommerce para teste no qual o adm pode criar os produtos e fazer upload de imagens , foi utilizado
o tortoise o orm para configurar o servidor e salvar como sqlite. Nao vinculei metodos de pagamentos e nem
calculos de fretes, esse ecommerce foi feito para revisao de conteudo relacionado ao fastapi e Javascript.


###Instalando venv
dentro da pasta em baixar os arquivos
inicie o comando abaixo
python3 venv -m venv 

##Ativando venv
windows -> venv\Scripts\activate.bat
linux -> source venv/bin/activate
mac -> venv/bin/activate

###Instalando Dependencias
com a venv ativa execute o codigo abaixo
pip install -r requirements.txt

iniciar o app:
uvicorn app.main:app --reload
