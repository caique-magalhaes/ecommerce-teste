from app.models import*
from tortoise.contrib.pydantic import pydantic_model_creator

user_data = pydantic_model_creator(User, name="User")

user_in = pydantic_model_creator(User, name="User_in", exclude = ("id","is_activated","join_date","log_in","user_type"))

user_out = pydantic_model_creator(User, name="User_out", exclude =("password"))

adm_data = pydantic_model_creator(Adm,name="Adm")

adm_in = pydantic_model_creator(Adm, name="Adm_in",exclude=("id","is_activated","join_date","log_in","user_type"))

product = pydantic_model_creator(Product, name="Product")


product_out = pydantic_model_creator(Product,name="Product_out", exclude="creator")
product_in = pydantic_model_creator(Product, name = "Product_in",exclude = ("percentage_discount","product_image","date_published","id","creator") )


order_out = pydantic_model_creator(Order, name="Order_out")

