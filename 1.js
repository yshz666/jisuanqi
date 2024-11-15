let resultField = document.getElementById('result');
let historyList = document.getElementById('historyList'); // 获取历史记录列表
let isCalculated = false;

// 页面加载时恢复历史记录和主题
window.onload = function() {
    loadHistory();
    const savedTheme = localStorage.getItem('calculatorTheme') || 'default';
    document.body.className = savedTheme; // 应用保存的主题
    const calculator = document.querySelector('.calculator');
    calculator.className = `calculator ${savedTheme}`; // 确保计算器的类名与主题一致
};

function appendToResult(value) {
    if (isCalculated && !isNaN(value)) {
        resultField.value = '';
        isCalculated = false;
    }
    resultField.value += value;
}

function clearResult() {
    resultField.value = '';
    isCalculated = false;
}

function calculateResult() {
    try {
        let expression = resultField.value
            .replace(/x²/g, '**2')
            .replace(/(\d+)\*\*(2)/g, 'Math.pow($1, 2)')
            .replace(/factorial\((\d+)\)/g, 'factorial($1)') // 处理阶乘
            .replace(/e\^/g, 'Math.exp(') // 将 e^ 转换为 Math.exp(
            .replace(/ln\(/g, 'Math.log('); // 将 ln( 转换为 Math.log(

        // 计算结果
        let result = eval(expression);
        resultField.value = result; // 只显示结果
        isCalculated = true;

        // 添加到历史记录
        addToHistory(`${expression} = ${result}`);
    } catch (error) {
        resultField.value = 'Error';
        isCalculated = false;
    }
}

function addToHistory(entry) {
    let timestamp = new Date().toLocaleString(); // 获取当前时间戳
    let listItem = document.createElement('li');
    // 去除括号并换行
    listItem.textContent = `${entry} - 计算时间: ${timestamp}`;
    historyList.appendChild(listItem);

    // 保存到 localStorage
    saveHistory(entry, timestamp);
}

function saveHistory(entry, timestamp) {
    let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    history.push({ entry: entry, timestamp: timestamp });
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    history.forEach(item => {
        let listItem = document.createElement('li');
        // 去除括号并换行
        listItem.textContent = `${item.entry} - 计算时间: ${item.timestamp}`;
        historyList.appendChild(listItem);
    });
}

// 添加键盘事件监听
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendToResult(event.key);
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendToResult(event.key);
    } else if (event.key === '.') { // 处理小数点
        appendToResult('.');
    } else if (event.key === 'Enter') {
        calculateResult();
    } else if (event.key === 'Backspace') {
        resultField.value = resultField.value.slice(0, -1); // 删除最后一个字符
    } else if (event.key === 'Escape') {
        clearResult(); // 清空输入
    } else if (event.key === 'c' || event.key === 'C') { // 处理 C 键
        clearResult(); // 清空输入
    } else if (event.key === 'e' || event.key === 'E') { // 处理 E 键
        appendToResult('E'); // 输入 E 字符
    }
});

function toggleSettings() {
    const settingsPanel = document.getElementById('settings');
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
}

function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.body.className = theme; // 根据选择的主题更改 body 的类名
    const calculator = document.querySelector('.calculator');
    calculator.className = `calculator ${theme}`; // 更新计算器的类名
    const settingsPanel = document.getElementById('settings');
    settingsPanel.className = `settings ${theme}`; // 更新设置面板的类名
    saveTheme(theme); // 保存选择的主题
}

function saveTheme(theme) {
    localStorage.setItem('calculatorTheme', theme); // 将主题保存到 localStorage
}

function factorial(n) {
    if (n < 0) return undefined; // 阶乘未定义
    if (n === 0) return 1; // 0! = 1
    return n * factorial(n - 1); // 递归计算阶乘
}
