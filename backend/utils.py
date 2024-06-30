from sqlalchemy.sql import annotation


def calcular_quantidade_de_linhas(inicio, fim):
    if inicio > fim:
        raise ValueError("O início não pode ser maior que o fim")
    if fim - inicio > 100:
        raise ValueError("O intervalo não pode ser maior que 100")
    if inicio < 0 or fim < 0:
        raise ValueError("O início ou o fim não pode ser negativo")


def column_name(item):
    columns = [i for i in item._key_to_index if type(i) == annotation.AnnotatedColumn]
    for column in columns:
        yield f"{column.table.name}.{column.name}"

def columns_name(item):
    columns = [i for i in item._key_to_index if type(i) == annotation.AnnotatedColumn]
    list_names = []
    for column in columns:
        list_names.append(f"{column.table.name}.{column.name}")
    return list_names