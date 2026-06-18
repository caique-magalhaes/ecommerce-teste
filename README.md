# Async E-Commerce Platform: FastAPI, Tortoise-ORM & Dynamic JWT Auth

<p>This e-commerce site uses FastAPI, Tortoise, FastAPI_email, JWT to generate the token, and Pillow for image uploads. This test e-commerce site allows the admin to create products and upload images. Tortoise used ORM to configure the server and save as SQLite. Payment methods and shipping calculations were not included; this e-commerce site was created for content review related to FastAPI and Javascript..</p>

## 🛠️ Tech Stack
*   **Backend Framework:** FastAPI
*   **Asynchronous ORM:** Tortoise-ORM (Asynchronous data relationships)
*   **Security & Auth:** PyJWT (JSON Web Token authentication tracking)
*   **Asset Processing:** Pillow (Dynamic image compression and processing)
*   **Automation:** FastAPI-Mail (SMTP server configuration management)
*   **Database Engine:** SQLite (Configured via tortoise system schemas)

## 🌟 Key Technical Implementations

*   **Asynchronous Content Mapping:** Utilizes Tortoise-ORM to handle user data, secure roles, and catalog persistence concurrently without blocking system cycles.
*   **Token-Based Verification Pipeline:** Integrates secure JWT tokens to authenticate administrators and protect routes for managing product updates.
*   **Decoupled Frontend UI Logic:** Employs async JavaScript components on the frontend to communicate with backend endpoints natively without full-page loads.
*   **Secure SMTP Notification Routing:** Structures an automated validation trigger using FastAPI-Mail to confirm registration.

## 💻 Local Installation & Setup

To run this application locally, follow these steps:

1. Clone the repository:
```
git clone https://github.com/caique-magalhaes/ecommerce-teste.git

cd ecommerce-teste
```

2. Set up and activate a clean Python virtual environment:

```
python3 venv -m venv 
```

3. Activating venv:

```
windows -> venv\Scripts\activate.bat
linux -> source venv/bin/activate
mac -> venv/bin/activate
```
3. Install all structural project dependencies:
```
pip install -r requirements.txt
```
4. Initialize the ASGI local testing server:

```
uvicorn app.main:app --reload
```

<p>To configure email verification using your email address within the downloaded project's app, go to the verify_email.py file and configure it to your email address following the steps below:</p>


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


