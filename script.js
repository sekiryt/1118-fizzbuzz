// FizzBuzz ロジックと DOM 制御
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const gridContainer = document.getElementById('fizzbuzz-grid');
  const statusMessage = document.getElementById('status-message');

  const MIN = 1;
  const MAX = 50;
  const INTERVAL_MS = 45; // 各カードの描画間隔（ミリ秒）

  let timerId = null;
  let isRunning = false;

  /**
   * 数値に対応する FizzBuzz 判定結果を返す
   * @param {number} n
   * @returns {{ type: 'fizzbuzz' | 'fizz' | 'buzz' | 'normal', text: string }}
   */
  function getFizzBuzz(n) {
    if (n % 15 === 0) {
      return { type: 'fizzbuzz', text: 'FizzBuzz' };
    }
    if (n % 3 === 0) {
      return { type: 'fizz', text: 'Fizz' };
    }
    if (n % 5 === 0) {
      return { type: 'buzz', text: 'Buzz' };
    }
    return { type: 'normal', text: String(n) };
  }

  /**
   * カード要素を作成する
   * @param {number} n
   * @param {{ type: string, text: string }} result
   * @returns {HTMLElement}
   */
  function createCard(n, result) {
    const card = document.createElement('div');
    card.className = `card card-${result.type}`;
    card.setAttribute('data-number', n);

    const numSpan = document.createElement('div');
    numSpan.className = 'card-num';
    numSpan.textContent = `#${n}`;

    const valSpan = document.createElement('div');
    valSpan.className = 'card-val';
    valSpan.textContent = result.text;

    card.appendChild(numSpan);
    card.appendChild(valSpan);
    return card;
  }

  /**
   * アニメーション描画を開始する
   */
  function startFizzBuzz() {
    if (isRunning) return;

    isRunning = true;
    startBtn.disabled = true;
    resetBtn.disabled = false;
    gridContainer.innerHTML = '';

    let current = MIN;
    statusMessage.textContent = `生成中... (${current}/${MAX})`;

    timerId = setInterval(() => {
      const result = getFizzBuzz(current);
      const card = createCard(current, result);
      gridContainer.appendChild(card);

      statusMessage.textContent = `生成中... (${current}/${MAX})`;

      if (current >= MAX) {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
        startBtn.disabled = false;
        startBtn.textContent = 'もう一度実行';
        statusMessage.textContent = `完了しました！（全${MAX}件）`;
      } else {
        current++;
      }
    }, INTERVAL_MS);
  }

  /**
   * 状態をリセットする
   */
  function resetFizzBuzz() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    isRunning = false;
    gridContainer.innerHTML = '';
    startBtn.disabled = false;
    startBtn.textContent = 'FizzBuzz を実行';
    resetBtn.disabled = true;
    statusMessage.textContent = '「FizzBuzz を実行」ボタンを押してください';
  }

  // イベントリスナーの登録
  startBtn.addEventListener('click', startFizzBuzz);
  resetBtn.addEventListener('click', resetFizzBuzz);
});
