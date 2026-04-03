import os
import google.generativeai as genai

def generate_insight(
    profile_key: str,
    initial_amount: float,
    monthly_contrib: float,
    years: int
) -> str:
    """
    Gera um insight de investimento personalizado usando o Gemini.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "GEMINI_API_KEY não configurada. Impossível gerar insight."

    genai.configure(api_key=api_key)
    
    # Recomendado "gemini-1.5-flash" para tarefas rápidas de texto
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = (
        f"Atue como um consultor financeiro especialista do InvestIQ. "
        f"Analise o perfil de investidor '{profile_key}' com um capital inicial de R$ {initial_amount:,.2f}, "
        f"aportes mensais de R$ {monthly_contrib:,.2f} durante um horizonte de tempo de {years} anos. "
        f"Forneça uma avaliação concisa (máx 2 parágrafos) em português do Brasil com:\n"
        f"1. Uma breve projeção qualitativa dos resultados esperados.\n"
        f"2. Uma recomendação principal sobre gestão de risco e diversificação."
    )

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Erro ao comunicar com a IA: {e}"
