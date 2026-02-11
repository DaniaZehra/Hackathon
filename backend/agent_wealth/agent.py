from crewai import Agent, Task, Crew, Process, LLM
from crewai.tools import tool
from langchain_google_genai import GoogleGenerativeAI
import yfinance as yf
import pandas as pd
from typing import List, Dict
import json
import os
from dotenv import load_dotenv

@tool("get_market_data")
def get_market_data(ticker: str, period: str = "1mo") -> str:
    """Fetch historical market data for a given ticker and period."""
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period)
        info = stock.info
        
        hist_summary = {}
        if not hist.empty:
            hist_summary = {
                'start_date': str(hist.index[0]),
                'end_date': str(hist.index[-1]),
                'current_close': float(hist['Close'].iloc[-1]),
                'period_high': float(hist['High'].max()),
                'period_low': float(hist['Low'].min()),
                'avg_volume': float(hist['Volume'].mean())
            }
        
        result = {
            'ticker': ticker,
            'current_price': info.get('currentPrice', info.get('regularMarketPrice')),
            'previous_close': info.get('regularMarketPreviousClose'),
            'day_change': info.get('regularMarketChange'),
            'day_change_percent': info.get('regularMarketChangePercent'),
            '52_week_high': info.get('fiftyTwoWeekHigh'),
            '52_week_low': info.get('fiftyTwoWeekLow'),
            'pe_ratio': info.get('trailingPE'),
            'market_cap': info.get('marketCap'),
            'company_name': info.get('longName', info.get('shortName')),
            'sector': info.get('sector'),
            'history_summary': hist_summary
        }
        
        result = {k: v for k, v in result.items() if v is not None}
        return json.dumps(result, indent=2, default=str)
    except Exception as e:
        return json.dumps({"error": f"Failed to fetch data for {ticker}: {str(e)}"}, indent=2)



@tool("analyse_portfolio")
def analyse_portfolio(portfolio_data: List[Dict]) -> str:
    """Analyze the user's investment portfolio and provide insights."""
    try:
        if isinstance(portfolio_data, str):
            portfolio = json.loads(portfolio_data)
        else:
            portfolio = portfolio_data
        
        total_value = sum(item.get('value', 0) for item in portfolio)
        
        allocation = {}
        for item in portfolio:
            ticker = item.get('ticker', 'Unknown')
            value = item.get('value', 0)
            if total_value > 0:
                allocation[ticker] = round((value / total_value) * 100, 2)
        
        sector_exposure = {}
        for item in portfolio:
            sector = item.get('sector', 'Unknown')
            value = item.get('value', 0)
            sector_exposure[sector] = sector_exposure.get(sector, 0) + value
        
        sector_percentages = {}
        if total_value > 0:
            for sector, value in sector_exposure.items():
                sector_percentages[sector] = round((value / total_value) * 100, 2)
        
        concentration_risk = any(percent > 30 for percent in allocation.values())
        sector_concentration_risk = any(percent > 50 for percent in sector_percentages.values())
        
        top_holdings = sorted(portfolio, key=lambda x: x.get('value', 0), reverse=True)[:3]
        
        analysis = {
            'portfolio_summary': {
                'total_value': f"${total_value:,.2f}",
                'number_of_holdings': len(portfolio),
                'average_position_size': f"${total_value/len(portfolio):,.2f}" if portfolio else "$0.00"
            },
            'asset_allocation': allocation,
            'sector_exposure': sector_percentages,
            'top_holdings': [
                {
                    'ticker': item.get('ticker'),
                    'value': f"${item.get('value', 0):,.2f}",
                    'percentage': allocation.get(item.get('ticker'), 0)
                }
                for item in top_holdings
            ],
            'risk_assessment': {
                'concentration_risk': 'HIGH' if concentration_risk else 'LOW',
                'sector_concentration_risk': 'HIGH' if sector_concentration_risk else 'LOW',
                'diversification_score': 100 - max(allocation.values(), default=0)
            },
            'recommendations': []
        }

        if concentration_risk:
            analysis['recommendations'].append(
                "Consider reducing positions that exceed 30% of portfolio to mitigate concentration risk."
            )
        
        if sector_concentration_risk:
            analysis['recommendations'].append(
                "Diversify across more sectors to reduce sector-specific risks."
            )
        
        if len(portfolio) < 5:
            analysis['recommendations'].append(
                "Consider adding more positions to improve diversification."
            )
        
        return json.dumps(analysis, indent=2)
    except Exception as e:
        return json.dumps({"error": f"Portfolio analysis failed: {str(e)}"}, indent=2)


