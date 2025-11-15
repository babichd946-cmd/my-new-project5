$(document).ready(function() {
    // Дані слів для вивчення
    const wordPairs = [
        { ukrainian: "завжди", english: "always" },
        { ukrainian: "ніколи", english: "never" },
        { ukrainian: "зазвичай", english: "usually" },
        { ukrainian: "часто", english: "often" },
        { ukrainian: "iноді", english: "sometimes" },
        { ukrainian: "зрідка", english: "occasionally" },
        { ukrainian: "рідко", english: "seldom" },
        { ukrainian: "майже ніколи", english: "hardly ever" },
        { ukrainian: "загалом", english: "generally" },
        { ukrainian: "регулярно", english: "regulary" }
    ];

    // Стан гри
    let gameState = {
        currentStep: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        currentWords: [],
        isAnswered: false
    };

    // Елементи DOM
    const elements = {
        currentWord: $('#currentWord'),
        currentWordBack: $('#currentWordBack'),
        correctTranslation: $('#correctTranslation'),
        translationInput: $('#translationInput'),
        checkBtn: $('#checkBtn'),
        nextBtn: $('#nextBtn'),
        wordCard: $('#wordCard'),
        correctCount: $('#correctCount'),
        incorrectCount: $('#incorrectCount'),
        stepCounter: $('#stepCounter'),
        progressBar: $('#progressBar'),
        feedback: $('#feedback'),
        resultsModal: $('#resultsModal'),
        finalScore: $('#finalScore'),
        knowledgeLevel: $('#knowledgeLevel'),
        restartBtn: $('#restartBtn')
    };

    // Ініціалізація гри
    function initGame() {
        // Скидання стану
        gameState = {
            currentStep: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            currentWords: [...wordPairs].sort(() => Math.random() - 0.5),
            isAnswered: false
        };

        updateStats();
        showCurrentWord();
        resetInput();
    }

    // Показати поточне слово
    function showCurrentWord() {
        if (gameState.currentStep >= gameState.currentWords.length) {
            showResults();
            return;
        }

        const currentWord = gameState.currentWords[gameState.currentStep];
        
        // Оновлення інтерфейсу
        elements.currentWord.text(currentWord.ukrainian);
        elements.currentWordBack.text(currentWord.ukrainian);
        elements.correctTranslation.text(currentWord.english);
        
        elements.stepCounter.text(`${gameState.currentStep + 1}/${gameState.currentWords.length}`);
        elements.progressBar.css('width', `${(gameState.currentStep / gameState.currentWords.length) * 100}%`);
        
        resetInput();
    }

    // Скидання поля вводу
    function resetInput() {
        elements.translationInput.val('').prop('disabled', false).focus();
        elements.checkBtn.prop('disabled', false);
        elements.nextBtn.prop('disabled', true);
        elements.wordCard.removeClass('flipped');
        elements.feedback.text('').removeClass('correct-feedback incorrect-feedback');
        gameState.isAnswered = false;
    }

    // Перевірка відповіді
    function checkAnswer() {
        if (gameState.isAnswered) return;

        const userAnswer = elements.translationInput.val().trim().toLowerCase();
        const correctAnswer = gameState.currentWords[gameState.currentStep].english.toLowerCase();

        if (userAnswer === correctAnswer) {
            // Правильна відповідь
            gameState.correctAnswers++;
            showFeedback('Правильно! ✓', 'correct-feedback');
        } else {
            // Неправильна відповідь
            gameState.incorrectAnswers++;
            showFeedback(`Неправильно. Правильно: ${gameState.currentWords[gameState.currentStep].english}`, 'incorrect-feedback');
        }

        updateStats();
        completeAnswer();
    }

    // Показати відгук
    function showFeedback(message, className) {
        elements.feedback.text(message)
            .removeClass('correct-feedback incorrect-feedback')
            .addClass(className);
    }

    // Завершити відповідь
    function completeAnswer() {
        gameState.isAnswered = true;
        elements.translationInput.prop('disabled', true);
        elements.checkBtn.prop('disabled', true);
        elements.nextBtn.prop('disabled', false);
        elements.wordCard.addClass('flipped');
    }

    // Наступне слово
    function nextWord() {
        gameState.currentStep++;
        showCurrentWord();
    }

    // Оновити статистику
    function updateStats() {
        elements.correctCount.text(gameState.correctAnswers);
        elements.incorrectCount.text(gameState.incorrectAnswers);
    }

    // Показати результати
    function showResults() {
        const score = Math.round((gameState.correctAnswers / gameState.currentWords.length) * 100);
        
        let level, message;
        if (score >= 90) {
            level = "Експерт";
            message = "Відмінно! Ви майже бездоганно володієте цими словами.";
        } else if (score >= 70) {
            level = "Просунутий";
            message = "Дуже добре! Ви добре знаєте ці слова.";
        } else if (score >= 50) {
            level = "Середній";
            message = "Непогано! Продовжуйте практикуватися.";
        } else {
            level = "Початківець";
            message = "Потрібно більше практики. Спробуйте ще раз!";
        }

        elements.finalScore.text(`${score}%`);
        elements.knowledgeLevel.text(level);
        elements.resultsModal.fadeIn(300);
    }

    // Обробники подій
    function setupEventHandlers() {
        // Кнопка перевірки
        elements.checkBtn.on('click', checkAnswer);
        
        // Кнопка наступного слова
        elements.nextBtn.on('click', nextWord);
        
        // Картка слова
        elements.wordCard.on('click', function() {
            if (!gameState.isAnswered) {
                checkAnswer();
            } else {
                nextWord();
            }
        });
        
        // Enter у полі вводу
        elements.translationInput.on('keypress', function(e) {
            if (e.which === 13) { // Enter
                if (!gameState.isAnswered) {
                    checkAnswer();
                } else {
                    nextWord();
                }
            }
        });
        
        // Кнопка перезапуску
        elements.restartBtn.on('click', function() {
            elements.resultsModal.fadeOut(300);
            setTimeout(initGame, 300);
        });
    }

    // Запуск гри
    function startGame() {
        setupEventHandlers();
        initGame();
    }

    // Початок
    startGame();
});