from pydantic import BaseModel


class Request_Body(BaseModel):
    columns: list[str]
    tables: dict[str, list[str]]
    orderby: str
    filtros: dict[str, str]
    inicio: int
    fim: int
