let selectedGender = null;
let selectedTheme = null;
let isCustomTheme = false;

const genderButtons = document.querySelectorAll('.gender-btn');
const themeButtons = document.querySelectorAll('.theme-btn');
const customThemeBtn = document.querySelector('.custom-theme-btn');
const customInput = document.querySelector('.custom-input');
const customThemeInput = document.getElementById('customTheme');
const generateBtn = document.querySelector('.generate-btn');
const resultSection = document.querySelector('.result');
const affirmationsList = document.getElementById('affirmationsList');
const regenerateBtn = document.querySelector('.regenerate-btn');

genderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    genderButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedGender = btn.dataset.gender;
    updateGenerateButton();
  });
});

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (btn === customThemeBtn) {
      isCustomTheme = true;
      customInput.classList.remove('hidden');
      selectedTheme = null;
    } else {
      isCustomTheme = false;
      customInput.classList.add('hidden');
      selectedTheme = btn.dataset.theme;
    }
    updateGenerateButton();
  });
});

customThemeInput.addEventListener('input', () => {
  isCustomTheme = customThemeInput.value.trim().length > 0;
  updateGenerateButton();
});

function updateGenerateButton() {
  const hasGender = selectedGender !== null;
  const hasTheme = selectedTheme !== null || (isCustomTheme && customThemeInput.value.trim().length > 0);
  generateBtn.disabled = !(hasGender && hasTheme);
}

generateBtn.addEventListener('click', generateAffirmations);
regenerateBtn.addEventListener('click', generateAffirmations);

async function generateAffirmations() {
  const customText = isCustomTheme ? customThemeInput.value.trim() : null;
  
  generateBtn.classList.add('loading');
  generateBtn.querySelector('.btn-text').classList.add('hidden');
  generateBtn.querySelector('.btn-loader').classList.remove('hidden');
  generateBtn.disabled = true;
  resultSection.classList.add('hidden');
  
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gender: selectedGender,
        theme: selectedTheme,
        customText: customText
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      alert(data.error);
      return;
    }
    
    displayAffirmations(data.affirmations);
  } catch (error) {
    alert('Ошибка соединения. Попробуйте еще раз.');
  } finally {
    generateBtn.classList.remove('loading');
    generateBtn.querySelector('.btn-text').classList.remove('hidden');
    generateBtn.querySelector('.btn-loader').classList.add('hidden');
    updateGenerateButton();
  }
}

function displayAffirmations(affirmations) {
  affirmationsList.innerHTML = '';
  
  affirmations.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    affirmationsList.appendChild(li);
  });
  
  resultSection.classList.remove('hidden');
  resultSection.scrollIntoView({ behavior: 'smooth' });
}