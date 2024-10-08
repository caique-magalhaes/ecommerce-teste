from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import List
from app.models import User
from dotenv import dotenv_values
import jwt

configure_env = dotenv_values(".env")

SECRET_KEY = configure_env['SECRET_KEY']
ALGORITHM = configure_env['ALGORITHM']

conf = ConnectionConfig(
    MAIL_USERNAME=configure_env['MAIL_USERNAME'],
    MAIL_PASSWORD=configure_env['MAIL_PASSWORD'],
    MAIL_FROM=configure_env['MAIL_USERNAME'],
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,

)

async def send_email(email:List, instance:User):
    token_data ={
        "id":instance.id,
        "username":instance.username
    }

    token = jwt.encode(token_data,SECRET_KEY,algorithm=ALGORITHM)

    template = f'''
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="{{url_for('static', path='style/verify_email.css')}}">
                <title>veriry - email</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@200;400;500;700&display=swap');
                </style>
            </head>
            <body style= "text-align: center;font-family: "Nunito Sans", sans-serif;">
                <main style= "margin-top: 4em;">
                    <h1>Ecommerce</h1>
                    <h2>{instance.username} Voce precisa Verificar Seu e-mail!!!</h1>
                    <p>{instance.username} Obrigado por escolher nossa loja</p>

                    <a style="text-decoration: none;color: #fff;border: 1px solid  #000;background-color: #000;padding: 8px;border-radius: 8px;" class="veriry-btn" href="http://127.0.0.1:8000/verification/?token={token}">Verify</a>
                </main>
                
            </body>
            </html>
    '''

    message = MessageSchema(
        subject="Ecommerce Verifique sua Conta",
        recipients=email,
        body=template,
        subtype='html'

    )

    fm = FastMail(conf)
    await fm.send_message(message=message)