/**
 * SHOPPING DAS CASAS - INTERACTIVE JAVASCRIPT
 * Features: Simulator, WhatsApp Lead Generator, LocalStorage CRM Persistence, 
 * Model Filter, 3D Floorplan Modal, FAQ Accordion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSimulator();
  initCatalogFilters();
  initModal();
  initFaqAccordion();
  initMobileMenu();
  initWhatsAppBubble();
});

/* ==========================================================================
   1. INTERACTIVE HOUSE & BUDGET SIMULATOR
   ========================================================================== */
const PRICING_RULES = {
  materialRates: {
    'concreto': 1180, // R$ por m² em concreto pré-moldado
    'madeira': 980,   // R$ por m² em madeira tratada autoclave
    'mista': 1250     // R$ por m² em estrutura mista
  },
  roomAddons: {
    '1': 0,
    '2': 3800,
    '3': 7500
  },
  minBasePrice: 37500
};

function initSimulator() {
  const form = document.getElementById('houseSimulatorForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input[type="radio"], select');
  inputs.forEach(input => {
    input.addEventListener('change', calculateEstimate);
  });

  const sendBtn = document.getElementById('btnSubmitSimulator');
  if (sendBtn) {
    sendBtn.addEventListener('click', handleSimulatorSubmit);
  }

  // Initial calculation
  calculateEstimate();
}

function calculateEstimate() {
  const materialInput = document.querySelector('input[name="simMaterial"]:checked');
  const roomsInput = document.querySelector('input[name="simRooms"]:checked');
  const areaSelect = document.getElementById('simArea');

  const material = materialInput ? materialInput.value : 'concreto';
  const rooms = roomsInput ? roomsInput.value : '2';
  const area = areaSelect ? parseInt(areaSelect.value, 10) : 54;

  const rate = PRICING_RULES.materialRates[material] || 1180;
  const roomAddon = PRICING_RULES.roomAddons[rooms] || 0;

  let totalEstimate = (area * rate) + roomAddon;
  if (totalEstimate < PRICING_RULES.minBasePrice) {
    totalEstimate = PRICING_RULES.minBasePrice;
  }

  // Monthly installment estimate (simulation with 30% downpayment and 60x financing)
  const financedAmount = totalEstimate * 0.70;
  const monthlyInstallment = Math.round(financedAmount / 60 * 1.012);

  // Update DOM with animated counter feeling
  const priceDisplay = document.getElementById('simDisplayPrice');
  const installmentDisplay = document.getElementById('simDisplayInstallment');
  const summaryMaterial = document.getElementById('summaryMaterial');
  const summaryRooms = document.getElementById('summaryRooms');
  const summaryArea = document.getElementById('summaryArea');

  if (priceDisplay) {
    priceDisplay.textContent = formatCurrency(totalEstimate);
  }
  if (installmentDisplay) {
    installmentDisplay.textContent = formatCurrency(monthlyInstallment);
  }
  if (summaryMaterial) {
    const materialNames = {
      'concreto': 'Concreto Pré-Moldado',
      'madeira': 'Madeira Nobre Tratada',
      'mista': 'Mista (Alvenaria + Madeira)'
    };
    summaryMaterial.textContent = materialNames[material] || material;
  }
  if (summaryRooms) {
    summaryRooms.textContent = `${rooms} Dormitório(s)`;
  }
  if (summaryArea) {
    summaryArea.textContent = `${area} m² de Área Construída`;
  }
}

function handleSimulatorSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('simUserName');
  const phoneInput = document.getElementById('simUserPhone');
  const citySelect = document.getElementById('simCity');
  const hasLandSelect = document.getElementById('simHasLand');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const city = citySelect ? citySelect.value : 'Araquari/Joinville';
  const hasLand = hasLandSelect ? hasLandSelect.value : 'Sim';

  if (!name) {
    showToast('Por favor, informe seu nome para simulação.');
    if (nameInput) nameInput.focus();
    return;
  }

  const materialInput = document.querySelector('input[name="simMaterial"]:checked');
  const roomsInput = document.querySelector('input[name="simRooms"]:checked');
  const areaSelect = document.getElementById('simArea');

  const material = materialInput ? materialInput.value : 'concreto';
  const rooms = roomsInput ? roomsInput.value : '2';
  const area = areaSelect ? areaSelect.value : '54';
  const priceDisplay = document.getElementById('simDisplayPrice');
  const priceText = priceDisplay ? priceDisplay.textContent : 'Consulte';

  const materialNames = {
    'concreto': 'Concreto Pré-Moldado',
    'madeira': 'Madeira Nobre Tratada',
    'mista': 'Mista (Alvenaria + Madeira)'
  };

  // 1. Save Lead into LocalStorage for future CRM integration
  const leadData = {
    id: 'LEAD-' + Date.now(),
    name: name,
    phone: phone,
    city: city,
    hasLand: hasLand,
    material: materialNames[material] || material,
    rooms: `${rooms} Dormitórios`,
    area: `${area} m²`,
    estimatedPrice: priceText,
    date: new Date().toLocaleString('pt-BR'),
    source: 'Simulador do Site'
  };

  saveLeadLocally(leadData);

  // 2. Format WhatsApp Message
  const whatsappNumber = '5547991337816'; // Official Shopping das Casas WhatsApp
  const message = `👋 Olá, Shopping das Casas! Acabei de realizar uma simulação no site e gostaria de um atendimento personalizado:

📋 *DADOS DA SIMULAÇÃO:*
• *Nome:* ${name}
• *Cidade da Obra:* ${city}
• *Possui Terreno:* ${hasLand}
• *Tipo de Casa:* ${materialNames[material] || material}
• *Dormitórios:* ${rooms} Quarto(s)
• *Metragem Desejada:* ${area} m²
• *Valor Estimado no Site:* ${priceText}

Poderiam me passar mais detalhes sobre a planta baixa e formas de pagamento?`;

  const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  showToast('Orçamento gerado com sucesso! Abrindo WhatsApp...');

  setTimeout(() => {
    window.open(encodedUrl, '_blank');
  }, 600);
}

