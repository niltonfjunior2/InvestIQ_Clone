import os
import sys

# Insere a pasta do backend no PATH do sistema para permitir a importação de app.main
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

# Importa a instância FastAPI principal
from app.main import app 

# O Vercel lidará automaticamente com 'app'
