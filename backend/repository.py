from model import (
    Ameacas,
    Atributos,
    Novidades,
    Outrosnomes,
    Relacionados,
    TaticasETecnicas,
    get_db,
)
from sqlalchemy import (
    Date,
    Enum,
    Integer,
)
from sqlalchemy.orm import query
import datetime

def get_model(consulta: query.Query, model, tables: list[str]):
    model_list = [
        Ameacas,
        Atributos,
        Novidades,
        Outrosnomes,
        Relacionados,
        TaticasETecnicas,
    ]
    # pegar os atributos de acordo com a model list
    model_list = [mod for mod in model_list if mod.__name__ in tables.keys()]
    for m in model_list:
        for key, values in tables.items():
            if key == m.__name__:
                consulta = get_column_join(consulta, m, values)
    # fazer o join
    for mod in model_list:
        consulta = consulta.join(mod, getattr(mod, "tid") == getattr(model, "tid"))
    return consulta


def get_column_join(query: query.Query, model, columns):
    colunas = [getattr(model, coluna) for coluna in columns]
    if not colunas:
        for col in model.__table__.columns.values():
            colunas.append(getattr(model, col.name))
    consulta = query.add_columns(*colunas)
    return consulta


def filtrar_atributos(
    query,
    model,
    filtros,
):
    for coluna, filtro in filtros.items():
        atrib = getattr(model, coluna)
        if type(atrib.type) == Date:
            query = query.filter(
                atrib == datetime.datetime.strptime(filtro, "%Y-%m-%d")
            )
        elif type(atrib.type) == Integer:
            query = query.filter(atrib == int(filtro))
        elif type(atrib.type) == Enum:
            query = query.filter(atrib == filtro)
        else:
            query = query.filter(atrib.like(f"%{filtro}%"))
    return query


def get_column(session, model, columns):
    colunas = [getattr(model, coluna) for coluna in columns]
    if not colunas:
        for col in model.__table__.columns.values():
            colunas.append(getattr(model, col.name))

    consulta = session.query(*colunas)
    return consulta


def realizar_consulta(
    model,
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # pegar as colunas
    consulta = get_column(db, model, columns)
    # dar order by
    if orderby == "":
        consulta = consulta.order_by(
            getattr(model, model.__table__.primary_key.columns.keys()[0])
        )
    else:
        consulta = consulta.order_by(getattr(model, orderby))
    # fazer join
    consulta = get_model(consulta, model, tables)
    # fazer filtros
    consulta = filtrar_atributos(consulta,model, filtros)

    return consulta


def select_ameaca(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    return realizar_consulta(Ameacas, orderby, tables, filtros, columns)


def select_atributos(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    return realizar_consulta(Atributos, orderby, tables, filtros, columns)


def select_novidades(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    return realizar_consulta(Novidades, orderby, tables, filtros, columns)


def select_outrosnomes(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    return realizar_consulta(Outrosnomes, orderby, tables, filtros, columns)


def select_relacionados(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    return realizar_consulta(Relacionados, orderby, tables, filtros, columns)


def select_taticas_e_tecnicas(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    return realizar_consulta(TaticasETecnicas, orderby, tables, filtros, columns)
