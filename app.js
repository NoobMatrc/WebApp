async function loadXML() {
    const res = await fetch('anki.xml');
    const xml = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const notes = [...doc.querySelectorAll('note')].map(note => {
      let obj = {};
      for (let i = 1; i <= 8; i++) {
        const field = note.querySelector(`field_${i}`);
        obj[`field_${i}`] = field ? field.textContent.trim() : '';
      }
      return obj;
    });
    return notes;
  }
  
  let cards = [];
  let seen = JSON.parse(localStorage.getItem('seen') || '[]');
  let repeat = JSON.parse(localStorage.getItem('repeat') || '[]');
  
  function saveProgress() {
    localStorage.setItem('seen', JSON.stringify(seen));
    localStorage.setItem('repeat', JSON.stringify(repeat));
  }
  
  function playAudio(file) {
    const audio = new Audio(`audio/${file}`);
    audio.play();
  }
  
  function showCard() {
    const unseen = cards.filter(c => !seen.includes(c.field_1));
    const card = unseen[Math.floor(Math.random() * unseen.length)];
  
    document.getElementById('word').textContent = card.field_2;
    document.getElementById('definition').innerHTML = card.field_3;
    document.getElementById('sentence').textContent = `${card.field_5}\n${card.field_6}`;
  
    document.getElementById('playWord').onclick = () =>
      playAudio(card.field_7.replace('[sound:', '').replace(']', ''));
    document.getElementById('playSentence').onclick = () =>
      playAudio(card.field_8.replace('[sound:', '').replace(']', ''));
  
    document.getElementById('again').onclick = () => {
      if (!repeat.includes(card.field_1)) repeat.push(card.field_1);
      saveProgress();
      showCard();
    };
    document.getElementById('seen').onclick = () => {
      seen.push(card.field_1);
      saveProgress();
      showCard();
    };
  }
  
  loadXML().then(data => {
    cards = data;
    showCard();
  });
  