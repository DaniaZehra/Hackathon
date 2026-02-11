import os
from mongoengine import (
    Document, StringField, FloatField, ListField, DictField, connect
)
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

connect(
    db="hackathonDB",
    host=MONGO_URI,
    alias="default"
)

class User(Document):
    firstname = StringField(required=True)
    lastname = StringField(required=True)
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    balance = FloatField(default=0.0)
    monthly_spends = FloatField(default=0.0)
    daily_avg_spend = FloatField(default=0.0)
    transaction_history = ListField(DictField())  
    agent_history = ListField(DictField())

    meta = {"collection": "users"}

    @classmethod
    def get_all_users(cls):
        return cls.objects.exclude("password")

    @classmethod
    def get_user_by_id(cls, user_id):
        return cls.objects(id=user_id).exclude("password").first()

    @classmethod
    def update_user(cls, user_id, update_data):
        user = cls.objects(id=user_id).first()
        if user:
            user.update(**update_data)
            user.reload()
            user.password = None
        return user

    @classmethod
    def delete_user(cls, user_id):
        return cls.objects(id=user_id).delete()
