from fastapi import FastAPI
from repository import (
    select_ameaca,
    select_atributos,
    select_novidades,
    select_outrosnomes,
    select_relacionados,
    select_taticas_e_tecnicas,
)
from http import HTTPStatus
import uvicorn
from utils import calcular_quantidade_de_linhas
app = FastAPI()


class Response:
    def __init__(self, status: HTTPStatus, message: str, result: list = []):
        self.status = status
        self.message = message
        self.result = result

    def __dict__(self):
        return {"status": self.status, "message": self.message, "result": self.result}


@app.get("/ameacas")
def get_ameacas(
    inicial: int = 0,
    final: int = 10,
    orderby: str = "tid",
    nome: str = None,
    categoria: str = None,
    risco: str = None,
    descricao: str = None,
    wiki_sumario: str = None,
    wiki_link: str = None,
    descontinuado: str = None,
    hora_atualizado: str = None,
    hora_visto: str = None,
    hora_descontinuado: str = None,
    hora_adicionado: str = None,
):
    try:
        calcular_quantidade_de_linhas(inicial, final)
        result = select_ameaca(
            inicial,
            final,
            orderby=orderby,
            nome=nome,
            categoria=categoria,
            risco=risco,
            descricao=descricao,
            wiki_sumario=wiki_sumario,
            wiki_link=wiki_link,
            descontinuado=descontinuado,
            hora_atualizado=hora_atualizado,
            hora_visto=hora_visto,
            hora_descontinuado=hora_descontinuado,
            hora_adicionado=hora_adicionado,
        )
        response = Response(
            HTTPStatus.OK,
            "Ameaças retornadas com sucesso",
            [item.__dict__ for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.get("/atributos")
def get_atributos(
    inicial: int = 0,
    final: int = 10,
    orderby: str = "atid",
    categoria: str = None,
    descricao: str = None,
):
    try:
        calcular_quantidade_de_linhas(inicial, final)
        result = select_atributos(
            inicial, final, orderby=orderby, categoria=categoria, descricao=descricao
        )
        response = Response(
            HTTPStatus.OK,
            "Atributos retornados com sucesso",
            [item.__dict__ for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.get("/novidades")
def get_novidades(
    inicial: int = 0,
    final: int = 10,
    orderby: str = "nid",
    titulo: str = None,
    canal: str = None,
    icone: str = None,
    link: str = None,
    hora_adicionado: str = None,
):
    try:
        calcular_quantidade_de_linhas(inicial, final)
        result = select_novidades(
            inicial,
            final,
            orderby=orderby,
            titulo=titulo,
            canal=canal,
            icone=icone,
            link=link,
            hora_adicionado=hora_adicionado,
        )
        response = Response(
            HTTPStatus.OK,
            "Novidades retornadas com sucesso",
            [item.__dict__ for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.get("/outrosnomes")
def get_outrosnomes(
    inicial: int = 0, final: int = 10, orderby: str = "onid", nomes: str = None
):
    try:
        calcular_quantidade_de_linhas(inicial, final)
        result = select_outrosnomes(inicial, final, orderby=orderby, nomes=nomes)
        response = Response(
            HTTPStatus.OK,
            "Outros nomes retornados com sucesso",
            [item.__dict__ for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.get("/relacionados")
def get_relacionados(
    inicial: int = 0,
    final: int = 10,
    orderby: str = "relid",
    nome: str = None,
    categoria: str = None,
    risco: str = None,
    hora_link: str = None,
):
    try:
        calcular_quantidade_de_linhas(inicial, final)
        result = select_relacionados(
            inicial,
            final,
            orderby=orderby,
            nome=nome,
            categoria=categoria,
            risco=risco,
            hora_link=hora_link,
        )
        response = Response(
            HTTPStatus.OK,
            "Relacionados retornados com sucesso",
            [item.__dict__ for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.get("/taticas_e_tecnicas")
def get_taticas_e_tecnicas(
    inicial: int = 0,
    final: int = 10,
    orderby: str = "ttpsid",
    categoria: str = None,
    descricao: str = None,
):
    try:
        calcular_quantidade_de_linhas(inicial, final)
        result = select_taticas_e_tecnicas(
            inicial, final, orderby=orderby, categoria=categoria, descricao=descricao
        )
        response = Response(
            HTTPStatus.OK,
            "Táticas e técnicas retornadas com sucesso",
            [item.__dict__ for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
