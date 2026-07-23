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

