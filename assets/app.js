const FIXED_SHIPPING = 49.9;
const FULL_DISCOUNT_LABEL = "100% OFF";
const GLOBAL_DISCOUNT_RATE = 0.85;
const STORAGE_KEYS = {
    session: "ml_session",
    purchases: "ml_purchases",
    history: "ml_history"
};
const APP_CONFIG = {
    googleClientId: window.GOOGLE_CLIENT_ID || ""
};
const AUTH_LOADING_MIN_MS = 950;
const products = [
    { id: 1, title: 'Samsung Smart TV 75" Crystal UHD 4K 2025', price: 1499.99, oldPrice: 2199.0, image: "https://m.media-amazon.com/images/I/81QsB0GMcyL._AC_SX522_.jpg", description: "A nova era da TV chegou. Com processador Crystal 4K e Alexa integrada." },
    { id: 2, title: "Geladeira Electrolux Frost Free Inverter 480L", price: 1999.99, oldPrice: 3798.0, image: "https://m.media-amazon.com/images/I/41qntZyTefL._AC_SX342_SY445_QL70_ML2_.jpg", description: "Tecnologia AutoSense que preserva alimentos por muito mais tempo." },
    { id: 3, title: "Apple iPhone 15 (128 GB) - Preto", price: 2399.0, oldPrice: 4394.0, image: "https://m.media-amazon.com/images/I/416MG51rNgL._AC_SX342_SY445_QL70_ML2_.jpg", description: "O iPhone 15 traz a Dynamic Island, camera de 48 MP e USB-C." },
    { id: 4, title: "Philips Walita Airfryer XL Digital 6.2L", price: 249.99, oldPrice: 460.0, image: "https://m.media-amazon.com/images/I/51i3nkPbZ-L._AC_SX679_.jpg", description: "Cozinhe de forma saudável com até 90% menos gordura." },
    { id: 5, title: "Jogo de Panelas 13 Pecas Antiaderente com Panela de Pressao", price: 119.99, oldPrice: 329.0, image: "https://m.media-amazon.com/images/I/61MUlJ3X-jL._AC_SX679_.jpg", description: "Conjunto completo antiaderente com 13 pecas, incluindo panela de pressao, ideal para equipar sua cozinha." },
    { id: 6, title: "Fogao Cook Glass Preto 5 Bocas Mega Chama", price: 499.99, oldPrice: 899.0, image: "https://m.media-amazon.com/images/I/51Llc-bUtRL._AC_SX522_.jpg", description: "Fogao 5 bocas com mesa de vidro, mega chama, trempes com 6 apoios e acendimento automatico." },
    { id: 7, title: "JBL PartyBox Stage 520 Bluetooth Portátil", price: 1789.99, oldPrice: 4218.0, image: "https://m.media-amazon.com/images/I/61zm6pi9ziL._AC_SX679_.jpg", description: "Caixa de som Bluetooth portátil com show de luzes e até 15 horas de reprodução." },
    { id: 8, title: "Samsung Galaxy Book4 Intel Core i5", price: 0, oldPrice: 2200.0, image: "https://m.media-amazon.com/images/I/51lGW2nP9qL._AC_SX522_.jpg", description: "Notebook leve com Intel Core i5, 8GB de RAM, SSD de 512GB e tela Full HD de 15,6 polegadas." }
];

const appState = {
    cart: [],
    currentProdId: null,
    currentPayment: null,
    currentHeroSlide: 0,
    heroCarouselInterval: null,
    heroSlideCount: 3,
    currentCheckoutStep: "address",
    authMode: "register",
    authRegistration: {
        verificationRequested: false,
        email: ""
    },
    session: null,
    purchases: [],
    history: [],
    addresses: [],
    addressesLoadedFor: "",
    pendingCheckout: false,
    searchQuery: "",
    checkoutDraft: {
        paymentMethod: "pix"
    }
};

const productDetailMap = {
    1: {
        brand: "Samsung",
        breadcrumb: "Eletronicos, Audio e Video > Televisores",
        sold: "+50 mil vendidos",
        rating: 4.9,
        reviews: 4452,
        shippingText: "Chegará grátis na quinta-feira, 30 de abril",
        sellerName: "Loja oficial Samsung",
        sellerSales: "+1 M",
        optionText: "20 produtos novos a partir de R$ 2.299",
        highlights: [
            "Google Assistant embutido.",
            "Possui 3 portas HDMI.",
            "Equipado com conexão USB.",
            "Com conectividade via Bluetooth.",
            "Inclui controle remoto."
        ]
    },
    2: {
        brand: "Electrolux",
        breadcrumb: "Eletrodomesticos > Geladeiras",
        sold: "+8 mil vendidos",
        rating: 4.8,
        reviews: 2187,
        shippingText: "Receba em até 2 dias úteis",
        sellerName: "Loja oficial Electrolux",
        sellerSales: "+500 mil",
        optionText: "14 produtos novos a partir de R$ 1.980",
        highlights: [
            "Tecnologia AutoSense para conservar alimentos.",
            "Sistema Frost Free.",
            "Motor inverter silencioso.",
            "Grande capacidade interna de 480L.",
            "Prateleiras ajustaveis."
        ]
    },
    3: {
        brand: "Apple",
        breadcrumb: "Celulares e Telefones > Smartphones",
        sold: "+20 mil vendidos",
        rating: 4.9,
        reviews: 9981,
        shippingText: "Chegará amanhã com entrega expressa",
        sellerName: "Loja oficial Apple",
        sellerSales: "+800 mil",
        optionText: "18 produtos novos a partir de R$ 2.099",
        highlights: [
            "Tela brilhante com Dynamic Island.",
            "Camera principal de 48 MP.",
            "Conexão USB-C.",
            "Chip rapido para tarefas e jogos.",
            "Bateria para o dia todo."
        ]
    }
};

window.appState = appState;

function safeParse(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.warn(`Falha ao ler ${key}:`, error);
        return fallback;
    }
}

function persistState() {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(appState.session));
    localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(appState.purchases));
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(appState.history));
}

function loadState() {
    appState.session = safeParse(STORAGE_KEYS.session, null);
    appState.purchases = safeParse(STORAGE_KEYS.purchases, []);
    appState.history = safeParse(STORAGE_KEYS.history, []);
}

function getSessionEmail() {
    return (appState.session?.email || "").trim().toLowerCase();
}

function setTextFeedback(elementId, message, tone = "neutral") {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerText = message || "";
    el.className = "text-sm min-h-[20px]";
    if (tone === "success") el.classList.add("text-green-600");
    else if (tone === "error") el.classList.add("text-red-500");
    else el.classList.add("text-gray-500");
}

function renderSavedAddresses() {
    const list = document.getElementById("saved-addresses-list");
    const form = document.getElementById("saved-address-form");
    if (!list || !form) return;

    if (!appState.session) {
        list.innerHTML = `
            <div class="address-empty">
                Faça login para visualizar e gerenciar seus endereços.
            </div>
        `;
        form.classList.add("opacity-60", "pointer-events-none");
        return;
    }

    form.classList.remove("opacity-60", "pointer-events-none");

    if (!appState.addresses.length) {
        list.innerHTML = `
            <div class="address-empty">
                Nenhum endereço salvo ainda. Adicione o primeiro endereço ao lado.
            </div>
        `;
        return;
    }

    list.innerHTML = appState.addresses.map((address) => `
        <div class="address-card">
            <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                        <p class="text-lg font-semibold text-gray-900">${address.label || "Endereço"}</p>
                        ${address.isDefault ? '<span class="text-[11px] font-bold text-[#3483fa] bg-[#eaf2ff] px-2 py-1 rounded-full">PRINCIPAL</span>' : ""}
                    </div>
                    <p class="text-sm text-gray-500 mt-1">${address.recipientName || ""}${address.phone ? ` • ${address.phone}` : ""}</p>
                </div>
                <button class="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors" onclick="deleteSavedAddress('${address.id}')">Excluir</button>
            </div>
            <div class="mt-4 text-sm text-gray-700 leading-6">
                <p>${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""}</p>
                <p>${address.neighborhood ? `${address.neighborhood} • ` : ""}${address.city || ""}${address.state ? ` - ${address.state}` : ""}</p>
                <p>CEP ${address.cep}</p>
            </div>
        </div>
    `).join("");
}

async function loadSavedAddresses(force = false) {
    const email = getSessionEmail();
    if (!email) {
        appState.addresses = [];
        appState.addressesLoadedFor = "";
        renderSavedAddresses();
        renderHeaderLocation();
        setTextFeedback("saved-addresses-feedback", "");
        return;
    }

    if (!force && appState.addressesLoadedFor === email && appState.addresses.length) {
        renderSavedAddresses();
        return;
    }

    setTextFeedback("saved-addresses-feedback", "Carregando endereços...");
    const result = await apiRequest("/api/account/addresses/list", { email });
    if (result?.error) {
        appState.addresses = [];
        appState.addressesLoadedFor = "";
        renderSavedAddresses();
        setTextFeedback("saved-addresses-feedback", result.error, "error");
        return;
    }

    appState.addresses = Array.isArray(result.addresses) ? result.addresses : [];
    appState.addressesLoadedFor = email;
    renderSavedAddresses();
    renderHeaderLocation();
    setTextFeedback("saved-addresses-feedback", appState.addresses.length ? `${appState.addresses.length} endereço(s) salvo(s).` : "Nenhum endereço salvo ainda.", "success");
}

function resetSavedAddressForm() {
    document.getElementById("saved-address-form")?.reset();
    if (appState.session?.name) {
        const recipientInput = document.getElementById("saved-address-recipient");
        if (recipientInput) recipientInput.value = appState.session.name;
    }
    setTextFeedback("saved-address-form-feedback", "");
}

async function submitSavedAddressForm(event) {
    event.preventDefault();
    const email = getSessionEmail();
    if (!email) {
        setTextFeedback("saved-address-form-feedback", "Faça login para salvar endereços.", "error");
        return;
    }

    const payload = {
        email,
        label: document.getElementById("saved-address-label")?.value?.trim() || "Casa",
        recipientName: document.getElementById("saved-address-recipient")?.value?.trim() || "",
        phone: document.getElementById("saved-address-phone")?.value?.trim() || "",
        cep: document.getElementById("saved-address-cep")?.value?.trim() || "",
        street: document.getElementById("saved-address-street")?.value?.trim() || "",
        number: document.getElementById("saved-address-number")?.value?.trim() || "",
        complement: document.getElementById("saved-address-complement")?.value?.trim() || "",
        neighborhood: document.getElementById("saved-address-neighborhood")?.value?.trim() || "",
        city: document.getElementById("saved-address-city")?.value?.trim() || "",
        state: document.getElementById("saved-address-state")?.value?.trim() || "",
        isDefault: Boolean(document.getElementById("saved-address-default")?.checked),
    };

    if (!payload.recipientName || !payload.cep || !payload.street || !payload.number) {
        setTextFeedback("saved-address-form-feedback", "Preencha destinatário, CEP, rua e número.", "error");
        return;
    }

    setButtonLoading("saved-address-submit-btn", true, "Salvando...", "Salvar endereço");
    const result = await apiRequest("/api/account/addresses/create", payload);
    setButtonLoading("saved-address-submit-btn", false, "", "Salvar endereço");
    if (result?.error) {
        setTextFeedback("saved-address-form-feedback", result.error, "error");
        return;
    }

    resetSavedAddressForm();
    setTextFeedback("saved-address-form-feedback", "Endereço salvo com sucesso.", "success");
    await loadSavedAddresses(true);
}

