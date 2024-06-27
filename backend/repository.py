from model import (
    Ameacas,
    Atributos,
    Novidades,
    Outrosnomes,
    Relacionados,
    TaticasETecnicas,
    get_db,
)
from sqlalchemy.orm import load_only


def filtrar_atributos(
    query,
    filtros,
):
    for coluna, filtro in filtros.items():
        query = query.filter(getattr(Ameacas, coluna).like(f"%{filtro}%"))
    return query


def get_column(consulta, entidade, columns):
    colunas = [getattr(entidade, coluna) for coluna in columns]
    consulta = consulta.options(load_only(*colunas))
    return consulta


def select_ameaca(
    inicial,
    final,
    orderby=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # TODO dar join
    consulta = db.query(Ameacas).order_by(getattr(Ameacas, orderby))
    consulta = filtrar_atributos(consulta, filtros)
    if columns:
        consulta = get_column(consulta, Ameacas, columns)
    return consulta.slice(inicial, final).all()


def select_atributos(
    inicial,
    final,
    orderby=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # TODO dar join
    consulta = db.query(Atributos).order_by(getattr(Atributos, orderby))
    consulta = filtrar_atributos(consulta, filtros)
    if columns:
        consulta = get_column(consulta, Atributos, columns)
    return consulta.slice(inicial, final).all()


def select_novidades(
    inicial,
    final,
    orderby=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # TODO dar join
    consulta = db.query(Novidades).order_by(getattr(Novidades, orderby))
    consulta = filtrar_atributos(consulta, filtros)
    if columns:
        consulta = get_column(consulta, Novidades, columns)
    return consulta.slice(inicial, final).all()


def select_outrosnomes(
    inicial,
    final,
    orderby=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # TODO dar join
    consulta = db.query(Outrosnomes).order_by(getattr(Outrosnomes, orderby))
    consulta = filtrar_atributos(consulta, filtros)
    if columns:
        consulta = get_column(consulta, Outrosnomes, columns)
    return consulta.slice(inicial, final).all()


def select_relacionados(
    inicial,
    final,
    orderby=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # TODO dar join
    consulta = db.query(Relacionados).order_by(getattr(Relacionados, orderby))
    consulta = filtrar_atributos(consulta, filtros)
    if columns:
        consulta = get_column(consulta, Relacionados, columns)
    return consulta.slice(inicial, final).all()


def select_taticas_e_tecnicas(
    inicial,
    final,
    orderby=None,
    filtros=None,
    columns=None,
):
    db = next(get_db())
    # TODO dar join
    consulta = db.query(TaticasETecnicas).order_by(getattr(TaticasETecnicas, orderby))
    consulta = filtrar_atributos(consulta, filtros)
    if columns:
        consulta = get_column(consulta, TaticasETecnicas, columns)
    return consulta.slice(inicial, final).all()
