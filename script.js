// FizzBuzz ロジックと DOM 制御（爆発アニメーション付き）
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const gridContainer = document.getElementById('fizzbuzz-grid');
  const statusMessage = document.getElementById('status-message');

  const MIN = 1;
  const MAX = 50;
  const INTERVAL_MS = 65; // 各カードの描画間隔（ミリ秒）

  let timerId = null;
  let isRunning = false;

  // タイプ別パーティクルカラー定義
  const PARTICLE_PALETTES = {
    fizzbuzz: ['#ec4899', '#8b5cf6', '#d946ef', '#f59e0b', '#f43f5e', '#fbbf24', '#ffffff'],
    fizz: ['#2563eb', '#60a5fa', '#93c5fd', '#38bdf8', '#ffffff'],
    buzz: ['#059669', '#34d399', '#6ee7b7', '#facc15', '#ffffff'],
    normal: ['#f59e0b', '#fbbf24', '#cbd5e1', '#94a3b8', '#e2e8f0']
  };

  const SHOCKWAVE_COLORS = {
    fizzbuzz: '#d946ef',
    fizz: '#60a5fa',
    buzz: '#34d399',
    normal: '#cbd5e1'
  };

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
   * カード出現時の爆発エフェクト（火花パーティクル & 衝撃波）を発生させる
   * @param {HTMLElement} card
   * @param {string} type
   */
  function triggerExplosion(card, type) {
    const palette = PARTICLE_PALETTES[type] || PARTICLE_PALETTES.normal;
    const isMega = (type === 'fizzbuzz');
    const particleCount = isMega ? 22 : (type === 'normal' ? 8 : 14);
    const maxDistance = isMega ? 75 : 45;

    // 1. 衝撃波リング（ショックウェーブ）の追加
    const waveColor = SHOCKWAVE_COLORS[type] || '#cbd5e1';
    const shockwave = document.createElement('div');
    shockwave.className = 'shockwave';
    shockwave.style.setProperty('--wave-color', waveColor);
    card.appendChild(shockwave);

    if (isMega) {
      // FizzBuzz時は特大追加ショックウェーブと画面揺れ
      const megaWave = document.createElement('div');
      megaWave.className = 'shockwave';
      megaWave.style.setProperty('--wave-color', '#fbbf24');
      megaWave.style.animationDelay = '0.08s';
      card.appendChild(megaWave);

      if (container) {
        container.classList.remove('shake-screen');
        // リフローを発生させてアニメーションを再トリガー
        void container.offsetWidth;
        container.classList.add('shake-screen');
      }
    }

    // 2. 放射状に飛び散るパーティクル火花
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
      const distance = 25 + Math.random() * maxDistance;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const size = (isMega ? 5 : 3.5) + Math.random() * 4;
      const color = palette[Math.floor(Math.random() * palette.length)];

      particle.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      particle.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      particle.style.setProperty('--size', `${size.toFixed(1)}px`);
      particle.style.setProperty('--color', color);

      card.appendChild(particle);
    }

    // 600ms後に不要になったエフェクト要素をDOMから除去
    setTimeout(() => {
      const effects = card.querySelectorAll('.particle, .shockwave');
      effects.forEach(el => el.remove());
    }, 600);
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
    statusMessage.textContent = `爆発生成中... (${current}/${MAX})`;

    timerId = setInterval(() => {
      const result = getFizzBuzz(current);
      const card = createCard(current, result);
      gridContainer.appendChild(card);

      // 爆発エフェクトを発火
      triggerExplosion(card, result.type);

      statusMessage.textContent = `爆発生成中... (${current}/${MAX})`;

      if (current >= MAX) {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
        startBtn.disabled = false;
        startBtn.textContent = 'もう一度爆発させる';
        statusMessage.textContent = `全${MAX}件の生成が完了しました！`;
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
    if (container) {
      container.classList.remove('shake-screen');
    }
    startBtn.disabled = false;
    startBtn.textContent = 'FizzBuzz を実行';
    resetBtn.disabled = true;
    statusMessage.textContent = '「FizzBuzz を実行」ボタンを押してください';
  }

  // イベントリスナーの登録
  startBtn.addEventListener('click', startFizzBuzz);
  resetBtn.addEventListener('click', resetFizzBuzz);
});
