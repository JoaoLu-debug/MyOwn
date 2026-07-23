// Booking Drawer Drawer Controller
const backdrop = document.getElementById('drawer-backdrop');
const panel = document.getElementById('drawer-panel');
const submitBtn = document.getElementById('submit-button');
const bookingForm = document.getElementById('booking-form');

function openDrawer() {
  backdrop.classList.add('active');
  panel.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Focus name input when open for usability
  setTimeout(() => {
    document.getElementById('name').focus();
  }, 100);
}

function closeDrawer() {
  backdrop.classList.remove('active');
  panel.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on Escape Key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && panel.classList.contains('active')) {
    closeDrawer();
  }
});

// ─── Canvas Spline Wave Animation ───────────────────────────────────────────
const splineCanvas = document.getElementById('spline-canvas');
if (splineCanvas) {
  const ctx = splineCanvas.getContext('2d');
  let width = splineCanvas.width = splineCanvas.offsetWidth;
  let height = splineCanvas.height = splineCanvas.offsetHeight;
  
  // Resize handler
  window.addEventListener('resize', () => {
    width = splineCanvas.width = splineCanvas.offsetWidth;
    height = splineCanvas.height = splineCanvas.offsetHeight;
  });

  const waveCount = 3;
  const waves = [];
  
  // Create configuration parameters for spline waves
  for (let i = 0; i < waveCount; i++) {
    waves.push({
      yFactor: 0.46 + (i * 0.06), // Vertical offset placement
      amplitude: 45 + (i * 12),
      speed: 0.008 + (i * 0.004),
      frequency: 0.0025 + (i * 0.0008),
      phase: i * Math.PI / 3,
      lineWidth: 2.2 - (i * 0.4)
    });
  }

  // Linear interpolation variables for mouse movements
  let targetMouseY = 0;
  let currentMouseY = 0;
  
  const posterElement = document.getElementById('hero-poster');
  if (posterElement) {
    posterElement.addEventListener('mousemove', (e) => {
      const rect = posterElement.getBoundingClientRect();
      // Normalize cursor ratio (-0.5 to 0.5)
      targetMouseY = ((e.clientY - rect.top) / rect.height) - 0.5;
    });
    
    posterElement.addEventListener('mouseleave', () => {
      targetMouseY = 0;
    });
  }

  function drawSplines() {
    ctx.clearRect(0, 0, width, height);
    
    // Smooth out coordinates using linear interpolation (LERP)
    currentMouseY += (targetMouseY - currentMouseY) * 0.06;
    
    waves.forEach((wave) => {
      // Set line colors based on the current theme mode
      const isDark = document.body.classList.contains('dark-theme');
      ctx.strokeStyle = isDark
        ? `rgba(255, 255, 255, ${0.16 - wave.lineWidth * 0.03})`
        : `rgba(18, 18, 18, ${0.10 - wave.lineWidth * 0.02})`;
        
      ctx.lineWidth = wave.lineWidth;
      ctx.beginPath();
      
      wave.phase += wave.speed;
      
      // Calculate start coordinate
      const startY = height * wave.yFactor + Math.sin(wave.phase) * wave.amplitude + (currentMouseY * 110 * wave.yFactor);
      ctx.moveTo(0, startY);
      
      const step = 25;
      for (let x = 0; x <= width; x += step) {
        // Spline curve coordinates calculated via trigonometric functions
        const y = height * wave.yFactor 
                + Math.sin(wave.phase + x * wave.frequency) * wave.amplitude 
                + Math.cos(wave.phase * 0.4 + x * 0.001) * (wave.amplitude * 0.4)
                + (currentMouseY * (140 * wave.yFactor));
        
        const nextX = x + step;
        const nextY = height * wave.yFactor 
                    + Math.sin(wave.phase + nextX * wave.frequency) * wave.amplitude 
                    + Math.cos(wave.phase * 0.4 + nextX * 0.001) * (wave.amplitude * 0.4)
                    + (currentMouseY * (140 * wave.yFactor));
        
        // Connect coordinates using quadratic curves
        ctx.quadraticCurveTo(x, y, (x + nextX) / 2, (y + nextY) / 2);
      }
      ctx.stroke();
    });
    
    requestAnimationFrame(drawSplines);
  }
  
  drawSplines();
}


// Form Submission Feedback Interaction
function handleFormSubmit(event) {
  event.preventDefault();
  
  // Tactile loading feedback
  const originalContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  submitBtn.innerHTML = 'Sending request...';
  
  // Mock API delay
  setTimeout(() => {
    // Show success state
    submitBtn.innerHTML = 'Success! Strategy Booked';
    submitBtn.style.backgroundColor = '#10b981'; // Tailwind Emerald green
    submitBtn.style.color = '#ffffff';
    
    setTimeout(() => {
      // Reset form fields
      bookingForm.reset();
      closeDrawer();
      
      // Reset button state
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
        submitBtn.innerHTML = originalContent;
      }, 500);
    }, 1500);
  }, 1200);
}

// ─── Bento Cards Spotlight & 3D Tilt Interaction ───────────────────────────
const bentoCards = document.querySelectorAll('.bento-card');

bentoCards.forEach(card => {
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let isHovered = false;
  
  // Interpolation loop mimicking KokonutUI TILT_SPRING physics
  function cardLoop() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.12;
    currentRotateY += (targetRotateY - currentRotateY) * 0.12;
    
    if (isHovered) {
      card.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(1.025)`;
    } else {
      // Return smoothly to flat coordinates
      if (Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01) {
        card.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(1)`;
      } else {
        card.style.transform = ''; // Clear inline transform to avoid stacking context overrides
      }
    }
    requestAnimationFrame(cardLoop);
  }
  requestAnimationFrame(cardLoop);
  
  card.addEventListener('mousemove', (e) => {
    isHovered = true;
    const rect = card.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width;
    const yNorm = (e.clientY - rect.top) / rect.height;
    
    // Dynamic glow positioning mapping
    card.style.setProperty('--glow-x', `${xNorm * 100}%`);
    card.style.setProperty('--glow-y', `${yNorm * 100}%`);
    
    // Max 9 degrees tilt math (range -9 to 9)
    targetRotateX = (0.5 - yNorm) * 18;
    targetRotateY = (xNorm - 0.5) * 18;
  });
  
  card.addEventListener('mouseenter', () => {
    isHovered = true;
  });
  
  card.addEventListener('mouseleave', () => {
    isHovered = false;
    targetRotateX = 0;
    targetRotateY = 0;
  });
});

// ─── Center Glass Card 3D Tilt & Distortion Interaction ──────────────
const glassCard = document.querySelector('.glass-card');
const cardDisplacement = document.getElementById('card-displacement-map');

if (glassCard) {
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let isGlassHovered = false;
  
  let targetScale = 0;
  let currentScale = 0;
  
  function glassCardLoop() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.12;
    currentRotateY += (targetRotateY - currentRotateY) * 0.12;
    
    // Calculate current rotation magnitude/velocity
    const tiltMagnitude = Math.sqrt(currentRotateX * currentRotateX + currentRotateY * currentRotateY);
    
    // Set target distortion scale (warp up to 32px depending on tilt degree)
    targetScale = isGlassHovered ? Math.min(tiltMagnitude * 2.2, 32) : 0;
    currentScale += (targetScale - currentScale) * 0.15;
    
    // Apply displacement scale to SVG shader
    if (cardDisplacement) {
      cardDisplacement.setAttribute('scale', currentScale);
    }
    
    if (isGlassHovered) {
      glassCard.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(1.03)`;
    } else {
      if (Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01) {
        glassCard.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(1)`;
      } else {
        glassCard.style.transform = '';
      }
    }
    requestAnimationFrame(glassCardLoop);
  }
  requestAnimationFrame(glassCardLoop);
  
  glassCard.addEventListener('mousemove', (e) => {
    isGlassHovered = true;
    const rect = glassCard.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width;
    const yNorm = (e.clientY - rect.top) / rect.height;
    
    // Smooth 3D tilt math (max 10 degrees limits)
    targetRotateX = (0.5 - yNorm) * 20;
    targetRotateY = (xNorm - 0.5) * 20;
  });
  
  glassCard.addEventListener('mouseenter', () => {
    isGlassHovered = true;
  });
  
  glassCard.addEventListener('mouseleave', () => {
    isGlassHovered = false;
    targetRotateX = 0;
    targetRotateY = 0;
  });
}

// ─── Experience Lab: Liquid Glass Dock Controls ───────────────────────────
const lockToggleBtn = document.getElementById('lock-toggle-btn');
const thumbTextLabel = document.getElementById('thumb-text-label');

if (lockToggleBtn) {
  lockToggleBtn.addEventListener('click', () => {
    const isLocked = lockToggleBtn.classList.contains('locked');
    
    if (isLocked) {
      // Toggle to unlocked
      lockToggleBtn.classList.remove('locked');
      lockToggleBtn.setAttribute('aria-pressed', 'false');
      if (thumbTextLabel) thumbTextLabel.textContent = '';
    } else {
      // Toggle to locked
      lockToggleBtn.classList.add('locked');
      lockToggleBtn.setAttribute('aria-pressed', 'true');
      if (thumbTextLabel) {
        // Delay slightly for visual pacing matching transition width
        setTimeout(() => {
          if (lockToggleBtn.classList.contains('locked')) {
            thumbTextLabel.textContent = 'Locked';
          }
        }, 120);
      }
    }
  });
}

// ─── Theme Toggle Controller ─────────────────────────
const themeToggleBtn = document.getElementById('theme-toggle-btn');
let rotationState = 0;
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Tactile rotation spin feedback
    rotationState += 180;
    themeToggleBtn.style.transform = `rotate(${rotationState}deg)`;
  });
}

// ─── Scroll to Services Controller ───────────────────
const scrollToServicesBtn = document.getElementById('scroll-to-services-btn');
if (scrollToServicesBtn) {
  scrollToServicesBtn.addEventListener('click', () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ─── AI Assistant Drawer Controller ─────────────────
const assistantBackdrop = document.getElementById('assistant-backdrop');
const assistantPanel = document.getElementById('assistant-panel');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

function openAssistant() {
  assistantBackdrop.classList.add('active');
  assistantPanel.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    if (chatInput) chatInput.focus();
  }, 100);
}

function closeAssistant() {
  assistantBackdrop.classList.remove('active');
  assistantPanel.classList.remove('active');
  document.body.style.overflow = '';
}

// Bind Q&A assistant to Orb Buttons and Generate Button
const assistantOrbBtn = document.getElementById('assistant-orb-btn');
const assistantSmallOrbBtn = document.getElementById('assistant-small-orb-btn');
const generateDocBtn = document.getElementById('generate-doc-btn');

if (assistantOrbBtn) {
  assistantOrbBtn.addEventListener('click', openAssistant);
}
if (assistantSmallOrbBtn) {
  assistantSmallOrbBtn.addEventListener('click', openAssistant);
}

// Generate button action triggers Q&A and simulates compilation visual effect first
if (generateDocBtn) {
  generateDocBtn.addEventListener('click', () => {
    const genText = generateDocBtn.querySelector('.gen-text');
    if (!genText || genText.textContent !== 'Generate') return;
    
    genText.textContent = 'Generating...';
    generateDocBtn.style.opacity = '0.82';
    
    setTimeout(() => {
      genText.textContent = 'Success!';
      generateDocBtn.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
      generateDocBtn.style.borderColor = '#10b981';
      generateDocBtn.style.color = '#10b981';
      
      setTimeout(() => {
        // Open Q&A Assistant to display findings
        openAssistant();
        
        // Reset button
        setTimeout(() => {
          genText.textContent = 'Generate';
          generateDocBtn.style.backgroundColor = '';
          generateDocBtn.style.borderColor = '';
          generateDocBtn.style.color = '';
          generateDocBtn.style.opacity = '';
        }, 300);
        
      }, 500);
    }, 1200);
  });
}

// Close assistant on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && assistantPanel.classList.contains('active')) {
    closeAssistant();
  }
});

// Q&A Chat Handler
const responses = {
  webdev: "We build custom, high-performance web systems utilizing React/Vite, Tailwind, and clean Vanilla JS. We handle domain bindings, technical SEO schemas, speed engineering (100/100 Mobile PageSpeed guarantees), and custom interactive UI structures from scratch.",
  video: "Our video editing pillar specializes in vertical formats (TikTok, Reels, Shorts) and corporate media. We script hooks, build custom title cards, direct dynamic cuts, color-grade raw log profiles, and engineer professional audio designs to boost retention metrics.",
  ads: "Our Google Ads acquisition campaigns target high-intent search terms and display networks. We build custom landing page target structures, structure negative keyword funnels, audit tracking hooks (GA4), and adjust bid bounds continuously to maximize ROAS.",
  start: "Getting started is easy! You can toggle the booking drawer by clicking 'Start Project' or 'Book a Strategy Session' on the page. Enter your details, and we'll reply with a custom roadmap proposal within 12 business hours.",
  fallback: "ERGO Studio handles end-to-end custom Web Development, Video Editing, and Google Ads management. Ask me about one of these service areas specifically, or click 'Start Project' to book a strategy call!"
};

function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  
  // Auto scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'message incoming';
  indicator.id = 'typing-indicator';
  indicator.textContent = 'Co-pilot is writing...';
  chatMessages.appendChild(indicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function getAIResponse(input) {
  const query = input.toLowerCase();
  
  if (query.includes('web') || query.includes('dev') || query.includes('site') || query.includes('program') || query.includes('code')) {
    return responses.webdev;
  }
  if (query.includes('video') || query.includes('edit') || query.includes('cut') || query.includes('film') || query.includes('youtube')) {
    return responses.video;
  }
  if (query.includes('ads') || query.includes('google') || query.includes('traffic') || query.includes('market') || query.includes('camp')) {
    return responses.ads;
  }
  if (query.includes('work') || query.includes('start') || query.includes('contact') || query.includes('book') || query.includes('price') || query.includes('cost') || query.includes('session')) {
    return responses.start;
  }
  return responses.fallback;
}

function handleChatSubmit(event) {
  event.preventDefault();
  const query = chatInput.value.trim();
  if (!query) return;
  
  // 1. Add user query message
  addMessage(query, 'outgoing');
  chatInput.value = '';
  
  // 2. Show typing simulator
  showTypingIndicator();
  
  // 3. Delayed AI reply
  setTimeout(() => {
    removeTypingIndicator();
    const reply = getAIResponse(query);
    addMessage(reply, 'incoming');
  }, 700);
}

function sendSuggestion(promptText) {
  // Directly simulate sending a prompt
  addMessage(promptText, 'outgoing');
  showTypingIndicator();
  
  setTimeout(() => {
    removeTypingIndicator();
    const reply = getAIResponse(promptText);
    addMessage(reply, 'incoming');
  }, 700);
}



