(function () {
  const SCALE = [
    { value: 1, label: 'Never' },
    { value: 2, label: 'Rarely' },
    { value: 3, label: 'Sometimes' },
    { value: 4, label: 'Often' },
    { value: 5, label: 'Almost always' },
  ];

  const GROUPS = [
    {
      code: 'P',
      name: 'Balanced Constitution',
      short: 'Balanced',
      questions: [
        'I rarely feel tired for no obvious reason.',
        'I usually sleep well at night and feel energized during the day.',
        'My body usually adapts quickly to seasonal changes, travel, or periods of extra work.',
        'My appetite is generally steady and I usually enjoy my meals.',
        'Changes in weather rarely make me feel unwell.',
        'People often tell me I look healthy and well-rested.',
        'After a stressful event, I tend to recover emotionally and physically fairly quickly.',
      ],
    },
    {
      code: 'Q',
      name: 'Qi-Deficient Constitution',
      short: 'Qi-Deficient',
      questions: [
        'I get noticeably out of breath after climbing two or three flights of stairs.',
        'After talking for a while, my voice tends to become weaker and I feel low on energy.',
        'I tend to sweat easily even after light activity, such as a few minutes of brisk walking.',
        'Compared with people my age, I feel that I tire more easily.',
        'It usually takes me longer than others to feel fully recovered after a cold.',
        'I tend to catch colds relatively often.',
        'I often wake up feeling as if I have not slept enough.',
      ],
    },
    {
      code: 'Y',
      name: 'Yang-Deficient Constitution',
      short: 'Yang-Deficient',
      questions: [
        'My hands and feet often feel cold, especially in winter.',
        'I tend to feel colder than other people in the same weather.',
        'I prefer warm drinks, and cold drinks can make me feel uncomfortable.',
        'My stools tend to be loose or soft rather than well formed.',
        'I often feel low on physical drive and would rather stay still than be active.',
        'My urine tends to be pale and relatively abundant.',
        'Cold foods or drinks, such as ice cream, can easily upset my stomach.',
      ],
    },
    {
      code: 'X',
      name: 'Yin-Deficient Constitution',
      short: 'Yin-Deficient',
      questions: [
        'My palms or soles often feel unusually warm.',
        'I sometimes feel a subtle sense of heat in the afternoon or evening.',
        'My mouth gets dry easily and I often feel the need to drink water.',
        'My skin tends to be dry, flaky, or prone to peeling.',
        'My eyes often feel dry or irritated.',
        'I have trouble sleeping, wake easily, or tend to have restless, dream-filled sleep.',
        'I tend to become impatient, restless, or irritable easily.',
      ],
    },
    {
      code: 'T',
      name: 'Phlegm-Damp Constitution',
      short: 'Phlegm-Damp',
      questions: [
        'I tend to carry soft fullness around my abdomen.',
        'My face or hair tends to become oily easily.',
        'I often feel heaviness in my chest or a sensation of phlegm in my throat.',
        'I often feel sleepy during the day and physically heavy.',
        'My mouth often feels sticky or coated when I wake up.',
        'I gain weight easily and find it relatively difficult to lose.',
        'I tend to feel more uncomfortable on rainy or very humid days.',
      ],
    },
    {
      code: 'S',
      name: 'Damp-Heat Constitution',
      short: 'Damp-Heat',
      questions: [
        'My face and nose tend to get oily, and I am prone to breakouts.',
        'I often notice a bitter taste or unpleasant feeling in my mouth.',
        'I often feel physically heavy or sleepy.',
        'My stools tend to be sticky and difficult to flush clean.',
        'My skin is prone to itchy or eczema-like irritation.',
        'I tend to experience more moisture or discharge than usual in the genital area.',
        'Hot, humid weather tends to make me especially restless or uncomfortable.',
      ],
    },
    {
      code: 'B',
      name: 'Blood-Stasis Constitution',
      short: 'Blood-Stasis',
      questions: [
        'I tend to bruise easily without an obvious reason.',
        'My lips often look dull or darker rather than naturally rosy.',
        'I tend to have noticeable dark circles around my eyes.',
        'I am prone to uneven skin tone or dark spots.',
        'If applicable: my menstrual flow tends to be dark in color or contain clots.',
        'I sometimes experience unexplained, localized sharp or stabbing sensations.',
        'When my skin is dry, it can become noticeably flaky or scale-like.',
      ],
    },
    {
      code: 'M',
      name: 'Qi-Stagnation Constitution',
      short: 'Qi-Stagnation',
      questions: [
        'Small things can easily leave me feeling low or emotionally stuck.',
        'I often sigh without realizing it.',
        'I often feel tightness or fullness around my chest or sides of my ribcage.',
        'My mood tends to fluctuate and I often overthink things.',
        'My sleep quality is noticeably affected by my emotions.',
        'Sudden sounds or situations can make me feel startled or unsettled easily.',
        'I tend to be sensitive and reserved, and I do not open up to people easily.',
      ],
    },
    {
      code: 'G',
      name: 'Sensitive Constitution',
      short: 'Sensitive',
      questions: [
        'I tend to have allergic reactions to certain foods, such as seafood or mango.',
        'I tend to react to pollen, dust mites, pet hair, or similar environmental triggers.',
        'My skin is prone to recurring itchy welts or hive-like reactions.',
        'During seasonal changes, I often sneeze or experience a runny or blocked nose.',
        'I have had an allergic reaction to medication before.',
        'A parent or sibling has a history of allergic conditions.',
        'My skin tends to be more reactive or sensitive than average.',
      ],
    },
  ];

  const QUESTIONS = GROUPS.flatMap((group) =>
    group.questions.map((text, index) => ({
      id: `${group.code}${index + 1}`,
      code: group.code,
      group: group.name,
      groupShort: group.short,
      text,
      optional: group.code === 'B' && index === 4,
    }))
  );

  const RESULTS = {
    P: {
      name: 'Balanced Constitution',
      keyword: 'Balanced & Resilient',
      copy: 'Your overall profile appears relatively balanced. You seem to adapt well to changes in routine, diet, and environment. Rather than focusing on one specific concern, a steady and consistent wellness routine may suit you best.',
      product: 'sevenday',
    },
    Q: {
      name: 'Qi-Deficient Constitution',
      keyword: 'Low Energy & Slower Recovery',
      copy: 'Your answers show a stronger pattern of low energy, easy fatigue, and slower recovery after activity. A routine focused on restoring energy and everyday nourishment may suit you well.',
      product: 'yuseying',
    },
    Y: {
      name: 'Yang-Deficient Constitution',
      keyword: 'Cold-Prone & Low Drive',
      copy: 'You appear to be more sensitive to cold, with signs such as cool hands and feet, a preference for warm drinks, or discomfort after cold foods. Gentle, warming nourishment may be a better fit.',
      product: 'rantaoyao',
    },
    X: {
      name: 'Yin-Deficient Constitution',
      keyword: 'Dry, Warm & Easily Depleted',
      copy: 'Dryness, a sense of internal warmth, restless sleep, or irritability appear more often in your answers. A gentler, hydrating and restorative routine may be more suitable.',
      product: 'fuyaoshang',
    },
    T: {
      name: 'Phlegm-Damp Constitution',
      keyword: 'Heavy, Sluggish & Easily Weighed Down',
      copy: 'Your answers show a stronger pattern of heaviness, sluggishness, stickiness, and oiliness. A routine that supports digestion and helps you feel lighter may be especially suitable.',
      product: 'yunkaijian',
    },
    S: {
      name: 'Damp-Heat Constitution',
      keyword: 'Heavy, Oily & Heat-Prone',
      copy: 'Your answers suggest a combination of heaviness and heat, such as oiliness, breakouts, a sticky or bitter mouth, or greater discomfort in hot and humid weather.',
      product: 'yunkaijian',
    },
    B: {
      name: 'Blood-Stasis Constitution',
      keyword: 'Dull Tone & Reduced Sense of Flow',
      copy: 'Your answers show more signs such as dull-looking complexion, easy bruising, uneven tone, or occasional localized discomfort. A nourishing routine focused on vitality may suit you.',
      product: 'yuseying',
    },
    M: {
      name: 'Qi-Stagnation Constitution',
      keyword: 'Stress-Tense & Emotion-Sensitive',
      copy: 'Your answers suggest that stress and emotions may linger in the body, affecting your mood, sense of ease, or sleep. A routine centered on unwinding may suit you.',
      product: 'fuyaoshang',
    },
    G: {
      name: 'Sensitive Constitution',
      keyword: 'Sensitive & Reactive',
      copy: 'Your answers suggest a higher level of sensitivity to foods, environmental triggers, seasonal changes, or certain ingredients. Ingredient safety should take priority over constitution-based matching.',
      product: null,
    },
  };

  const MIXED_RULES = {
    'Q+T': ['yunkaijian', 'yuseying'],
    'Q+S': ['yunkaijian', 'yuseying'],
    'Q+Y': ['rantaoyao', 'yuseying'],
    'Q+X': ['fuyaoshang', 'yuseying'],
    'T+Y': ['yunkaijian', 'rantaoyao'],
    'M+X': ['fuyaoshang', 'yuexiahan'],
    'S+T': ['yunkaijian', 'yufengyou'],
    'M+T': ['yunkaijian', 'fuyaoshang'],
    'M+S': ['yunkaijian', 'fuyaoshang'],
    'B+Q': ['yuseying', 'rantaoyao'],
    'B+Y': ['rantaoyao', 'yuseying'],
  };

  const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const pairKey = (a, b) => [a, b].sort().join('+');
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function calculateScores(answers) {
    return GROUPS.reduce((scores, group) => {
      const values = group.questions
        .map((_, index) => answers[`${group.code}${index + 1}`])
        .filter((value) => Number.isFinite(value) && value > 0);
      if (!values.length) {
        scores[group.code] = 0;
        return scores;
      }
      const raw = values.reduce((sum, value) => sum + value, 0);
      scores[group.code] = Math.round(((raw - values.length) / (4 * values.length)) * 100);
      return scores;
    }, {});
  }

  function classify(scores) {
    const nonBalanced = Object.keys(RESULTS)
      .filter((code) => code !== 'P')
      .sort((a, b) => scores[b] - scores[a]);
    const isBalanced = scores.P >= 60 && nonBalanced.every((code) => scores[code] < 40);

    if (isBalanced) return { primary: 'P', secondary: [], lowConfidence: false };

    const primary = nonBalanced[0];
    const secondary = nonBalanced.filter((code) => code !== primary && scores[code] >= 40).slice(0, 2);
    return { primary, secondary, lowConfidence: scores[primary] < 40 };
  }

  function getRecommendations(profile, scores, answers) {
    if (scores.G >= 60 || profile.primary === 'G') return { products: [], caution: true };
    if (profile.lowConfidence || profile.primary === 'P') return { products: ['sevenday'], caution: false };

    let products = [];
    for (const secondaryCode of profile.secondary) {
      const mixed = MIXED_RULES[pairKey(profile.primary, secondaryCode)];
      if (mixed) {
        products = [...mixed];
        break;
      }
    }

    if (!products.length) {
      products.push(RESULTS[profile.primary].product);
      if (profile.secondary[0]) products.push(RESULTS[profile.secondary[0]].product);
    }

    const sleepSignal = answers.X6 >= 4 || answers.M5 >= 4;
    const strongSleepSignal = (answers.X6 === 5 && scores.X >= 60) || (answers.M5 === 5 && scores.M >= 60);
    if (strongSleepSignal) products.unshift('yuexiahan');
    else if (sleepSignal) products.push('yuexiahan');

    if (scores.X >= 60) products = products.filter((key) => key !== 'rantaoyao');
    products = products.filter(Boolean).filter((key, index, list) => list.indexOf(key) === index);

    if (!products.length) products.push('sevenday');
    return { products: products.slice(0, 2), caution: false };
  }

  function radarMarkup(scores) {
    const size = 240;
    const center = size / 2;
    const radius = 78;
    const codes = GROUPS.map((group) => group.code);
    const point = (index, value) => {
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / codes.length;
      const distance = radius * (value / 100);
      return [center + Math.cos(angle) * distance, center + Math.sin(angle) * distance];
    };
    const polygon = (value) => codes.map((_, index) => point(index, value).join(',')).join(' ');
    const scorePoints = codes.map((code, index) => point(index, scores[code]).join(',')).join(' ');
    const labels = GROUPS.map((group, index) => {
      const [x, y] = point(index, 1.28 * 100);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${group.code}</text>`;
    }).join('');
    const axes = codes.map((_, index) => {
      const [x, y] = point(index, 100);
      return `<line x1="${center}" y1="${center}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`;
    }).join('');
    const legend = GROUPS.map((group) => `<li><span>${group.short}</span><strong>${scores[group.code]}</strong></li>`).join('');

    return `
      <svg viewBox="0 0 ${size} ${size}" role="img" aria-labelledby="btq-radar-title">
        <title id="btq-radar-title">Nine-dimension constitution score profile</title>
        <g class="btq-radar__grid">
          <polygon points="${polygon(25)}"></polygon>
          <polygon points="${polygon(50)}"></polygon>
          <polygon points="${polygon(75)}"></polygon>
          <polygon points="${polygon(100)}"></polygon>
          ${axes}
        </g>
        <polygon class="btq-radar__score" points="${scorePoints}"></polygon>
        <g class="btq-radar__labels">${labels}</g>
      </svg>
      <ul class="btq-radar__legend">${legend}</ul>
    `;
  }

  function initQuiz(root) {
    if (!root || root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';

    const storageKey = root.dataset.storageKey || 'thyling-constitution-quiz-v2';
    const progress = root.querySelector('[data-btq-progress]');
    const progressCount = root.querySelector('[data-btq-progress-count]');
    const progressBar = root.querySelector('[data-btq-progress-bar]');
    const stage = root.querySelector('[data-btq-stage]');
    const group = root.querySelector('[data-btq-group]');
    const questionNumber = root.querySelector('[data-btq-question-number]');
    const questionText = root.querySelector('[data-btq-question]');
    const options = root.querySelector('[data-btq-options]');
    const skip = root.querySelector('[data-btq-skip]');
    const previous = root.querySelector('[data-btq-previous]');
    const next = root.querySelector('[data-btq-next]');
    const result = root.querySelector('[data-btq-result]');
    const resultBadge = root.querySelector('[data-btq-result-badge]');
    const resultTitle = root.querySelector('[data-btq-result-title]');
    const resultKeyword = root.querySelector('[data-btq-result-keyword]');
    const resultCopy = root.querySelector('[data-btq-result-copy]');
    const resultSecondary = root.querySelector('[data-btq-result-secondary]');
    const resultCaution = root.querySelector('[data-btq-result-caution]');
    const resultCards = root.querySelector('[data-btq-result-cards]');
    const resultSet = root.querySelector('[data-btq-result-set]');
    const radar = root.querySelector('[data-btq-radar]');
    const reset = root.querySelector('[data-btq-reset]');

    const state = { current: 0, answers: {} };

    try {
      const saved = JSON.parse(window.sessionStorage.getItem(storageKey));
      if (saved && typeof saved === 'object') {
        state.current = clamp(Number(saved.current) || 0, 0, QUESTIONS.length - 1);
        state.answers = saved.answers && typeof saved.answers === 'object' ? saved.answers : {};
      }
    } catch (error) {
      state.current = 0;
      state.answers = {};
    }

    function save() {
      try {
        window.sessionStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        // The quiz remains fully functional when browser storage is unavailable.
      }
    }

    function updateProgress() {
      const answered = QUESTIONS.filter((question) => hasOwn(state.answers, question.id)).length;
      progressCount.textContent = `Question ${state.current + 1} of ${QUESTIONS.length}`;
      progressBar.style.transform = `scaleX(${answered / QUESTIONS.length})`;
      progress.setAttribute('aria-valuenow', String(answered));
    }

    function choose(value, shouldAdvance) {
      const question = QUESTIONS[state.current];
      state.answers[question.id] = value;
      save();
      options.querySelectorAll('button').forEach((button) => {
        const selected = Number(button.dataset.value) === value;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      next.disabled = false;
      updateProgress();

      if (shouldAdvance) {
        window.setTimeout(() => {
          if (state.current < QUESTIONS.length - 1) {
            state.current += 1;
            renderQuestion(true);
          }
        }, 160);
      }
    }

    function renderQuestion(focusQuestion) {
      const question = QUESTIONS[state.current];
      const groupQuestion = (state.current % 7) + 1;
      stage.hidden = false;
      result.classList.remove('is-visible');
      group.textContent = `${question.group} · ${groupQuestion} of 7`;
      questionNumber.textContent = question.id;
      questionText.textContent = question.text;
      questionText.tabIndex = -1;
      skip.hidden = !question.optional;
      previous.disabled = state.current === 0;
      next.textContent = state.current === QUESTIONS.length - 1 ? 'See My Results' : 'Next question';
      next.disabled = !hasOwn(state.answers, question.id);
      options.replaceChildren();

      SCALE.forEach((item) => {
        const button = document.createElement('button');
        const selected = state.answers[question.id] === item.value;
        button.type = 'button';
        button.className = `btq-option${selected ? ' is-selected' : ''}`;
        button.dataset.value = String(item.value);
        button.setAttribute('aria-pressed', String(selected));
        button.innerHTML = `<span>${item.value}</span><strong>${item.label}</strong>`;
        button.addEventListener('click', () => choose(item.value, state.current < QUESTIONS.length - 1));
        options.appendChild(button);
      });

      updateProgress();
      save();
      if (focusQuestion) {
        questionText.focus({ preventScroll: true });
        root.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }
    }

    function cloneProductCard(key, eyebrow) {
      const template = root.querySelector(`[data-btq-product-template="${key}"]`);
      if (!template) return null;
      const fragment = template.content.cloneNode(true);
      const eyebrowNode = fragment.querySelector('.btq-rec-card__eyebrow');
      if (eyebrowNode) eyebrowNode.textContent = eyebrow;
      return fragment;
    }

    function showResult() {
      const scores = calculateScores(state.answers);
      const profile = classify(scores);
      const recommendation = getRecommendations(profile, scores, state.answers);
      const primaryResult = RESULTS[profile.primary];

      stage.hidden = true;
      result.classList.add('is-visible');
      progressCount.textContent = 'Profile complete';
      progressBar.style.transform = 'scaleX(1)';
      progress.setAttribute('aria-valuenow', String(QUESTIONS.length));
      radar.innerHTML = radarMarkup(scores);
      resultCards.replaceChildren();
      resultSet.replaceChildren();
      resultCaution.hidden = true;
      resultSecondary.hidden = profile.secondary.length === 0;

      if (recommendation.caution) {
        resultBadge.textContent = 'Choose with Extra Care';
        resultTitle.textContent = RESULTS.G.name;
        resultKeyword.textContent = RESULTS.G.keyword;
        resultCopy.textContent = RESULTS.G.copy;
        resultSecondary.hidden = true;
        resultCaution.hidden = false;
        resultCaution.innerHTML = '<strong>No automatic product recommendation is shown.</strong><p>Review every ingredient and speak with a qualified healthcare professional before using a related product, especially if you have known food, environmental, or medication allergies.</p>';
      } else if (profile.lowConfidence) {
        resultBadge.textContent = 'No prominent tendency';
        resultTitle.textContent = 'Your answers form a relatively mixed profile';
        resultKeyword.textContent = 'No dimension reached the moderate threshold';
        resultCopy.textContent = 'Your current answers do not point strongly toward one constitution pattern. A broad, steady routine may be more useful than a narrowly targeted recommendation.';
      } else {
        resultBadge.textContent = profile.primary === 'P' ? 'Your Constitution Profile' : 'Your Primary Tendency';
        resultTitle.textContent = primaryResult.name;
        resultKeyword.textContent = primaryResult.keyword;
        resultCopy.textContent = primaryResult.copy;
      }

      if (!resultSecondary.hidden) {
        resultSecondary.innerHTML = `<strong>You also show signs of</strong><p>${profile.secondary.map((code) => RESULTS[code].name).join(' · ')}</p>`;
      }

      recommendation.products.forEach((key, index) => {
        const card = cloneProductCard(key, index === 0 ? 'Your Best Match' : 'Also Worth Exploring');
        if (card) resultCards.appendChild(card);
      });

      if (!recommendation.caution && !recommendation.products.includes('sevenday')) {
        const heading = document.createElement('h3');
        heading.textContent = 'Looking for a more complete weekly ritual?';
        const card = cloneProductCard('sevenday', 'Complete weekly ritual');
        resultSet.appendChild(heading);
        if (card) resultSet.appendChild(card);
      }

      root.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      resultTitle.tabIndex = -1;
      resultTitle.focus({ preventScroll: true });
    }

    previous.addEventListener('click', () => {
      if (state.current === 0) return;
      state.current -= 1;
      renderQuestion(true);
    });

    next.addEventListener('click', () => {
      const question = QUESTIONS[state.current];
      if (!hasOwn(state.answers, question.id)) return;
      if (state.current === QUESTIONS.length - 1) showResult();
      else {
        state.current += 1;
        renderQuestion(true);
      }
    });

    skip.addEventListener('click', () => {
      choose(0, false);
      if (state.current === QUESTIONS.length - 1) showResult();
      else {
        state.current += 1;
        renderQuestion(true);
      }
    });

    reset.addEventListener('click', () => {
      state.current = 0;
      state.answers = {};
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch (error) {
        // Nothing else is required when storage is unavailable.
      }
      renderQuestion(true);
    });

    root.addEventListener('keydown', (event) => {
      if (stage.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
      const value = Number(event.key);
      if (value >= 1 && value <= 5) choose(value, state.current < QUESTIONS.length - 1);
    });

    const answeredCount = QUESTIONS.filter((question) => hasOwn(state.answers, question.id)).length;
    if (answeredCount === QUESTIONS.length) showResult();
    else renderQuestion(false);
  }

  function initAll(scope) {
    (scope || document).querySelectorAll('[data-body-type-quiz]').forEach(initQuiz);
  }

  window.ThylingQuizEngine = Object.freeze({
    questionCount: QUESTIONS.length,
    questions: QUESTIONS.map(({ id, code, optional }) => ({ id, code, optional })),
    calculateScores,
    classify,
    getRecommendations,
  });

  initAll(document);
  document.addEventListener('shopify:section:load', (event) => initAll(event.target));
})();
