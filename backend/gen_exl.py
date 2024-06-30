import xlsxwriter
import datetime
from utils import columns_name

def generate_excel(result, output):
    # escrever os nomes das colunas

    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    colunas = columns_name(result.first())
    consulta = result.all()

    date_format = workbook.add_format({"num_format": "dd/mm/yyyy"})
    bold_format = workbook.add_format({"bold": True})
    for i, coluna in enumerate(colunas):
        worksheet.write(0, i, coluna, bold_format)

    coluna = 0
    linha = 1
    for model in consulta:
        for i in model:
            if type(i) == datetime.date:
                worksheet.write(
                    linha, coluna, i, date_format
                )
            else:
                worksheet.write(linha, coluna, i)
            coluna += 1
        coluna = 0
        linha += 1

    workbook.close()
