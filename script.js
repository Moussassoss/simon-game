$(document).ready(function() {
  let sequence = [];
  let userSequence = [];
  let score = 0;
  let isPlaying = false;
  let gameOver = false;

  // Cache jQuery selectors
  const $modal = $('#gameModal');
  const $howToPlayModal = $('#howToPlayModal');
  const $playButton = $('#playButton');
  const $howToPlayButton = $('#howToPlayButton');
  const $closeButton = $('#closeButton');
  const $closeHowToPlayButton = $('#closeHowToPlayButton');
  const $restartButton = $('#restartButton');
  const $scoreElement = $('#scoreValue');
  const $gameButtons = $('.game-button');

  $playButton.on('click', function() {
    $modal.addClass('active');
    startGame();
  });

  $howToPlayButton.on('click', function() {
    $howToPlayModal.addClass('active');
  });

  $closeButton.on('click', function() {
    $modal.removeClass('active');
    resetGame();
  });

  $closeHowToPlayButton.on('click', function() {
    $howToPlayModal.removeClass('active');
  });

  $restartButton.on('click', startGame);

  $gameButtons.on('click', function() {
    handleButtonClick($(this));
  });

  $(window).on('click', function(event) {
    if ($(event.target).hasClass('modal')) {
      $modal.removeClass('active');
      $howToPlayModal.removeClass('active');
      resetGame();
    }
  });

  function resetGame() {
    sequence = [];
    userSequence = [];
    score = 0;
    isPlaying = false;
    gameOver = false;
    $scoreElement.text('0');
    $restartButton.addClass('hidden');
    $('.game-container').removeClass('game-over');
    enableButtons(true);
  }

  async function startGame() {
    resetGame();
    enableButtons(false);
    await addNextInSequence();
  }

  async function addNextInSequence() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    await showNewColor(randomColor);
    userSequence = [];
    enableButtons(true);
  }

  async function showNewColor(color) {
    isPlaying = true;
    const $button = $(`.game-button[data-color="${color}"]`);
    $button.addClass('active');
    playSound(color);
    await new Promise(resolve => setTimeout(resolve, 300));
    $button.removeClass('active');
    isPlaying = false;
  }

  function playSound(color) {
    const audio = new Audio('sounds/' + color + '.mp3');
    audio.play();
  }

  function enableButtons(enabled) {
    $gameButtons.prop('disabled', !enabled);
  }

  function handleButtonClick($button) {
    if (isPlaying || gameOver) return;

    const color = $button.data('color');
    playSound(color);
    $button.addClass('active');
    setTimeout(() => $button.removeClass('active'), 300);

    userSequence.push(color);
    const currentIndex = userSequence.length - 1;

    if (userSequence[currentIndex] !== sequence[currentIndex]) {
      gameOver = true;
      $('.game-container').addClass('game-over');
      playSound('wrong');
      setTimeout(() => $('.game-container').removeClass('wrong'), 200);
      $restartButton.removeClass('hidden');
      enableButtons(false);
      return;
    }

    // If user finished current sequence correctly
    if (userSequence.length === sequence.length) {
      score++;
      $scoreElement.text(score);
      enableButtons(false);
      setTimeout(() => addNextInSequence(), 800);
    }
  }
});
