import xlsxwriter
import datetime


def generate_excel(result, output):
    # escrever os nomes das colunas

    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    colunas = result.all()[0].__table__.columns.values()
    consulta = result.all()

    date_format = workbook.add_format({"num_format": "dd/mm/yyyy"})
    bold_format = workbook.add_format({"bold": True})
    for i, coluna in enumerate(colunas):
        worksheet.write(0, i, coluna.name, bold_format)

    coluna = 0
    linha = 1
    for model in consulta:
        for key in colunas:
            if type(model.__dict__.get(key.name)) == datetime.date:
                worksheet.write(
                    linha, coluna, model.__dict__.get(key.name), date_format
                )
            else:
                worksheet.write(linha, coluna, model.__dict__.get(key.name))
            coluna += 1
        coluna = 0
        linha += 1

    workbook.close()
