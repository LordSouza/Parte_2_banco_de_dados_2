from model import (
    Ameacas,
    Atributos,
    Novidades,
    Outrosnomes,
    Relacionados,
    TaticasETecnicas,
    get_db,
)


def filter_ameaca(
    query,
    nome=None,
    categoria=None,
    risco=None,
    descricao=None,
    wiki_sumario=None,
    wiki_link=None,
    descontinuado=None,
    hora_atualizado=None,
    hora_visto=None,
    hora_descontinuado=None,
    hora_adicionado=None,
):
    if nome:
        query = query.filter(Ameacas.nome.like(f"%{nome}%"))
    if categoria:
        query = query.filter(Ameacas.categoria.like(f"%{categoria}%"))
    if risco:
        query = query.filter(Ameacas.risco.like(f"%{risco}%"))
    if descricao:
        query = query.filter(Ameacas.descricao.like(descricao))
    if wiki_sumario:
        query = query.filter(Ameacas.wiki_sumario.like(f"%{wiki_sumario}%"))
    if wiki_link:
        query = query.filter(Ameacas.wiki_link.like(f"%{wiki_link}%"))
    if descontinuado:
        query = query.filter(Ameacas.descontinuado.like(f"%{descontinuado}%"))
    # TODO arrumar a query das datas
    if hora_atualizado:
        query = query.filter(Ameacas.hora_atualizado.like(f"%{hora_atualizado}%"))
    if hora_visto:
        query = query.filter(Ameacas.hora_visto.like(f"%{hora_visto}%"))
    if hora_descontinuado:
        query = query.filter(Ameacas.hora_descontinuado.like(f"%{hora_descontinuado}%"))
    if hora_adicionado:
        query = query.filter(Ameacas.hora_adicionado.like(f"%{hora_adicionado}%"))
    return query


def filter_atributos(query, categoria=None, descricao=None):
    if categoria:
        query = query.filter(Atributos.categoria.like(f"%{categoria}%"))
    if descricao:
        query = query.filter(Atributos.descricao.like(f"%{descricao}%"))
    return query


def filter_novidades(
    query, titulo=None, canal=None, icone=None, link=None, hora_adicionado=None
):
    if titulo:
        query = query.filter(Novidades.titulo.like(f"%{titulo}%"))
    if canal:
        query = query.filter(Novidades.canal.like(f"%{canal}%"))
    if icone:
        query = query.filter(Novidades.icone.like(f"%{icone}%"))
    if link:
        query = query.filter(Novidades.link.like(f"%{link}%"))
    if hora_adicionado:
        query = query.filter(Novidades.hora_adicionado.like(f"%{hora_adicionado}%"))
    return query


def filter_outrosnomes(query, nomes=None):
    if nomes:
        query = query.filter(Outrosnomes.nomes.like(f"%{nomes}%"))
    return query


def filter_relacionados(query, nome=None, categoria=None, risco=None, hora_link=None):
    if nome:
        query = query.filter(Relacionados.nome.like(f"%{nome}%"))
    if categoria:
        query = query.filter(Relacionados.categoria.like(f"%{categoria}%"))
    if risco:
        query = query.filter(Relacionados.risco.like(f"%{risco}%"))
    if hora_link:
        query = query.filter(Relacionados.hora_link.like(f"%{hora_link}%"))
    return query


def filter_taticas_e_tecnicas(query, categoria=None, descricao=None):
    if categoria:
        query = query.filter(TaticasETecnicas.categoria.like(f"%{categoria}%"))
    if descricao:
        query = query.filter(TaticasETecnicas.descricao.like(f"%{descricao}%"))
    return query


def select_ameaca(
    inicial,
    final,
    orderby=None,
    nome=None,
    categoria=None,
    risco=None,
    descricao=None,
    wiki_sumario=None,
    wiki_link=None,
    descontinuado=None,
    hora_atualizado=None,
    hora_visto=None,
    hora_descontinuado=None,
    hora_adicionado=None,
):
    db = next(get_db())
    consulta = db.query(Ameacas).order_by(getattr(Ameacas, orderby))
    consulta = filter_ameaca(
        consulta,
        nome,
        categoria,
        risco,
        descricao,
        wiki_sumario,
        wiki_link,
        descontinuado,
        hora_atualizado,
        hora_visto,
        hora_descontinuado,
        hora_adicionado,
    )
    return consulta.slice(inicial, final)


def select_atributos(inicial, final, orderby=None, categoria=None, descricao=None):
    db = next(get_db())
    consulta = db.query(Atributos).order_by(getattr(Atributos, orderby))
    consulta = filter_atributos(consulta, categoria, descricao)
    return consulta.slice(inicial, final)


def select_novidades(
    inicial,
    final,
    orderby=None,
    titulo=None,
    canal=None,
    icone=None,
    link=None,
    hora_adicionado=None,
):
    db = next(get_db())
    consulta = db.query(Novidades).order_by(getattr(Novidades, orderby))
    consulta = filter_novidades(consulta, titulo, canal, icone, link, hora_adicionado)
    return consulta.slice(inicial, final)


def select_outrosnomes(inicial, final, orderby=None, nomes=None):
    db = next(get_db())
    consulta = db.query(Outrosnomes).order_by(getattr(Outrosnomes, orderby))
    consulta = filter_outrosnomes(consulta, nomes)
    return consulta.slice(inicial, final)


def select_relacionados(
    inicial,
    final,
    orderby=None,
    nome=None,
    categoria=None,
    risco=None,
    hora_link=None,
):
    db = next(get_db())
    consulta = db.query(Relacionados).order_by(getattr(Relacionados, orderby))
    consulta = filter_relacionados(consulta, nome, categoria, risco, hora_link)
    return consulta.slice(inicial, final)


def select_taticas_e_tecnicas(
    inicial, final, orderby=None, categoria=None, descricao=None
):
    db = next(get_db())
    consulta = db.query(TaticasETecnicas).order_by(getattr(TaticasETecnicas, orderby))
    consulta = filter_taticas_e_tecnicas(consulta, categoria, descricao)
    return consulta.slice(inicial, final)
