from tortoise import Model, fields
from datetime import datetime
from zoneinfo import ZoneInfo


class Adm(Model):
    id = fields.IntField(pk = True, index = True)
    username = fields.CharField(max_length = 50, null= False)
    email = fields.CharField(max_length = 100,unique = True,null=False)
    password = fields.CharField(max_length = 100, null=False)
    is_activated = fields.BooleanField(default = False)
    log_in = fields.BooleanField(default=False)
    join_date = fields.DatetimeField(default = datetime.utcnow)
    user_type = fields.CharField(max_length=10,default = "admin")


class Product(Model):
    id= fields.IntField(pk= True, index = True)
    nome= fields.CharField(max_length = 50, null=False)
    description= fields.CharField(max_length = 400)
    price= fields.FloatField(max_digits=10 , decimal_places=2,null=False)
    new_price= fields.FloatField(max_digits=10 ,decimal_places=2)
    percentage_discount = fields.IntField()
    product_image= fields.CharField(max_length = 200, null = False, default = "shopping-bag.png")
    date_published= fields.DateField(default = datetime.utcnow)
    gender = fields.CharField(max_length=10,null=False)
    category = fields.CharField(max_length=200,null=False)
    creator= fields.ForeignKeyField("models.Adm",related_name="product")


class User(Model):
    id = fields.IntField(pk = True, index = True)
    username = fields.CharField(max_length = 50, null= False)
    email = fields.CharField(max_length = 100,unique = True,null=False)
    password = fields.CharField(max_length = 100, null=True)
    is_activated = fields.BooleanField(default = False)
    log_in = fields.BooleanField(default=False)
    join_date = fields.DatetimeField(default = datetime.now(tz=ZoneInfo("America/Sao_Paulo")))
    user_type = fields.CharField(max_length=10,default = "user")


class Order(Model):
    id =  fields.IntField(pk=True, index=True)
    nome_product = fields.CharField(max_length = 50,null=False)
    user_order = fields.ForeignKeyField("models.User",related_name="user_order")
    item = fields.ForeignKeyField("models.Product", related_name="item") 
    date_order = fields.DatetimeField(default = datetime.now(tz=ZoneInfo("America/Sao_Paulo")))
    size = fields.CharField(max_length = 5, null=False)
    price = fields.FloatField(max_digits=10,decimal_places=2,null=False)
     
    
    





    