async function deleteSavedAddress(addressId) {
    const email = getSessionEmail();
    if (!email || !addressId) return;

    setTextFeedback("saved-addresses-feedback", "Excluindo endereço...");
    const result = await apiRequest("/api/account/addresses/delete", { email, addressId });
    if (result?.error) {
        setTextFeedback("saved-addresses-feedback", result.error, "error");
        return;
    }

    appState.addresses = appState.addresses.filter((address) => address.id !== addressId);
    renderSavedAddresses();
    setTextFeedback("saved-addresses-feedback", "Endereço excluído.", "success");
}

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getBasePrice(product) {
    const oldPrice = Number(product?.oldPrice || 0);
    if (oldPrice > 0) return oldPrice;
    const explicitPrice = Number(product?.price || 0);
    if (explicitPrice > 0) return explicitPrice;
    return Number(product?.unitPrice || 0);
}

function getEffectivePrice(product) {
    const basePrice = getBasePrice(product);
    if (basePrice <= 0) return 0;
    return Number((basePrice * (1 - GLOBAL_DISCOUNT_RATE)).toFixed(2));
}

function getDiscountPercentage(product) {
    const basePrice = getBasePrice(product);
    const currentPrice = getEffectivePrice(product);
    if (!basePrice || currentPrice >= basePrice) return 0;
    return Math.round((1 - currentPrice / basePrice) * 100);
}

function getPreferredLocationLabel() {
    const preferredAddress = appState.addresses.find((address) => address.isDefault) || appState.addresses[0];
    if (preferredAddress?.city && preferredAddress?.cep) {
        return `${preferredAddress.city} ${preferredAddress.cep}`;
    }

    if (appState.checkoutDraft?.city && appState.checkoutDraft?.cep) {
        return `${appState.checkoutDraft.city} ${appState.checkoutDraft.cep}`;
    }

    return "Informe seu CEP";
}

function renderHeaderLocation() {
    const label = getPreferredLocationLabel();
    document.getElementById("mobile-header-location-text")?.replaceChildren(document.createTextNode(label));
    document.getElementById("desktop-header-location-text")?.replaceChildren(document.createTextNode(label));
}

function requireAccountForPurchase() {
    if (appState.session) return true;
    appState.pendingCheckout = true;
    toggleCart(false);
    closeCheckout();
    openAuthPage("login");
    setAuthFeedback("Crie uma conta ou entre para comprar este produto.", "error");
    return false;
}

function continuePendingCheckoutAfterAuth() {
    if (!appState.pendingCheckout) {
        showPage("home");
        return;
    }

    appState.pendingCheckout = false;
    setAuthFeedback("Login concluído. Vamos continuar sua compra.", "success");
    window.setTimeout(() => {
        openCartPage();
    }, 650);
}

function renderProductCard(product) {
    const currentPrice = getEffectivePrice(product);
    const discount = getDiscountPercentage(product);
    return `
        <div class="offer-grid-card px-3 md:px-4 py-3 md:py-4 bg-white cursor-pointer" onclick="openDetails(${product.id}, this)">
            <div class="h-32 md:h-36 flex items-center justify-center overflow-hidden rounded-md bg-[#f7f7f7]">
                <img src="${product.image}" class="max-h-full object-contain p-2" alt="${product.title}" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-4')">
            </div>
            <div class="pt-3 min-h-[194px] flex flex-col">
                <h4 class="text-[13px] text-gray-700 line-clamp-2 min-h-[42px] font-normal leading-[1.35]">${product.title}</h4>
                <p class="text-xs text-gray-400 mt-2 line-through">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div class="flex items-baseline gap-1.5 mt-1 flex-wrap">
                    <p class="text-[18px] md:text-[20px] leading-none font-normal text-gray-900">${formatCurrency(currentPrice)}</p>
                    <p class="text-[12px] font-bold text-green-600">${discount}% OFF</p>
                </div>
                <p class="text-[12px] text-green-600 font-medium mt-2">Frete gratis <span class="font-normal text-gray-400">por ser sua primeira compra</span></p>
                <button onclick="event.stopPropagation(); addToCart(${product.id})" class="mt-auto pt-3 text-left text-[12px] text-blue-600 font-semibold hover:underline">Ver oferta</button>
            </div>
        </div>
    `;
}

function renderMobileProductCard(product) {
    const currentPrice = getEffectivePrice(product);
    const discount = getDiscountPercentage(product);
    return `
        <div class="mobile-product-card cursor-pointer" onclick="openDetails(${product.id}, this)">
            <div class="mobile-product-image flex items-center justify-center overflow-hidden">
                <img src="${product.image}" class="max-h-full object-contain p-2" alt="${product.title}" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-4')">
            </div>
            <div class="pt-3">
                <h4 class="text-[13px] leading-[1.35] text-gray-700 line-clamp-2 min-h-[36px]">${product.title}</h4>
                <p class="text-[11px] text-gray-400 mt-2 line-through">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div class="flex items-baseline gap-1 mt-1 flex-wrap">
                    <p class="text-[24px] leading-none font-normal text-gray-900">${formatCurrency(currentPrice)}</p>
                    <p class="text-[11px] font-bold text-green-600">${discount}% OFF</p>
                </div>
                <p class="text-[11px] text-green-600 font-semibold mt-2">Frete grátis</p>
            </div>
        </div>
    `;
}

function normalizeSearchText(value) {
    return (value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function getFilteredProducts() {
    const query = normalizeSearchText(appState.searchQuery);
    if (!query) return products;

    return products.filter((product) => {
        const meta = getProductDetailMeta(product);
        const haystack = normalizeSearchText([
            product.title,
            product.description,
            meta.brand,
            meta.breadcrumb
        ].join(" "));
        return haystack.includes(query);
    });
}

function renderProducts() {
    const list = document.getElementById("products-list");
    const featured = document.getElementById("featured-offer");
    const mobileList = document.getElementById("mobile-products-list");
    const filteredProducts = getFilteredProducts();
    const featuredProduct = filteredProducts[0] || null;
    const desktopProducts = filteredProducts.slice(featuredProduct ? 1 : 0, featuredProduct ? 7 : 6);
    const mobileProducts = filteredProducts.slice(0, 6);

    if (list) {
        list.innerHTML = desktopProducts.length
            ? desktopProducts.map(renderProductCard).join("")
            : '<div class="col-span-full px-4 py-10 text-center text-gray-500">Nenhum produto encontrado para essa busca.</div>';
    }

    if (mobileList) {
        mobileList.innerHTML = mobileProducts.length
            ? mobileProducts.map(renderMobileProductCard).join("")
            : '<div class="w-full rounded-[14px] bg-white px-4 py-6 text-center text-sm text-gray-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">Nenhum produto encontrado para essa busca.</div>';
    }

    if (featured) {
        if (!featuredProduct) {
            featured.innerHTML = `
                <div class="rounded-[1.25rem] border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                    <p class="text-lg text-gray-500">Nenhum produto encontrado para essa busca.</p>
                </div>
            `;
            return;
        }

        const product = featuredProduct;
        const currentPrice = getEffectivePrice(product);
        const discount = getDiscountPercentage(product);
        featured.innerHTML = `
            <p class="text-2xl font-light text-gray-700 mb-4">${appState.searchQuery ? "Resultado em destaque" : "Oferta do dia"}</p>
            <div class="rounded-[1.25rem] overflow-hidden bg-gray-50 h-[300px] flex items-center justify-center">
                <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.remove('object-cover');this.classList.add('object-contain','p-8')">
            </div>
            <div class="pt-4">
                <h3 class="text-[15px] text-gray-700 leading-6">${product.title}</h3>
                <p class="text-sm text-gray-400 line-through mt-3">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div class="flex items-baseline gap-2 mt-1 flex-wrap">
                    <p class="text-[2.5rem] leading-none font-light text-gray-900">${formatCurrency(currentPrice)}</p>
                    <p class="text-lg font-bold text-green-600">${discount}% OFF</p>
                </div>
                <p class="text-sm text-green-600 font-bold mt-2">Frete gratis <span class="font-normal text-gray-400">por ser sua primeira compra</span></p>
                <button onclick="addToCart(${product.id})" class="mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">Adicionar ao carrinho</button>
            </div>
        `;
    }
}

function syncSearchInputs() {
    const desktopInput = document.getElementById("desktop-search-input");
    const mobileInput = document.getElementById("mobile-search-input");
    if (desktopInput && desktopInput.value !== appState.searchQuery) desktopInput.value = appState.searchQuery;
    if (mobileInput && mobileInput.value !== appState.searchQuery) mobileInput.value = appState.searchQuery;
}

function applySearchQuery(rawValue = "") {
    appState.searchQuery = rawValue.trimStart();
    syncSearchInputs();
    renderProducts();
    showPage("home", null, { updateHistory: false, skipAnimation: true });
}

function bindSearchInputs() {
    ["desktop-search-input", "mobile-search-input"].forEach((id) => {
        const input = document.getElementById(id);
        if (!input || input.dataset.bound === "true") return;

        input.addEventListener("input", (event) => {
            applySearchQuery(event.target.value || "");
        });

        input.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            applySearchQuery(event.target.value || "");
        });

        input.dataset.bound = "true";
    });

    syncSearchInputs();
}