class WealthManagementAgent:
    def __init__(self):
        load_dotenv()
        GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
    
        
        if not GEMINI_API_KEY:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        

        self.llm = LLM(
            model="gemini/gemini-2.5-flash",
            api_key=GEMINI_API_KEY,
            temperature=0.2,
        )
    
        self.tools = [
            {
                "name": "get_market_data",
                "func": get_market_data,
                "description": "Fetch market data for a given ticker symbol. Input should be a string with ticker and optional period (default: '1mo')."
            },
            {
                "name": "analyse_portfolio",
                "func": analyse_portfolio,
                "description": "Analyze portfolio composition and risk. Input should be a list of portfolio holdings or a JSON string."
            }
        ]
        
        self.agents = self.create_agents()
        self.tasks = self.create_tasks()

    def create_tasks(self):
        return [
            Task(
                name="Comprehensive Portfolio Analysis",
                # We use {portfolio} as a placeholder here
                description="""Analyze the user's investment portfolio: {portfolio} thoroughly. 
                
                Step-by-step process:
                1. First, analyze the portfolio structure using the analyse_portfolio tool
                2. For each stock in the portfolio, fetch current market data using get_market_data
                3. Compare portfolio allocation with market conditions
                4. Assess risk levels and diversification
                5. Provide specific, actionable recommendations
                
                Your analysis should include:
                - Portfolio valuation and composition
                - Current market performance of holdings
                - Risk assessment (concentration, sector risk)
                - Diversification analysis
                - Specific buy/hold/sell recommendations
                - Suggested allocation adjustments""",
                expected_output="A detailed, professional portfolio analysis report suitable for" \
                " a wealth management client. " \
                "Output your final answer as a well-structured Executive Summary in Markdown. " \
                "Use tables for data comparison, bold text for risks, "
                "and clean bullet points for recommendations. Avoid conversational filler like 'Here is your report'",
                agent=self.agents['analyser']
            )
        ]
    def run(self, portfolio):
        "Running the agent system to analyze the portfolio and generate a report."
        crew = Crew(
            agents=[self.agents['analyser']],
            tasks=self.tasks,
            verbose=True
        )
        
        result = crew.kickoff(inputs={'portfolio': json.dumps(portfolio)})
        print(result)

        return result

    def create_agents(self):
        # For CrewAI compatibility, we'll create a simple agent
        analyser = Agent(
            role="Chief Investment Officer",
            goal="Provide expert portfolio analysis and investment recommendations",
            backstory="""You are a seasoned investment professional with 20+ years of experience 
            managing multi-million dollar portfolios. You are known for your conservative yet 
            effective investment strategies and your ability to explain complex financial 
            concepts in simple terms. You believe in data-driven decisions and risk management.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm,
        )
        return {"analyser": analyser}


if __name__ == "__main__":
    try:
        print("Initializing Wealth Management System...")
        
        # Create agent system
        agent_system = WealthManagementAgent()
        
        # Test portfolio
        sample_portfolio = [
            {
                "ticker": "AAPL",
                "value": 50000,
                "sector": "Technology"
            },
            {
                "ticker": "MSFT",
                "value": 30000,
                "sector": "Technology"
            },
            {
                "ticker": "JNJ",
                "value": 20000,
                "sector": "Healthcare"
            }
        ]
        
        print(f"Analyzing portfolio with {len(sample_portfolio)} holdings...")
        
        result = agent_system.run(sample_portfolio)
        
        # Save results
        with open("portfolio_analysis_report.txt", "w", encoding="utf-8") as f:
            f.write(str(result))
        
        print("\n" + "="*60)
        print("Analysis saved to portfolio_analysis_report.txt")
        print("="*60)
        
    except ValueError as ve:
        print(f"Configuration Error: {ve}")
        print("\nPlease ensure:")
        print("1. You have a .env file with GOOGLE_API_KEY=your_key")
        print("2. Required packages are installed: pip install python-dotenv yfinance crewai langchain-google-genai")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()