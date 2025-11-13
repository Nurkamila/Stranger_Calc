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