function updateHeroCarousel() {
    const track = document.getElementById("hero-carousel-track");
    const dots = document.querySelectorAll("#hero-carousel-dots .hero-dot");
    if (track) track.style.transform = `translateX(-${appState.currentHeroSlide * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle("active", index === appState.currentHeroSlide));
}

function startHeroCarousel() {
    stopHeroCarousel();
    appState.heroCarouselInterval = window.setInterval(() => {
        appState.currentHeroSlide = (appState.currentHeroSlide + 1) % appState.heroSlideCount;
        updateHeroCarousel();
    }, 4500);
}

function stopHeroCarousel() {
    if (appState.heroCarouselInterval) {
        window.clearInterval(appState.heroCarouselInterval);
        appState.heroCarouselInterval = null;
    }
}

function setHeroSlide(index) {
    appState.currentHeroSlide = ((index % appState.heroSlideCount) + appState.heroSlideCount) % appState.heroSlideCount;
    updateHeroCarousel();
    startHeroCarousel();
}

function moveHeroSlide(direction) {
    setHeroSlide(appState.currentHeroSlide + direction);
}

function initHeroCarousel() {
    const hero = document.getElementById("hero-carousel");
    if (hero && !hero.dataset.touchBound) {
        let startX = 0;
        let endX = 0;
        hero.addEventListener("touchstart", (event) => {
            startX = event.changedTouches[0]?.clientX || 0;
            endX = startX;
            stopHeroCarousel();
        }, { passive: true });
        hero.addEventListener("touchmove", (event) => {
            endX = event.changedTouches[0]?.clientX || startX;
        }, { passive: true });
        hero.addEventListener("touchend", () => {
            const delta = endX - startX;
            if (Math.abs(delta) > 40) {
                moveHeroSlide(delta < 0 ? 1 : -1);
                return;
            }
            startHeroCarousel();
        }, { passive: true });
        hero.dataset.touchBound = "true";
    }
    updateHeroCarousel();
    startHeroCarousel();
}

function setActiveNav(triggerEl) {
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("is-active"));
    if (triggerEl?.classList?.contains("nav-link")) triggerEl.classList.add("is-active");
}

function closeCategoriesMenu() {
    document.getElementById("categories-dropdown")?.classList.add("hidden");
}

function getVisiblePageId() {
    const pageMap = ["home", "auth", "purchases", "orders", "history", "addresses", "details", "cart", "cart-loading"];
    return pageMap.find((pageId) => !document.getElementById(`page-${pageId}`)?.classList.contains("hidden")) || "home";
}

function isCheckoutOpen() {
    return !document.getElementById("checkout-modal")?.classList.contains("hidden");
}

function captureNavigationState() {
    return {
        page: getVisiblePageId(),
        productId: appState.currentProdId || null,
        checkoutOpen: isCheckoutOpen(),
        checkoutStep: appState.currentCheckoutStep || "address"
    };
}

function writeNavigationState(mode = "push") {
    const state = captureNavigationState();
    const method = mode === "replace" ? "replaceState" : "pushState";
    window.history[method]({ __appNavigation: true, ...state }, "", window.location.href);
}

function restoreNavigationState(state) {
    const targetState = state?.__appNavigation
        ? state
        : { page: "home", productId: null, checkoutOpen: false, checkoutStep: "address" };

    if (targetState.page === "details" && targetState.productId) {
        openDetails(targetState.productId, null, { updateHistory: false });
    } else {
        showPage(targetState.page || "home", null, { updateHistory: false });
    }

    if (targetState.checkoutOpen) {
        openCheckout({
            updateHistory: false,
            resetDraft: false,
            skipRequireAccountCheck: true,
            step: targetState.checkoutStep || "address"
        });
    } else {
        closeCheckout({ updateHistory: false });
    }
}

function closeDesktopAccountMenu() {
    document.getElementById("desktop-account-menu")?.classList.remove("is-open");
}

function toggleDesktopAccountMenu(event) {
    event?.stopPropagation();
    const menu = document.getElementById("desktop-account-menu");
    const shell = document.getElementById("nav-account-shell");
    if (!menu) return;
    if (shell) shell.classList.add("is-open");
    const willOpen = !menu.classList.contains("is-open");
    closeDesktopAccountMenu();
    if (willOpen) menu.classList.add("is-open");
    lucide.createIcons();
}

function openMobileMenu() {
    document.getElementById("mobile-menu-drawer")?.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lucide.createIcons();
}

function closeMobileMenu() {
    document.getElementById("mobile-menu-drawer")?.classList.remove("is-open");
    if (!document.getElementById("checkout-modal")?.classList.contains("hidden")) return;
    document.body.style.overflow = "auto";
}

function toggleCategoriesMenu(event, triggerEl) {
    event?.stopPropagation();
    const menu = document.getElementById("categories-dropdown");
    if (!menu) return;
    const willOpen = menu.classList.contains("hidden");
    closeCategoriesMenu();
    if (willOpen) {
        menu.classList.remove("hidden");
        setActiveNav(triggerEl);
    }
    lucide.createIcons();
}

function showPage(pageId, triggerEl = null, options = {}) {
    const { updateHistory = true, skipAnimation = false } = options;
    const pageMap = {
        home: document.getElementById("page-home"),
        auth: document.getElementById("page-auth"),
        purchases: document.getElementById("page-purchases"),
        orders: document.getElementById("page-orders"),
        history: document.getElementById("page-history"),
        addresses: document.getElementById("page-addresses"),
        details: document.getElementById("page-details"),
        cart: document.getElementById("page-cart"),
        "cart-loading": document.getElementById("page-cart-loading")
    };

    const nextPage = pageMap[pageId];
    const currentPage = Object.values(pageMap).find((page) => page && !page.classList.contains("hidden"));

    if (currentPage && currentPage !== nextPage && !skipAnimation) {
        currentPage.classList.remove("page-enter");
        currentPage.classList.add("page-exit");
    }

    Object.values(pageMap).forEach((page) => {
        if (!page || page === currentPage) return;
        page.classList.add("hidden");
        page.classList.remove("page-enter", "page-exit");
    });

    if (currentPage === nextPage) {
        nextPage?.classList.remove("page-exit");
    } else if (nextPage) {
        const revealNextPage = () => {
            currentPage?.classList.add("hidden");
            currentPage?.classList.remove("page-exit");
            nextPage.classList.remove("hidden", "page-exit");
            nextPage.classList.remove("page-enter");
            void nextPage.offsetWidth;
            nextPage.classList.add("page-enter");
        };

        if (currentPage && !skipAnimation) {
            window.setTimeout(revealNextPage, 140);
        } else {
            revealNextPage();
        }
    }

    closeCategoriesMenu();
    closeDesktopAccountMenu();
    closeMobileMenu();
    setActiveNav(triggerEl);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "auto";
    if (pageId === "purchases") renderAccountArea();
    if (pageId === "orders") renderPurchaseHistory();
    if (pageId === "history") renderHistoryPage();
    if (updateHistory) writeNavigationState("push");
    lucide.createIcons();
}

function navigateToSection(sectionId, triggerEl = null) {
    showPage("home", triggerEl);
    const target = document.getElementById(`section-${sectionId}`);
    if (!target) return;
    window.setTimeout(() => {
        const top = target.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top, behavior: "smooth" });
    }, 80);
}

function getProductDetailMeta(product) {
    return productDetailMap[product.id] || {
        brand: "Mercado Livre",
        breadcrumb: "Eletronicos > Ofertas do dia",
        sold: "+10 mil vendidos",
        rating: 4.8,
        reviews: 1876,
        shippingText: "Chegará grátis entre quarta e quinta",
        sellerName: "Loja oficial Mercado Livre",
        sellerSales: "+1 M",
        optionText: `12 produtos novos a partir de R$ ${Math.round(product.oldPrice).toLocaleString("pt-BR")}`,
        highlights: [
            "Produto com excelente avaliacao dos compradores.",
            "Entrega rapida para varias regioes.",
            "Pagamento à vista com valor promocional.",
            "Itens com garantia e compra protegida.",
            "Ideal para quem busca custo-beneficio."
        ]
    };
}

function renderRatingStars(score) {
    const container = document.getElementById("det-stars");
    if (!container) return;
    const rounded = Math.round(score);
    container.innerHTML = Array.from({ length: 5 }, (_, index) => `
        <i data-lucide="star" class="w-4 h-4 ${index < rounded ? "fill-current" : ""}"></i>
    `).join("");
}

function updateMainDetailImage(src, alt) {
    const image = document.getElementById("det-main-image");
    if (!image) return;
    image.classList.remove("is-swapping");
    void image.offsetWidth;
    image.classList.add("is-swapping");
    image.src = src;
    image.alt = alt;
    image.onerror = () => {
        image.onerror = null;
        image.src = "assets/mercado-livre-logo.png";
    };
    window.setTimeout(() => image.classList.remove("is-swapping"), 320);
}

function renderDetailGallery(product) {
    const thumbWrap = document.getElementById("det-thumbs");
    if (!thumbWrap) return;
    const gallery = [product.image, product.image, product.image, product.image, product.image];
    thumbWrap.innerHTML = gallery.map((src, index) => `
        <button class="detail-thumb ${index === 0 ? "active" : ""} w-14 h-14 rounded-md p-1 bg-white" onclick="selectDetailImage('${src}', '${product.title.replace(/'/g, "\\'")}', this)">
            <img src="${src}" alt="${product.title}" class="w-full h-full object-contain" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
        </button>
    `).join("");
    updateMainDetailImage(gallery[0], product.title);
}

function openDetails(id, triggerEl = null, options = {}) {
    const { updateHistory = true } = options;
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const meta = getProductDetailMeta(product);
    const currentPrice = getEffectivePrice(product);
    const pixPrice = currentPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const discount = getDiscountPercentage(product);

    appState.currentProdId = id;
    recordViewedProduct(id);
    document.getElementById("det-title").innerText = product.title;
    document.getElementById("det-breadcrumb").innerText = meta.breadcrumb;
    document.getElementById("det-brand-link").innerText = `Conferir mais produtos da marca ${meta.brand}`;
    document.getElementById("det-condition").innerText = "Novo";
    document.getElementById("det-sold").innerText = meta.sold;
    document.getElementById("det-rating-score").innerText = meta.rating.toFixed(1);
    document.getElementById("det-reviews").innerText = `(${meta.reviews})`;
    document.getElementById("det-price").innerText = formatCurrency(currentPrice);
    document.getElementById("det-old-price").innerHTML = `De <span class="line-through">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
    document.getElementById("det-off-badge").innerText = `${discount}% OFF`;
    document.getElementById("det-cash-price").innerText = pixPrice;
    document.getElementById("det-description").innerText = product.description;
    document.getElementById("det-shipping-line").innerText = meta.shippingText;
    document.getElementById("det-seller-name").innerText = meta.sellerName;
    document.getElementById("det-seller-sales").innerText = meta.sellerSales;
    document.getElementById("det-option-count").innerText = meta.optionText;
    document.getElementById("det-highlights").innerHTML = meta.highlights.map((item) => `<li>${item}</li>`).join("");
    document.getElementById("det-add-cart").onclick = () => addToCart(id);
    renderRatingStars(meta.rating);
    if (triggerEl?.classList) {
        triggerEl.classList.add("product-opening");
        window.setTimeout(() => triggerEl.classList.remove("product-opening"), 280);
    }

    renderDetailGallery(product);
    renderRelatedProducts(id);
    showPage("details", null, { updateHistory });
    const detailsPage = document.getElementById("page-details");
    detailsPage?.classList.remove("detail-animating");
    void detailsPage?.offsetWidth;
    detailsPage?.classList.add("detail-animating");
    window.setTimeout(() => detailsPage?.classList.remove("detail-animating"), 420);
}

function selectDetailImage(src, alt, trigger) {
    updateMainDetailImage(src, alt);
    document.querySelectorAll("#det-thumbs .detail-thumb").forEach((thumb) => thumb.classList.remove("active"));
    trigger?.classList.add("active");
}

function renderRelatedProducts(currentId) {
    const container = document.getElementById("related-products-list");
    if (!container) return;

    const related = products.filter((item) => item.id !== currentId).slice(0, 6);
    container.innerHTML = related.map((product) => {
        const currentPrice = getEffectivePrice(product);
        const discount = getDiscountPercentage(product);
        return `
            <div class="related-card min-w-[240px] max-w-[240px] rounded-2xl bg-white p-4 cursor-pointer" onclick="openDetails(${product.id}, this)">
                <div class="h-36 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img src="${product.image}" alt="${product.title}" class="max-h-full object-contain p-2" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
                </div>
                <div class="pt-4">
                    <h3 class="text-[14px] text-gray-700 line-clamp-2 min-h-[42px]">${product.title}</h3>
                    <p class="text-sm text-gray-400 line-through mt-3">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div class="flex items-baseline gap-2 mt-1 flex-wrap">
                    <p class="text-[28px] leading-none font-light text-gray-900">${formatCurrency(currentPrice)}</p>
                        <p class="text-sm font-bold text-green-600">${discount}% OFF</p>
                    </div>
                    <p class="text-[11px] text-green-600 font-bold mt-2">Frete gratis <span class="font-normal text-gray-400">por sua primeira compra</span></p>
                </div>
            </div>
        `;
    }).join("");
}

function scrollRelatedProducts(direction) {
    const container = document.getElementById("related-products-list");
    if (!container) return;
    container.scrollBy({ left: direction * 280, behavior: "smooth" });
}

function toggleCart(show) {
    const sidebar = document.getElementById("cart-sidebar");
    if (!sidebar) return;
    if (show) {
        closeMobileMenu();
        sidebar.classList.remove("invisible");
        sidebar.classList.add("active");
    } else {
        sidebar.classList.remove("active");
        window.setTimeout(() => sidebar.classList.add("invisible"), 400);
    }
}

