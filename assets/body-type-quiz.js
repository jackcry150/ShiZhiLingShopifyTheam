(function () {
  const QUESTIONS = [
    {
      id: 'energy',
      text: 'How do you usually feel by mid-afternoon?',
      options: [
        { label: 'Steady enough to keep going', scores: { balanced: 2 } },
        { label: 'Low energy and looking for a gentle reset', scores: { qi: 3 } },
        { label: 'Cold, slow, and craving warmth', scores: { yang: 3 } },
        { label: 'Restless or wired even when tired', scores: { yin: 2, stress: 1 } },
      ],
    },
    {
      id: 'temperature',
      text: 'Which temperature pattern sounds most familiar?',
      options: [
        { label: 'Generally comfortable in most seasons', scores: { balanced: 2 } },
        { label: 'Cold hands or feet, especially in cooler rooms', scores: { yang: 3 } },
        { label: 'Warm flushes, dry mouth, or night heat', scores: { yin: 3 } },
        { label: 'Heavy heat, stuffiness, or oily skin', scores: { damp: 3 } },
      ],
    },
    {
      id: 'digestion',
      text: 'After meals, what do you notice most often?',
      options: [
        { label: 'Comfortable and satisfied', scores: { balanced: 2 } },
        { label: 'Easy bloating or feeling weighed down', scores: { qi: 2, damp: 2 } },
        { label: 'Prefer warm food and drinks to feel settled', scores: { yang: 2 } },
        { label: 'Dryness or thirst even after eating', scores: { yin: 2 } },
      ],
    },
    {
      id: 'sleep',
      text: 'What is your sleep most like lately?',
      options: [
        { label: 'Mostly restful', scores: { balanced: 2 } },
        { label: 'Light sleep with active thoughts', scores: { stress: 3 } },
        { label: 'Wake warm or dry during the night', scores: { yin: 3 } },
        { label: 'Long sleep but still not refreshed', scores: { qi: 2, damp: 2 } },
      ],
    },
    {
      id: 'mood',
      text: 'When stress builds, your body tends to feel...',
      options: [
        { label: 'A little tense, then able to recover', scores: { balanced: 2 } },
        { label: 'Tight chest, sighing, or emotional pressure', scores: { stress: 3 } },
        { label: 'Heavy, sluggish, and hard to motivate', scores: { damp: 2, qi: 1 } },
        { label: 'Hot, irritable, or easily overstimulated', scores: { yin: 1, damp: 2 } },
      ],
    },
    {
      id: 'skin',
      text: 'Which skin or complexion clue fits best?',
      options: [
        { label: 'Relatively even and stable', scores: { balanced: 2 } },
        { label: 'Dryness or a need for extra moisture', scores: { yin: 3 } },
        { label: 'Oiliness, redness, or breakouts', scores: { damp: 3 } },
        { label: 'Dullness or slow-to-brighten tone', scores: { qi: 1, stress: 2 } },
      ],
    },
    {
      id: 'movement',
      text: 'What kind of movement usually feels best?',
      options: [
        { label: 'A balanced mix of strength, mobility, and rest', scores: { balanced: 2 } },
        { label: 'Gentle walks or stretching, not too intense', scores: { qi: 2 } },
        { label: 'Warm, slow movement that builds heat', scores: { yang: 3 } },
        { label: 'Sweaty sessions that help release heaviness', scores: { damp: 2, stress: 1 } },
      ],
    },
    {
      id: 'cravings',
      text: 'Which craving pattern shows up most?',
      options: [
        { label: 'No strong pattern', scores: { balanced: 2 } },
        { label: 'Warm soups, spices, or comforting drinks', scores: { yang: 2, qi: 1 } },
        { label: 'Cold drinks, juicy fruit, or cooling foods', scores: { yin: 2 } },
        { label: 'Rich, sweet, fried, or salty snacks', scores: { damp: 3 } },
      ],
    },
    {
      id: 'season',
      text: 'Which season or environment challenges you most?',
      options: [
        { label: 'I adapt fairly well', scores: { balanced: 2 } },
        { label: 'Cold or damp weather', scores: { yang: 3 } },
        { label: 'Dry heat or long hot days', scores: { yin: 3 } },
        { label: 'Humid weather or stuffy rooms', scores: { damp: 3 } },
      ],
    },
    {
      id: 'routine',
      text: 'What do you most want from a daily wellness ritual?',
      options: [
        { label: 'Maintain overall balance', scores: { balanced: 3 } },
        { label: 'Support steady energy and resilience', scores: { qi: 3 } },
        { label: 'Feel warm, grounded, and comfortable', scores: { yang: 3 } },
        { label: 'Cool, clear, and calm my system', scores: { yin: 2, damp: 1 } },
        { label: 'Ease tension and feel emotionally lighter', scores: { stress: 3 } },
      ],
    },
  ];

  const RESULTS = {
    balanced: {
      label: 'Balanced tendency',
      title: 'You lean toward a steady, balanced routine.',
      copy: 'Your answers suggest a relatively even pattern. Keep your daily rhythm simple: consistent meals, restorative sleep, and a ritual that helps you maintain what is already working.',
      reason: 'Recommendation focus: everyday nourishment, gentle seasonal support, and an easy habit you can repeat.',
    },
    qi: {
      label: 'Qi support tendency',
      title: 'You may benefit from gentle energy support.',
      copy: 'Your pattern points toward lower stamina or easy fatigue. This is not a diagnosis; it is a health reference for choosing a daily ritual that supports steadiness.',
      reason: 'Recommendation focus: warm, easy-to-keep routines that support day-to-day resilience without overstimulation.',
    },
    yang: {
      label: 'Warmth support tendency',
      title: 'You may prefer warming, grounding support.',
      copy: 'Your answers suggest a cold or slow-to-warm pattern. Choose rituals that feel cozy, steady, and supportive during cooler mornings or long workdays.',
      reason: 'Recommendation focus: warming herbs, comforting textures, and a routine that helps you feel settled.',
    },
    yin: {
      label: 'Cooling moisture tendency',
      title: 'You may need cooling and replenishing support.',
      copy: 'Your responses point toward dryness, heat, or restlessness. Keep your daily ritual calming and hydrating, with space for slower evenings.',
      reason: 'Recommendation focus: cooling, soothing support for everyday balance and comfort.',
    },
    damp: {
      label: 'Clear-light tendency',
      title: 'You may prefer light, clarifying support.',
      copy: 'Your answers suggest heaviness, humidity sensitivity, or oily/blocked feelings. A lighter routine can help your day feel clearer and less weighed down.',
      reason: 'Recommendation focus: fresh, bright rituals that pair well with movement and lighter meals.',
    },
    stress: {
      label: 'Ease and flow tendency',
      title: 'You may benefit from tension-easing support.',
      copy: 'Your responses suggest that stress and emotional pressure shape how your body feels. Build a ritual around calm, flow, and a reliable pause.',
      reason: 'Recommendation focus: soothing support for everyday stress patterns and a smoother wind-down.',
    },
  };

  function getTopResult(scores) {
    return Object.keys(RESULTS)
      .map((key) => ({ key, score: scores[key] || 0 }))
      .sort((a, b) => b.score - a.score || Object.keys(RESULTS).indexOf(a.key) - Object.keys(RESULTS).indexOf(b.key))[0];
  }

  function createQuestion(question, index, selectedValue) {
    const article = document.createElement('article');
    article.className = 'btq-question';
    article.dataset.questionIndex = String(index);

    const selected = Number.isInteger(selectedValue);
    article.classList.toggle('is-complete', selected);

    article.innerHTML = `
      <div class="btq-question__head">
        <span class="btq-question__number">${index + 1}</span>
        <h3 class="btq-question__title">${question.text}</h3>
      </div>
      <div class="btq-question__body"></div>
    `;

    const body = article.querySelector('.btq-question__body');
    question.options.forEach((option, optionIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btq-option';
      button.textContent = option.label;
      button.dataset.questionIndex = String(index);
      button.dataset.optionIndex = String(optionIndex);
      button.classList.toggle('is-selected', selectedValue === optionIndex);
      body.appendChild(button);
    });

    return article;
  }

  function renderQuestions(root, state) {
    const list = root.querySelector('[data-btq-question-list]');
    list.innerHTML = '';

    QUESTIONS.forEach((question, index) => {
      const questionNode = createQuestion(question, index, state.answers[index]);
      const isActive = index === state.current;
      const isLocked = index > state.current;
      questionNode.classList.toggle('is-active', isActive);
      questionNode.classList.toggle('is-locked', isLocked);
      list.appendChild(questionNode);
    });
  }

  function updateProgress(root, state) {
    const answered = state.answers.filter(Number.isInteger).length;
    const percent = Math.round((answered / QUESTIONS.length) * 100);
    root.querySelector('[data-btq-progress-count]').textContent = `${answered} of ${QUESTIONS.length}`;
    root.querySelector('[data-btq-progress-bar]').style.width = `${percent}%`;
  }

  function calculateScores(answers) {
    return answers.reduce((scores, answerIndex, questionIndex) => {
      if (!Number.isInteger(answerIndex)) return scores;
      const option = QUESTIONS[questionIndex].options[answerIndex];
      Object.entries(option.scores).forEach(([key, value]) => {
        scores[key] = (scores[key] || 0) + value;
      });
      return scores;
    }, {});
  }

  function renderResult(root, state) {
    const resultPanel = root.querySelector('[data-btq-result]');
    const result = getTopResult(calculateScores(state.answers));
    const resultData = RESULTS[result.key];
    const templates = root.querySelector(`[data-btq-template="${result.key}"]`);
    const fallbackTemplate = root.querySelector('[data-btq-template="balanced"]');
    const cards = templates || fallbackTemplate;

    root.querySelector('[data-btq-result-badge]').textContent = resultData.label;
    root.querySelector('[data-btq-result-title]').textContent = resultData.title;
    root.querySelector('[data-btq-result-copy]').textContent = resultData.copy;
    root.querySelector('[data-btq-result-reason]').textContent = resultData.reason;
    root.querySelector('[data-btq-result-cards]').innerHTML = cards ? cards.innerHTML : '';
    resultPanel.classList.add('is-visible');
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function initQuiz(root) {
    const state = {
      answers: Array(QUESTIONS.length).fill(null),
      current: 0,
    };

    renderQuestions(root, state);
    updateProgress(root, state);

    root.addEventListener('click', (event) => {
      const option = event.target.closest('[data-option-index]');
      if (!option || !root.contains(option)) return;

      const questionIndex = Number(option.dataset.questionIndex);
      const optionIndex = Number(option.dataset.optionIndex);
      state.answers[questionIndex] = optionIndex;
      state.current = Math.min(questionIndex + 1, QUESTIONS.length - 1);

      renderQuestions(root, state);
      updateProgress(root, state);

      if (state.answers.filter(Number.isInteger).length === QUESTIONS.length) {
        renderResult(root, state);
      } else {
        const next = root.querySelector(`[data-question-index="${state.current}"]`);
        if (next) next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    const reset = root.querySelector('[data-btq-reset]');
    if (reset) {
      reset.addEventListener('click', () => {
        state.answers = Array(QUESTIONS.length).fill(null);
        state.current = 0;
        root.querySelector('[data-btq-result]').classList.remove('is-visible');
        renderQuestions(root, state);
        updateProgress(root, state);
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-body-type-quiz]').forEach(initQuiz);
  });
})();
