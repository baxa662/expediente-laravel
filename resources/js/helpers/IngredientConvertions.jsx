class IngredientConvertions {
    constructor(parameters) {
        
    }

    static amountToEquivalent (ingredient, newValue) {
        const portionUnit = ingredient.portionUnit;
        const equivalent = ingredient.portionQuantity / ingredient.portionUnit;
        
        const newEquivalent = (newValue / (equivalent * portionUnit)).toFixed(1);

        return {
            equivalent: newEquivalent,
            measure: `${this.formatAmount(newValue / portionUnit)} ${ingredient.unit}`
        };
    }
    
    static equivalentToAmount (ingredient, newValue) {
        const portionUnit = ingredient.portionUnit;
        const equivalent = ingredient.portionQuantity / ingredient.portionUnit;
    
        const newAmount = newValue * portionUnit * equivalent;

        return {
            amount: newAmount,
            measure: `${this.formatAmount(newAmount / portionUnit)} ${ingredient.unit}`
        };
    }


    static formatAmount (amount)  {
        const integerPart = Math.floor(amount);
        const decimalPart = amount - integerPart;
    
        if (decimalPart === 0) {
          return `${integerPart}`;
        }
    
        const commonFractions = {
          0.125: "1/8",
          0.25: "1/4",
          0.333: "1/3",
          0.5: "1/2",
          0.667: "2/3",
          0.75: "3/4",
        };
    
        const fractionKeys = Object.keys(commonFractions).map(Number);
        let closestFraction = fractionKeys.reduce((prev, curr) => 
          Math.abs(curr - decimalPart) < Math.abs(prev - decimalPart) ? curr : prev
        );
    
        if (decimalPart - closestFraction > 0.2) {
          const nextFractionIndex = fractionKeys.indexOf(closestFraction) + 1;
          if (nextFractionIndex < fractionKeys.length) {
            closestFraction = fractionKeys[nextFractionIndex];
          } else {
            return `${integerPart + 1}`;
          }
        }
    
        const fraction = commonFractions[closestFraction] || this.convertToFraction(decimalPart);
        return integerPart > 0 ? `${integerPart} ${fraction}` : fraction;
    };


    static convertToFraction (decimal) {
        const gcd = (a, b) => (b ? gcd(b, a % b) : a);
        const len = decimal.toString().length - 2;
        const denominator = Math.pow(10, len);
        const numerator = Math.ceil(decimal * denominator); // Round up the numerator
        const divisor = gcd(numerator, denominator);
        return `${Math.ceil(numerator / divisor)}/${Math.ceil(denominator / divisor)}`;
      };
      
    
}

export default IngredientConvertions;