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
        
        default:
            this.chooseOperation(action);
            break;
    }

