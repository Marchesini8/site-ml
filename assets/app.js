const FIXED_SHIPPING = 49.9;
const FULL_DISCOUNT_LABEL = "100% OFF";
const STORAGE_KEYS = {
    session: "ml_session",
    purchases: "ml_purchases"
};
const APP_CONFIG = {
    googleClientId: window.GOOGLE_CLIENT_ID || ""
};
const products = [
    { id: 1, title: 'Samsung Smart TV 75" Crystal UHD 4K 2025', price: 0, oldPrice: 2199.99, image: "https://m.media-amazon.com/images/I/81QsB0GMcyL._AC_SX522_.jpg", description: "A nova era da TV chegou. Com processador Crystal 4K e Alexa integrada." },
    { id: 2, title: "Geladeira Electrolux Frost Free Inverter 480L", price: 0, oldPrice: 1980.0, image: "https://m.media-amazon.com/images/I/41qntZyTefL._AC_SX342_SY445_QL70_ML2_.jpg", description: "Tecnologia AutoSense que preserva alimentos por muito mais tempo." },
    { id: 3, title: "Apple iPhone 15 (128 GB) - Preto", price: 0, oldPrice: 2099.0, image: "https://m.media-amazon.com/images/I/416MG51rNgL._AC_SX342_SY445_QL70_ML2_.jpg", description: "O iPhone 15 traz a Dynamic Island, camera de 48 MP e USB-C." },
    { id: 4, title: "Philips Walita Airfryer XL Digital 6.2L", price: 0, oldPrice: 460.0, image: "https://m.media-amazon.com/images/I/51i3nkPbZ-L._AC_SX679_.jpg", description: "Cozinhe de forma saudavel com ate 90% menos gordura." },
    { id: 5, title: "Jogo de Panelas 13 Pecas Antiaderente com Panela de Pressao", price: 0, oldPrice: 329.0, image: "https://m.media-amazon.com/images/I/61MUlJ3X-jL._AC_SX679_.jpg", description: "Conjunto completo antiaderente com 13 pecas, incluindo panela de pressao, ideal para equipar sua cozinha." },
    { id: 6, title: "Fogao Cook Glass Preto 5 Bocas Mega Chama", price: 0, oldPrice: 899.0, image: "https://m.media-amazon.com/images/I/51Llc-bUtRL._AC_SX522_.jpg", description: "Fogao 5 bocas com mesa de vidro, mega chama, trempes com 6 apoios e acendimento automatico." },
    { id: 7, title: "JBL PartyBox Stage 520 Bluetooth Portatil", price: 0, oldPrice: 1999.99, image: "https://m.media-amazon.com/images/I/61zm6pi9ziL._AC_SX679_.jpg", description: "Caixa de som Bluetooth portatil com show de luzes e ate 15 horas de reproducao." },
    { id: 8, title: "Samsung Galaxy Book4 Intel Core i5", price: 0, oldPrice: 2200.0, image: "https://m.media-amazon.com/images/I/51lGW2nP9qL._AC_SX522_.jpg", description: "Notebook leve com Intel Core i5, 8GB de RAM, SSD de 512GB e tela Full HD de 15,6 polegadas." }
];