function playEmbeddedVideo() {
    const frame = document.getElementById("mercado-play-embed");
    if (!frame) return;
    frame.src = "https://www.youtube.com/embed/CI12S_1PNqc?autoplay=1&mute=0&loop=1&playlist=CI12S_1PNqc&controls=1&playsinline=1&rel=0";
    frame.scrollIntoView({ behavior: "smooth", block: "center" });
}

function addToCart(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const inCart = appState.cart.find((item) => item.id === id);
    if (inCart) inCart.qty += 1;
    else appState.cart.push({ ...product, qty: 1, unitPrice: getEffectivePrice(product) });

    const btn = document.getElementById("cart-btn");
    btn?.classList.add("bump");
    window.setTimeout(() => btn?.classList.remove("bump"), 300);
    updateCartUI();
    openCartPage();
}

function updateQty(id, delta) {
    const item = appState.cart.find((entry) => entry.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    updateCartUI();
}

function remove(id) {
    appState.cart = appState.cart.filter((item) => item.id !== id);
    updateCartUI();
}

function renderCartPage() {
    const itemsWrap = document.getElementById("cart-page-items");
    const productsLabel = document.getElementById("cart-page-products-label");
    const productsTotal = document.getElementById("cart-page-products-total");
    const totalLabel = document.getElementById("cart-page-total");
    const continueBtn = document.getElementById("cart-page-continue-btn");
    if (!itemsWrap || !productsLabel || !productsTotal || !totalLabel || !continueBtn) return;

    const itemCount = appState.cart.reduce((acc, item) => acc + item.qty, 0);
    const total = appState.cart.reduce((acc, item) => acc + getEffectivePrice(item) * item.qty, 0);

    productsLabel.innerText = `Produtos (${itemCount})`;
    productsTotal.innerText = formatCurrency(total);
    totalLabel.innerText = formatCurrency(total);
    continueBtn.innerText = `Continuar (${itemCount})`;
    continueBtn.disabled = itemCount === 0;
    continueBtn.classList.toggle("opacity-50", itemCount === 0);
    continueBtn.classList.toggle("cursor-not-allowed", itemCount === 0);

    if (!appState.cart.length) {
        itemsWrap.innerHTML = `
            <div class="px-6 py-14 text-center text-gray-500">
                <i data-lucide="shopping-cart" class="w-12 h-12 mx-auto opacity-30"></i>
                <p class="mt-4 text-lg">Seu carrinho está vazio.</p>
                <button onclick="showPage('home')" class="mt-5 text-[#3483fa] font-semibold">Voltar para a loja</button>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    itemsWrap.innerHTML = appState.cart.map((item) => {
        const price = getEffectivePrice(item);
        const discount = getDiscountPercentage(item);
        return `
            <div class="cart-page-line">
                <span class="cart-page-check"><i data-lucide="check" class="w-3.5 h-3.5"></i></span>
                <div class="cart-page-thumb">
                    <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
                </div>
                <div class="min-w-0">
                    <h3 class="text-[20px] font-medium text-gray-800 line-clamp-2">${item.title}</h3>
                    <div class="mt-4 flex items-center gap-3 flex-wrap">
                        <div class="cart-qty-box">
                            <button onclick="updateQty(${item.id}, -1)">−</button>
                            <span>${item.qty}</span>
                            <button onclick="updateQty(${item.id}, 1)">+</button>
                        </div>
                        <p class="text-sm text-gray-400">+50 disponíveis</p>
                    </div>
                </div>
                <div class="text-right min-w-[130px]">
                    <button onclick="remove(${item.id})" class="text-gray-400 hover:text-red-500 transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4 ml-auto"></i>
                    </button>
                    ${item.oldPrice ? `<p class="text-sm text-gray-400 line-through mt-3">R$ ${item.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>` : ""}
                    <p class="text-[34px] leading-none font-normal text-gray-900 mt-1">${formatCurrency(price)}</p>
                    <p class="text-sm text-green-600 font-semibold mt-2">${discount}% OFF</p>
                </div>
            </div>
        `;
    }).join("");
    lucide.createIcons();
}

function updateCartUI() {
    const container = document.getElementById("cart-items");
    const countLabel = document.getElementById("cart-count");
    const mobileBadge = document.getElementById("mobile-menu-badge");
    const totalLabel = document.getElementById("cart-total");
    if (!container || !countLabel || !totalLabel) return;

    container.innerHTML = appState.cart.length === 0
        ? '<div class="flex flex-col items-center justify-center h-64 text-gray-400 gap-4"><i data-lucide="shopping-bag" class="w-12 h-12 opacity-20"></i><p>Seu carrinho esta vazio</p></div>'
        : "";

    let total = 0;
    let count = 0;
    appState.cart.forEach((item) => {
        const itemPrice = getEffectivePrice(item);
        total += itemPrice * item.qty;
        count += item.qty;
        container.innerHTML += `
            <div class="flex gap-4 border-b border-gray-50 pb-6 fade-in">
                <img src="${item.image}" class="w-20 h-20 object-contain rounded-xl p-2 border bg-gray-50" alt="${item.title}" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
                <div class="flex-1">
                    <h3 class="text-sm font-bold line-clamp-1 text-gray-800">${item.title}</h3>
                    <p class="text-lg font-bold text-blue-600 mt-1">R$ ${itemPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div class="flex items-center justify-between mt-3">
                        <div class="flex items-center bg-gray-100 rounded-lg px-2">
                            <button onclick="updateQty(${item.id}, -1)" class="p-1 hover:text-blue-600"><i data-lucide="minus" class="w-3 h-3"></i></button>
                            <span class="px-4 text-sm font-bold">${item.qty}</span>
                            <button onclick="updateQty(${item.id}, 1)" class="p-1 hover:text-blue-600"><i data-lucide="plus" class="w-3 h-3"></i></button>
                        </div>
                        <button onclick="remove(${item.id})" class="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase">Remover</button>
                    </div>
                </div>
            </div>
        `;
    });

    countLabel.innerText = count;
    countLabel.classList.toggle("hidden", count === 0);
    if (mobileBadge) {
        mobileBadge.innerText = count;
        mobileBadge.classList.toggle("hidden", count === 0);
    }
    totalLabel.innerText = `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    renderCartPage();
    updateCheckoutSummary();
    lucide.createIcons();
}

function openCartPage() {
    renderCartPage();
    showPage("cart");
}

function startCheckoutFlow() {
    if (appState.cart.length === 0) return;
    showPage("cart-loading");
    window.setTimeout(() => {
        showPage("home", null, { updateHistory: false, skipAnimation: true });
        openCheckout();
    }, 1350);
}

function getFieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : "";
}

function setButtonLoading(buttonId, isLoading, loadingLabel, defaultLabel) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    button.disabled = isLoading;
    button.classList.toggle("checkout-loading", isLoading);
    button.dataset.defaultLabel = button.dataset.defaultLabel || defaultLabel || button.innerText;
    button.innerHTML = isLoading
        ? `<span class="inline-flex items-center gap-2"><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>${loadingLabel}</span>`
        : (defaultLabel || button.dataset.defaultLabel);
    lucide.createIcons();
}

function setCepStatus(message, tone = "neutral") {
    const el = document.getElementById("checkout-cep-status");
    if (!el) return;
    el.innerText = message;
    el.className = "checkout-help";
    if (tone === "success") el.classList.add("text-green-600");
    else if (tone === "error") el.classList.add("text-red-500");
    else if (tone === "loading") el.classList.add("text-blue-600");
}

function hydrateCheckoutUI() {
    const userPill = document.getElementById("checkout-user-pill");
    const checkoutUserName = document.getElementById("checkout-user-name");
    const checkoutAvatarImage = document.getElementById("checkout-user-avatar-image");
    const checkoutAvatarFallback = document.getElementById("checkout-user-avatar-fallback");
    const sessionName = appState.session?.name || "Checkout";
    const sessionAvatar = appState.session?.avatar || "";
    const avatarLetter = (appState.session?.name || appState.session?.email || "C").trim().charAt(0).toUpperCase() || "C";

    if (userPill) userPill.classList.remove("hidden");
    if (checkoutUserName) checkoutUserName.innerText = sessionName;
    if (checkoutAvatarImage && checkoutAvatarFallback) {
        if (sessionAvatar) {
            checkoutAvatarImage.src = sessionAvatar;
            checkoutAvatarImage.classList.remove("hidden");
            checkoutAvatarFallback.classList.add("hidden");
        } else {
            checkoutAvatarImage.src = "";
            checkoutAvatarImage.classList.add("hidden");
            checkoutAvatarFallback.classList.remove("hidden");
            checkoutAvatarFallback.innerText = avatarLetter;
        }
    }
    const customerName = document.getElementById("cust-name");
    if (customerName && appState.session?.name) customerName.value = appState.session.name;
    setPaymentStatusMessage("");
    document.getElementById("pix-code").value = "";
    setCepStatus("");
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const productTotal = appState.cart.reduce((acc, item) => acc + getEffectivePrice(item) * item.qty, 0);
    const finalTotal = productTotal;
    const productLabel = document.getElementById("summary-product-total");
    const shippingLabel = document.getElementById("summary-shipping-total");
    const grandTotal = document.getElementById("summary-grand-total");
    const totalLabel = document.getElementById("summary-total-label");
    const couponRow = document.getElementById("summary-coupon-row");

    if (productLabel) productLabel.innerText = formatCurrency(finalTotal);
    if (shippingLabel) shippingLabel.innerText = "Gratis";
    if (grandTotal) grandTotal.innerText = formatCurrency(finalTotal);
    if (couponRow) couponRow.classList.toggle("hidden", appState.currentCheckoutStep !== "payment");
    if (totalLabel) {
    totalLabel.innerText = appState.currentCheckoutStep === "payment" ? "Você pagará" : "Total";
    }

    const reviewPaymentTotal = document.getElementById("review-payment-total");
    if (reviewPaymentTotal) reviewPaymentTotal.innerText = formatCurrency(finalTotal);
    const pixScreenTotal = document.getElementById("pix-screen-total");
    if (pixScreenTotal) pixScreenTotal.innerText = formatCurrency(finalTotal);
}

function openCheckout(options = {}) {
    const {
        updateHistory = true,
        resetDraft = true,
        skipRequireAccountCheck = false,
        step = "address"
    } = options;
    if (appState.cart.length === 0) return;
    if (!skipRequireAccountCheck && !requireAccountForPurchase()) return;
    toggleCart(false);
    if (resetDraft) {
        resetPaymentState();
        appState.checkoutDraft = {
            paymentMethod: "pix",
            name: appState.session?.name || "",
            cpf: "",
            phone: "",
            cep: "",
            city: "",
            address: "",
            number: "",
            complement: ""
        };
    }
    hydrateCheckoutUI();
    const modal = document.getElementById("checkout-modal");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    modal.scrollTop = 0;
    goToCheckStep(step, { updateHistory: false });
    if (updateHistory) writeNavigationState("push");
}

function closeCheckout(options = {}) {
    const { updateHistory = true } = options;
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;
    resetPaymentState();
    document.body.style.overflow = "auto";
    modal.classList.add("hidden");
    if (updateHistory) writeNavigationState("push");
}

function recordPurchase(status = "confirmed") {
    if (!appState.cart.length) return;
    const orderId = appState.currentPayment?.orderId || `PED-${Date.now()}`;
    const transactionHash = appState.currentPayment?.transactionHash || null;
    const existingIndex = appState.purchases.findIndex((purchase) => purchase.id === orderId || (transactionHash && purchase.transactionHash === transactionHash));
    const deliveryDate = existingIndex >= 0
        ? appState.purchases[existingIndex].estimatedDelivery || null
        : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    const order = {
        id: orderId,
        createdAt: existingIndex >= 0 ? appState.purchases[existingIndex].createdAt : new Date().toISOString(),
        shipping: 0,
        status,
        transactionHash,
        estimatedDelivery: deliveryDate,
        items: appState.cart.map((item) => ({
            id: item.id,
            title: item.title,
            qty: item.qty,
            image: item.image,
            description: item.description,
            price: getEffectivePrice(item)
        })),
        customerEmail: appState.session?.email || "visitante"
    };
    if (existingIndex >= 0) appState.purchases.splice(existingIndex, 1, order);
    else appState.purchases.unshift(order);
    if (appState.currentPayment) {
        appState.currentPayment.orderId = orderId;
        appState.currentPayment.status = status;
    }
    persistState();
    renderPurchaseHistory();
}

function goToCheckStep(step, options = {}) {
    const { updateHistory = true } = options;
    [
        "check-step-address",
        "check-step-map",
        "check-step-shipping-review",
        "check-step-payment",
        "check-step-review",
        "check-step-pix",
        "check-step-success"
    ].forEach((id) => document.getElementById(id)?.classList.add("hidden"));

    appState.currentCheckoutStep = step;
    document.getElementById(`check-step-${step}`)?.classList.remove("hidden");

    const summarySidebar = document.getElementById("checkout-summary-sidebar");
    if (summarySidebar) summarySidebar.classList.toggle("hidden", step === "pix" || step === "success");

    if (step === "map") {
        updateCheckoutMap();
    } else if (step === "shipping-review") {
        document.getElementById("checkout-shipping-address").innerText = formatAddressLine();
    } else if (step === "review") {
        document.getElementById("review-billing-name").innerText = appState.checkoutDraft.name;
        document.getElementById("review-billing-cpf").innerText = `CPF ${appState.checkoutDraft.cpf}`;
        document.getElementById("review-address-line").innerText = formatAddressLine();
    } else if (step === "success") {
        recordPurchase();
        appState.cart = [];
        updateCartUI();
        renderPurchaseHistory();
    }
    updateCheckoutSummary();
    if (isCheckoutOpen() && updateHistory) writeNavigationState("push");
    lucide.createIcons();
}

function formatAddressLine() {
    const { address, number, complement, cep } = appState.checkoutDraft;
    return `${address || ""} ${number || ""}${complement ? ` - ${complement}` : ""} - CEP ${cep || ""}`.trim();
}

function setFieldError(fieldId, message = "") {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (input) {
        input.classList.toggle("border-red-500", Boolean(message));
        input.classList.toggle("focus:border-red-500", Boolean(message));
        input.classList.toggle("focus:ring-red-100", Boolean(message));
    }
    if (error) {
        error.innerText = message;
        error.classList.toggle("hidden", !message);
    }
}

function clearCheckoutAddressErrors() {
    ["ship-cep", "ship-address", "ship-number", "cust-name", "cust-cpf", "cust-phone"]
        .forEach((fieldId) => setFieldError(fieldId, ""));
}

function submitAddressStep() {
    clearCheckoutAddressErrors();
    const draft = {
        paymentMethod: "pix",
        name: getFieldValue("cust-name"),
        cpf: getFieldValue("cust-cpf"),
        phone: getFieldValue("cust-phone"),
        cep: getFieldValue("ship-cep"),
        city: appState.checkoutDraft.city || "",
        address: getFieldValue("ship-address"),
        number: getFieldValue("ship-number"),
        complement: getFieldValue("ship-complement")
    };

    let hasErrors = false;
    if (!draft.cep) {
        setFieldError("ship-cep", "Informe o CEP.");
        hasErrors = true;
    }
    if (!draft.address) {
        setFieldError("ship-address", "Informe a rua ou avenida.");
        hasErrors = true;
    }
    if (!draft.number) {
        setFieldError("ship-number", "Informe o número.");
        hasErrors = true;
    }
    if (!draft.name) {
        setFieldError("cust-name", "Informe o nome completo.");
        hasErrors = true;
    }
    if (!draft.cpf) {
        setFieldError("cust-cpf", "Informe o CPF.");
        hasErrors = true;
    }
    if (!draft.phone) {
        setFieldError("cust-phone", "Informe o telefone de contato.");
        hasErrors = true;
    }
    if (hasErrors) return;

    appState.checkoutDraft = draft;
    renderHeaderLocation();
    setButtonLoading("checkout-address-btn", true, "Continuando...", "Continuar");
    window.setTimeout(() => {
        setButtonLoading("checkout-address-btn", false, "", "Continuar");
        goToCheckStep("map");
    }, 450);
}

function updateCheckoutMap() {
    const frame = document.getElementById("checkout-map-frame");
    const text = document.getElementById("checkout-map-address-text");
    const fullAddress = `${formatAddressLine()}, Catanduva, Sao Paulo, Brasil`;
    if (text) text.innerText = fullAddress;
    if (frame) {
        frame.src = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
    }
}

function selectPaymentMethod(method) {
    appState.checkoutDraft.paymentMethod = method;
    document.getElementById("pix-option-card")?.classList.toggle("selected", method === "pix");
}

function advanceCheckoutStep(buttonId, nextStep, loadingLabel) {
    setButtonLoading(buttonId, true, loadingLabel, "Continuar");
    window.setTimeout(() => {
        setButtonLoading(buttonId, false, "", "Continuar");
        goToCheckStep(nextStep);
    }, 350);
}

async function lookupCep() {
    const cepDigits = getFieldValue("ship-cep").replace(/\D/g, "");
    if (cepDigits.length !== 8) return;
    setCepStatus("Buscando endereço pelo CEP...", "loading");
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
        const data = await response.json();
        if (!response.ok || data.erro) throw new Error("CEP não encontrado");
        const addressField = document.getElementById("ship-address");
        if (addressField && !addressField.value.trim()) {
            addressField.value = [data.logradouro, data.bairro].filter(Boolean).join(", ");
        }
        appState.checkoutDraft.cep = data.cep || getFieldValue("ship-cep");
        appState.checkoutDraft.city = data.localidade || "";
        renderHeaderLocation();
        setCepStatus(`Endereço localizado: ${[data.logradouro, data.bairro, data.localidade].filter(Boolean).join(" - ")}`, "success");
    } catch (error) {
        console.warn("Falha ao buscar CEP:", error);
        setCepStatus("Não foi possível localizar o CEP automaticamente.", "error");
    }
}

