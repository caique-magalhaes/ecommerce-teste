from fastapi import FastAPI, Depends,Request,Query
from typing import List
from fastapi.responses import HTMLResponse,RedirectResponse
from db.db import*
from app.schema import*
from app.authenticated import*
from fastapi.security import OAuth2PasswordRequestForm
from app.models import*
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
#upload image
from fastapi import File, UploadFile
from PIL import Image
import re
from app.verify_email import send_email

app = FastAPI()
configurantion(app)


app.mount("/static",StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

#register - user / admin
@app.post("/registration-user")
async def user_registration(user:user_in):
    user_info = user.dict(exclude_unset = True)
    user_verify_email = await User.get_or_none(email=user_info['email'])
    
    if user_verify_email:
        return {"error":"Usuario e Email ja Existente no Banco"}
        
    else:
        user_info['password'] = get_hash_password(user_info['password'])
        user_obj = await User.create(**user_info)
        user_obj.log_in = True
        await user_obj.save()
        new_user = await user_data.from_tortoise_orm(user_obj)
        await send_email([new_user.email],new_user)
        
        return {"status":"ok","data":new_user}
    
    


@app.post("/registration-admin")
async def admin_registration(adm:adm_in):
    adm_info = adm.dict(exclude_unset = True)
    adm_verify_email = await Adm.get_or_none(email=adm_info['email'])
    
    if adm_verify_email:
        return {"error":"Usuario e Email ja Existente no Banco"}
        
    else:
        adm_info['password'] = get_hash_password(adm_info['password'])
        adm_obj = await Adm.create(**adm_info)
        adm_obj.log_in = True
        await adm_obj.save()
        new_adm = await user_data.from_tortoise_orm(adm_obj)
        await send_email([new_adm.email],new_adm)

        return {"status":"ok","data":new_adm}
   

#verification email
@app.get("/verification", response_class=HTMLResponse)
async def verify(request:Request,token:str):
    user = await get_current_user(token=token)

    if (user and not user.is_activated):
        user.is_activated = True
        await user.save()

        return templates.TemplateResponse(
        request=request, name="verify-email.html", context={"message":"Ativado","username":user.username}
    )
    if (user and user.is_activated):
        return templates.TemplateResponse(
         request=request, name="verify-email.html", context={"message":"Ja foi Ativado","username":user.username}
        )
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Voce nao tem permissao a algo de errado com seu token",
        headers={"WWW-Authenticate":"Bearer"}
        
    )

#create token   
@app.post("/token")
async def generation_token(form_data:OAuth2PasswordRequestForm = Depends()):
    try:
        token = await token_generator(form_data.username, form_data.password)
        return{"access_token":token, "token_type":"bearer"}
        
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario ou Senha Invalido",
            headers={"WWW-Authenticate":"Bearer"}
        )
    
    

#user-info
@app.get("/user/me")
async def user_login(user: user_in = Depends(get_current_user)):
    try:
        user.log_in= True
        await user.save()
        return {user}
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario ou Senha Invalido",
            headers={"WWW-Authenticate":"Bearer"}
        )
    

   

@app.post("/create-products")
async def create_products(product:product_in, user:user_in = Depends(get_current_user)):
    product = product.dict()
    
    if user.user_type == "user":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Para Criar Produtos deve ter Privelegio de Admnistrador",
            headers={"WWW-Authenticate":"Bearer"}
        )

    if product['price'] > 0:
        product['percentage_discount'] =  ((product['price'] - product['new_price']) / product['price'])*100

        product_obj = await Product.create(**product,creator = user)
        product_obj = await product_in.from_tortoise_orm(product_obj)

        return {"status":"ok"}
    else:
        return{"status":"something is wrong"} 


#upload image
@app.post("/uploadfile/product/{id}")
async def create_upload_file(id:int, file:UploadFile = File(...), adm:user_in = Depends(get_current_user)):
    FILEPATH = "./static/image/"
    filename = file.filename
    #teste.png >> ["teste", "png"]
    extension = filename.split(".")[1]

    if extension not in ["jpg", "png"]:
        return{"status":"error","Detail": "extensao do arquivo nao permitido"}
    
    generate_name = FILEPATH + filename
    file_content = await file.read()

    with open(generate_name, "wb") as file:
        file.write(file_content)


    #pillow

    img = Image.open(generate_name)
    img = img.resize(size=(500,667))
    img.save(generate_name)

    file.close()

    product = await Product.get(id=id)

    

    if adm:
        product.product_image=filename
        await product.save()

    return{
        "status":"ok",
        "filename":"localhost:8000"+generate_name[1:]
    }



