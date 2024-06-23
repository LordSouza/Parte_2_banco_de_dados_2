from fastapi import FastAPI
from model import *
import json
from http import HTTPStatus
app = FastAPI()

class Response:
    def __init__(self, status: HTTPStatus, message: str, result: list = []):
        self.status = status
        self.message = message
        self.result = result
    
    def __dict__(self):
        return {
            "status": self.status,
            "message": self.message,
            "result": self.result
        }

@app.get("/ameacas")
def get_ameacas(inicial: int = 0, final: int = 10):
    # TODO fazer operações de banco de dados em outro arquivo
    db = next(get_db())
    result = db.query(Ameacas).order_by(Ameacas.tid).slice(inicial, final).all()
    response = Response(HTTPStatus.OK, "Ameaças retornadas com sucesso", [item.__dict__ for item in result])
    return response.__dict__()

@app.get("/atributos")
def get_atributos(inicial: int = 0, final: int = 10):
    # TODO fazer operações de banco de dados em outro arquivo
    db = next(get_db())
    result = db.query(Atributos).order_by(Atributos.atid).slice(inicial, final).all()
    response = Response(HTTPStatus.OK, "Atributos retornados com sucesso", [item.__dict__ for item in result])
    return response.__dict__()

@app.get("/novidades")
def get_novidades(inicial: int = 0, final: int = 10):
    # TODO fazer operações de banco de dados em outro arquivo
    db = next(get_db())
    result = db.query(Novidades).order_by(Novidades.nid).slice(inicial, final).all()
    response = Response(HTTPStatus.OK, "Novidades retornadas com sucesso", [item.__dict__ for item in result])
    return response.__dict__()

@app.get("/outrosnomes")
def get_outrosnomes(inicial: int = 0, final: int = 10):
    # TODO fazer operações de banco de dados em outro arquivo
    db = next(get_db())
    result = db.query(Outrosnomes).order_by(Outrosnomes.onid).slice(inicial, final).all()
    response = Response(HTTPStatus.OK, "Outros nomes retornados com sucesso", [item.__dict__ for item in result])
    return response.__dict__()

@app.get("/relacionados")
def get_relacionados(inicial: int = 0, final: int = 10):
    # TODO fazer operações de banco de dados em outro arquivo
    db = next(get_db())
    result = db.query(Relacionados).order_by(Relacionados.relid).slice(inicial, final).all()
    response = Response(HTTPStatus.OK, "Relacionados retornados com sucesso", [item.__dict__ for item in result])
    return response.__dict__()

@app.get("/taticas_e_tecnicas")
def get_taticas_e_tecnicas(inicial: int = 0, final: int = 10):
    # TODO fazer operações de banco de dados em outro arquivo
    db = next(get_db())
    result = db.query(TaticasETecnicas).order_by(TaticasETecnicas.ttpsid).slice(inicial, final).all()
    response = Response(HTTPStatus.OK, "Táticas e técnicas retornadas com sucesso", [item.__dict__ for item in result])
    return response.__dict__()