async function startPixCheckout() {
    if (!requireAccountForPurchase()) return;
    const btn = document.getElementById("checkout-confirm-btn");
    const payload = {
        items: appState.cart.map((item) => ({
            ...item,
            price: getEffectivePrice(item),
            unitPrice: getEffectivePrice(item)
        })),
        customer: {
            name: appState.checkoutDraft.name,
            cpf: appState.checkoutDraft.cpf,
            phone: appState.checkoutDraft.phone,
            email: appState.session?.email || `${appState.checkoutDraft.name.replace(/\s+/g, ".").toLowerCase()}@checkout.local`
        },
        delivery: {
            cep: appState.checkoutDraft.cep,
            country: "Brasil",
            address: appState.checkoutDraft.address,
            number: appState.checkoutDraft.number,
            city: "Catanduva",
            complement: appState.checkoutDraft.complement
        }
    };
    setButtonLoading("checkout-confirm-btn", true, "Gerando Pix...", "Confirmar a compra");
    setPaymentStatusMessage("");

    try {
        const response = await fetch("/api/payments/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Falha ao gerar pagamento");

        const pixCode = data.pix_code || data.pix_qr_code || (data.transaction_hash ? `PIX_HASH_${data.transaction_hash}` : "");
        if (!pixCode) throw new Error("A IronPay não retornou um código PIX válido.");

        appState.currentPayment = {
            transactionHash: data.transaction_hash || data.transactionHash || null,
            status: data.status || "pending"
        };

        document.getElementById("pix-code").value = pixCode;
        renderPixQr(data.pix_base64, pixCode);
        recordPurchase("pending");
        goToCheckStep("pix");
    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor.");
    } finally {
        setButtonLoading("checkout-confirm-btn", false, "", "Confirmar a compra");
    }
}

function renderPixQr(base64Qr, pixCode) {
    const image = document.getElementById("pix-qr-image");
    const placeholder = document.getElementById("pix-qr-placeholder");
    if (!image || !placeholder) return;

    image.src = base64Qr
        ? (base64Qr.startsWith("data:image") ? base64Qr : `data:image/png;base64,${base64Qr}`)
        : `https://quickchart.io/qr?size=320&text=${encodeURIComponent(pixCode)}`;
    image.classList.remove("hidden");
    placeholder.classList.add("hidden");
}

function setPaymentStatusMessage(message, tone = "neutral") {
    const el = document.getElementById("payment-status-message");
    if (!el) return;
    el.innerText = message;
    el.className = "text-sm min-h-[20px] mt-3";
    if (tone === "success") el.classList.add("text-green-600");
    else if (tone === "error") el.classList.add("text-red-600");
    else el.classList.add("text-gray-500");
}

function resetPaymentState() {
    appState.currentPayment = null;
    setPaymentStatusMessage("");
    const btn = document.getElementById("payment-validated-btn");
    if (!btn) return;
    btn.disabled = false;
    btn.innerText = "Confirmar pagamento";
}