@app.get("/products/")
async def get_products(q:str|None = Query(default=None, pattern="\w")):
    response = await product_out.from_queryset(Product.all())
    data = ''
    products=[]
    
    if (q):
         for product in response:
             data = (re.findall(product.category ,q))
             if len(data) > 0:
                 products.append(product)

    else:
        products = response 


        

    return{
        "status":"ok",
        "data":products
    }


@app.get("/product/{id}")
async def get_single_product(id:int):
    try:
        product = await product_out.from_queryset_single(Product.get(id=id))
    except:
        raise HTTPException(
           status_code=status.HTTP_404_NOT_FOUND,
           detail="Usuario Nao Encontrado",
           headers={"www-Authenticate":"Bearer"} 
        )
    
    

    return{
        "status":"ok",
        "data":product
    }



@app.post('/order-product/{id}')
async def order_product(size:str,id:int, user:user_in= Depends(get_current_user)): 

    if(size == 'null'):
            
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tamanho deve ser selecionado",
            headers={"www-Authenticate":"Bearer"}
            )
    if(not user) or user.user_type=="admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Voce deve ser um Usuario ou estar logado",
            headers={"www-Authenticate":"Bearer"}
            )
        
    
    
    product = await Product.get(id=id)
    order = await Order.create(user_order=user,item=product,
                            nome_product=product.nome,price=product.new_price if(product.new_price) else product.price,size=size)

   
    return{
        "status":"ok",
        "data":order
    }

@app.get('/read-order-product/')
async def order(user:user_in = Depends(get_current_user)):
    order = await Order._db_queryset().filter(user_order=user.id).all()

    return {
        "status":"ok",
        "data":[order]
    }



#PAGES

@app.get("/")
def init_app(request:Request):
    return templates.TemplateResponse(
        request=request,name="home.html"
    )

@app.get("/register-page/")
async def register_page(request:Request):
    return templates.TemplateResponse(
        request=request, name="registration.html"
    )

@app.get("/login/")
async def login_page(request:Request):
    return templates.TemplateResponse(
        request=request, name="login.html"
    )



@app.get('/user-info/')
async def login_page(request:Request):
    return templates.TemplateResponse(
        request=request,name="user.html"
    )

@app.get("/products-page/")
async def get_products_page(request:Request):
    return templates.TemplateResponse(
        request=request, name="products.html" 
    )

@app.get("/products-gender/{gender_type}")
async def page_gender_female(request:Request,gender_type:str):
    return templates.TemplateResponse(
        request=request, name="products-gender.html",context={"gender":gender_type}
    )


@app.get("/product-page/{id}")
async def get_single_product_page(request:Request,id:int):
    try:
            product= await Product.get(id=id)
    except:
            raise HTTPException(
             status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario Nao Encontrado",
            headers={"www-Authenticate":"Bearer"} 
            )
    
    return templates.TemplateResponse(
        request=request, name="product.html",context={"nome":product.nome,"id":product.id}
    )


@app.get('/search-products/{search}')
def get_search(request:Request,search:str):
         

    return templates.TemplateResponse(request=request, name="search.html",context={"search":search})


   

@app.get('/category/{type_category}')
def get_category(request:Request,type_category:str):
    
    

    return templates.TemplateResponse(
        request=request, name="category.html",context={"category":type_category}
    )
        


@app.get("/user-checkout/")
async def checkout(request:Request):
    return templates.TemplateResponse(
        request=request,name="checkout.html"
    )


#change status log_in
@app.put("/user-logoff/")
async def log_out(user:user_out = Depends(get_current_user)):
        try:
            user.log_in = False
            await user.save()
            return{"user":{user}}
        except:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User has been logoff",
                headers={
                    "www-Authenticate":"Bearer"
                }
            )
        

#delete product
@app.delete('/product/{id}')
async def delete_product(id:int, user:user_in = Depends(get_current_user)):
        if user and user.user_type=="admin":
            product = await Product.get(id=id)
            await product.delete()
            await product.save()

            return {"status":"Deletado"}
        
        
        return{"error":"Algo deu errado"}

        
        
