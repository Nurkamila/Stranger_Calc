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