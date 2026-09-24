/**
 * PANCHENKO DENTIST - Interactive Logic
 * Native HTML5 Dialog, Phone Input Mask, Auto-Service Selection
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const bookingDialog = document.getElementById('bookingDialog');
  const closeDialogBtn = document.getElementById('closeDialogBtn');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const serviceSelect = document.getElementById('serviceSelect');
  const patientPhone = document.getElementById('patientPhone');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const siteHeader = document.querySelector('.site-header');

  // Sticky Header elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.style.setProperty('box-shadow', '0 4px 20px rgba(11, 21, 38, 0.08)');
    } else {
      siteHeader?.style.removeProperty('box-shadow');
    }
  }, { passive: true });

  // Open Dialog Modal with auto-service selection
  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const requestedService = btn.getAttribute('data-service');
      
      if (requestedService && serviceSelect) {
        let matched = false;
        // Search for matching option in select
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(requestedService.toLowerCase()) ||
              serviceSelect.options[i].value.toLowerCase().includes(requestedService.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched && requestedService) {
          serviceSelect.options[0].text = `Запис: ${requestedService}`;
          serviceSelect.selectedIndex = 0;
        }
      }

      // Reset success state if reopening
      if (bookingForm && formSuccessMessage) {
        bookingForm.classList.remove('hidden');
        formSuccessMessage.classList.add('hidden');
      }

      bookingDialog?.showModal();
    });
  });

  // Close Dialog Modal
  function closeModal() {
    bookingDialog?.close();
  }

  closeDialogBtn?.addEventListener('click', closeModal);
  successCloseBtn?.addEventListener('click', closeModal);

  // Close on backdrop click
  bookingDialog?.addEventListener('click', (e) => {
    const rect = bookingDialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeModal();
    }
  });

  // Phone input formatting mask (+380 (XX) XXX-XX-XX)
  if (patientPhone) {
    patientPhone.addEventListener('focus', () => {
      if (!patientPhone.value) {
        patientPhone.value = '+380 ';
      }
    });

    patientPhone.addEventListener('input', (e) => {
      let val = patientPhone.value.replace(/\D/g, '');
      
      // Ensure country code 380
      if (!val.startsWith('380')) {
        val = '380' + val;
      }
      
      // Limit to 12 digits (380 + 9 digits)
      val = val.substring(0, 12);
      
      let formatted = '+380';
      if (val.length > 3) {
        formatted += ' (' + val.substring(3, 5);
      }
      if (val.length >= 5) {
        formatted += ') ' + val.substring(5, 8);
      }
      if (val.length >= 8) {
        formatted += '-' + val.substring(8, 10);
      }
      if (val.length >= 10) {
        formatted += '-' + val.substring(10, 12);
      }
      
      patientPhone.value = formatted;
    });

    patientPhone.addEventListener('blur', () => {
      if (patientPhone.value === '+380 ' || patientPhone.value === '+380') {
        patientPhone.value = '';
      }
    });
  }

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(bookingForm);
      const bookingData = {
        service: formData.get('service'),
        name: formData.get('name'),
        phone: formData.get('phone'),
        comment: formData.get('comment'),
        date: new Date().toISOString()
      };

      console.log('Заявка на прийом:', bookingData);

      // Display success message
      bookingForm.classList.add('hidden');
      formSuccessMessage?.classList.remove('hidden');
      bookingForm.reset();
    });
  }

  // ==========================================================================
  // Before/After Slider Interaction (Anti-Stretch CSS clip-path)
  // ==========================================================================
  const baSlider = document.getElementById('baSlider');
  const baRangeInput = document.getElementById('baRangeInput');

  if (baSlider && baRangeInput) {
    const updateSlider = (value) => {
      baSlider.style.setProperty('--slider-pos', `${value}%`);
    };

    baRangeInput.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    // Touch and mouse smooth drag support
    let isDragging = false;

    const handleMove = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      baRangeInput.value = pos;
      updateSlider(pos);
    };

    baSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleMove(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    baSlider.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        handleMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }
});

