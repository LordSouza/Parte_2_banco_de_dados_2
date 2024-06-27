from fastapi import FastAPI, Request
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
from schemas import Request_Body

app = FastAPI()


class Response:
    def __init__(self, status: HTTPStatus, message: str, result: list = []):
        self.status = status
        self.message = message
        self.result = result

    def __dict__(self):
        return {"status": self.status, "message": self.message, "result": self.result}


@app.post("/ameacas")
def get_ameacas(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_ameaca(
            request.inicio,
            request.fim,
            orderby=request.orderby,
            filtros=request.filtros,
            columns=request.columns,
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


@app.post("/atributos")
def get_atributos(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_atributos(
            request.inicio,
            request.fim,
            orderby=request.orderby,
            filtros=request.filtros,
            columns=request.columns,
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


@app.post("/novidades")
def get_novidades(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_novidades(
            request.inicio,
            request.fim,
            orderby=request.orderby,
            filtros=request.filtros,
            columns=request.columns,
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


@app.post("/outrosnomes")
def get_outrosnomes(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_outrosnomes(
            request.inicio,
            request.fim,
            orderby=request.orderby,
            filtros=request.filtros,
            columns=request.columns,
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


@app.post("/relacionados")
def get_relacionados(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_relacionados(
            request.inicio,
            request.fim,
            orderby=request.orderby,
            filtros=request.filtros,
            columns=request.columns,
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


@app.post("/taticas_e_tecnicas")
def get_taticas_e_tecnicas(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_taticas_e_tecnicas(
            request.inicio,
            request.fim,
            orderby=request.orderby,
            filtros=request.filtros,
            columns=request.columns,
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


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
