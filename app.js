class Calculator {
    constructor() {
        this.current = '0';
        this.previousOperand = null;
        this.operation = null;
        this.history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
        this.newOperation = false;
        this.initializeDOM();
        this.loadTheme();
        this.bindEvents();
        this.renderHistory();
    }

    initializeDOM() {
        this.display = document.querySelector('.display');
        this.buttons = document.querySelector('.buttons');
        this.historyList = document.getElementById('history-list');
        this.themeToggle = document.getElementById('themeToggle');
        this.updateDisplay();
    }

        loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme;
        this.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    getDisplayValue() {
        if (this.operation !== null && this.previousOperand !== null) {
            if (this.newOperation || this.current === '0') {
                return `${this.previousOperand} ${this.operation}`;
            }
            return `${this.previousOperand} ${this.operation} ${this.current}`;
        }
        return this.current || '0';
    }

    updateDisplay() {
        this.display.textContent = this.getDisplayValue();
    }

    inputDigit(digit) {
        if (this.newOperation) {
            this.current = digit === '.' ? '0.' : digit;
            this.newOperation = false;
        } else {
            if (digit === '.' && this.current.includes('.')) return;
            if (this.current === '0' && digit !== '.') {
                this.current = digit;
            } else {
                this.current += digit;
            }
        }
        this.updateDisplay();
    }

    bindEvents() {
        this.buttons.addEventListener('click', (event) => {
            const { target } = event;
            if (target.matches('button[data-digit]')) {
                this.inputDigit(target.dataset.digit);
            } else if (target.matches('button[data-action]')) {
                const action = target.dataset.action;
                this.handleAction(action);
            }

        });

        this.historyList.addEventListener('click', (event) => {
            if (event.target.tagName === 'LI') {
                this.replayExpression(event.target.textContent);
            }
        });

        this.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light');
            const isLight = document.body.classList.contains('light');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            this.themeToggle.textContent = isLight ? '🌙' : '☀️';
        });

    }

    chooseOperation(nextOperator) {
        const inputValue = parseFloat(this.current);
        if (Number.isNaN(inputValue)) return;

        if (this.previousOperand !== null && this.operation !== null && !this.newOperation) {
            this.evaluate(); 
        }

        this.operation = nextOperator;
        this.previousOperand = parseFloat(this.current);
        this.newOperation = true;
        this.updateDisplay();
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'allClear':
                this.allClear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'evaluate':
                this.evaluate();
                break;
            case '%':
                this.percent();
                break;
            case '-':
                if (this.operation === null && (this.current === '0' || this.current === '')) {
                    this.current = '-';
                } else {
                    this.chooseOperation(action);
                }
                this.updateDisplay();
                break;
            default:
                this.chooseOperation(action);
                break;
        }
    }

    evaluate() {
        if (this.previousOperand === null || this.operation === null) return;
        if (this.newOperation) return; 

        const prev = this.previousOperand;
        const current = parseFloat(this.current);
        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.current = 'Error: Cannot divide by zero';
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        const expression = ${prev} ${this.operation} ${current} = ${result};
        this.history.unshift(expression);
        this.history = this.history.slice(0, 10);
        localStorage.setItem('calcHistory', JSON.stringify(this.history));
        this.renderHistory();

        this.current = result.toString();
        this.previousOperand = null;
        this.operation = null;
        this.newOperation = true;
        this.updateDisplay();
    }

    replayExpression(fullExpr) {
        const eqPos = fullExpr.indexOf('=');
        if (eqPos === -1) return;
        const inputExpr = fullExpr.substring(0, eqPos).trim();
        const parts = inputExpr.split(/\s+/);
        if (parts.length !== 3) return;
        this.previousOperand = parseFloat(parts[0]);
        this.operation = parts[1];
        this.current = parts[2];
        this.newOperation = false;
        this.updateDisplay();
    }

    renderHistory() {
        const html = this.history.map((expr) => `<li>${expr}</li>`).join('');
        this.historyList.innerHTML = html;
    }

    percent() {
        let value = parseFloat(this.current);
        if (Number.isNaN(value)) return;
        this.current = (value / 100).toString();
        this.updateDisplay();
    }

    clear() {
        this.current = '0';
        this.previousOperand = null;
        this.operation = null;
        this.newOperation = false;
        this.updateDisplay();
    }

    allClear() {
        this.current = '0';
        this.previousOperand = null;
        this.operation = null;
        this.newOperation = false;
        this.history = [];
        localStorage.removeItem('calcHistory');
        this.renderHistory();
        this.updateDisplay();
    }

    backspace() {
        if (this.current === 'Error') {
            this.current = '0';
            this.updateDisplay();
            return;
        }

        if (this.newOperation || this.current === '0') {
            if (this.operation !== null && this.previousOperand !== null) {
                this.current = this.previousOperand.toString();
                this.previousOperand = null;
                this.operation = null;
                this.newOperation = false;
            } else {
                this.current = '0';
            }
        } else {
            if (this.current.length <= 1) {
                this.current = '0';
            } else {
                this.current = this.current.slice(0, -1);
            }
            if (this.current === '-') {
                this.current = '0';
            }
        }
        this.updateDisplay();
    }

}