function saveLeadLocally(lead) {
  try {
    const existing = JSON.parse(localStorage.getItem('shopping_das_casas_leads') || '[]');
    existing.unshift(lead);
    localStorage.setItem('shopping_das_casas_leads', JSON.stringify(existing));
    console.log('[CRM] Lead registrado localmente:', lead);
  } catch (err) {
    console.error('Erro ao registrar lead:', err);
  }
}

/* ==========================================================================
   2. CATALOG FILTERS
   ========================================================================== */
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.model-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const rooms = card.getAttribute('data-rooms') || '';

        if (filter === 'all' || category.includes(filter) || rooms === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. MODAL FOR FLOOR PLANS & DETAILS
   ========================================================================== */
const MODEL_DETAILS = {
  'chale-praia': {
    title: 'Chalé Modelo Praia / Lazer (36m²)',
    subtitle: '1 Dormitório • Madeira Nobre Tratada em Autoclave',
    image: 'assets/images/house_chale.jpg',
    floorplan: 'assets/images/floorplan_humanizada.jpg',
    price: 'A partir de R$ 37.500,00',
    description: 'Perfeito para terrenos no litoral (Barra do Sul, São Chico, Itapoá) ou chácaras no interior. Estrutura aconchegante com deck frontal e entrega em 25 dias.',
    specs: [
      'Madeira nobre tratada em autoclave com garantia',
      'Varanda frontal com deck integrado',
      'Banheiro completo em alvenaria com revestimento cerâmico',
      'Cobertura em telhas cerâmicas esmaltadas',
      'Esquadrias e portas em madeira maciça com vidros temperados',
      'Instalação hidráulica e elétrica básica inclusas'
    ]
  },
  'itinga-concreto': {
    title: 'Residencial Itinga Prime (54m²)',
    subtitle: '2 Dormitórios • Concreto Pré-Moldado Estrutural',
    image: 'assets/images/house_premoldada.jpg',
    floorplan: 'assets/images/floorplan_humanizada.jpg',
    price: 'A partir de R$ 62.900,00',
    description: 'O modelo mais vendido da Shopping das Casas! Máxima durabilidade contra intempéries, excelente isolamento termoacústico e acabamento pronto para pintura.',
    specs: [
      'Placas de concreto armado usinado de alta resistência',
      '2 quartos amplos e sala conjugada com cozinha americana',
      'Pé-direito confortável de 2,60m',
      'Madeiramento de cobertura certificado com telhas cerâmicas',
      'Portas internas de madeira e janelas em alumínio',
      'Montagem expressa em até 35 dias úteis'
    ]
  },
  'villa-imperial': {
    title: 'Villa Imperial Contemporânea (75m²)',
    subtitle: '3 Dormitórios (1 Suíte) • Mista ou Concreto',
    image: 'assets/images/house_familiar.jpg',
    floorplan: 'assets/images/floorplan_humanizada.jpg',
    price: 'A partir de R$ 89.900,00',
    description: 'Espaço, requinte e conforto para toda a família. Conta com varanda gourmet integrada, suíte privativa e linhas modernas inspiradas nas tendências contemporâneas.',
    specs: [
      '3 dormitórios confortáveis com 1 suíte master',
      'Varanda gourmet frontal com espaço para churrasqueira',
      'Área de serviço independente e cozinha ampla',
      'Excelente iluminação natural com amplas aberturas',
      'Garantia estrutural de 5 anos direto de fábrica',
      'Possibilidade de personalização das divisórias internas'
    ]
  }
};

function initModal() {
  const modal = document.getElementById('modelDetailsModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalTriggers = document.querySelectorAll('.btn-open-model-modal');

  if (!modal) return;

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modelKey = btn.getAttribute('data-model-id') || 'itinga-concreto';
      loadModalData(modelKey);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function loadModalData(key) {
  const data = MODEL_DETAILS[key] || MODEL_DETAILS['itinga-concreto'];

  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalImg = document.getElementById('modalImage');
  const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
  if (modalPrice) modalPrice.textContent = data.price;
  if (modalDesc) modalDesc.textContent = data.description;
  if (modalImg) modalImg.src = data.floorplan;

  if (modalSpecs) {
    modalSpecs.innerHTML = '';
    data.specs.forEach(spec => {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${spec}</span>
      `;
      modalSpecs.appendChild(li);
    });
  }

  if (modalWhatsappBtn) {
    const text = `Olá! Gostaria de receber a planta e o orçamento do modelo *${data.title}* (${data.price}).`;
    modalWhatsappBtn.href = `https://wa.me/5547991337816?text=${encodeURIComponent(text)}`;
  }
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   6. WHATSAPP FLOATING BUBBLE
   ========================================================================== */
function initWhatsAppBubble() {
  const bubble = document.getElementById('whatsappBubble');
  if (!bubble) return;

  // Show friendly bubble message after 3 seconds
  setTimeout(() => {
    bubble.style.display = 'block';
  }, 3000);
}

/* ==========================================================================
   HELPER FUNCTIONS
   ========================================================================== */
function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(val);
}

function showToast(msg) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-box';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${msg}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
