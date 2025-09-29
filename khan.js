(function() {
    if (document.getElementById("khz-panel")) return;
  
    // --- CONFIGURAÇÕES E FUNCIONALIDADES DO SCRIPT ---
    const features = {
      questionSpoof: false,
      videoSpoof: false,
      revealAnswers: false,
      autoAnswer: false,
      darkMode: false,
      rgbLogo: false,
      oneko: true
    };
  
    const config = {
      autoAnswerDelay: 1.5
    };
  
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    // --- ESTILOS DO PAINEL E ELEMENTOS COM O NOVO TEMA PRETO E BRANCO ---
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
      :root {
        /* Paleta de cores alterada para preto e branco */
        --khz-bg: rgba(20, 20, 20, 0.85);          /* Fundo do painel (preto semi-transparente) */
        --khz-surface: rgba(51, 51, 51, 0.9);      /* Fundo de botões (cinza escuro) */
        --khz-border: rgba(255, 255, 255, 0.2);  /* Bordas (branco semi-transparente) */
        --khz-primary: #ffffff;                 /* Cor de destaque principal (branco) */
        --khz-primary-hover: #cccccc;           /* Cor de destaque ao passar o mouse (cinza claro) */
        --khz-text: #f0f0f0;                     /* Cor do texto principal (branco suave) */
        --khz-text-muted: #aaaaaa;              /* Cor do texto secundário (cinza) */
      }
      @keyframes fadeIn { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
      @keyframes hueShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
      
      .khz-toggle {
        position: fixed; bottom: 20px; left: 20px; width: 48px; height: 48px;
        background: var(--khz-surface); border: 1px solid var(--khz-border); border-radius: 50%;
        display: flex; align-items: center; justify-content: center; cursor: pointer;
        z-index: 100000; color: var(--khz-text); font-size: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); font-family: 'Poppins', sans-serif;
        transition: all 0.3s ease; backdrop-filter: blur(10px);
      }
      .khz-toggle:hover { background: var(--khz-primary); color: #000; transform: scale(1.1) rotate(15deg); }
      .khz-panel {
        position: fixed; top: 80px; left: 80px; width: 340px;
        background: var(--khz-bg); border-radius: 18px;
        border: 1px solid var(--khz-border); padding: 0;
        z-index: 99999; color: var(--khz-text); font-family: 'Poppins', sans-serif;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);
        cursor: grab; display: none; animation: fadeIn 0.4s ease; overflow: hidden;
      }
      .khz-header {
        padding: 20px 24px; background: rgba(0,0,0,0.15);
        display: flex; justify-content: space-between; align-items: center;
      }
      .khz-title { font-weight: 600; font-size: 22px; color: #fff; }
      .khz-version { font-size: 12px; font-weight: 500; color: var(--khz-text-muted); padding: 4px 8px; background: rgba(0,0,0,0.2); border-radius: 8px;}
      .khz-tabs { display: flex; padding: 12px 24px 0 24px; border-bottom: 1px solid var(--khz-border); }
      .khz-tab {
        padding: 8px 16px; cursor: pointer; color: var(--khz-text-muted);
        font-weight: 500; font-size: 14px; border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }
      .khz-tab:hover { color: var(--khz-primary-hover); }
      .khz-tab.active { color: var(--khz-primary); border-bottom-color: var(--khz-primary); }
      .khz-tab-content { padding: 20px 24px; display: none; animation: fadeIn 0.3s; }
      .khz-tab-content.active { display: block; }
      .khz-button {
        display: flex; align-items: center; gap: 12px; width: 100%;
        margin: 8px 0; padding: 12px; background: var(--khz-surface);
        color: var(--khz-text); border: 1px solid var(--khz-border);
        border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500;
        transition: all 0.2s ease-in-out; text-align: left;
      }
      .khz-button:hover { border-color: var(--khz-primary); background: rgba(255, 255, 255, 0.05); }
      .khz-button.active {
        background: var(--khz-primary); color: #000; border-color: var(--khz-primary); /* Botão ativo: fundo branco, texto preto */
        font-weight: 600;
      }
      .khz-button.active .khz-icon { stroke: #000; } /* Ícone do botão ativo: preto */
      .khz-icon { width: 20px; height: 20px; stroke: var(--khz-text-muted); transition: all 0.2s; flex-shrink: 0; }
      .khz-button:hover .khz-icon { stroke: var(--khz-primary-hover); }
      .khz-input-group { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--khz-border); }
      .khz-input-group label {
        display: flex; justify-content: space-between; align-items: center;
        font-size: 14px; color: var(--khz-text); margin-bottom: 10px; font-weight: 500;
      }
      #khz-speed-value { font-weight: 600; color: var(--khz-primary); }
      input[type="range"] {
        -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
        background: var(--khz-surface); border-radius: 3px; outline: none;
        border: 1px solid var(--khz-border);
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
        background: var(--khz-primary); border-radius: 50%; cursor: pointer;
        transition: background 0.2s;
      }
      input[type="range"]::-webkit-slider-thumb:hover { background: var(--khz-primary-hover); }
      .khz-footer {
        display: flex; justify-content: space-between; align-items: center; padding: 12px 24px;
        background: rgba(0,0,0,0.15); border-top: 1px solid var(--khz-border);
        font-size: 12px; color: var(--khz-text-muted);
      }
      .khz-footer a { color: var(--khz-primary); text-decoration: none; transition: color 0.3s; font-weight: 500; }
      .khz-footer a:hover { color: var(--khz-primary-hover); }
      @media (max-width: 768px) {
        .khz-panel { width: calc(100vw - 40px); max-width: 340px; left: 20px; top: 20px; transform: none; }
      }
    `;
    document.head.appendChild(style);
  
    // --- TELA DE CARREGAMENTO (SPLASH SCREEN) ---
    const showSplashScreen = () => {
      const splash = document.createElement('div');
      splash.innerHTML = `
          <div style="text-align:center; font-weight:bold; font-size:32px;">
              <span class="splash-moon">Henrique </span><span class="splash-scripts">Maxwell</span>
          </div>
          <div class="splash-credits">by Henrique Maxwell</div>
      `;
      splash.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#FFF;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;opacity:0;transition:opacity 0.5s ease;user-select:none;font-family:sans-serif;color:#000;";
      document.body.appendChild(splash);
      setTimeout(() => {
        splash.style.opacity = '1';
      }, 10);
      setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
      }, 2800);
    };
  
    // --- SISTEMA DE NOTIFICAÇÃO (TOASTIFY) COM O NOVO TEMA ---
    let Toastify;
    const createToastNode = (text, duration) => {
      const node = document.createElement('div');
      node.style.position = 'relative';
      node.style.paddingBottom = '8px';
      node.innerHTML = `<div>${text}</div><div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div>`;
      return node;
    };
  
    const sendToast = (text, duration = 4000) => {
      if (Toastify) {
        Toastify({
          node: createToastNode(text, duration),
          duration: duration,
          gravity: 'bottom',
          position: 'center',
          style: {
            background: "rgba(20, 20, 20, 0.9)", // Fundo preto
            backdropFilter: "blur(5px)",
            color: "#fff", // Texto branco
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255, 255, 255, 0.2)", // Borda branca
            fontFamily: "'Poppins', sans-serif",
            padding: "10px 15px 0 15px",
            textAlign: "center"
          }
        }).showToast();
      }
    };
  
  
    // --- LÓGICA DE INTERCEPTAÇÃO DE REDE ---
    const originalParse = JSON.parse;
    JSON.parse = function(text, reviver) {
      let data = originalParse(text, reviver);
      if (features.revealAnswers && data && data.data) {
        try {
          const dataValues = Object.values(data.data);
          for (const val of dataValues) {
            if (val && val.item && val.item.itemData) {
              let itemData = JSON.parse(val.item.itemData);
              if (itemData.question && itemData.question.widgets) {
                for (const widget of Object.values(itemData.question.widgets)) {
                  if (widget.options && widget.options.choices) {
                    widget.options.choices.forEach(choice => {
                      if (choice.correct) {
                        choice.content = "✅ " + choice.content;
                        sendToast("Resposta revelada!");
                      }
                    });
                  }
                }
              }
              val.item.itemData = JSON.stringify(itemData);
            }
          }
        } catch (e) {}
      }
      return data;
    };
  
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      let [input, init] = args;
      const originalResponse = await originalFetch.apply(this, args);
      if (features.questionSpoof && originalResponse.ok) {
        const clonedResponse = originalResponse.clone();
        try {
          let responseObj = await clonedResponse.json();
          if (responseObj && responseObj.data && responseObj.data.assessmentItem && responseObj.data.assessmentItem.item && responseObj.data.assessmentItem.item.itemData) {
            const phrases = [
              "Feito por [@orickmaxx](https://www.instagram.com/orickmax)!",
              "Me siga no insta [Instagram](https://www.instagram.com/orickmax)!",
              "Script por Henrique Maxwell."
            ];
            let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
            itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `\n\n[[☃ radio 1]]`;
            itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "✅", correct: true }, { content: "❌ (não clica aqui animal)", correct: false }] } } };
            responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            sendToast("Questão modificada!");
            return new Response(JSON.stringify(responseObj), { status: 200, statusText: "OK", headers: originalResponse.headers });
          }
        } catch (e) {}
      }
      return originalResponse;
    };
  
    // --- LOOPS DE FUNCIONALIDADE ---
    let lastFrameTime = performance.now();
    let frameCount = 0;
    function gameLoop() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 1000) {
            const fpsCounter = document.getElementById("khz-fps-counter");
            if (fpsCounter) fpsCounter.textContent = `FPS: ${frameCount}`;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(gameLoop);
    }
  
    (async function autoAnswerLoop() {
      while (true) {
        if (features.autoAnswer) {
          const click = (selector) => { const e = document.querySelector(selector); if(e) e.click(); };
          click('[data-testid="choice-icon__library-choice-icon"]');
          await delay(100);
          click('[data-testid="exercise-check-answer"]');
          await delay(100);
          click('[data-testid="exercise-next-question"]');
        }
        await delay(config.autoAnswerDelay * 1000);
      }
    })();
    
    // --- INICIALIZAÇÃO PRINCIPAL ---
    (async function initializeUI() {
      // FUNÇÃO ONEKO (GATINHO)
      function oneko() {
          const nekoEl = document.createElement("div"); let nekoPosX = 32; let nekoPosY = 32; let mousePosX = 0; let mousePosY = 0; let frameCount = 0; let idleTime = 0; let idleAnimation = null; let idleAnimationFrame = 0; const nekoSpeed = 10; const spriteSets = { idle: [[-3, -3]], alert: [[-7, -3]], scratchSelf: [[-5, 0], [-6, 0], [-7, 0]], scratchWall: [[0, 0], [0, -1]], sleep: [[-2, 0], [-2, -1]], sit: [[-2, -3]], N: [[-1, -2], [-1, -3]], NE: [[0, -2], [0, -3]], E: [[-3, 0], [-4, 0]], SE: [[-5, -1], [-6, -1]], S: [[-6, -2], [-7, -2]], SW: [[-5, -2], [-6, -3]], W: [[-4, -2], [-4, -3]], NW: [[-1, 0], [-1, -1]], }; function init() { nekoEl.id = "oneko"; nekoEl.style.width = "32px"; nekoEl.style.height = "32px"; nekoEl.style.position = "fixed"; nekoEl.style.pointerEvents = "none"; nekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/orickmaxx/KhanCrack/main/oneko.gif')"; nekoEl.style.imageRendering = "pixelated"; nekoEl.style.left = "16px"; nekoEl.style.top = "16px"; nekoEl.style.zIndex = "9999"; document.body.appendChild(nekoEl); document.addEventListener("mousemove", (event) => { mousePosX = event.clientX; mousePosY = event.clientY; }); window.onekoInterval = setInterval(frame, 100); } function setSprite(name, frame) { const sprite = spriteSets[name][frame % spriteSets[name].length]; nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`; } function resetIdleAnimation() { idleAnimation = null; idleAnimationFrame = 0; } function idle() { idleTime += 1; if (idleTime > 10 && Math.random() < 0.02 && idleAnimation == null) { let availableAnimations = ["alert", "scratchSelf"]; if (nekoPosX < 32) { availableAnimations.push("scratchWall"); } idleAnimation = availableAnimations[Math.floor(Math.random() * availableAnimations.length)]; } switch (idleAnimation) { case "alert": setSprite("alert", 0); if (idleAnimationFrame > 10) { resetIdleAnimation(); } break; case "scratchSelf": setSprite("scratchSelf", idleAnimationFrame); if (idleAnimationFrame > 9) { resetIdleAnimation(); } break; case "scratchWall": setSprite("scratchWall", idleAnimationFrame); if (idleAnimationFrame > 9) { resetIdleAnimation(); } break; default: setSprite("sit", 0); return; } idleAnimationFrame += 1; } function frame() { frameCount += 1; const diffX = nekoPosX - mousePosX; const diffY = nekoPosY - mousePosY; const distance = Math.sqrt(diffX ** 2 + diffY ** 2); if (distance < nekoSpeed || distance < 48) { idle(); return; } idleTime = 0; resetIdleAnimation(); let direction; const angle = (Math.atan2(diffY, diffX) + Math.PI) * (180 / Math.PI) + 90; if (angle < 0) { angle += 360; } if (angle > 337.5 || angle <= 22.5) { direction = "N"; } else if (angle > 22.5 && angle <= 67.5) { direction = "NE"; } else if (angle > 67.5 && angle <= 112.5) { direction = "E"; } else if (angle > 112.5 && angle <= 157.5) { direction = "SE"; } else if (angle > 157.5 && angle <= 202.5) { direction = "S"; } else if (angle > 202.5 && angle <= 247.5) { direction = "SW"; } else if (angle > 247.5 && angle <= 292.5) { direction = "W"; } else if (angle > 292.5 && angle <= 337.5) { direction = "NW"; } setSprite(direction, frameCount); nekoPosX -= (diffX / distance) * nekoSpeed; nekoPosY -= (diffY / distance) * nekoSpeed; nekoEl.style.left = `${nekoPosX - 16}px`; nekoEl.style.top = `${nekoPosY - 16}px`; } init();
      };
      
      function loadScript(src, id) {
        return new Promise((resolve, reject) => {
          if (document.getElementById(id)) return resolve();
          const script = document.createElement('script');
          script.src = src; script.id = id;
          script.onload = resolve; script.onerror = reject;
          document.head.appendChild(script);
        });
      }
  
      // --- CARREGAMENTO DE ESTILOS E SCRIPTS EXTERNOS ---
      const toastifyCSS = document.createElement('link');
      toastifyCSS.rel = 'stylesheet';
      toastifyCSS.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';
      document.head.appendChild(toastifyCSS);
      
      const customStyles = document.createElement('style');
      customStyles.innerHTML = `
          @keyframes slideInLeft{from{transform:translateX(-30px);opacity:0}to{transform:translateX(0);opacity:1}}
          @keyframes slideInRight{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          .splash-moon{animation:slideInLeft .8s ease-out forwards; display:inline-block;}
          .splash-scripts{animation:slideInRight .8s ease-out forwards; animation-delay:.2s; display:inline-block; font-weight: 900;}
          .splash-credits{font-size:14px;color:#555;margin-top:5px;opacity:0;animation:fadeIn 1s ease-out 1s forwards}
          @keyframes progress-deplete{from{width:100%}to{width:0%}}
          .toast-progress-bar{position:absolute;bottom:0;left:0;height:3px;background-color:#fff;animation:progress-deplete linear} /* Barra de progresso do toast branca */
      `;
      document.head.appendChild(customStyles);
  
      showSplashScreen();
      
      await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastify-js').then(() => Toastify = window.Toastify);
      loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkreader').then(() => {
          DarkReader.setFetchMethod(window.fetch);
          if (features.darkMode) DarkReader.enable();
      });
  
      // ATRASO PARA EXIBIR A UI APÓS A TELA DE CARREGAMENTO
      setTimeout(() => {
          gameLoop(); 
  
          const toggleBtn = document.createElement("div");
          toggleBtn.innerHTML = "🤍";
          toggleBtn.className = "khz-toggle";
          toggleBtn.onclick = () => {
            const p = document.getElementById("khz-panel");
            if (p) p.style.display = p.style.display === "none" ? "block" : "none";
          };
          document.body.appendChild(toggleBtn);
          
          const panel = document.createElement("div");
          panel.id = "khz-panel";
          panel.className = "khz-panel";
          panel.innerHTML = `
            <div class="khz-header">
              <div class="khz-title">Henrique Maxwell</div>
              <div class="khz-version">v2.0</div>
            </div>
            <div class="khz-tabs">
              <div class="khz-tab active" data-tab="main">Principal</div>
              <div class="khz-tab" data-tab="visuals">Visuais</div>
              <div class="khz-tab" data-tab="misc">Extras</div>
            </div>
            <div id="khz-tab-main" class="khz-tab-content active">
              <button id="khz-btn-auto" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><span>Auto Answer</span></button>
              <button id="khz-btn-question" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Question Spoof</span></button>
              <button id="khz-btn-video" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span>Video Spoof</span></button>
              <button id="khz-btn-reveal" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg><span>Reveal Answers</span></button>
              <div class="khz-input-group">
                <label for="khz-input-speed">Velocidade <span id="khz-speed-value">${config.autoAnswerDelay.toFixed(1)}s</span></label>
                <input type="range" id="khz-input-speed" value="${config.autoAnswerDelay}" step="0.1" min="1.5" max="2.5">
              </div>
            </div>
            <div id="khz-tab-visuals" class="khz-tab-content">
              <button id="khz-btn-dark" class="khz-button active"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg><span>Dark Mode</span></button>
              <button id="khz-btn-rgb" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg><span>RGB Logo</span></button>
            </div>
            <div id="khz-tab-misc" class="khz-tab-content">
              <button id="khz-btn-oneko" class="khz-button"><svg class="khz-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6.13a15.42,15.42,0,0,1,2.91-9.5,1,1,0,0,1,1.82.94,13.49,13.49,0,0,0-1.6,9.41,1,1,0,0,1-.6,1,1,1,0,0,1-1.12-.39,12.54,12.54,0,0,1-1.41-5.55,1,1,0,0,1,1-1.11,12.63,12.63,0,0,1,5.55,1.41,1,1,0,0,1,.39,1.12,1,1,0,0,1-1,.6,13.49,13.49,0,0,0-9.41,1.6,1,1,0,0,1-.94-1.82,15.42,15.42,0,0,1,9.5-2.91V15a1,1,0,0,1,2,0,13,13,0,0,0,0,2,1,1,0,0,1-2,0Z"/></svg><span>Oneko Gatinho</span></button>
            </div>
            <div class="khz-footer">
              <a href="https://www.instagram.com/orickmax" target="_blank">Henrique Maxwell 🤍</a>
              <span id="khz-fps-counter">FPS: ...</span>
            </div>
          `;
          document.body.appendChild(panel);
  
          // CONFIGURAÇÃO DOS BOTÕES E EVENTOS
          const setupToggleButton = (buttonId, featureName, callback) => {
            const button = document.getElementById(buttonId);
            if (button) {
              button.addEventListener('click', () => {
                features[featureName] = !features[featureName];
                button.classList.toggle('active', features[featureName]);
                if (callback) callback(features[featureName]);
              });
            }
          };
          
          setupToggleButton('khz-btn-auto', 'autoAnswer');
          setupToggleButton('khz-btn-question', 'questionSpoof');
          setupToggleButton('khz-btn-video', 'videoSpoof');
          setupToggleButton('khz-btn-reveal', 'revealAnswers');
          setupToggleButton('khz-btn-dark', 'darkMode', (isActive) => {
              if (typeof DarkReader === 'undefined') return;
              isActive ? DarkReader.enable() : DarkReader.disable();
          });
          setupToggleButton('khz-btn-rgb', 'rgbLogo', toggleRgbLogo);
          setupToggleButton('khz-btn-oneko', 'oneko', toggleOnekoJs);
  
          const speedInput = document.getElementById('khz-input-speed');
          const speedValue = document.getElementById('khz-speed-value');
          if (speedInput && speedValue) {
            speedInput.addEventListener('input', () => {
              const newDelay = parseFloat(speedInput.value);
              config.autoAnswerDelay = newDelay;
              speedValue.textContent = `${newDelay.toFixed(1)}s`;
            });
          }
          
          document.querySelectorAll('.khz-tab').forEach(tab => {
              tab.addEventListener('click', () => {
                  document.querySelectorAll('.khz-tab, .khz-tab-content').forEach(el => el.classList.remove('active'));
                  tab.classList.add('active');
                  document.getElementById(`khz-tab-${tab.dataset.tab}`).classList.add('active');
              });
          });
  
          function toggleRgbLogo(isActive) {
            const khanLogo = document.querySelector('path[fill="#14bf96"]');
            if (!khanLogo) return sendToast("❌ Logo do Khan Academy não encontrado.");
            khanLogo.style.animation = isActive ? 'hueShift 5s infinite linear' : '';
          }
  
          function toggleOnekoJs(isActive) {
              if (isActive) {
                  if (!document.getElementById("oneko")) {
                      oneko();
                      sendToast("🐱 Gatinho ativado!");
                  }
              } else {
                  const onekoEl = document.getElementById("oneko");
                  if (onekoEl) {
                      clearInterval(window.onekoInterval);
                      onekoEl.remove();
                  }
              }
          }
          
          let dragging = false, offsetX = 0, offsetY = 0;
          const startDrag = (e) => {
              if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a") || e.target.closest(".khz-tab")) return;
              dragging = true;
              const touch = e.touches ? e.touches[0] : null;
              const clientX = touch ? touch.clientX : e.clientX;
              const clientY = touch ? touch.clientY : e.clientY;
              offsetX = clientX - panel.offsetLeft;
              offsetY = clientY - panel.offsetTop;
              panel.style.cursor = "grabbing";
          };
          const onDrag = (e) => {
            if (dragging) {
              e.preventDefault();
              const touch = e.touches ? e.touches[0] : null;
              const clientX = touch ? touch.clientX : e.clientX;
              const clientY = touch ? touch.clientY : e.clientY;
              panel.style.left = `${clientX - offsetX}px`;
              panel.style.top = `${clientY - offsetY}px`;
            }
          };
          const endDrag = () => { dragging = false; panel.style.cursor = "grab"; };
  
          panel.addEventListener("mousedown", startDrag);
          document.addEventListener("mousemove", onDrag);
          document.addEventListener("mouseup", endDrag);
          panel.addEventListener("touchstart", startDrag, { passive: false });
          document.addEventListener("touchmove", onDrag, { passive: false });
          document.addEventListener("touchend", endDrag);
  
          // MENSAGEM INICIAL
          sendToast("Script Carregado com Sucesso!");
          setTimeout(() => {
              sendToast("Script por Henrique Maxwell.", 5000)
          }, 1000)
  
      }, 2900);
    })();
  })();