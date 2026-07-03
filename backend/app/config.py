import os
from dotenv import load_dotenv
load_dotenv()
class Settings:
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
    mongo_db_name = os.getenv('MONGO_DB_NAME', 'blogapp')
    jwt_secret_key = os.getenv('JWT_SECRET_KEY', 'insecure_dev_secret')
    jwt_algorithm = os.getenv('JWT_ALGORITHM', 'HS256')
    access_token_expire_minutes = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60'))
    cors_origins = [x.strip() for x in os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')]
settings = Settings()
