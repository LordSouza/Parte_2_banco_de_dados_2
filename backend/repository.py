from model import (
    Ameacas,
    Atributos,
    Novidades,
    Outrosnomes,
    Relacionados,
    TaticasETecnicas,
    get_db,
)
from sqlalchemy.orm import query


def get_model(consulta: query.Query, model, tables: list[str]):
    model_list = [
        Ameacas,
        Atributos,
        Novidades,
        Outrosnomes,
        Relacionados,
        TaticasETecnicas,
    ]
    # list comprehension para pegar a classe do model
    model_list = [mod for mod in model_list if mod.__name__ in tables]
    # pegar a chave primaria
    # fazer o join
    for mod in model_list:
        consulta = consulta.join(
            mod, getattr(mod, "tid") == getattr(model, "tid")
        )
        consulta = get_column_join(consulta, mod, [])
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
    filtros,
):
    for coluna, filtro in filtros.items():
        query = query.filter(getattr(Ameacas, coluna).like(f"%{filtro}%"))
    return query


def get_column(session, model, columns):
    colunas = [getattr(model, coluna) for coluna in columns]
    if not colunas:
        for col in model.__table__.columns.values():
            colunas.append(getattr(model, col.name))

    consulta = session.query(*colunas)
    return consulta


def select_ameaca(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # pegar as colunas
    consulta = get_column(db, Ameacas, columns)
    # dar order by
    if orderby == "":
        consulta = consulta.order_by(getattr(Ameacas, Ameacas.__table__.primary_key.columns.keys()[0]))
    else:
        consulta = consulta.order_by(getattr(Ameacas, orderby))
    # fazer join
    consulta = get_model(consulta, Ameacas, tables)
    # fazer filtros
    consulta = filtrar_atributos(consulta, filtros)

    return consulta


def select_atributos(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # pegar as colunas
    consulta = get_column(db, Atributos, columns)
    # dar order by
    if orderby == "":
        consulta = consulta.order_by(getattr(Atributos, Atributos.__table__.primary_key.columns.keys()[0]))
    else:
        consulta = consulta.order_by(getattr(Atributos, orderby))
    # fazer join
    consulta = get_model(consulta, Atributos, tables)
    # fazer filtros
    consulta = filtrar_atributos(consulta, filtros)

    return consulta


def select_novidades(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # pegar as colunas
    consulta = get_column(db, Novidades, columns)
    # dar order by
    if orderby == "":
        consulta = consulta.order_by(getattr(Novidades, Novidades.__table__.primary_key.columns.keys()[0]))
    else:
        consulta = consulta.order_by(getattr(Novidades, orderby))
    # fazer join
    consulta = get_model(consulta, Novidades, tables)
    # fazer filtros
    consulta = filtrar_atributos(consulta, filtros)

    return consulta

def select_outrosnomes(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # pegar as colunas
    consulta = get_column(db, Outrosnomes, columns)
    # dar order by
    if orderby == "":
        consulta = consulta.order_by(getattr(Outrosnomes, Outrosnomes.__table__.primary_key.columns.keys()[0]))
    else:
        consulta = consulta.order_by(getattr(Outrosnomes, orderby))
    # fazer join
    consulta = get_model(consulta, Outrosnomes, tables)
    # fazer filtros
    consulta = filtrar_atributos(consulta, filtros)

    return consulta


def select_relacionados(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # pegar as colunas
    consulta = get_column(db, Relacionados, columns)
    # dar order by
    if orderby == "":
        consulta = consulta.order_by(getattr(Relacionados, Relacionados.__table__.primary_key.columns.keys()[0]))
    else:
        consulta = consulta.order_by(getattr(Relacionados, orderby))
    # fazer join
    consulta = get_model(consulta, Relacionados, tables)
    # fazer filtros
    consulta = filtrar_atributos(consulta, filtros)

    return consulta


def select_taticas_e_tecnicas(
    orderby=None,
    tables=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # pegar as colunas
    consulta = get_column(db, TaticasETecnicas, columns)
    # dar order by
    if orderby == "":
        consulta = consulta.order_by(getattr(TaticasETecnicas, TaticasETecnicas.__table__.primary_key.columns.keys()[0]))
    else:
        consulta = consulta.order_by(getattr(TaticasETecnicas, orderby))
    # fazer join
    consulta = get_model(consulta, TaticasETecnicas, tables)
    # fazer filtros
    consulta = filtrar_atributos(consulta, filtros)

    return consulta