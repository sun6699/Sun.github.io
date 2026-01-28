// Simple calculator logic with click + keyboard support
(() => {
  const displayEl = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');

  let expression = ''; // expression shown and evaluated

  function updateDisplay() {
    displayEl.textContent = expression === '' ? '0' : expression;
  }

  function append(char) {
    // Prevent multiple leading zeros
    if (expression === '0' && char === '0') return;
    // Prevent two operators in a row (replace last operator)
    if (isOperator(char)) {
      if (expression === '' && char !== '-') return; // don't start with operator except minus
      if (isOperator(lastChar())) {
        expression = expression.slice(0, -1) + char;
        updateDisplay();
        return;
      }
    }

    // Prevent multiple decimals in the current number
    if (char === '.') {
      const parts = expression.split(/[\+\-\×\÷\*\/]/);
      const current = parts[parts.length - 1];
      if (current.includes('.')) return;
      if (current === '') char = '0.'; // start decimal with 0.
    }

    expression += char;
    updateDisplay();
  }

  function lastChar() {
    return expression ? expression[expression.length - 1] : '';
  }

  function isOperator(ch) {
    return ['+', '-', '×', '÷', '*', '/'].includes(ch);
  }

  function clearAll() {
    expression = '';
    updateDisplay();
  }

  function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
  }

  function applyPercent() {
    // Convert last number to percentage (e.g., 50 -> 0.5)
    const parts = expression.split(/([\+\-\×\÷\*\/])/);
    if (parts.length === 0) return;
    const last = parts.pop();
    if (last === '' || isOperator(last)) return;
    const num = parseFloat(last);
    if (isNaN(num)) return;
    parts.push(String(num / 100));
    expression = parts.join('');
    updateDisplay();
  }

  function evaluateExpression() {
    if (expression === '') return;
    try {
      // Replace × and ÷ with * and / for evaluation
      const safeExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');

      // Basic safety: only allow digits, operators, decimal point, and parentheses
      if (!/^[0-9+\-*/().\s]+$/.test(safeExpr)) {
        throw new Error('Invalid characters');
      }

      // Use Function to evaluate (local, simple calculator)
      const result = Function(`"use strict"; return (${safeExpr})`)();
      expression = (result === Infinity || result === -Infinity || Number.isNaN(result)) ? 'Error' : String(result);
    } catch {
      expression = 'Error';
    }
    updateDisplay();
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;

      if (action === 'clear') return clearAll();
      if (action === 'delete') return deleteLast();
      if (action === 'percent') return applyPercent();
      if (action === 'equals') return evaluateExpression();
      if (value) return append(value);
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') return append(e.key);
    if (e.key === '.') return append('.');
    if (e.key === 'Backspace') return deleteLast();
    if (e.key === 'Escape') return clearAll();
    if (e.key === 'Enter' || e.key === '=') return evaluateExpression();
    if (e.key === '%') return applyPercent();

    // Operators
    if (['+', '-', '*', '/'].includes(e.key)) {
      // map * and / to visual operators? We'll append the corresponding chars used by code
      const mapped = e.key === '*' ? '×' : (e.key === '/' ? '÷' : e.key);
      return append(mapped);
    }
  });

  // Initialize
  clearAll();
})();