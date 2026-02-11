from pydantic import BaseModel, Field
from typing import List
class Holding(BaseModel):
    ticker: str = Field(..., example="AAPL")
    value: float = Field(..., gt=0, example=50000.0)
    sector: str = Field(..., example="Technology")

class PortfolioRequest(BaseModel):
    holdings: List[Holding]

class AnalysisResponse(BaseModel):
    status: str
    report: str