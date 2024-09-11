from passlib.context import CryptContext
from fastapi.exceptions import HTTPException
from app.models import*
from fastapi.security import OAuth2PasswordBearer
from fastapi import status,Depends
from dotenv import dotenv_values
import jwt

configure_env = dotenv_values(".env")

SECRET_KEY = configure_env['SECRET_KEY']
ALGORITHM = configure_env['ALGORITHM']

pwd_context = CryptContext(schemes=['bcrypt'], deprecated = 'auto')
oath2_scheme = OAuth2PasswordBearer(tokenUrl='token')

#create has_password
def get_hash_password(password):
    return pwd_context.hash(password)

async def athenticate_user(username,password):
    user = await User.get_or_none(username=username)
    adm = await Adm.get_or_none(username=username)

    if user:
        secret = pwd_context.verify(password,user.password)
        if secret:
            user = await User.get(username=username)
            return user 
    if adm:
        secret_adm = pwd_context.verify(password,adm.password)
        if secret_adm:
            adm = await Adm.get(username=username)
            return adm
    return False

#create token
async def token_generator(username:str,password:str):
    user = await athenticate_user(username,password)

    if user == False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
            headers={"WWW-Aunthentic":"Beared"}
        )
    
    token_data = {
        "id":user.id,
        "username":user.username
    }

    token = jwt.encode(token_data,SECRET_KEY,algorithm=ALGORITHM )
    
    return token

#create a dependency 
async def get_current_user(token:str = Depends(oath2_scheme) ):
    try:
        payload = jwt.decode(token,SECRET_KEY,ALGORITHM)
        user = await User.get_or_none(username=payload.get("username"))
        adm = await Adm.get_or_none(username=payload.get("username"))

        if user:
           user= await User.get(id=payload.get("id"))
           return  await user
        elif adm:
            adm = await Adm.get(id=payload.get("id"))
            return await adm
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate":"Bearer"}
        )