async function confirmPayment() {
    const paymentBtn = document.getElementById("payment-validated-btn");
    if (!appState.currentPayment?.transactionHash) {
        setPaymentStatusMessage("Ainda não foi possível identificar a transação para validar o pagamento.", "error");
        return;
    }

    setButtonLoading("payment-validated-btn", true, "Validando pagamento...", "Confirmar pagamento");
    setPaymentStatusMessage("Aguardando confirmacao do backend...", "neutral");

    try {
        const response = await fetch(`/api/payments/status/${encodeURIComponent(appState.currentPayment.transactionHash)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Falha ao validar pagamento");

        if (data.isPaid) {
            setPaymentStatusMessage("Pagamento validado com sucesso.", "success");
            if (appState.currentPayment) appState.currentPayment.status = "confirmed";
            recordPurchase("confirmed");
            goToCheckStep("success");
            return;
        }

        setPaymentStatusMessage("O pagamento ainda não foi validado no backend. Tente novamente em alguns segundos.", "neutral");
    } catch (error) {
        console.error(error);
        setPaymentStatusMessage(error.message || "Erro ao validar pagamento.", "error");
    } finally {
        setButtonLoading("payment-validated-btn", false, "", "Confirmar pagamento");
    }
}

function copyPix() {
    const input = document.getElementById("pix-code");
    if (!input) return;
    setButtonLoading("checkout-copy-btn", true, "Copiando...", "Copiar código");
    navigator.clipboard.writeText(input.value);
    const feedback = document.getElementById("copy-feedback");
    feedback?.classList.remove("hidden");
    window.setTimeout(() => {
        feedback?.classList.add("hidden");
        setButtonLoading("checkout-copy-btn", false, "", "Copiar código");
    }, 1200);
}

function buyNow() {
    if (!requireAccountForPurchase()) return;
    addToCart(appState.currentProdId);
}

function formatCPF(input) {
    let value = input.value.replace(/\D/g, "").slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = value;
}

function formatCEP(input) {
    let value = input.value.replace(/\D/g, "").slice(0, 8);
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = value;
}

function formatPhone(input) {
    let value = input.value.replace(/\D/g, "").slice(0, 11);
    if (value.length > 10) value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    else value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    input.value = value.trim().replace(/-$/, "");
}

function setAuthFeedback(message, tone = "neutral") {
    const el = document.getElementById("auth-feedback");
    if (!el) return;
    el.innerText = message;
    el.className = "auth-feedback text-sm min-h-[20px] mt-4 text-center";
    if (tone === "success") el.classList.add("text-green-600");
    else if (tone === "error") el.classList.add("text-red-500");
    else el.classList.add("text-gray-500");
    if (message) {
        requestAnimationFrame(() => el.classList.add("is-visible"));
    }
}

function animateAuthCardSuccess() {
    const card = document.querySelector(".account-card");
    if (!card) return;
    card.classList.remove("auth-success-flash");
    void card.offsetWidth;
    card.classList.add("auth-success-flash");
}

function setAuthFormBusy(isBusy) {
    document.getElementById("auth-form")?.classList.toggle("is-submitting", isBusy);
}

function setAuthTopLoader(isActive) {
    document.getElementById("auth-top-loader")?.classList.toggle("is-active", isActive);
}

async function withMinimumDelay(task, minDelay = AUTH_LOADING_MIN_MS) {
    const startedAt = Date.now();
    const result = await task();
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, minDelay - elapsed);
    if (remaining) {
        await new Promise((resolve) => window.setTimeout(resolve, remaining));
    }
    return result;
}

function resetRegisterVerificationState(clearCode = true) {
    appState.authRegistration = {
        verificationRequested: false,
        email: ""
    };
    document.getElementById("auth-code-wrap")?.classList.add("hidden");
    if (clearCode) {
        const codeInput = document.getElementById("auth-code");
        if (codeInput) codeInput.value = "";
    }
}

function setRegisterVerificationState(isActive, email = "") {
    appState.authRegistration = {
        verificationRequested: isActive,
        email: (email || "").toLowerCase()
    };
    document.getElementById("auth-code-wrap")?.classList.toggle("hidden", !isActive);
    if (!isActive) {
        const codeInput = document.getElementById("auth-code");
        if (codeInput) codeInput.value = "";
    }
}

function setAuthMode(mode) {
    appState.authMode = mode;
    const isRegister = mode === "register";
    document.getElementById("auth-title").innerText = isRegister ? "Crie sua conta para continuar comprando" : "Digite seu e-mail ou telefone para iniciar sessão";
    document.getElementById("auth-subtitle").innerText = isRegister
        ? "Informe seus dados, receba um código por e-mail e finalize o cadastro com segurança."
        : "Entre com seus dados para continuar a compra com segurança.";
    document.getElementById("auth-name-wrap").classList.toggle("hidden", !isRegister);
    document.getElementById("auth-confirm-wrap").classList.toggle("hidden", !isRegister);
    resetRegisterVerificationState(true);
    document.getElementById("auth-submit-btn").innerText = isRegister ? "Enviar código" : "Entrar";
    document.getElementById("auth-switch-label").innerText = isRegister ? "Já tem uma conta?" : "Ainda não tem uma conta?";
    document.getElementById("auth-switch-btn").innerText = isRegister ? "Entre" : "Criar conta";
    setAuthFeedback("");
}

function toggleAuthMode() {
    setAuthMode(appState.authMode === "register" ? "login" : "register");
}

function openAuthPage(mode = "register", triggerEl = null) {
    setAuthMode(mode);
    showPage("auth", triggerEl);
    initGoogleAuth();
}

function normalizeUser(user) {
    return {
        id: user.id || `usr-${Date.now()}`,
        name: user.name || "Usuário",
        email: (user.email || "").toLowerCase(),
        provider: user.provider || "email",
        avatar: user.avatar || "",
        emailVerified: Boolean(user.emailVerified),
        createdAt: user.createdAt || new Date().toISOString()
    };
}

async function apiRequest(path, payload) {
    try {
        const response = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                error: data.error || "Falha na requisicao"
            };
        }
        return data;
    } catch (error) {
        console.warn(`Requisicao local falhou em ${path}:`, error.message);
        return {
            error: "Erro de conexão com o servidor."
        };
    }
}

function syncSession(user) {
    appState.session = {
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar || "",
        emailVerified: Boolean(user.emailVerified)
    };
    persistState();
    renderAccountArea();
    renderHeaderAuthState();
    hydrateCheckoutUI();
    resetSavedAddressForm();
    loadSavedAddresses(true);
}

function renderHeaderAuthState() {
    const isLoggedIn = Boolean(appState.session);
    renderHeaderLocation();
    document.getElementById("nav-login-btn")?.classList.toggle("hidden", isLoggedIn);
    document.getElementById("nav-account-shell")?.classList.toggle("hidden", !isLoggedIn);
    document.getElementById("nav-register-btn")?.classList.toggle("hidden", isLoggedIn);
    document.getElementById("mobile-menu-login-link")?.classList.toggle("hidden", isLoggedIn);
    document.getElementById("mobile-menu-register-link")?.classList.toggle("hidden", isLoggedIn);
    document.getElementById("mobile-menu-logout-link")?.classList.toggle("hidden", !isLoggedIn);

    const mobileUserName = document.getElementById("mobile-menu-user-name");
    const mobileAvatarImage = document.getElementById("mobile-menu-avatar-image");
    const mobileAvatarFallback = document.getElementById("mobile-menu-avatar-fallback");
    const fallbackLetter = (appState.session?.name || appState.session?.email || "M").trim().charAt(0).toUpperCase() || "M";

    if (mobileUserName) {
        mobileUserName.innerText = appState.session?.name || "Minha conta";
    }

    if (mobileAvatarImage && mobileAvatarFallback) {
        if (appState.session?.avatar) {
            mobileAvatarImage.src = appState.session.avatar;
            mobileAvatarImage.classList.remove("hidden");
            mobileAvatarFallback.classList.add("hidden");
        } else {
            mobileAvatarImage.src = "";
            mobileAvatarImage.classList.add("hidden");
            mobileAvatarFallback.classList.remove("hidden");
            mobileAvatarFallback.innerText = fallbackLetter;
        }
    }

    const desktopName = document.getElementById("desktop-account-name");
    const desktopAvatarImage = document.getElementById("desktop-account-avatar-image");
    const desktopAvatarFallback = document.getElementById("desktop-account-avatar-fallback");
    const desktopMenuName = document.getElementById("desktop-account-menu-name");
    const desktopMenuAvatarImage = document.getElementById("desktop-account-menu-avatar-image");
    const desktopMenuAvatarFallback = document.getElementById("desktop-account-menu-avatar-fallback");
    const accountName = appState.session?.name || "Minha conta";

    if (desktopName) desktopName.innerText = accountName;
    if (desktopMenuName) desktopMenuName.innerText = accountName;

    [[desktopAvatarImage, desktopAvatarFallback], [desktopMenuAvatarImage, desktopMenuAvatarFallback]].forEach(([imageEl, fallbackEl]) => {
        if (!imageEl || !fallbackEl) return;
        if (appState.session?.avatar) {
            imageEl.src = appState.session.avatar;
            imageEl.classList.remove("hidden");
            fallbackEl.classList.add("hidden");
        } else {
            imageEl.src = "";
            imageEl.classList.add("hidden");
            fallbackEl.classList.remove("hidden");
            fallbackEl.innerText = fallbackLetter;
        }
    });
}

function validateRegisterFields(payload, confirmPassword) {
    if (!payload.name || !payload.email || !payload.password) {
        setAuthFeedback("Preencha nome, e-mail e senha.", "error");
        return false;
    }

    if (payload.password.length < 6) {
        setAuthFeedback("A senha precisa ter pelo menos 6 caracteres.", "error");
        return false;
    }

    if (payload.password !== confirmPassword) {
        setAuthFeedback("As senhas não conferem.", "error");
        return false;
    }

    return true;
}

async function registerUser() {
    const payload = {
        name: getFieldValue("auth-name"),
        email: getFieldValue("auth-email").toLowerCase(),
        password: getFieldValue("auth-password")
    };
    const confirmPassword = getFieldValue("auth-confirm-password");
    const verificationCode = getFieldValue("auth-code").replace(/\D/g, "");

    if (!validateRegisterFields(payload, confirmPassword)) return;

    const verificationRequested = appState.authRegistration.verificationRequested
        && appState.authRegistration.email === payload.email;

    if (!verificationRequested) {
        setAuthFormBusy(true);
        setAuthTopLoader(true);
        setButtonLoading("auth-submit-btn", true, "Enviando código...", "Enviar código");
        const requestResult = await withMinimumDelay(() => apiRequest("/api/auth/register/send-code", payload));
        setButtonLoading("auth-submit-btn", false, "", "Enviar código");
        setAuthFormBusy(false);
        setAuthTopLoader(false);
        if (requestResult?.error) return setAuthFeedback(requestResult.error, "error");

        setRegisterVerificationState(true, payload.email);
        document.getElementById("auth-submit-btn").innerText = "Criar conta";
        setAuthFeedback(`Código enviado para ${payload.email}. Digite os 6 números para concluir o cadastro.`, "success");
        document.getElementById("auth-code")?.focus();
        return;
    }

    if (verificationCode.length !== 6) {
        return setAuthFeedback("Digite o código de 6 dígitos enviado para o seu e-mail.", "error");
    }

    setAuthFormBusy(true);
    setAuthTopLoader(true);
    setButtonLoading("auth-submit-btn", true, "Validando código...", "Criar conta");
    const serverResult = await withMinimumDelay(() => apiRequest("/api/auth/register/verify", {
        ...payload,
        code: verificationCode
    }));
    setButtonLoading("auth-submit-btn", false, "", "Criar conta");
    setAuthFormBusy(false);
    setAuthTopLoader(false);
    if (serverResult?.error) return setAuthFeedback(serverResult.error, "error");

    const user = normalizeUser(serverResult.user);
    syncSession(user);
    persistState();
    setAuthFeedback("Conta criada com sucesso.", "success");
    animateAuthCardSuccess();
    resetRegisterVerificationState(true);
    renderPurchaseHistory();
    continuePendingCheckoutAfterAuth();
}

async function loginUser() {
    const email = getFieldValue("auth-email").toLowerCase();
    const password = getFieldValue("auth-password");
    if (!email || !password) return setAuthFeedback("Digite e-mail e senha.", "error");

    setAuthFormBusy(true);
    setAuthTopLoader(true);
    setButtonLoading("auth-submit-btn", true, "Entrando...", "Entrar");
    const serverResult = await withMinimumDelay(() => apiRequest("/api/auth/login", { email, password }));
    setButtonLoading("auth-submit-btn", false, "", "Entrar");
    setAuthFormBusy(false);
    setAuthTopLoader(false);
    if (serverResult?.error) return setAuthFeedback(serverResult.error, "error");

    const user = normalizeUser(serverResult.user);
    syncSession(user);
    persistState();
    setAuthFeedback("Login realizado com sucesso.", "success");
    animateAuthCardSuccess();
    renderPurchaseHistory();
    continuePendingCheckoutAfterAuth();
}

async function submitAuthForm(event) {
    event.preventDefault();
    if (appState.authMode === "register") await registerUser();
    else await loginUser();
}

function decodeJwtPayload(token) {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(decodeURIComponent(atob(base64).split("").map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")));
    } catch (error) {
        console.warn("Falha ao decodificar token do Google:", error);
        return null;
    }
}

async function completeGoogleLogin(profile, isDemo = false) {
    if (isDemo) {
        setAuthTopLoader(true);
        await withMinimumDelay(() => Promise.resolve());
        const user = normalizeUser({
            name: profile.name || "Usuário Google",
            email: profile.email || "google.demo@mercadolivre.local",
            provider: "google-demo",
            avatar: profile.picture || ""
        });
        syncSession(user);
        persistState();
        setAuthFeedback("Login com Google em modo de demonstração ativado.", "success");
        animateAuthCardSuccess();
        renderPurchaseHistory();
        setAuthTopLoader(false);
        continuePendingCheckoutAfterAuth();
        return;
    }

    setAuthTopLoader(true);
    const serverResult = await withMinimumDelay(() => apiRequest("/api/auth/google", {
            name: profile.name || "Usuário Google",
        email: profile.email,
        avatar: profile.picture || ""
    }));
    setAuthTopLoader(false);

    if (serverResult?.error) return setAuthFeedback(serverResult.error, "error");

    const user = normalizeUser(serverResult.user);
    syncSession(user);
    persistState();
    setAuthFeedback("Login com Google realizado com sucesso.", "success");
    animateAuthCardSuccess();
    renderPurchaseHistory();
    continuePendingCheckoutAfterAuth();
}

function handleGoogleCredentialResponse(response) {
    const profile = decodeJwtPayload(response.credential);
    if (!profile) return setAuthFeedback("Não foi possível ler os dados do Google.", "error");
    completeGoogleLogin(profile, false);
}

function handleGoogleFallback() {
    completeGoogleLogin({
        name: getFieldValue("auth-name") || "Usuário Google",
        email: getFieldValue("auth-email") || "google.demo@mercadolivre.local"
    }, true);
}

function initGoogleAuth() {
    const slot = document.getElementById("google-login-slot");
    const fallbackBtn = document.getElementById("google-fallback-btn");
    const help = document.getElementById("google-login-help");
    if (!slot || !fallbackBtn || !help) return;

    slot.innerHTML = "";
    if (window.google?.accounts?.id && APP_CONFIG.googleClientId) {
        fallbackBtn.classList.add("hidden");
        help.innerText = "";
        window.google.accounts.id.initialize({
            client_id: APP_CONFIG.googleClientId,
            callback: handleGoogleCredentialResponse
        });
        window.google.accounts.id.renderButton(slot, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            width: 336
        });
    } else {
        fallbackBtn.classList.remove("hidden");
        help.innerText = "Modo de demonstração ativo. Para o login real com Google, adicione GOOGLE_CLIENT_ID.";
    }
}

function renderAccountArea() {
    const session = appState.session;
    document.getElementById("account-user-name").innerText = session?.name || "Nenhum usuário logado";
    document.getElementById("account-user-email").innerText = session?.email || "Faça login para visualizar";
    document.getElementById("account-user-provider").innerText = session?.provider
        ? `${session.provider}${session.emailVerified ? " • email verificado" : ""}`
        : "Não definido";
    document.getElementById("logout-btn").classList.toggle("hidden", !session);
}

function renderPurchaseHistory() {
    const wrap = document.getElementById("purchase-history");
    if (!wrap) return;
    if (!appState.purchases.length) {
        wrap.innerHTML = '<div class="rounded-2xl border border-dashed border-gray-300 p-5 text-gray-500">Nenhuma compra registrada ainda. Quando você integrar o banco de dados, esse painel poderá receber pedidos reais.</div>';
        return;
    }

    wrap.innerHTML = appState.purchases.map((purchase) => `
        <div class="rounded-2xl border border-gray-200 bg-white p-5">
            <div class="flex items-center justify-between gap-3">
                <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-gray-400 font-bold">${purchase.id}</p>
                    <p class="font-bold text-gray-900 mt-2">${new Date(purchase.createdAt).toLocaleString("pt-BR")}</p>
                </div>
                <span class="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-bold">Confirmado</span>
            </div>
            <div class="mt-4 space-y-2">
                ${purchase.items.map((item) => `<p class="text-sm text-gray-700">${item.qty}x ${item.title}</p>`).join("")}
            </div>
            <p class="text-sm text-gray-500 mt-4">Frete pago: ${formatCurrency(purchase.shipping)} - Cliente: ${purchase.customerEmail}</p>
        </div>
    `).join("");
}

function logout() {
    appState.session = null;
    appState.addresses = [];
    appState.addressesLoadedFor = "";
    persistState();
    renderAccountArea();
    renderHeaderAuthState();
    renderSavedAddresses();
    resetSavedAddressForm();
    setAuthFeedback("Sessão encerrada.", "success");
    showPage("home");
}

function bindAuthForm() {
    document.getElementById("auth-form")?.addEventListener("submit", submitAuthForm);
    document.getElementById("address-book-form")?.addEventListener("submit", submitSavedAddressForm);
    ["auth-name", "auth-email", "auth-password", "auth-confirm-password"].forEach((id) => {
        document.getElementById(id)?.addEventListener("input", () => {
            if (appState.authMode === "register" && appState.authRegistration.verificationRequested) {
                resetRegisterVerificationState(false);
                document.getElementById("auth-submit-btn").innerText = "Enviar código";
                setAuthFeedback("Se você alterar os dados, um novo código será enviado.", "neutral");
            }
        });
    });
    document.getElementById("auth-code")?.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
    });
    document.getElementById("address-book-phone")?.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11)
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    });
    document.getElementById("address-book-cep")?.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    });
    ["ship-cep", "ship-address", "ship-number", "cust-name", "cust-cpf", "cust-phone"].forEach((id) => {
        document.getElementById(id)?.addEventListener("input", () => setFieldError(id, ""));
    });
}

function renderAccountArea() {
    const session = appState.session;
    const displayName = session?.name || "Nenhum usuário logado";
    const displayEmail = session?.email || "Faça login para visualizar";
    const provider = session?.provider
        ? `${session.provider}${session.emailVerified ? " - e-mail verificado" : ""}`
        : "Não definido";
    const avatar = (session?.name || session?.email || "?").trim().charAt(0).toUpperCase() || "?";
    const avatarImage = document.getElementById("account-user-avatar-image");
    const avatarFallback = document.getElementById("account-user-avatar-fallback");

    document.getElementById("account-user-name").innerText = displayName;
    document.getElementById("account-user-email").innerText = displayEmail;
    document.getElementById("account-user-provider").innerText = provider;
    if (avatarImage && avatarFallback) {
        if (session?.avatar) {
            avatarImage.src = session.avatar;
            avatarImage.classList.remove("hidden");
            avatarFallback.classList.add("hidden");
            avatarFallback.innerText = avatar;
        } else {
            avatarImage.src = "";
            avatarImage.classList.add("hidden");
            avatarFallback.classList.remove("hidden");
            avatarFallback.innerText = avatar;
        }
    }
    document.getElementById("account-security-banner-text").innerText = session
        ? "Seu acesso está ativo. Reforce a segurança e mantenha sua conta protegida."
        : "Crie uma senha e mantenha sua conta segura";
    document.getElementById("account-security-copy").innerText = session?.emailVerified
        ? "Seu e-mail já foi verificado. Revise as demais configurações."
        : "Você tem configurações pendentes.";
    document.getElementById("logout-btn").classList.toggle("hidden", !session);
    if (session) {
        const recipientInput = document.getElementById("saved-address-recipient");
        if (recipientInput && !recipientInput.value.trim()) recipientInput.value = session.name || "";
    }
    renderSavedAddresses();
    loadSavedAddresses();
}

function renderPurchaseHistory() {
    const wrap = document.getElementById("purchase-history");
    if (!wrap) return;
    if (!appState.purchases.length) {
        wrap.innerHTML = '<div class="rounded-xl border border-dashed border-gray-300 p-5 text-gray-500">Nenhuma compra registrada ainda. Quando seus pedidos entrarem, eles aparecerão aqui com status e itens comprados.</div>';
        return;
    }

    wrap.innerHTML = appState.purchases.map((purchase) => `
        <div class="rounded-xl border border-gray-200 bg-[#fafafa] p-5">
            <div class="flex items-center justify-between gap-3">
                <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-gray-400 font-bold">${purchase.id}</p>
                    <p class="font-semibold text-gray-900 mt-2">${new Date(purchase.createdAt).toLocaleString("pt-BR")}</p>
                </div>
                <span class="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-bold">Confirmado</span>
            </div>
            <div class="mt-4 space-y-2">
                ${purchase.items.map((item) => `<p class="text-sm text-gray-700">${item.qty}x ${item.title}</p>`).join("")}
            </div>
            <p class="text-sm text-gray-500 mt-4">Frete pago: ${formatCurrency(purchase.shipping)} - Cliente: ${purchase.customerEmail}</p>
        </div>
    `).join("");
}

function formatPurchaseDay(dateString) {
    return new Date(dateString).toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}

function formatDeliveryDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}

function recordViewedProduct(productId) {
    const nextEntry = { id: productId, viewedAt: new Date().toISOString() };
    appState.history = [
        nextEntry,
        ...appState.history.filter((item) => item.id !== productId)
    ].slice(0, 30);
    persistState();
}

function removeViewedProduct(productId) {
    appState.history = appState.history.filter((item) => item.id !== productId);
    persistState();
    renderHistoryPage();
}

function groupHistoryEntries() {
    const today = new Date().toDateString();
    const recent = appState.history
        .map((entry) => {
            const product = products.find((item) => item.id === entry.id);
            return product ? { ...entry, product } : null;
        })
        .filter(Boolean);

    const groups = recent.reduce((acc, entry) => {
        const viewedDate = new Date(entry.viewedAt);
        const label = viewedDate.toDateString() === today
            ? "Hoje"
            : viewedDate.toLocaleDateString("pt-BR", { month: "long" }).replace(/^./, (char) => char.toUpperCase());
        if (!acc[label]) acc[label] = [];
        acc[label].push(entry);
        return acc;
    }, {});

    const orderedLabels = Object.keys(groups).sort((a, b) => {
        if (a === "Hoje") return -1;
        if (b === "Hoje") return 1;
        return 0;
    });

    return orderedLabels.map((label) => ({ label, items: groups[label] }));
}

function renderHistoryPage() {
    const historyList = document.getElementById("history-groups");
    if (!historyList) return;

    if (!appState.history.length) {
        historyList.innerHTML = `
            <div class="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-500">
                Nenhum produto visitado recentemente ainda.
            </div>
        `;
        return;
    }

    const groups = groupHistoryEntries();
    historyList.innerHTML = groups.map((group) => `
        <section class="history-group">
            <h2 class="history-group-title">${group.label}</h2>
            <div class="history-grid">
                ${group.items.map(({ product }) => {
                    const currentPrice = getEffectivePrice(product);
                    const discount = getDiscountPercentage(product);
                    return `
                        <article class="history-card" onclick="openDetails(${product.id})">
                            <div class="history-card-media">
                                <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
                            </div>
                            <div class="history-card-body">
                                <p class="history-card-title">${product.title}</p>
                                <p class="history-card-seller">Por Mercado Livre</p>
                                ${product.oldPrice ? `<p class="history-card-old-price">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>` : ""}
                                <div class="history-card-price-row">
                                    <span class="history-card-price">${formatCurrency(currentPrice)}</span>
                                    ${discount ? `<span class="history-card-discount">${discount}% OFF</span>` : ""}
                                </div>
                                <p class="history-card-shipping">Frete grátis</p>
                                <button class="history-card-remove" onclick="event.stopPropagation(); removeViewedProduct(${product.id})">Excluir</button>
                            </div>
                        </article>
                    `;
                }).join("")}
            </div>
        </section>
    `).join("");
}

function viewPurchase(orderId) {
    const purchase = appState.purchases.find((item) => item.id === orderId);
    const firstItem = purchase?.items?.[0];
    if (!firstItem?.id) return;
    openDetails(firstItem.id);
}

function buyPurchaseAgain(orderId) {
    const purchase = appState.purchases.find((item) => item.id === orderId);
    if (!purchase?.items?.length) return;

    purchase.items.forEach((savedItem) => {
        const product = products.find((item) => item.id === savedItem.id);
        if (!product) return;
        const inCart = appState.cart.find((item) => item.id === product.id);
        if (inCart) inCart.qty += savedItem.qty || 1;
        else appState.cart.push({ ...product, qty: savedItem.qty || 1, unitPrice: getEffectivePrice(product) });
    });

    updateCartUI();
    openCartPage();
}

function renderPurchaseHistory() {
    const wrap = document.getElementById("purchase-history");
    const totalLabel = document.getElementById("orders-total-label");
    if (!wrap) return;
    if (totalLabel) totalLabel.innerText = `${appState.purchases.length} compra${appState.purchases.length === 1 ? "" : "s"}`;
    if (!appState.purchases.length) {
        wrap.innerHTML = '<div class="rounded-xl border border-dashed border-gray-300 p-5 text-gray-500">Nenhum pedido registrado ainda. Quando uma compra for iniciada, ela aparecerá aqui com status e detalhes.</div>';
        return;
    }

    wrap.innerHTML = appState.purchases.map((purchase) => `
        <div class="orders-day-group">
            <div class="orders-day-label">${formatPurchaseDay(purchase.createdAt)}</div>
            <div class="order-card-row">
                <div class="order-thumb">
                    <img src="${purchase.items[0]?.image || "assets/mercado-livre-logo.png"}" alt="${purchase.items[0]?.title || "Produto"}" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
                </div>
                <div class="min-w-0">
                    <p class="order-status-label ${purchase.status === "confirmed" ? "is-confirmed" : "is-pending"}">${purchase.status === "confirmed" ? "Pagamento confirmado" : "Pagamento pendente"}</p>
                    <p class="text-[26px] leading-tight font-semibold text-gray-900 mt-1">${purchase.status === "confirmed" ? "Seu pagamento foi aprovado" : "Pague para garantir sua compra"}</p>
                    <p class="text-sm text-gray-500 mt-2">${purchase.status === "confirmed" ? `Chega por volta de ${formatDeliveryDate(purchase.estimatedDelivery)}.` : "Confirmaremos a data de entrega quando o pagamento for aprovado."}</p>
                    <p class="text-sm text-gray-700 mt-4 line-clamp-2">${purchase.items[0]?.description || purchase.items[0]?.title || "Produto selecionado na sua compra."}</p>
                    <p class="text-sm text-gray-400 mt-1">${purchase.items[0]?.qty || 1} unidade${(purchase.items[0]?.qty || 1) > 1 ? "s" : ""}</p>
                </div>
                <div class="order-actions">
                    <button class="order-primary-btn" onclick="viewPurchase('${purchase.id}')">Ver compra</button>
                    <button class="order-secondary-btn" onclick="buyPurchaseAgain('${purchase.id}')">Comprar novamente</button>
                </div>
            </div>
        </div>
    `).join("");
}

function openAddressManager() {
    document.getElementById("address-manager-overlay")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    resetSavedAddressForm();
    lucide.createIcons();
}

function closeAddressManager() {
    document.getElementById("address-manager-overlay")?.classList.add("hidden");
    if (document.getElementById("checkout-modal")?.classList.contains("hidden")) {
        document.body.style.overflow = "auto";
    }
}

function renderSavedAddresses() {
    const list = document.getElementById("address-book-list");
    const form = document.getElementById("address-book-form");
    if (!list || !form) return;

    if (!appState.session) {
        list.innerHTML = `<div class="address-empty">Faça login para visualizar e gerenciar seus endereços.</div>`;
        form.classList.add("opacity-60", "pointer-events-none");
        return;
    }

    form.classList.remove("opacity-60", "pointer-events-none");

    if (!appState.addresses.length) {
        list.innerHTML = `<div class="address-empty">Nenhum endereço salvo ainda. Adicione o primeiro endereço abaixo.</div>`;
        return;
    }

    list.innerHTML = appState.addresses.map((address) => `
        <div class="address-book-card">
            <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                    <p class="text-[30px] leading-tight font-semibold text-gray-900">${address.street || "Endereço"}, ${address.number || "s/n"} ${address.label || ""}</p>
                    <p class="text-[18px] text-gray-700 mt-2">CEP ${address.cep || ""} - ${address.state || ""} - ${address.city || ""}</p>
                    <p class="text-[15px] text-gray-500 mt-2">Endereço residencial</p>
                    <p class="text-[15px] text-gray-500 mt-2">${address.recipientName || ""}${address.phone ? ` - ${address.phone}` : ""}</p>
                    <div class="flex items-center gap-2 flex-wrap mt-3">
                        ${address.isDefault ? '<span class="address-book-tag">Principal</span>' : ""}
                        ${address.label ? `<span class="address-book-tag">${address.label}</span>` : ""}
                    </div>
                    <button class="mt-5 text-[#3483fa] font-semibold" onclick="openAddressManager()">Incluir informações adicionais →</button>
                </div>
                <button class="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors" onclick="deleteSavedAddress('${address.id}')">Excluir</button>
            </div>
        </div>
    `).join("");
}

async function loadSavedAddresses(force = false) {
    const email = getSessionEmail();
    if (!email) {
        appState.addresses = [];
        appState.addressesLoadedFor = "";
        renderSavedAddresses();
        renderHeaderLocation();
        setTextFeedback("address-book-feedback", "");
        return;
    }

    if (!force && appState.addressesLoadedFor === email && appState.addresses.length) {
        renderSavedAddresses();
        return;
    }

    setTextFeedback("address-book-feedback", "Carregando endereços...");
    const result = await apiRequest("/api/account/addresses/list", { email });
    if (result?.error) {
        appState.addresses = [];
        appState.addressesLoadedFor = "";
        renderSavedAddresses();
        setTextFeedback("address-book-feedback", result.error, "error");
        return;
    }

    appState.addresses = Array.isArray(result.addresses) ? result.addresses : [];
    appState.addressesLoadedFor = email;
    renderSavedAddresses();
    renderHeaderLocation();
    setTextFeedback("address-book-feedback", appState.addresses.length ? `${appState.addresses.length} endereço(s) salvo(s).` : "Nenhum endereço salvo ainda.", "success");
}

function resetSavedAddressForm() {
    document.getElementById("address-book-form")?.reset();
    if (appState.session?.name) {
        const recipientInput = document.getElementById("address-book-recipient");
        if (recipientInput) recipientInput.value = appState.session.name;
    }
    setTextFeedback("address-book-form-feedback", "");
}

async function submitSavedAddressForm(event) {
    event.preventDefault();
    const email = getSessionEmail();
    if (!email) {
        setTextFeedback("address-book-form-feedback", "Faça login para salvar endereços.", "error");
        return;
    }

    const payload = {
        email,
        label: document.getElementById("address-book-label")?.value?.trim() || "Casa",
        recipientName: document.getElementById("address-book-recipient")?.value?.trim() || "",
        phone: document.getElementById("address-book-phone")?.value?.trim() || "",
        cep: document.getElementById("address-book-cep")?.value?.trim() || "",
        street: document.getElementById("address-book-street")?.value?.trim() || "",
        number: document.getElementById("address-book-number")?.value?.trim() || "",
        complement: document.getElementById("address-book-complement")?.value?.trim() || "",
        neighborhood: document.getElementById("address-book-neighborhood")?.value?.trim() || "",
        city: document.getElementById("address-book-city")?.value?.trim() || "",
        state: document.getElementById("address-book-state")?.value?.trim() || "",
        isDefault: Boolean(document.getElementById("address-book-default")?.checked),
    };

    if (!payload.recipientName || !payload.cep || !payload.street || !payload.number) {
        setTextFeedback("address-book-form-feedback", "Preencha destinatário, CEP, rua e número.", "error");
        return;
    }

    setButtonLoading("address-book-submit-btn", true, "Salvando...", "Salvar endereço");
    const result = await apiRequest("/api/account/addresses/create", payload);
    setButtonLoading("address-book-submit-btn", false, "", "Salvar endereço");
    if (result?.error) {
        setTextFeedback("address-book-form-feedback", result.error, "error");
        return;
    }

    closeAddressManager();
    await loadSavedAddresses(true);
}

async function deleteSavedAddress(addressId) {
    const email = getSessionEmail();
    if (!email || !addressId) return;

    setTextFeedback("address-book-feedback", "Excluindo endereço...");
    const result = await apiRequest("/api/account/addresses/delete", { email, addressId });
    if (result?.error) {
        setTextFeedback("address-book-feedback", result.error, "error");
        return;
    }

    appState.addresses = appState.addresses.filter((address) => address.id !== addressId);
    renderSavedAddresses();
    setTextFeedback("address-book-feedback", "Endereço excluído.", "success");
}

function init() {
    loadState();
    renderProducts();
    bindSearchInputs();
    updateCartUI();
    hydrateCheckoutUI();
    updateCheckoutSummary();
    bindAuthForm();
    renderAccountArea();
    renderHeaderAuthState();
    renderPurchaseHistory();
    renderSavedAddresses();
    resetSavedAddressForm();
    setAuthMode("register");
    initGoogleAuth();
    initHeroCarousel();
    document.getElementById("nav-account-btn")?.addEventListener("click", toggleDesktopAccountMenu);
    document.addEventListener("click", (event) => {
        closeCategoriesMenu();
        if (!event.target.closest("#nav-account-shell")) {
            closeDesktopAccountMenu();
        }
    });
    window.addEventListener("popstate", (event) => {
        restoreNavigationState(event.state);
    });
    showPage("home", null, { updateHistory: false });
    writeNavigationState("replace");
    lucide.createIcons();
}

window.setHeroSlide = setHeroSlide;
window.moveHeroSlide = moveHeroSlide;
window.showPage = showPage;
window.navigateToSection = navigateToSection;
window.toggleCategoriesMenu = toggleCategoriesMenu;
window.toggleDesktopAccountMenu = toggleDesktopAccountMenu;
window.closeDesktopAccountMenu = closeDesktopAccountMenu;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.openCartPage = openCartPage;
window.startCheckoutFlow = startCheckoutFlow;
window.openAddressManager = openAddressManager;
window.closeAddressManager = closeAddressManager;
window.openDetails = openDetails;
window.viewPurchase = viewPurchase;
window.buyPurchaseAgain = buyPurchaseAgain;
window.selectDetailImage = selectDetailImage;
window.scrollRelatedProducts = scrollRelatedProducts;
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.remove = remove;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.goToCheckStep = goToCheckStep;
window.submitAddressStep = submitAddressStep;
window.selectPaymentMethod = selectPaymentMethod;
window.advanceCheckoutStep = advanceCheckoutStep;
window.startPixCheckout = startPixCheckout;
window.formatCPF = formatCPF;
window.formatCEP = formatCEP;
window.formatPhone = formatPhone;
window.lookupCep = lookupCep;
window.confirmPayment = confirmPayment;
window.copyPix = copyPix;
window.buyNow = buyNow;
window.openAuthPage = openAuthPage;
window.toggleAuthMode = toggleAuthMode;
window.handleGoogleFallback = handleGoogleFallback;
window.deleteSavedAddress = deleteSavedAddress;
window.logout = logout;
window.playEmbeddedVideo = playEmbeddedVideo;

init();
