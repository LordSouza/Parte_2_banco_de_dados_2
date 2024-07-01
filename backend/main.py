from io import BytesIO
from fastapi import FastAPI
from gen_exl import generate_excel
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
from utils import calcular_quantidade_de_linhas, column_name
from schemas import Request_Body
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        result = (
            select_ameaca(
                orderby=request.orderby,
                tables=request.tables,
                filtros=request.filtros,
                columns=request.columns,
            )
            .slice(request.inicio, request.fim)
            .all()
        )
        response = Response(
            HTTPStatus.OK,
            "Ameaças retornadas com sucesso",
            [dict(zip(column_name(item), item)) for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/ameacas/excel")
def get_ameacas_excel(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_ameaca(
            orderby=request.orderby,
            tables=request.tables,
            filtros=request.filtros,
            columns=request.columns,
        )
        output = BytesIO()
        generate_excel(result, output)
        output.seek(0)
        headers = {"Content-Disposition": 'attachment; filename="ameacas.xlsx"'}
        return StreamingResponse(output, headers=headers)

    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/atributos")
def get_atributos(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = (
            select_atributos(
                orderby=request.orderby,
                tables=request.tables,
                filtros=request.filtros,
                columns=request.columns,
            )
            .slice(request.inicio, request.fim)
            .all()
        )
        response = Response(
            HTTPStatus.OK,
            "Atributos retornadas com sucesso",
            [dict(zip(column_name(item), item)) for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/atributos/excel")
def get_atributos_excel(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_atributos(
            orderby=request.orderby,
            tables=request.tables,
            filtros=request.filtros,
            columns=request.columns,
        )
        output = BytesIO()
        generate_excel(result, output)
        output.seek(0)
        headers = {"Content-Disposition": 'attachment; filename="atributos.xlsx"'}
        return StreamingResponse(output, headers=headers)

    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/novidades")
def get_novidades(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = (
            select_novidades(
                orderby=request.orderby,
                tables=request.tables,
                filtros=request.filtros,
                columns=request.columns,
            )
            .slice(request.inicio, request.fim)
            .all()
        )
        response = Response(
            HTTPStatus.OK,
            "Novidades retornadas com sucesso",
            [dict(zip(column_name(item), item)) for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/novidades/excel")
def get_novidades_excel(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_novidades(
            orderby=request.orderby,
            tables=request.tables,
            filtros=request.filtros,
            columns=request.columns,
        )
        output = BytesIO()
        generate_excel(result, output)
        output.seek(0)
        headers = {"Content-Disposition": 'attachment; filename="novidades.xlsx"'}
        return StreamingResponse(output, headers=headers)

    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/outrosnomes")
def get_outrosnomes(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = (
            select_outrosnomes(
                orderby=request.orderby,
                tables=request.tables,
                filtros=request.filtros,
                columns=request.columns,
            )
            .slice(request.inicio, request.fim)
            .all()
        )
        response = Response(
            HTTPStatus.OK,
            "OutrosNomes retornadas com sucesso",
            [dict(zip(column_name(item), item)) for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/outrosnomes/excel")
def get_outrosnomes_excel(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_outrosnomes(
            orderby=request.orderby,
            tables=request.tables,
            filtros=request.filtros,
            columns=request.columns,
        )
        output = BytesIO()
        generate_excel(result, output)
        output.seek(0)
        headers = {"Content-Disposition": 'attachment; filename="outrosnomes.xlsx"'}
        return StreamingResponse(output, headers=headers)

    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/relacionados")
def get_relacionados(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = (
            select_relacionados(
                orderby=request.orderby,
                tables=request.tables,
                filtros=request.filtros,
                columns=request.columns,
            )
            .slice(request.inicio, request.fim)
            .all()
        )
        response = Response(
            HTTPStatus.OK,
            "Relacionados retornadas com sucesso",
            [dict(zip(column_name(item), item)) for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/relacionados/excel")
def get_relacionados_excel(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_relacionados(
            orderby=request.orderby,
            tables=request.tables,
            filtros=request.filtros,
            columns=request.columns,
        )
        output = BytesIO()
        generate_excel(result, output)
        output.seek(0)
        headers = {"Content-Disposition": 'attachment; filename="relacionados.xlsx"'}
        return StreamingResponse(output, headers=headers)

    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/taticas_e_tecnicas")
def get_taticas_e_tecnicas(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = (
            select_taticas_e_tecnicas(
                orderby=request.orderby,
                tables=request.tables,
                filtros=request.filtros,
                columns=request.columns,
            )
            .slice(request.inicio, request.fim)
            .all()
        )
        response = Response(
            HTTPStatus.OK,
            "Taticas e Tecnicas retornadas com sucesso",
            [dict(zip(column_name(item), item)) for item in result],
        )
        return response.__dict__()
    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


@app.post("/taticas_e_tecnicas/excel")
def get_taticas_e_tecnicas_excel(
    request: Request_Body,
):
    try:
        calcular_quantidade_de_linhas(request.inicio, request.fim)
        result = select_taticas_e_tecnicas(
            orderby=request.orderby,
            tables=request.tables,
            filtros=request.filtros,
            columns=request.columns,
        )
        output = BytesIO()
        generate_excel(result, output)
        output.seek(0)
        headers = {"Content-Disposition": 'attachment; filename="taticas_e_tecnicas.xlsx"'}
        return StreamingResponse(output, headers=headers)

    except Exception as e:
        response = Response(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        return response.__dict__()


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
