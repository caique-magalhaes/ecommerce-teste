from tortoise.contrib.fastapi import register_tortoise
from app.models import*


def configurantion(app):
    register_tortoise(
        app=app,
        db_url="sqlite://db/database.sqlite3",
        modules={"models":["app.models"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )