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

// Parallax Hover Interaction on Chrome Artwork
const poster = document.getElementById('hero-poster');
const sculptureWrapper = document.getElementById('sculpture-wrapper');

if (poster && sculptureWrapper) {
  let isHovered = false;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  
  // High-performance interpolation loop
  function updateParallax() {
    if (isHovered) {
      // Ease the transition coordinates (lerp)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      sculptureWrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.03) rotateY(${currentX * 0.15}deg) rotateX(${-currentY * 0.15}deg)`;
    } else {
      currentX += (0 - currentX) * 0.08;
      currentY += (0 - currentY) * 0.08;
      sculptureWrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1) rotateY(0deg) rotateX(0deg)`;
    }
    requestAnimationFrame(updateParallax);
  }
  
  // Kick off frame calculations
  requestAnimationFrame(updateParallax);

  poster.addEventListener('mousemove', (e) => {
    isHovered = true;
    const rect = poster.getBoundingClientRect();
    
    // Coordinates relative to center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalized ratios (-1 to 1)
    const xRatio = x / (rect.width / 2);
    const yRatio = y / (rect.height / 2);
    
    // Apply bounds for subtle parallax shift (max 20px)
    targetX = xRatio * 20;
    targetY = yRatio * 20;
  });

  poster.addEventListener('mouseleave', () => {
    isHovered = false;
  });
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



