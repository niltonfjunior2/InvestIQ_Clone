from .profile_engine import PROFILES

def run_simulation(profile: str, amount: float, monthly: float, years: int):
    """
    Roda a simulação financeira em anos de forma estática aproximada.
    """
    p = PROFILES.get(profile, PROFILES["conservador"])
    
    weighted_return = sum(a["annual_return"] * a["allocation"] / 100 for a in p["assets"]) / 100
    
    cdi_return = 0.105
    ibov_return = 0.12
    
    total_contributed = amount
    carteira = amount
    cdi_val = amount
    ibov_val = amount
    
    data = []
    data.append({
        "year": 0, 
        "invested": amount, 
        "portfolio_value": amount, 
        "cdi_value": amount, 
        "ibov_value": amount
    })
    
    for y in range(1, years + 1):
        carteira = carteira * (1 + weighted_return) + (monthly * 12)
        cdi_val = cdi_val * (1 + cdi_return) + (monthly * 12)
        ibov_val = ibov_val * (1 + ibov_return) + (monthly * 12)
        total_contributed += (monthly * 12)
        
        data.append({
            "year": y,
            "invested": total_contributed,
            "portfolio_value": carteira,
            "cdi_value": cdi_val,
            "ibov_value": ibov_val
        })
        
    roi_percentage = ((carteira - total_contributed) / total_contributed) * 100 if total_contributed > 0 else 0

    return {
        "data": data,
        "weighted_return": round(weighted_return * 100, 2),
        "final_carteira": round(carteira, 2),
        "final_cdi": round(cdi_val, 2),
        "final_ibovespa": round(ibov_val, 2),
        "gain_vs_cdi": round(carteira - cdi_val, 2),
        "total_contributed": round(total_contributed, 2),
        "roi_percentage": round(roi_percentage, 2)
    }