const appState = {
    cart: [],
    currentProdId: null,
    currentPayment: null,
    currentHeroSlide: 0,
    heroCarouselInterval: null,
    heroSlideCount: 4,
    currentCheckoutStep: "address",
    authMode: "register",
    authRegistration: {
        verificationRequested: false,
        email: ""
    },
    session: null,
    purchases: [],
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
        shippingText: "Chegara gratis quinta-feira 30 de abril",
        sellerName: "Loja oficial Samsung",
        sellerSales: "+1 M",
        optionText: "20 produtos novos a partir de R$ 2.299",
        highlights: [
            "Google Assistant embutido.",
            "Possui 3 portas HDMI.",
            "Equipado com conexao USB.",
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
        shippingText: "Receba em ate 2 dias uteis",
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
        shippingText: "Chegara amanha com entrega expressa",
        sellerName: "Loja oficial Apple",
        sellerSales: "+800 mil",
        optionText: "18 produtos novos a partir de R$ 2.099",
        highlights: [
            "Tela brilhante com Dynamic Island.",
            "Camera principal de 48 MP.",
            "Conexao USB-C.",
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
}

function loadState() {
    appState.session = safeParse(STORAGE_KEYS.session, null);
    appState.purchases = safeParse(STORAGE_KEYS.purchases, []);
}

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderProductCard(product) {
    const discount = product.oldPrice ? Math.max(1, Math.round((1 - product.price / product.oldPrice) * 100)) : 40;
    const installment = Math.max(1, Math.round((product.oldPrice || 100) / 10));
    return `
        <div class="offer-grid-card px-3 md:px-4 py-3 md:py-4 bg-white cursor-pointer" onclick="openDetails(${product.id}, this)">
            <div class="h-32 md:h-36 flex items-center justify-center overflow-hidden rounded-md bg-[#f7f7f7]">
                <img src="${product.image}" class="max-h-full object-contain p-2" alt="${product.title}" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-4')">
            </div>
            <div class="pt-3 min-h-[194px] flex flex-col">
                <h4 class="text-[13px] text-gray-700 line-clamp-2 min-h-[42px] font-normal leading-[1.35]">${product.title}</h4>
                <p class="text-xs text-gray-400 mt-2 line-through">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                <div class="flex items-baseline gap-1.5 mt-1 flex-wrap">
                    <p class="text-[18px] md:text-[20px] leading-none font-normal text-gray-900">R$ ${Math.round(product.oldPrice).toLocaleString("pt-BR")}</p>
                    <p class="text-[12px] font-bold text-green-600">${discount}% OFF</p>
                </div>
                <p class="text-[12px] text-green-600 font-medium mt-1">10x R$ ${installment},41 sem juros</p>
                <p class="text-[12px] text-green-600 font-medium mt-2">Frete gratis <span class="font-normal text-gray-400">por ser sua primeira compra</span></p>
                <button onclick="event.stopPropagation(); addToCart(${product.id})" class="mt-auto pt-3 text-left text-[12px] text-blue-600 font-semibold hover:underline">Ver oferta</button>
            </div>
        </div>
    `;
}

function renderProducts() {
    const list = document.getElementById("products-list");
    const featured = document.getElementById("featured-offer");
    if (list) list.innerHTML = products.slice(1, 7).map(renderProductCard).join("");
    if (featured) {
        const product = products[0];
        const discount = product.oldPrice ? Math.max(1, Math.round((1 - product.price / product.oldPrice) * 100)) : 27;
        featured.innerHTML = `
            <p class="text-2xl font-light text-gray-700 mb-4">Oferta do dia</p>
            <div class="rounded-[1.25rem] overflow-hidden bg-gray-50 h-[300px] flex items-center justify-center">
                <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.remove('object-cover');this.classList.add('object-contain','p-8')">
            </div>
            <div class="pt-4">
                <h3 class="text-[15px] text-gray-700 leading-6">${product.title}</h3>
                <p class="text-sm text-gray-400 line-through mt-3">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div class="flex items-baseline gap-2 mt-1 flex-wrap">
                    <p class="text-[2.5rem] leading-none font-light text-gray-900">R$ ${Math.round(product.oldPrice).toLocaleString("pt-BR")}</p>
                    <p class="text-lg font-bold text-green-600">${discount}% OFF</p>
                </div>
                <p class="text-sm text-green-600 font-bold mt-2">Frete gratis <span class="font-normal text-gray-400">por ser sua primeira compra</span></p>
                <button onclick="addToCart(${product.id})" class="mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">Adicionar ao carrinho</button>
            </div>
        `;
    }
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

function showPage(pageId, triggerEl = null) {
    const pageMap = {
        home: document.getElementById("page-home"),
        auth: document.getElementById("page-auth"),
        purchases: document.getElementById("page-purchases"),
        details: document.getElementById("page-details")
    };

    Object.values(pageMap).forEach((page) => page?.classList.add("hidden"));
    pageMap[pageId]?.classList.remove("hidden");
    closeCategoriesMenu();
    setActiveNav(triggerEl);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "auto";
    if (pageId === "purchases") renderAccountArea();
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
        shippingText: "Chegara gratis entre quarta e quinta",
        sellerName: "Loja oficial Mercado Livre",
        sellerSales: "+1 M",
        optionText: `12 produtos novos a partir de R$ ${Math.round(product.oldPrice).toLocaleString("pt-BR")}`,
        highlights: [
            "Produto com excelente avaliacao dos compradores.",
            "Entrega rapida para varias regioes.",
            "Pagamento em ate 10x sem juros.",
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

function openDetails(id, triggerEl = null) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const meta = getProductDetailMeta(product);
    const parcel = ((product.oldPrice || product.price || 1) / 10).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const pixPrice = (product.oldPrice || product.price || 1).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const discount = product.oldPrice ? Math.max(1, Math.round((1 - product.price / product.oldPrice) * 100)) : 17;

    appState.currentProdId = id;
    document.getElementById("det-title").innerText = product.title;
    document.getElementById("det-breadcrumb").innerText = meta.breadcrumb;
    document.getElementById("det-brand-link").innerText = `Conferir mais produtos da marca ${meta.brand}`;
    document.getElementById("det-condition").innerText = "Novo";
    document.getElementById("det-sold").innerText = meta.sold;
    document.getElementById("det-rating-score").innerText = meta.rating.toFixed(1);
    document.getElementById("det-reviews").innerText = `(${meta.reviews})`;
    document.getElementById("det-price").innerText = `R$ ${Math.round(product.oldPrice || product.price).toLocaleString("pt-BR")}`;
    document.getElementById("det-old-price").innerHTML = `De <span class="line-through">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
    document.getElementById("det-off-badge").innerText = `${discount}% OFF`;
    document.getElementById("det-cash-price").innerText = pixPrice;
    document.getElementById("det-parcel").innerText = parcel;
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
    showPage("details");
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
        const discount = product.oldPrice ? Math.max(1, Math.round((1 - product.price / product.oldPrice) * 100)) : 17;
        return `
            <div class="related-card min-w-[240px] max-w-[240px] rounded-2xl bg-white p-4 cursor-pointer" onclick="openDetails(${product.id}, this)">
                <div class="h-36 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img src="${product.image}" alt="${product.title}" class="max-h-full object-contain p-2" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
                </div>
                <div class="pt-4">
                    <h3 class="text-[14px] text-gray-700 line-clamp-2 min-h-[42px]">${product.title}</h3>
                    <p class="text-sm text-gray-400 line-through mt-3">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div class="flex items-baseline gap-2 mt-1 flex-wrap">
                        <p class="text-[28px] leading-none font-light text-gray-900">R$ ${Math.round(product.oldPrice).toLocaleString("pt-BR")}</p>
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
    else appState.cart.push({ ...product, qty: 1 });

    const btn = document.getElementById("cart-btn");
    btn?.classList.add("bump");
    window.setTimeout(() => btn?.classList.remove("bump"), 300);
    updateCartUI();
    toggleCart(true);
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

function updateCartUI() {
    const container = document.getElementById("cart-items");
    const countLabel = document.getElementById("cart-count");
    const totalLabel = document.getElementById("cart-total");
    if (!container || !countLabel || !totalLabel) return;

    container.innerHTML = appState.cart.length === 0
        ? '<div class="flex flex-col items-center justify-center h-64 text-gray-400 gap-4"><i data-lucide="shopping-bag" class="w-12 h-12 opacity-20"></i><p>Seu carrinho esta vazio</p></div>'
        : "";

    let total = 0;
    let count = 0;
    appState.cart.forEach((item) => {
        total += item.price * item.qty;
        count += item.qty;
        container.innerHTML += `
            <div class="flex gap-4 border-b border-gray-50 pb-6 fade-in">
                <img src="${item.image}" class="w-20 h-20 object-contain rounded-xl p-2 border bg-gray-50" alt="${item.title}" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
                <div class="flex-1">
                    <h3 class="text-sm font-bold line-clamp-1 text-gray-800">${item.title}</h3>
                    <p class="text-lg font-bold text-blue-600 mt-1">R$ ${item.price.toLocaleString("pt-BR")}</p>
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
    totalLabel.innerText = `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    updateCheckoutSummary();
    lucide.createIcons();
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
    if (userPill) userPill.innerText = appState.session?.name || "Checkout";
    const customerName = document.getElementById("cust-name");
    if (customerName && appState.session?.name) customerName.value = appState.session.name;
    setPaymentStatusMessage("");
    document.getElementById("pix-code").value = "";
    setCepStatus("");
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const productTotal = appState.cart.reduce((acc, item) => acc + item.oldPrice * item.qty, 0);
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
        totalLabel.innerText = appState.currentCheckoutStep === "payment" ? "Voce pagara" : "Total";
    }

    const reviewPaymentTotal = document.getElementById("review-payment-total");
    if (reviewPaymentTotal) reviewPaymentTotal.innerText = formatCurrency(finalTotal);
    const pixScreenTotal = document.getElementById("pix-screen-total");
    if (pixScreenTotal) pixScreenTotal.innerText = formatCurrency(finalTotal);
}

function openCheckout() {
    if (appState.cart.length === 0) return;
    toggleCart(false);
    resetPaymentState();
    appState.checkoutDraft = {
        paymentMethod: "pix",
        name: appState.session?.name || "",
        cpf: "",
        phone: "",
        cep: "",
        address: "",
        number: "",
        complement: ""
    };
    hydrateCheckoutUI();
    const modal = document.getElementById("checkout-modal");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    modal.scrollTop = 0;
    goToCheckStep("address");
}

function closeCheckout() {
    const modal = document.getElementById("checkout-modal");
    resetPaymentState();
    document.body.style.overflow = "auto";
    modal.classList.add("hidden");
    showPage("home");
}

function recordPurchase() {
    if (!appState.cart.length) return;
    const order = {
        id: `PED-${Date.now()}`,
        createdAt: new Date().toISOString(),
        shipping: 0,
        items: appState.cart.map((item) => ({ id: item.id, title: item.title, qty: item.qty })),
        customerEmail: appState.session?.email || "visitante"
    };
    appState.purchases.unshift(order);
    persistState();
    renderPurchaseHistory();
}

function goToCheckStep(step) {
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
    lucide.createIcons();
}

function formatAddressLine() {
    const { address, number, complement, cep } = appState.checkoutDraft;
    return `${address || ""} ${number || ""}${complement ? ` - ${complement}` : ""} - CEP ${cep || ""}`.trim();
}

function submitAddressStep() {
    const missing = [];
    const draft = {
        paymentMethod: "pix",
        name: getFieldValue("cust-name"),
        cpf: getFieldValue("cust-cpf"),
        phone: getFieldValue("cust-phone"),
        cep: getFieldValue("ship-cep"),
        address: getFieldValue("ship-address"),
        number: getFieldValue("ship-number"),
        complement: getFieldValue("ship-complement")
    };

    if (!draft.cep) missing.push("CEP");
    if (!draft.address) missing.push("endereco");
    if (!draft.number) missing.push("numero");
    if (!draft.name) missing.push("nome");
    if (!draft.cpf) missing.push("CPF");
    if (!draft.phone) missing.push("telefone");
    if (missing.length) return alert(`Preencha: ${missing.join(", ")}`);

    appState.checkoutDraft = draft;
    setButtonLoading("checkout-address-btn", true, "Salvando...", "Salvar");
    window.setTimeout(() => {
        setButtonLoading("checkout-address-btn", false, "", "Salvar");
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
    setCepStatus("Buscando endereco pelo CEP...", "loading");
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
        const data = await response.json();
        if (!response.ok || data.erro) throw new Error("CEP nao encontrado");
        const addressField = document.getElementById("ship-address");
        if (addressField && !addressField.value.trim()) {
            addressField.value = [data.logradouro, data.bairro].filter(Boolean).join(", ");
        }
        appState.checkoutDraft.cep = data.cep || getFieldValue("ship-cep");
        setCepStatus(`Endereco localizado: ${[data.logradouro, data.bairro, data.localidade].filter(Boolean).join(" - ")}`, "success");
    } catch (error) {
        console.warn("Falha ao buscar CEP:", error);
        setCepStatus("Nao foi possivel localizar o CEP automaticamente.", "error");
    }
}

async function startPixCheckout() {
    const btn = document.getElementById("checkout-confirm-btn");
    const payload = {
        items: appState.cart,
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
        if (!pixCode) throw new Error("A IronPay nao retornou um codigo PIX valido.");

        appState.currentPayment = {
            transactionHash: data.transaction_hash || data.transactionHash || null,
            status: data.status || "pending"
        };

        document.getElementById("pix-code").value = pixCode;
        renderPixQr(data.pix_base64, pixCode);
        goToCheckStep("pix");
    } catch (error) {
        console.error(error);
        alert("Erro de conexao com o servidor.");
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
    btn.innerText = "Ir para Minhas compras";
}

async function confirmPayment() {
    const paymentBtn = document.getElementById("payment-validated-btn");
    if (!appState.currentPayment?.transactionHash) {
        setPaymentStatusMessage("Ainda nao foi possivel identificar a transacao para validar o pagamento.", "error");
        return;
    }

    setButtonLoading("payment-validated-btn", true, "Validando pagamento...", "Ir para Minhas compras");
    setPaymentStatusMessage("Aguardando confirmacao do backend...", "neutral");

    try {
        const response = await fetch(`/api/payments/status/${encodeURIComponent(appState.currentPayment.transactionHash)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Falha ao validar pagamento");

        if (data.isPaid) {
            setPaymentStatusMessage("Pagamento validado com sucesso.", "success");
            goToCheckStep("success");
            return;
        }

        setPaymentStatusMessage("Pagamento ainda nao foi validado no backend. Tente novamente em alguns segundos.", "neutral");
    } catch (error) {
        console.error(error);
        setPaymentStatusMessage(error.message || "Erro ao validar pagamento.", "error");
    } finally {
        setButtonLoading("payment-validated-btn", false, "", "Ir para Minhas compras");
    }
}

function copyPix() {
    const input = document.getElementById("pix-code");
    if (!input) return;
    setButtonLoading("checkout-copy-btn", true, "Copiando...", "Copiar codigo");
    navigator.clipboard.writeText(input.value);
    const feedback = document.getElementById("copy-feedback");
    feedback?.classList.remove("hidden");
    window.setTimeout(() => {
        feedback?.classList.add("hidden");
        setButtonLoading("checkout-copy-btn", false, "", "Copiar codigo");
    }, 1200);
}

function buyNow() {
    addToCart(appState.currentProdId);
    openCheckout();
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
    el.className = "text-sm min-h-[20px] mt-4 text-center";
    if (tone === "success") el.classList.add("text-green-600");
    else if (tone === "error") el.classList.add("text-red-500");
    else el.classList.add("text-gray-500");
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
    document.getElementById("auth-title").innerText = isRegister ? "Crie sua conta e compre com frete gratis" : "Entre na sua conta para continuar comprando";
    document.getElementById("auth-subtitle").innerText = isRegister
        ? "Informe seus dados, receba um codigo por e-mail e finalize o cadastro com seguranca."
        : "Seu acesso agora valida direto no backend com banco PostgreSQL online.";
    document.getElementById("auth-name-wrap").classList.toggle("hidden", !isRegister);
    document.getElementById("auth-confirm-wrap").classList.toggle("hidden", !isRegister);
    resetRegisterVerificationState(true);
    document.getElementById("auth-submit-btn").innerText = isRegister ? "Enviar codigo" : "Entrar";
    document.getElementById("auth-switch-label").innerText = isRegister ? "Ja tem uma conta?" : "Ainda nao tem uma conta?";
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
        name: user.name || "Usuario",
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
            error: "Erro de conexao com o servidor."
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
        setAuthFeedback("As senhas nao conferem.", "error");
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
        setButtonLoading("auth-submit-btn", true, "Enviando codigo...", "Enviar codigo");
        const requestResult = await apiRequest("/api/auth/register/send-code", payload);
        setButtonLoading("auth-submit-btn", false, "", "Enviar codigo");
        if (requestResult?.error) return setAuthFeedback(requestResult.error, "error");

        setRegisterVerificationState(true, payload.email);
        document.getElementById("auth-submit-btn").innerText = "Criar conta";
        setAuthFeedback(`Codigo enviado para ${payload.email}. Digite os 6 numeros para concluir o cadastro.`, "success");
        document.getElementById("auth-code")?.focus();
        return;
    }

    if (verificationCode.length !== 6) {
        return setAuthFeedback("Digite o codigo de 6 digitos enviado para o seu e-mail.", "error");
    }

    setButtonLoading("auth-submit-btn", true, "Validando codigo...", "Criar conta");
    const serverResult = await apiRequest("/api/auth/register/verify", {
        ...payload,
        code: verificationCode
    });
    setButtonLoading("auth-submit-btn", false, "", "Criar conta");
    if (serverResult?.error) return setAuthFeedback(serverResult.error, "error");

    const user = normalizeUser(serverResult.user);
    syncSession(user);
    persistState();
    setAuthFeedback("Conta criada com sucesso.", "success");
    resetRegisterVerificationState(true);
    renderPurchaseHistory();
    window.setTimeout(() => showPage("purchases"), 700);
}

async function loginUser() {
    const email = getFieldValue("auth-email").toLowerCase();
    const password = getFieldValue("auth-password");
    if (!email || !password) return setAuthFeedback("Digite e-mail e senha.", "error");

    setButtonLoading("auth-submit-btn", true, "Entrando...", "Entrar");
    const serverResult = await apiRequest("/api/auth/login", { email, password });
    setButtonLoading("auth-submit-btn", false, "", "Entrar");
    if (serverResult?.error) return setAuthFeedback(serverResult.error, "error");

    const user = normalizeUser(serverResult.user);
    syncSession(user);
    persistState();
    setAuthFeedback("Login realizado com sucesso.", "success");
    renderPurchaseHistory();
    window.setTimeout(() => showPage("purchases"), 700);
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
        const user = normalizeUser({
            name: profile.name || "Usuario Google",
            email: profile.email || "google.demo@mercadolivre.local",
            provider: "google-demo",
            avatar: profile.picture || ""
        });
        syncSession(user);
        persistState();
        setAuthFeedback("Login com Google em modo demonstracao ativado.", "success");
        renderPurchaseHistory();
        window.setTimeout(() => showPage("purchases"), 700);
        return;
    }

    const serverResult = await apiRequest("/api/auth/google", {
        name: profile.name || "Usuario Google",
        email: profile.email,
        avatar: profile.picture || ""
    });

    if (serverResult?.error) return setAuthFeedback(serverResult.error, "error");

    const user = normalizeUser(serverResult.user);
    syncSession(user);
    persistState();
    setAuthFeedback("Login com Google realizado com sucesso.", "success");
    renderPurchaseHistory();
    window.setTimeout(() => showPage("purchases"), 700);
}

function handleGoogleCredentialResponse(response) {
    const profile = decodeJwtPayload(response.credential);
    if (!profile) return setAuthFeedback("Nao foi possivel ler os dados do Google.", "error");
    completeGoogleLogin(profile, false);
}

function handleGoogleFallback() {
    completeGoogleLogin({
        name: getFieldValue("auth-name") || "Usuario Google",
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
            width: 380
        });
    } else {
        fallbackBtn.classList.remove("hidden");
        help.innerText = "Modo demonstracao ativo. Para o login real com Google, depois adicione GOOGLE_CLIENT_ID.";
    }
}

function renderAccountArea() {
    const session = appState.session;
    document.getElementById("account-user-name").innerText = session?.name || "Nenhum usuario logado";
    document.getElementById("account-user-email").innerText = session?.email || "Faca login para visualizar";
    document.getElementById("account-user-provider").innerText = session?.provider
        ? `${session.provider}${session.emailVerified ? " • email verificado" : ""}`
        : "Nao definido";
    document.getElementById("logout-btn").classList.toggle("hidden", !session);
}

function renderPurchaseHistory() {
    const wrap = document.getElementById("purchase-history");
    if (!wrap) return;
    if (!appState.purchases.length) {
        wrap.innerHTML = '<div class="rounded-2xl border border-dashed border-gray-300 p-5 text-gray-500">Nenhuma compra registrada ainda. Quando voce integrar banco de dados, esse painel ja pode receber pedidos reais.</div>';
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
    persistState();
    renderAccountArea();
    setAuthFeedback("Sessao encerrada.", "success");
    showPage("home");
}

function bindAuthForm() {
    document.getElementById("auth-form")?.addEventListener("submit", submitAuthForm);
    ["auth-name", "auth-email", "auth-password", "auth-confirm-password"].forEach((id) => {
        document.getElementById(id)?.addEventListener("input", () => {
            if (appState.authMode === "register" && appState.authRegistration.verificationRequested) {
                resetRegisterVerificationState(false);
                document.getElementById("auth-submit-btn").innerText = "Enviar codigo";
                setAuthFeedback("Se voce alterar os dados, um novo codigo sera enviado.", "neutral");
            }
        });
    });
    document.getElementById("auth-code")?.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
    });
}

function renderAccountArea() {
    const session = appState.session;
    const displayName = session?.name || "Nenhum usuario logado";
    const displayEmail = session?.email || "Faca login para visualizar";
    const provider = session?.provider
        ? `${session.provider}${session.emailVerified ? " - email verificado" : ""}`
        : "Nao definido";
    const avatar = (session?.name || session?.email || "?").trim().charAt(0).toUpperCase() || "?";

    document.getElementById("account-user-name").innerText = displayName;
    document.getElementById("account-user-email").innerText = displayEmail;
    document.getElementById("account-user-provider").innerText = provider;
    document.getElementById("account-user-avatar").innerText = avatar;
    document.getElementById("account-security-banner-text").innerText = session
        ? "Seu acesso esta ativo. Reforce a seguranca e mantenha sua conta protegida."
        : "Crie uma senha e mantenha sua conta segura";
    document.getElementById("account-security-copy").innerText = session?.emailVerified
        ? "Seu e-mail ja foi verificado. Revise as demais configuracoes."
        : "Voce tem configuracoes pendentes.";
    document.getElementById("logout-btn").classList.toggle("hidden", !session);
}

function renderPurchaseHistory() {
    const wrap = document.getElementById("purchase-history");
    if (!wrap) return;
    if (!appState.purchases.length) {
        wrap.innerHTML = '<div class="rounded-xl border border-dashed border-gray-300 p-5 text-gray-500">Nenhuma compra registrada ainda. Quando seus pedidos entrarem, eles aparecem aqui com status e itens comprados.</div>';
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

function init() {
    loadState();
    renderProducts();
    updateCartUI();
    hydrateCheckoutUI();
    updateCheckoutSummary();
    bindAuthForm();
    renderAccountArea();
    renderPurchaseHistory();
    setAuthMode("register");
    initGoogleAuth();
    initHeroCarousel();
    document.addEventListener("click", () => closeCategoriesMenu());
    showPage("home");
    lucide.createIcons();
}

window.setHeroSlide = setHeroSlide;
window.moveHeroSlide = moveHeroSlide;
window.showPage = showPage;
window.navigateToSection = navigateToSection;
window.toggleCategoriesMenu = toggleCategoriesMenu;
window.openDetails = openDetails;
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
window.logout = logout;
window.playEmbeddedVideo = playEmbeddedVideo;

init();
