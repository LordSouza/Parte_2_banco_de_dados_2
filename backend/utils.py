def calcular_quantidade_de_linhas(inicio, fim):
    if inicio > fim:
        raise ValueError("O início não pode ser maior que o fim")
    if fim - inicio > 100:
        raise ValueError("O intervalo não pode ser maior que 100")
    if inicio < 0 or fim < 0:
        raise ValueError("O início ou o fim não pode ser negativo")
