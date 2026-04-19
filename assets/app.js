const FIXED_SHIPPING = 49.9;
const FULL_DISCOUNT_LABEL = "100% OFF";
const GLOBAL_DISCOUNT_RATE = 0.85;
const STORAGE_KEYS = {
    session: "ml_session",
    purchases: "ml_purchases",
    history: "ml_history",
    searchHistory: "ml_search_history",
    favorites: "ml_favorites"
};
const APP_CONFIG = {
    googleClientId: window.GOOGLE_CLIENT_ID || ""
};
const AUTH_LOADING_MIN_MS = 950;
const legacyProducts = [
    { id: 1, title: 'Samsung Smart TV 75" Crystal UHD 4K 2025', price: 1499.99, oldPrice: 2199.0, image: "https://m.media-amazon.com/images/I/81QsB0GMcyL._AC_SX522_.jpg", description: "A nova era da TV chegou. Com processador Crystal 4K e Alexa integrada." },
    { id: 2, title: "Geladeira Electrolux Frost Free Inverter 480L", price: 1999.99, oldPrice: 3798.0, image: "https://m.media-amazon.com/images/I/41qntZyTefL._AC_SX342_SY445_QL70_ML2_.jpg", description: "Tecnologia AutoSense que preserva alimentos por muito mais tempo." },
    { id: 3, title: "Apple iPhone 15 (128 GB) - Preto", price: 2399.0, oldPrice: 4394.0, image: "https://m.media-amazon.com/images/I/416MG51rNgL._AC_SX342_SY445_QL70_ML2_.jpg", description: "O iPhone 15 traz a Dynamic Island, camera de 48 MP e USB-C." },
    { id: 4, title: "Philips Walita Airfryer XL Digital 6.2L", price: 249.99, oldPrice: 460.0, image: "https://m.media-amazon.com/images/I/51i3nkPbZ-L._AC_SX679_.jpg", description: "Cozinhe de forma saudável com até 90% menos gordura." },
    { id: 5, title: "Jogo de Panelas 13 Pecas Antiaderente com Panela de Pressao", price: 119.99, oldPrice: 329.0, image: "https://m.media-amazon.com/images/I/61MUlJ3X-jL._AC_SX679_.jpg", description: "Conjunto completo antiaderente com 13 pecas, incluindo panela de pressao, ideal para equipar sua cozinha." },
    { id: 6, title: "Fogao Cook Glass Preto 5 Bocas Mega Chama", price: 499.99, oldPrice: 899.0, image: "https://m.media-amazon.com/images/I/51Llc-bUtRL._AC_SX522_.jpg", description: "Fogao 5 bocas com mesa de vidro, mega chama, trempes com 6 apoios e acendimento automatico." },
    { id: 7, title: "JBL PartyBox Stage 520 Bluetooth Portátil", price: 1789.99, oldPrice: 4218.0, image: "https://m.media-amazon.com/images/I/61zm6pi9ziL._AC_SX679_.jpg", description: "Caixa de som Bluetooth portátil com show de luzes e até 15 horas de reprodução." },
    { id: 8, title: "Samsung Galaxy Book4 Intel Core i5", price: 0, oldPrice: 2200.0, image: "https://m.media-amazon.com/images/I/51lGW2nP9qL._AC_SX522_.jpg", description: "Notebook leve com Intel Core i5, 8GB de RAM, SSD de 512GB e tela Full HD de 15,6 polegadas." }
];

const products = [
    {
        id: 1,
        category: "casa-moveis",
        title: "Sofa 3 Lugares Clean Retratil Reclinavel Cama Inbox - Cinza - Liso",
        price: 900.0,
        oldPrice: 4500.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_973369-MLA97351737569_112025-F.webp",
        description: "Sofa de 3 lugares com assento retratil, encosto reclinavel e visual clean para sala."
    },
    {
        id: 2,
        category: "eletrodomesticos",
        title: "Fritadeira Eletrica AFON-12L-BG Forno Oven 12 Litros Preto Mondial",
        price: 118.5,
        oldPrice: 790.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_654188-MLA110122213881_042026-F.webp",
        description: "Air fryer oven Mondial de 12 litros para assar, gratinar e fritar com menos oleo."
    },
    {
        id: 3,
        category: "eletrodomesticos",
        title: "Lava e Seca Hisense 11kg Titanium Conectada Cinza-escuro",
        price: 494.85,
        oldPrice: 3299.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_984896-MLA99461746270_112025-F.webp",
        description: "Lava e seca conectada com 11 kg de capacidade, acabamento titanium e recursos inteligentes."
    },
    {
        id: 4,
        category: "eletrodomesticos",
        title: "Maquina de Lavar Consul CWB09BB 9kg Branca com Dosagem Economica e Ciclo Edredom",
        price: 269.85,
        oldPrice: 1799.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_692762-MLA99477486134_112025-F.webp",
        description: "Lavadora Consul 9 kg com dosagem economica e ciclo edredom para a rotina da casa."
    },
    {
        id: 5,
        category: "tecnologia",
        title: "Notebook Acer Aspire Go 15 Intel Core i3 1215U 8GB 256GB SSD Linux Prateado",
        price: 764.85,
        oldPrice: 5099.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_848539-MLA109167669761_032026-O.jpg",
        description: "Notebook Acer com tela de 15 polegadas, Intel Core i3, 8 GB de RAM e SSD de 256 GB."
    },
    {
        id: 6,
        category: "tecnologia",
        title: "Console PlayStation 5 Slim Disk - Pacote Astro Bot e Gran Turismo 7 Branco",
        price: 525.0,
        oldPrice: 3500.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_945456-MLA99456386724_112025-O.jpg",
        description: "PS5 Slim com leitor de disco e pacote com Astro Bot e Gran Turismo 7."
    },
    {
        id: 7,
        category: "tecnologia",
        title: "Apple AirPods Pro 3 - Distribuidor Autorizado",
        price: 404.85,
        oldPrice: 2699.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_983699-MLA96154876825_102025-F.webp",
        description: "Fones sem fio da Apple com estojo de recarga e experiencia premium para o dia a dia."
    },
    {
        id: 8,
        category: "eletrodomesticos",
        title: "Lava e Seca 10,5kg Healthguard Titanium Conectada Midea",
        price: 736.6,
        oldPrice: 3683.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_892603-MLB89091208423_082025-F-lava-e-seca-105kg-healthguard-titanium-conectada-midea.webp",
        description: "Lava e seca Midea com 10,5 kg, tecnologia Healthguard, conectividade e acabamento titanium."
    },
    {
        id: 9,
        category: "eletrodomesticos",
        title: "Ventilador De Teto Natuvent Dahlia Led 4 Pas Madeira Freijo",
        price: 451.15,
        oldPrice: 1289.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_780740-MLB90768574509_082025-F-ventilador-de-teto-natuvent-dahlia-led-4-pas-madeira-freijo.webp",
        description: "Ventilador de teto com iluminacao LED, 4 pas em madeira freijo e visual sofisticado."
    },
    {
        id: 10,
        category: "eletrodomesticos",
        title: "Depurador e Exaustor Slim Touch 80cm DE81THPT Suggar",
        price: 196.0,
        oldPrice: 980.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_943717-MLA99471133198_112025-F.webp",
        description: "Depurador e exaustor slim touch Suggar de 80 cm para cozinhas modernas e funcionais."
    },
    {
        id: 11,
        category: "eletrodomesticos",
        title: "Ar Condicionado Split Hi Wall TCL T-Pro 2.0 Inverter 9.000 Btus Frio R-32",
        price: 749.75,
        oldPrice: 2999.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_851669-MLA99906883721_112025-F.webp",
        description: "Ar-condicionado split TCL inverter 9.000 BTUs com ciclo frio e gas R-32."
    },
    {
        id: 12,
        category: "esportes-fitness",
        title: "Hoverboard Skate Eletrico 6.5 Polegadas Com Led e Bluetooth Cor Roxo Galaxia Brinovar",
        price: 348.6,
        oldPrice: 996.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_948014-MLA109035887982_032026-F.webp",
        description: "Hoverboard com rodas de 6,5 polegadas, iluminacao LED e Bluetooth em acabamento roxo galaxia."
    },
    {
        id: 13,
        category: "esportes-fitness",
        title: "Alca Paracord Garrafa Agua Termica Suporte Portatil Cordao",
        price: 9.99,
        oldPrice: 31.9,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_836840-MLB84762789585_052025-F.webp",
        description: "Suporte com alca paracord para transportar garrafas e copos termicos com mais praticidade."
    },
    {
        id: 14,
        category: "esportes-fitness",
        title: "Bola Adidas Trionda League 5 WC 2026 Copa do Mundo FIFA",
        price: 99.99,
        oldPrice: 299.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_993670-MLB93538426506_102025-F.webp",
        description: "Bola Adidas inspirada na Copa do Mundo FIFA 2026 para treinos e partidas com visual oficial."
    },
    {
        id: 15,
        category: "esportes-fitness",
        title: "Bicicleta Aro 26 Dropp Freeride 21 Vel Freio a Disco VikingX Vermelha Quadro 13.5",
        price: 559.0,
        oldPrice: 1399.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_762018-MLA100014649909_122025-F.webp",
        description: "Bike aro 26 com 21 velocidades e freio a disco para pedal urbano e trilhas leves."
    },
    {
        id: 16,
        category: "esportes-fitness",
        title: "Bicicleta Eletrica 800W Astur Aro 24 Suspensao Acelerador Preto",
        price: 3299.0,
        oldPrice: 7499.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_914909-MLA105823359345_012026-F.webp",
        description: "Bicicleta eletrica Astur com motor de 800W, aro 24, suspensao e acelerador."
    },
    {
        id: 17,
        category: "esportes-fitness",
        title: "Bicicleta Ergometrica para Spinning Mecanica 8kg Odin Fit Preto/Vermelho",
        price: 1190.0,
        oldPrice: 2299.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_698827-MLA99367807330_112025-F.webp",
        description: "Bike de spinning mecanica com roda de inercia de 8 kg para treinos em casa."
    },
    {
        id: 18,
        category: "esportes-fitness",
        title: "Kit Halteres 6 em 1 Ate 40kg Ajustavel Halter Kettlebell Anilha Preto Vermelho",
        price: 299.0,
        oldPrice: 1649.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_723293-MLA101063609196_122025-F.webp",
        description: "Kit multifuncional 6 em 1 para musculacao com configuracoes de halter, kettlebell e anilhas."
    },
    {
        id: 19,
        category: "esportes-fitness",
        title: "Mono Cross Over Polia Parede Academia Musculacao WCT Fitness",
        price: 1429.0,
        oldPrice: 2977.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_915889-MLB90216840573_082025-F.webp",
        description: "Estacao mono cross over para parede pensada para treinos de musculacao em academia ou home gym."
    },
    {
        id: 20,
        category: "esportes-fitness",
        title: "Esteira Eletrica Dream Fitness Concept 2.1 Preto e Verde",
        price: 1420.0,
        oldPrice: 3082.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_625495-MLU72527055714_102023-F.webp",
        description: "Esteira eletrica Dream Fitness para caminhadas e corridas com design preto e verde."
    },
    {
        id: 21,
        category: "esportes-fitness",
        title: "Carabina Espingarda de Pressao CBC New Jade 5.5 + Super Combo",
        price: 449.0,
        oldPrice: 1199.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_968405-MLB92438466400_092025-F.webp",
        description: "Carabina de pressao CBC New Jade 5.5 acompanhada de super combo para tiro esportivo."
    },
    {
        id: 22,
        category: "esportes-fitness",
        title: "Carabina Rifle Pressao CBC Jade 5.5 Preta + Capa + Chumbo",
        price: 545.0,
        oldPrice: 959.0,
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_772435-MLB92445295136_092025-F.webp",
        description: "Kit com carabina CBC Jade 5.5, capa e chumbo para pratica esportiva."
    }
];

const electroPromoTiles = [
    "https://http2.mlstatic.com/D_NQ_NP_2X_851669-MLA99906883721_112025-F.webp",
    "https://http2.mlstatic.com/D_NQ_NP887410-MLA94263488132_102025-B.webp",
    "https://http2.mlstatic.com/D_NQ_NP966738-MLA94692492411_102025-B.webp",
    "https://http2.mlstatic.com/D_NQ_NP906445-MLA94692593391_102025-B.webp",
    "https://http2.mlstatic.com/D_NQ_NP723603-MLA94696018473_102025-B.webp",
    "https://http2.mlstatic.com/D_NQ_NP911670-MLA94696018299_102025-B.webp"
];

const homeHeroSlides = [
    { image: "./assets/banner-home-1.png", alt: "Banner principal Mercado Livre 1" },
    { image: "./assets/banner-home-2.png", alt: "Banner principal Mercado Livre 2" },
    { image: "./assets/banner-home-3.png", alt: "Banner principal Mercado Livre 3" },
    { image: "./assets/banner-home-4.png", alt: "Banner principal Mercado Livre 4" },
    { image: "./assets/banner-home-5.png", alt: "Banner principal Mercado Livre 5" },
    { image: "./assets/banner-home-6.webp", alt: "Banner principal Mercado Livre 6" }
];

const electrodomesticosHeroSlides = [
    { image: "./assets/banner-eletro-1.png", alt: "Banner de eletrodomesticos Wap Week" },
    { image: "./assets/banner-eletro-2.png", alt: "Banner de eletrodomesticos Arno" },
    { image: "./assets/banner-eletro-3.png", alt: "Banner de eletrodomesticos renove sua casa" }
];

const sportsFitnessHeroSlides = [
    { image: "./assets/sports/Captura de tela 2026-04-19 000627.png", alt: "Banner o melhor do esporte" },
    { image: "./assets/sports/Captura de tela 2026-04-19 000648.png", alt: "Banner o melhor do ciclismo" },
    { image: "./assets/sports/Captura de tela 2026-04-19 000712.png", alt: "Banner grandes marcas de tenis" },
    { image: "./assets/sports/Captura de tela 2026-04-19 000728.png", alt: "Banner monte sua academia" },
    { image: "./assets/sports/Captura de tela 2026-04-19 000749.png", alt: "Banner aventura ao ar livre" },
    { image: "./assets/sports/Captura de tela 2026-04-19 000805.png", alt: "Banner diversao garantida" }
];

const sportsQuickAccessTiles = [
    { title: "Bikes", image: "./assets/sports/Captura de tela 2026-04-19 000821.png" },
    { title: "Copos", image: "./assets/sports/Captura de tela 2026-04-19 000841.png" },
    { title: "Spinning", image: "./assets/sports/Captura de tela 2026-04-19 000855.png" },
    { title: "Patins", image: "./assets/sports/Captura de tela 2026-04-19 000907.png" },
    { title: "Barracas", image: "./assets/sports/Captura de tela 2026-04-19 000919.png" },
    { title: "Skates", image: "./assets/sports/Captura de tela 2026-04-19 000931.png" },
    { title: "Beach tennis", image: "./assets/sports/Captura de tela 2026-04-19 000942.png" },
    { title: "Esteiras", image: "./assets/sports/Captura de tela 2026-04-19 000955.png" },
    { title: "Relogios", image: "./assets/sports/Captura de tela 2026-04-19 001016.png" },
    { title: "Futebol", image: "./assets/sports/Captura de tela 2026-04-19 001028.png" }
];

const sportsLifestyleTiles = [
    { title: "Ciclismo", image: "./assets/sports/Captura de tela 2026-04-19 001040.png" },
    { title: "Fitness", image: "./assets/sports/Captura de tela 2026-04-19 001053.png" },
    { title: "Camping", image: "./assets/sports/Captura de tela 2026-04-19 001106.png" },
    { title: "Pesca", image: "./assets/sports/Captura de tela 2026-04-19 001120.png" },
    { title: "Cardiovasculares", image: "./assets/sports/Captura de tela 2026-04-19 001224.png" },
    { title: "Musculacao", image: "./assets/sports/Captura de tela 2026-04-19 001239.png" },
    { title: "Pilates & ioga", image: "./assets/sports/Captura de tela 2026-04-19 001252.png" },
    { title: "Artes marciais", image: "./assets/sports/Captura de tela 2026-04-19 001317.png" },
    { title: "Termicos", image: "./assets/sports/Captura de tela 2026-04-19 001340.png" },
    { title: "Barracas", image: "./assets/sports/Captura de tela 2026-04-19 001351.png" },
    { title: "Acessorios", image: "./assets/sports/Captura de tela 2026-04-19 001402.png" },
    { title: "Copos & garrafas", image: "./assets/sports/Captura de tela 2026-04-19 001502.png" }
];

const sportsShootingAssets = {
    banner: "./assets/sports/Captura de tela 2026-04-19 001516.png",
    tiles: [
        { title: "Carabinas e kits", image: "./assets/sports/Captura de tela 2026-04-19 001527.png" },
        { title: "Acessorios", image: "./assets/sports/Captura de tela 2026-04-19 001539.png" },
        { title: "Arcos e balestras", image: "./assets/sports/Captura de tela 2026-04-19 001551.png" }
    ]
};

const sportsActionAssets = {
    skateBanner: "./assets/sports/Captura de tela 2026-04-19 001712.png",
    footballBanner: "./assets/sports/Captura de tela 2026-04-19 001724.png",
    productTiles: [
        { title: "Bolas", image: "./assets/sports/Captura de tela 2026-04-19 001744.png" },
        { title: "Luvas", image: "./assets/sports/Captura de tela 2026-04-19 001806.png" },
        { title: "Caneleiras", image: "./assets/sports/Captura de tela 2026-04-19 001905.png" },
        { title: "Bolsas", image: "./assets/sports/Captura de tela 2026-04-19 001941.png" },
        { title: "Jaquetas", image: "./assets/sports/Captura de tela 2026-04-19 001953.png" },
        { title: "Chuteiras", image: "./assets/sports/Captura de tela 2026-04-19 002006.png" }
    ],
    promoBanners: [
        { title: "Fanzone", image: "./assets/sports/Captura de tela 2026-04-19 002016.png" },
        { title: "Treino Nike", image: "./assets/sports/Captura de tela 2026-04-19 002028.png" }
    ]
};

const appState = {
    cart: [],
    currentProdId: null,
    currentPayment: null,
    currentHeroSlide: 0,
    heroCarouselInterval: null,
    heroSlideCount: homeHeroSlides.length,
    currentCheckoutStep: "address",
    authMode: "register",
    authRegistration: {
        verificationRequested: false,
        email: ""
    },
    session: null,
    purchases: [],
    history: [],
    searchHistory: [],
    favorites: [],
    addresses: [],
    addressesLoadedFor: "",
    pendingCheckout: false,
    searchQuery: "",
    currentElectroSlide: 0,
    electroCarouselInterval: null,
    electroSlideCount: electrodomesticosHeroSlides.length,
    currentSportsSlide: 0,
    sportsCarouselInterval: null,
    sportsSlideCount: sportsFitnessHeroSlides.length,
    checkoutDraft: {
        paymentMethod: "pix"
    }
};

const legacyProductDetailMap = {
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

const productDetailMap = {
    1: {
        brand: "Inbox",
        breadcrumb: "Casa e Moveis > Sofas",
        sold: "+500 vendidos",
        rating: 4.7,
        reviews: 118,
        shippingText: "Entrega agendada e frete gratis na primeira compra",
        sellerName: "Loja oficial Inbox",
        sellerSales: "+5 mil",
        optionText: "12 produtos novos a partir de R$ 500",
        highlights: [
            "Sofa de 3 lugares com visual clean.",
            "Assento retratil para mais conforto.",
            "Encosto reclinavel para descanso.",
            "Acabamento liso na cor cinza.",
            "Ideal para salas compactas ou medias."
        ]
    },
    2: {
        brand: "Mondial",
        breadcrumb: "Eletrodomesticos > Fritadeiras",
        sold: "+3 mil vendidos",
        rating: 4.8,
        reviews: 624,
        shippingText: "Chegara rapido com envio full",
        sellerName: "Loja oficial Mondial",
        sellerSales: "+80 mil",
        optionText: "22 produtos novos a partir de R$ 790",
        highlights: [
            "Capacidade total de 12 litros.",
            "Funciona como fritadeira e forno.",
            "Ideal para receitas de maior volume.",
            "Design preto para cozinhas modernas.",
            "Versatil para assar, gratinar e aquecer."
        ]
    },
    3: {
        brand: "Hisense",
        breadcrumb: "Eletrodomesticos > Lava e Seca",
        sold: "+900 vendidos",
        rating: 4.8,
        reviews: 207,
        shippingText: "Entrega agendada com cobertura para grandes centros",
        sellerName: "Loja oficial Hisense",
        sellerSales: "+20 mil",
        optionText: "8 produtos novos a partir de R$ 3.299",
        highlights: [
            "Capacidade de 11 kg para lavar e secar.",
            "Acabamento titanium moderno.",
            "Recursos conectados para mais controle.",
            "Boa opcao para apartamentos e casas.",
            "Pensada para rotina de lavanderia completa."
        ]
    },
    4: {
        brand: "Consul",
        breadcrumb: "Eletrodomesticos > Maquinas de Lavar",
        sold: "+2 mil vendidos",
        rating: 4.7,
        reviews: 391,
        shippingText: "Chegara em poucos dias com frete gratis na campanha",
        sellerName: "Loja oficial Consul",
        sellerSales: "+100 mil",
        optionText: "15 produtos novos a partir de R$ 1.799",
        highlights: [
            "Capacidade de 9 kg para o uso diario.",
            "Dosagem economica para reduzir desperdicio.",
            "Ciclo edredom para pecas maiores.",
            "Visual branco classico.",
            "Boa relacao custo-beneficio."
        ]
    },
    5: {
        brand: "Acer",
        breadcrumb: "Tecnologia > Notebooks",
        sold: "+1 mil vendidos",
        rating: 4.8,
        reviews: 264,
        shippingText: "Receba com envio rapido e compra protegida",
        sellerName: "Loja oficial Acer",
        sellerSales: "+60 mil",
        optionText: "19 produtos novos a partir de R$ 5.099",
        highlights: [
            "Intel Core i3 de 12a geracao.",
            "8 GB de memoria RAM.",
            "SSD de 256 GB para inicializacao rapida.",
            "Tela de 15 polegadas para estudo e trabalho.",
            "Acabamento prateado discreto."
        ]
    },
    6: {
        brand: "Sony",
        breadcrumb: "Tecnologia > Games > Consoles",
        sold: "+4 mil vendidos",
        rating: 4.9,
        reviews: 1432,
        shippingText: "Entrega expressa para varias regioes",
        sellerName: "Loja oficial PlayStation",
        sellerSales: "+300 mil",
        optionText: "11 produtos novos a partir de R$ 3.500",
        highlights: [
            "Versao Slim com leitor de disco.",
            "Inclui Astro Bot e Gran Turismo 7.",
            "Console para jogos de nova geracao.",
            "Design branco com acabamento moderno.",
            "Excelente opcao para entretenimento."
        ]
    },
    7: {
        brand: "Apple",
        breadcrumb: "Tecnologia > Audio > Fones de Ouvido",
        sold: "+6 mil vendidos",
        rating: 4.9,
        reviews: 987,
        shippingText: "Chegara rapido com nota fiscal e garantia",
        sellerName: "Distribuidor autorizado Apple",
        sellerSales: "+250 mil",
        optionText: "16 produtos novos a partir de R$ 2.699",
        highlights: [
            "Audio sem fio com experiencia premium.",
            "Estojo de recarga incluso.",
            "Ideal para chamadas, musica e video.",
            "Integracao forte com ecossistema Apple.",
            "Produto vendido por distribuidor autorizado."
        ]
    },
    8: {
        brand: "Midea",
        breadcrumb: "Eletrodomesticos > Lava e Seca",
        sold: "+700 vendidos",
        rating: 4.8,
        reviews: 163,
        shippingText: "Entrega agendada com instalacao facilitada",
        sellerName: "Loja oficial Midea",
        sellerSales: "+40 mil",
        optionText: "9 produtos novos a partir de R$ 3.683",
        highlights: [
            "Capacidade de 10,5 kg para lavar e secar.",
            "Tecnologia Healthguard para mais cuidado.",
            "Acabamento titanium conectado.",
            "Boa opcao para rotina de lavanderia completa.",
            "Visual premium para ambientes modernos."
        ]
    },
    9: {
        brand: "Natuvent",
        breadcrumb: "Eletrodomesticos > Ventilacao > Ventiladores de Teto",
        sold: "+500 vendidos",
        rating: 4.7,
        reviews: 94,
        shippingText: "Receba com entrega full em regioes selecionadas",
        sellerName: "Loja oficial Natuvent",
        sellerSales: "+12 mil",
        optionText: "14 produtos novos a partir de R$ 1.289",
        highlights: [
            "Ventilador de teto com 4 pas em madeira freijo.",
            "Iluminacao LED integrada.",
            "Visual elegante para sala e quarto.",
            "Boa circulacao de ar com design decorativo.",
            "Ideal para projetos residenciais modernos."
        ]
    },
    10: {
        brand: "Suggar",
        breadcrumb: "Eletrodomesticos > Cozinha > Depuradores",
        sold: "+1 mil vendidos",
        rating: 4.7,
        reviews: 188,
        shippingText: "Chegara rapido com compra protegida",
        sellerName: "Loja oficial Suggar",
        sellerSales: "+70 mil",
        optionText: "17 produtos novos a partir de R$ 980",
        highlights: [
            "Modelo slim touch de 80 cm.",
            "Funciona como depurador e exaustor.",
            "Visual clean para cozinhas planejadas.",
            "Boa opcao para fogoes maiores.",
            "Painel touch com acabamento moderno."
        ]
    },
    11: {
        brand: "TCL",
        breadcrumb: "Eletrodomesticos > Ar e Ventilacao > Ar-condicionado",
        sold: "+2 mil vendidos",
        rating: 4.8,
        reviews: 276,
        shippingText: "Entrega agendada com cobertura para grandes centros",
        sellerName: "Loja oficial TCL",
        sellerSales: "+90 mil",
        optionText: "13 produtos novos a partir de R$ 2.999",
        highlights: [
            "Split inverter de 9.000 BTUs.",
            "Ciclo frio com gas R-32.",
            "Linha T-Pro 2.0 da TCL.",
            "Boa eficiencia energetica para uso diario.",
            "Ideal para ambientes compactos e medios."
        ]
    },
    12: {
        brand: "Brinovar",
        breadcrumb: "Esportes e Fitness > Skates e Patins > Hoverboards",
        sold: "+900 vendidos",
        rating: 4.7,
        reviews: 138,
        shippingText: "Chegara rapido com envio full",
        sellerName: "Loja oficial Brinovar",
        sellerSales: "+15 mil",
        optionText: "10 produtos novos a partir de R$ 996",
        highlights: [
            "Hoverboard com rodas de 6,5 polegadas.",
            "Iluminacao LED integrada.",
            "Bluetooth para trilha sonora no passeio.",
            "Acabamento roxo galaxia.",
            "Boa opcao para lazer e diversao."
        ]
    },
    13: {
        brand: "Paracord",
        breadcrumb: "Esportes e Fitness > Termicos > Acessorios",
        sold: "+4 mil vendidos",
        rating: 4.8,
        reviews: 412,
        shippingText: "Receba com compra protegida e frete rapido",
        sellerName: "Loja parceira Mercado Livre",
        sellerSales: "+40 mil",
        optionText: "24 produtos novos a partir de R$ 31",
        highlights: [
            "Alca paracord para transporte facil.",
            "Compatível com diversos modelos de garrafa.",
            "Ideal para rotina esportiva e trilhas.",
            "Leve, resistente e facil de prender.",
            "Boa opcao para copos e termicos grandes."
        ]
    },
    14: {
        brand: "Adidas",
        breadcrumb: "Esportes e Fitness > Futebol > Bolas",
        sold: "+2 mil vendidos",
        rating: 4.9,
        reviews: 286,
        shippingText: "Chegara com envio full para regioes selecionadas",
        sellerName: "Loja oficial Adidas",
        sellerSales: "+120 mil",
        optionText: "14 produtos novos a partir de R$ 299",
        highlights: [
            "Visual inspirado na Copa do Mundo FIFA 2026.",
            "Modelo league tamanho 5.",
            "Boa para treinos e partidas recreativas.",
            "Acabamento com identidade Adidas.",
            "Excelente opcao para colecao e uso."
        ]
    },
    15: {
        brand: "VikingX",
        breadcrumb: "Esportes e Fitness > Ciclismo > Bicicletas",
        sold: "+1 mil vendidos",
        rating: 4.7,
        reviews: 173,
        shippingText: "Entrega agendada com cobertura em varias cidades",
        sellerName: "Loja oficial VikingX",
        sellerSales: "+18 mil",
        optionText: "11 produtos novos a partir de R$ 1.399",
        highlights: [
            "Bicicleta aro 26 com 21 velocidades.",
            "Freios a disco para mais controle.",
            "Quadro 13.5 em acabamento vermelho.",
            "Boa para passeios e trilhas leves.",
            "Conjunto versatil para iniciantes."
        ]
    },
    16: {
        brand: "Astur",
        breadcrumb: "Esportes e Fitness > Ciclismo > Bicicletas Eletricas",
        sold: "+300 vendidos",
        rating: 4.8,
        reviews: 59,
        shippingText: "Entrega programada com compra protegida",
        sellerName: "Loja oficial Astur",
        sellerSales: "+6 mil",
        optionText: "7 produtos novos a partir de R$ 7.499",
        highlights: [
            "Motor de 800W com acelerador.",
            "Aro 24 e suspensao para mais conforto.",
            "Ideal para deslocamentos e lazer.",
            "Acabamento preto moderno.",
            "Boa autonomia para uso urbano."
        ]
    },
    17: {
        brand: "Odin Fit",
        breadcrumb: "Esportes e Fitness > Fitness > Bikes de Spinning",
        sold: "+700 vendidos",
        rating: 4.8,
        reviews: 145,
        shippingText: "Receba com envio rapido e garantia",
        sellerName: "Loja oficial Odin Fit",
        sellerSales: "+22 mil",
        optionText: "9 produtos novos a partir de R$ 2.299",
        highlights: [
            "Bike de spinning mecanica.",
            "Roda de inercia de 8 kg.",
            "Boa opcao para cardio em casa.",
            "Estrutura em preto e vermelho.",
            "Pensada para treinos regulares."
        ]
    },
    18: {
        brand: "WCT Fitness",
        breadcrumb: "Esportes e Fitness > Musculacao > Halteres",
        sold: "+3 mil vendidos",
        rating: 4.8,
        reviews: 521,
        shippingText: "Chegara rapido com envio full",
        sellerName: "Loja oficial WCT Fitness",
        sellerSales: "+55 mil",
        optionText: "16 produtos novos a partir de R$ 1.649",
        highlights: [
            "Kit 6 em 1 com diversas montagens.",
            "Ajustavel ate 40 kg.",
            "Pode virar halter, kettlebell e anilhas.",
            "Acompanha e-book.",
            "Boa opcao para home gym."
        ]
    },
    19: {
        brand: "WCT Fitness",
        breadcrumb: "Esportes e Fitness > Musculacao > Estacoes",
        sold: "+400 vendidos",
        rating: 4.7,
        reviews: 71,
        shippingText: "Entrega agendada com compra protegida",
        sellerName: "Loja oficial WCT Fitness",
        sellerSales: "+55 mil",
        optionText: "8 produtos novos a partir de R$ 2.977",
        highlights: [
            "Mono cross over para parede.",
            "Estrutura ideal para home gym.",
            "Boa variedade de exercicios com polia.",
            "Acabamento robusto para treino intenso.",
            "Pensado para musculacao funcional."
        ]
    },
    20: {
        brand: "Dream Fitness",
        breadcrumb: "Esportes e Fitness > Fitness > Esteiras",
        sold: "+900 vendidos",
        rating: 4.7,
        reviews: 164,
        shippingText: "Chegara com envio rapido para varias regioes",
        sellerName: "Loja oficial Dream Fitness",
        sellerSales: "+34 mil",
        optionText: "13 produtos novos a partir de R$ 3.082",
        highlights: [
            "Esteira eletrica para caminhadas e corridas leves.",
            "Linha Concept 2.1 em preto e verde.",
            "Boa opcao para treinar em casa.",
            "Design compacto para ambiente interno.",
            "Pratica para manter a rotina ativa."
        ]
    },
    21: {
        brand: "CBC",
        breadcrumb: "Esportes e Fitness > Tiro Esportivo > Carabinas",
        sold: "+1 mil vendidos",
        rating: 4.8,
        reviews: 204,
        shippingText: "Entrega com compra protegida em canais autorizados",
        sellerName: "Loja parceira CBC",
        sellerSales: "+12 mil",
        optionText: "9 produtos novos a partir de R$ 1.199",
        highlights: [
            "Modelo New Jade calibre 5.5.",
            "Acompanha super combo.",
            "Indicada para pratica esportiva.",
            "Boa opcao para iniciantes e entusiastas.",
            "Kit completo para uso recreativo."
        ]
    },
    22: {
        brand: "CBC",
        breadcrumb: "Esportes e Fitness > Tiro Esportivo > Carabinas",
        sold: "+800 vendidos",
        rating: 4.8,
        reviews: 151,
        shippingText: "Receba com envio rapido e compra protegida",
        sellerName: "Loja parceira CBC",
        sellerSales: "+12 mil",
        optionText: "11 produtos novos a partir de R$ 959",
        highlights: [
            "Carabina Jade 5.5 na cor preta.",
            "Acompanha capa e chumbo.",
            "Kit pensado para tiro esportivo.",
            "Boa relacao custo-beneficio para o segmento.",
            "Entrega em vendedores autorizados."
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
    localStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(appState.searchHistory));
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(appState.favorites));
}

function loadState() {
    appState.session = safeParse(STORAGE_KEYS.session, null);
    appState.purchases = safeParse(STORAGE_KEYS.purchases, []);
    appState.history = safeParse(STORAGE_KEYS.history, []);
    appState.searchHistory = safeParse(STORAGE_KEYS.searchHistory, []);
    appState.favorites = safeParse(STORAGE_KEYS.favorites, []);
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

function findProductsByQuery(rawQuery = "") {
    const query = normalizeSearchText(rawQuery);
    if (!query) return [];

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

function getSearchSuggestions(rawQuery = "", limit = 6) {
    return findProductsByQuery(rawQuery).slice(0, limit);
}

function getProductById(productId) {
    return products.find((product) => product.id === productId) || null;
}

function isFavorite(productId) {
    return appState.favorites.some((entry) => entry.id === productId);
}

function getFavoriteProducts() {
    return appState.favorites
        .map((entry) => getProductById(entry.id))
        .filter(Boolean);
}

function getInspiredProducts(limit = 6) {
    const lastViewed = getProductById(appState.history[0]?.id);
    if (!lastViewed) return [];

    const sameCategory = products.filter((product) => product.id !== lastViewed.id && product.category === lastViewed.category);
    const fallback = products.filter((product) => product.id !== lastViewed.id && product.category !== lastViewed.category);
    return [...sameCategory, ...fallback].slice(0, limit);
}

function renderInspiredProductCard(product) {
    const currentPrice = getEffectivePrice(product);
    const discount = getDiscountPercentage(product);
    return `
        <article class="related-card min-w-[220px] max-w-[220px] rounded-2xl bg-white p-4 cursor-pointer" onclick="openDetails(${product.id}, this)">
            <div class="h-40 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                <img src="${product.image}" alt="${product.title}" class="max-h-full object-contain p-2" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
            </div>
            <div class="pt-4">
                <h3 class="text-[14px] text-gray-700 line-clamp-2 min-h-[42px]">${product.title}</h3>
                <p class="text-sm text-gray-400 line-through mt-3">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div class="flex items-baseline gap-2 mt-1 flex-wrap">
                    <p class="text-[28px] leading-none font-light text-gray-900">${formatCurrency(currentPrice)}</p>
                    <p class="text-sm font-bold text-green-600">${discount}% OFF</p>
                </div>
                <p class="text-[11px] text-green-600 font-bold mt-2">Frete gratis</p>
            </div>
        </article>
    `;
}

function renderInspiredSection() {
    const section = document.getElementById("inspired-section");
    const list = document.getElementById("inspired-products-list");
    const title = document.getElementById("inspired-last-title");
    const dots = document.getElementById("inspired-section-dots");
    const lastViewed = getProductById(appState.history[0]?.id);
    const inspired = getInspiredProducts();
    if (!section || !list || !title || !dots) return;

    if (!lastViewed || !inspired.length) {
        section.classList.add("hidden");
        list.innerHTML = "";
        return;
    }

    title.innerText = "Inspirado no ultimo visto";
    dots.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-current"></span><span class="w-1.5 h-1.5 rounded-full bg-current"></span><span class="w-1.5 h-1.5 rounded-full bg-current"></span><span class="w-1.5 h-1.5 rounded-full bg-current"></span>';
    list.innerHTML = inspired.map(renderInspiredProductCard).join("");
    section.classList.remove("hidden");
}

function renderFavoritesMenu() {
    const countDesktop = document.getElementById("favorites-count");
    const countMobile = document.getElementById("mobile-favorites-count");
    const list = document.getElementById("favorites-menu-list");
    const empty = document.getElementById("favorites-menu-empty");
    const favorites = getFavoriteProducts();

    if (countDesktop) {
        countDesktop.innerText = String(favorites.length);
        countDesktop.classList.toggle("hidden", favorites.length === 0);
    }
    if (countMobile) {
        countMobile.innerText = String(favorites.length);
        countMobile.classList.toggle("hidden", favorites.length === 0);
    }
    if (!list || !empty) return;

    if (!favorites.length) {
        list.innerHTML = "";
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");
    list.innerHTML = favorites.map((product) => `
        <button class="desktop-account-menu-link gap-3 items-start" onclick="openDetails(${product.id}); closeFavoritesMenu();">
            <img src="${product.image}" alt="${product.title}" class="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-100 p-1" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png'">
            <span class="min-w-0 flex-1 text-left">
                <span class="block text-sm text-gray-800 truncate">${product.title}</span>
                <span class="block text-xs text-green-600 font-semibold mt-1">${formatCurrency(getEffectivePrice(product))}</span>
            </span>
        </button>
    `).join("");
}

function closeFavoritesMenu() {
    document.getElementById("favorites-menu")?.classList.remove("is-open");
}

function toggleFavoritesMenu(event) {
    event?.stopPropagation();
    const menu = document.getElementById("favorites-menu");
    if (!menu) return;
    const willOpen = !menu.classList.contains("is-open");
    closeFavoritesMenu();
    closeDesktopAccountMenu();
    if (willOpen) menu.classList.add("is-open");
}

function updateFavoriteButton(productId) {
    const button = document.getElementById("det-favorite-btn");
    const icon = document.getElementById("det-favorite-icon");
    if (!button || !icon) return;

    const active = isFavorite(productId);
    button.classList.toggle("text-blue-600", !active);
    button.classList.toggle("text-pink-500", active);
    icon.classList.toggle("fill-current", active);
}

function toggleFavorite(productId) {
    if (!productId) return;
    if (isFavorite(productId)) {
        appState.favorites = appState.favorites.filter((entry) => entry.id !== productId);
    } else {
        appState.favorites = [
            { id: productId, savedAt: new Date().toISOString() },
            ...appState.favorites.filter((entry) => entry.id !== productId)
        ].slice(0, 40);
    }
    persistState();
    renderFavoritesMenu();
    updateFavoriteButton(productId);
}

function renderHomeShortcutCard(card) {
    const imageMarkup = card.product
        ? `
            <div class="h-28 flex items-center justify-center overflow-hidden rounded-xl bg-[#f8fafc]">
                <img src="${card.product.image}" alt="${card.product.title}" class="max-h-full object-contain p-2" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-4')">
            </div>
        `
        : `
            <div class="h-28 flex items-center justify-center overflow-hidden rounded-xl bg-[#f8fafc]">
                <i data-lucide="${card.icon || "wallet"}" class="w-14 h-14 text-[#333]"></i>
            </div>
        `;

    const priceMarkup = card.product
        ? `
            <p class="text-[12px] text-gray-400 mt-2 line-through">R$ ${card.product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div class="flex items-baseline gap-2 mt-1 flex-wrap">
                <p class="text-[18px] leading-none font-normal text-gray-900">${formatCurrency(getEffectivePrice(card.product))}</p>
                <p class="text-[11px] font-bold text-green-600">${getDiscountPercentage(card.product)}% OFF</p>
            </div>
            <p class="text-[12px] text-green-600 font-semibold mt-2">Frete gratis <span class="font-bold">FULL</span></p>
        `
        : `<p class="text-[14px] text-[#666] leading-5 mt-3">${card.description}</p>`;

    return `
        <div class="shortcut-card p-4 md:p-5 flex flex-col gap-3 hover:-translate-y-1 transition-transform">
            <h3 class="text-[16px] font-semibold text-[#333]">${card.title}</h3>
            ${imageMarkup}
            <div class="flex flex-col min-h-[128px]">
                <p class="text-[14px] text-[#666] leading-5 line-clamp-3 min-h-[60px]">${card.copy}</p>
                ${priceMarkup}
                <button class="shortcut-cta rounded-md py-2 text-[13px] font-semibold mt-auto" onclick="${card.action}">${card.cta}</button>
            </div>
        </div>
    `;
}

function renderHomeShortcuts() {
    const container = document.getElementById("home-shortcuts-grid");
    if (!container) return;

    const recentProduct = getProductById(appState.history[0]?.id);
    const interestProduct = recentProduct
        ? products.find((product) => product.id !== recentProduct.id && product.category === recentProduct.category) || products.find((product) => product.id !== recentProduct.id)
        : products[0];
    const cartProduct = getProductById(appState.cart[0]?.id);
    const latestSearch = appState.searchHistory[0]?.query || "";
    const searchProduct = latestSearch ? findProductsByQuery(latestSearch)[0] || null : null;
    const checkoutProduct = getProductById(appState.cart[appState.cart.length - 1]?.id) || recentProduct;

    const cards = [
        recentProduct
            ? {
                title: "Visto recentemente",
                copy: recentProduct.title,
                product: recentProduct,
                cta: "Ver produto",
                action: `openDetails(${recentProduct.id})`
            }
            : {
                title: "Visto recentemente",
                copy: "Quando voce navegar pelos produtos, eles vao aparecer aqui.",
                icon: "history",
                description: "Seu historico recente fica salvo nesta area.",
                cta: "Explorar produtos",
                action: "navigateToSection('offers')"
            },
        interestProduct
            ? {
                title: "Tambem te interessa",
                copy: interestProduct.title,
                product: interestProduct,
                cta: "Ver oferta",
                action: `openDetails(${interestProduct.id})`
            }
            : null,
        cartProduct
            ? {
                title: "Compre seu carrinho",
                copy: `${cartProduct.title}${appState.cart.length > 1 ? ` e mais ${appState.cart.length - 1} item(ns)` : ""}`,
                product: cartProduct,
                cta: "Ir para o carrinho",
                action: "openCartPage()"
            }
            : {
                title: "Compre seu carrinho",
                copy: "Adicione produtos ao carrinho para continuar daqui com um clique.",
                icon: "shopping-cart",
                description: "Seu carrinho vazio aparece aqui quando voce escolher itens.",
                cta: "Ver ofertas",
                action: "navigateToSection('offers')"
            },
        searchProduct
            ? {
                title: "Sua busca",
                copy: `Busca recente: "${latestSearch}"`,
                product: searchProduct,
                cta: "Repetir busca",
                action: `applySearchQuery('${latestSearch.replace(/'/g, "\\'")}')`
            }
            : {
                title: "Sua busca",
                copy: "As pesquisas mais recentes aparecem aqui para voce retomar depois.",
                icon: "search",
                description: "Busque por um produto para alimentar esta recomendacao.",
                cta: "Buscar produtos",
                action: "document.getElementById('desktop-search-input')?.focus()"
            },
        checkoutProduct
            ? {
                title: "Conclua sua compra",
                copy: appState.cart.length ? `Finalize agora ${checkoutProduct.title}` : `Continue vendo ${checkoutProduct.title}`,
                product: checkoutProduct,
                cta: appState.cart.length ? "Concluir compra" : "Ver produto",
                action: appState.cart.length ? "startCheckoutFlow()" : `openDetails(${checkoutProduct.id})`
            }
            : null,
        {
            title: "Meios de pagamento",
            copy: "Pague suas compras com rapidez e seguranca.",
            icon: "wallet",
            description: "Pix, cartao e outras opcoes sempre disponiveis.",
            cta: "Mostrar meios",
            action: "navigateToSection('coupons')"
        }
    ].filter(Boolean);

    container.innerHTML = cards.map(renderHomeShortcutCard).join("");
    lucide.createIcons();
}

function renderHeroCarousel() {
    const track = document.getElementById("hero-carousel-track");
    const dotsWrap = document.getElementById("hero-carousel-dots");
    const slides = homeHeroSlides;
    if (!track || !dotsWrap) return;

    track.innerHTML = slides.map((slide) => `
        <div class="min-w-full h-full">
            <img src="${slide.image}" class="w-full h-full object-cover" alt="${slide.alt}">
        </div>
    `).join("");

    dotsWrap.innerHTML = slides.map((slide, index) => `
        <button class="hero-dot ${index === 0 ? "active" : ""}" onclick="setHeroSlide(${index})" aria-label="${slide.alt}"></button>
    `).join("");

    appState.currentHeroSlide = 0;
    appState.heroSlideCount = slides.length || 1;
    updateHeroCarousel();
    startHeroCarousel();
}

function renderProducts() {
    const list = document.getElementById("products-list");
    const featured = document.getElementById("featured-offer");
    const mobileList = document.getElementById("mobile-products-list");
    const searchSection = document.getElementById("search-results-section");
    const searchTitle = document.getElementById("search-results-title");
    const searchList = document.getElementById("search-results-list");
    const filteredProducts = getFilteredProducts();
    const featuredProduct = filteredProducts[0] || null;
    const desktopProducts = filteredProducts.slice(featuredProduct ? 1 : 0, featuredProduct ? 7 : 6);
    const mobileProducts = filteredProducts.slice(0, 6);

    if (searchSection && searchTitle && searchList) {
        if (appState.searchQuery.trim()) {
            searchTitle.innerText = `Resultados para "${appState.searchQuery.trim()}"`;
            searchList.innerHTML = filteredProducts.length
                ? filteredProducts.map(renderProductCard).join("")
                : '<div class="col-span-full px-4 py-10 text-center text-gray-500">Nenhum produto encontrado para essa busca.</div>';
            searchSection.classList.remove("hidden");
        } else {
            searchSection.classList.add("hidden");
            searchList.innerHTML = "";
        }
    }

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

    renderHomeShortcuts();
    renderInspiredSection();
}

function syncSearchInputs() {
    const desktopInput = document.getElementById("desktop-search-input");
    const mobileInput = document.getElementById("mobile-search-input");
    if (desktopInput && desktopInput.value !== appState.searchQuery) desktopInput.value = appState.searchQuery;
    if (mobileInput && mobileInput.value !== appState.searchQuery) mobileInput.value = appState.searchQuery;
}

function closeSearchSuggestions() {
    ["desktop-search-suggestions", "mobile-search-suggestions"].forEach((id) => {
        const element = document.getElementById(id);
        if (!element || element.classList.contains("hidden")) return;
        element.classList.remove("is-open");
        window.setTimeout(() => {
            if (!element.classList.contains("is-open")) {
                element.classList.add("hidden");
            }
        }, 220);
    });
}

function commitSearchHistory(rawValue = "") {
    const value = (rawValue || "").trim();
    const normalized = normalizeSearchText(value);
    if (!normalized) return;
    appState.searchHistory = [
        { query: value, at: new Date().toISOString() },
        ...appState.searchHistory.filter((entry) => normalizeSearchText(entry.query) !== normalized)
    ].slice(0, 8);
    persistState();
}

function renderSearchSuggestions() {
    const query = appState.searchQuery.trim();
    const suggestions = getSearchSuggestions(query);
    const containers = [
        document.getElementById("desktop-search-suggestions"),
        document.getElementById("mobile-search-suggestions")
    ];

    containers.forEach((container) => {
        if (!container) return;
        if (!query) {
            container.innerHTML = "";
            container.classList.add("hidden");
            return;
        }

        if (!suggestions.length) {
            container.innerHTML = '<div class="search-suggestion-empty">Nenhum produto encontrado.</div>';
            container.classList.remove("hidden");
            window.requestAnimationFrame(() => container.classList.add("is-open"));
            return;
        }

        container.innerHTML = suggestions.map((product, index) => `
            <button class="search-suggestion-item" style="animation-delay:${index * 40}ms" onclick="openSearchSuggestion(${product.id})">
                <span class="search-suggestion-icon" aria-hidden="true">⌕</span>
                <span class="min-w-0">
                    <span class="block text-[14px] font-normal text-[#333] leading-5 truncate">${product.title}</span>
                </span>
            </button>
        `).join("");
        container.classList.remove("hidden");
        window.requestAnimationFrame(() => container.classList.add("is-open"));
    });
}

function applySearchQuery(rawValue = "") {
    appState.searchQuery = rawValue.trimStart();
    commitSearchHistory(appState.searchQuery);
    syncSearchInputs();
    closeSearchSuggestions();
    renderProducts();
    showPage("home", null, { updateHistory: false, skipAnimation: true });
    if (appState.searchQuery.trim()) {
        window.setTimeout(() => {
            const section = document.getElementById("search-results-section");
            if (!section) return;
            const top = section.getBoundingClientRect().top + window.scrollY - 110;
            window.scrollTo({ top, behavior: "smooth" });
        }, 90);
    }
}

function previewSearchQuery(rawValue = "") {
    appState.searchQuery = rawValue.trimStart();
    syncSearchInputs();
    renderSearchSuggestions();
}

function openSearchSuggestion(productId) {
    const product = getProductById(productId);
    if (!product) return;
    commitSearchHistory(appState.searchQuery || product.title);
    closeSearchSuggestions();
    openDetails(productId);
}

function bindSearchInputs() {
    ["desktop-search-input", "mobile-search-input"].forEach((id) => {
        const input = document.getElementById(id);
        if (!input || input.dataset.bound === "true") return;

        input.addEventListener("input", (event) => {
            previewSearchQuery(event.target.value || "");
        });

        input.addEventListener("focus", (event) => {
            previewSearchQuery(event.target.value || "");
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeSearchSuggestions();
                return;
            }
            if (event.key !== "Enter") return;
            event.preventDefault();
            const firstMatch = getSearchSuggestions(event.target.value || "", 1)[0];
            if (firstMatch) {
                openSearchSuggestion(firstMatch.id);
                return;
            }
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
    renderHeroCarousel();
}

function getElectrodomesticosProducts() {
    return products.filter((product) => product.category === "eletrodomesticos");
}

function getSportsFitnessProducts() {
    return products.filter((product) => product.category === "esportes-fitness");
}

function renderElectroProductCard(product) {
    const currentPrice = getEffectivePrice(product);
    const discount = getDiscountPercentage(product);
    const installmentValue = Number((currentPrice / 10).toFixed(2));
    return `
        <div class="bg-white rounded-[6px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.08)] cursor-pointer border border-[#eee]" onclick="openDetails(${product.id}, this)">
            <div class="h-[220px] bg-white flex items-center justify-center p-4 border-b border-[#f3f3f3]">
                <img src="${product.image}" alt="${product.title}" class="max-h-full object-contain" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-4')">
            </div>
            <div class="p-3">
                <span class="inline-flex items-center rounded-[3px] bg-[#3483fa] px-2 py-0.5 text-[10px] font-semibold text-white">OFERTA IMPERDIVEL</span>
                <h3 class="mt-3 text-[14px] leading-5 text-[#333] line-clamp-3 min-h-[60px]">${product.title}</h3>
                <p class="mt-2 text-[12px] text-[#999] line-through">R$ ${product.oldPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div class="mt-1 flex items-baseline gap-2 flex-wrap">
                    <p class="text-[18px] leading-none text-[#333]">${formatCurrency(currentPrice)}</p>
                    <span class="text-[12px] font-semibold text-[#00a650]">${discount}% OFF</span>
                </div>
                <p class="mt-2 text-[13px] leading-5 text-[#00a650]">10x R$ ${installmentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sem juros</p>
                <p class="mt-2 text-[13px] font-semibold text-[#00a650]">Frete gratis <span class="font-bold">FULL</span></p>
            </div>
        </div>
    `;
}

function renderElectroPromoTile(imageUrl) {
    return `
        <div class="rounded-[10px] overflow-hidden bg-[#f6f1e7] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <img src="${imageUrl}" alt="Destaque de categoria" class="block w-full h-auto" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-8','bg-white')">
        </div>
    `;
}

function renderSportsQuickAccessCard(tile) {
    return `
        <button class="rounded-[22px] bg-white border border-[#e5e7eb] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.07)] text-left hover:-translate-y-1 transition-transform" onclick="showPage('esportes-fitness')">
            <div class="aspect-square rounded-[18px] bg-[#f7ffe9] overflow-hidden flex items-center justify-center">
                <img src="${tile.image}" alt="${tile.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-6','bg-white')">
            </div>
            <p class="mt-3 text-[14px] md:text-[15px] font-semibold text-[#1f2937]">${tile.title}</p>
        </button>
    `;
}

function renderSportsLifestyleCard(tile) {
    return `
        <button class="rounded-[24px] overflow-hidden bg-white border border-[#e5e7eb] shadow-[0_12px_34px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-transform text-left" onclick="showPage('esportes-fitness')">
            <img src="${tile.image}" alt="${tile.title}" class="block w-full h-auto" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-8','bg-white')">
        </button>
    `;
}

function renderSportsDarkTile(tile) {
    return `
        <button class="rounded-[24px] overflow-hidden bg-[#242424] border border-white/10 shadow-[0_18px_40px_rgba(15,23,42,0.18)] hover:-translate-y-1 transition-transform text-left" onclick="showPage('esportes-fitness')">
            <img src="${tile.image}" alt="${tile.title}" class="block w-full h-auto" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-8','bg-white')">
        </button>
    `;
}

function updateElectroCarousel() {
    const track = document.getElementById("electro-carousel-track");
    const dots = document.querySelectorAll("#electro-carousel-dots .hero-dot");
    if (track) track.style.transform = `translateX(-${appState.currentElectroSlide * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle("active", index === appState.currentElectroSlide));
}

function stopElectroCarousel() {
    if (appState.electroCarouselInterval) {
        window.clearInterval(appState.electroCarouselInterval);
        appState.electroCarouselInterval = null;
    }
}

function startElectroCarousel() {
    stopElectroCarousel();
    appState.electroCarouselInterval = window.setInterval(() => {
        appState.currentElectroSlide = (appState.currentElectroSlide + 1) % appState.electroSlideCount;
        updateElectroCarousel();
    }, 4800);
}

function setElectroSlide(index) {
    appState.currentElectroSlide = ((index % appState.electroSlideCount) + appState.electroSlideCount) % appState.electroSlideCount;
    updateElectroCarousel();
    startElectroCarousel();
}

function moveElectroSlide(direction) {
    setElectroSlide(appState.currentElectroSlide + direction);
}

function renderElectrodomesticosPage() {
    const track = document.getElementById("electro-carousel-track");
    const dotsWrap = document.getElementById("electro-carousel-dots");
    const list = document.getElementById("electro-products-list");
    const promoGrid = document.getElementById("electro-promo-grid");
    if (!track || !dotsWrap || !list || !promoGrid) return;

    track.innerHTML = electrodomesticosHeroSlides.map((slide) => `
        <div class="min-w-full h-full">
            <img src="${slide.image}" class="block w-full h-auto md:h-full md:object-cover" alt="${slide.alt}">
        </div>
    `).join("");

    dotsWrap.innerHTML = electrodomesticosHeroSlides.map((slide, index) => `
        <button class="hero-dot ${index === 0 ? "active" : ""}" onclick="setElectroSlide(${index})" aria-label="${slide.alt}"></button>
    `).join("");

    list.innerHTML = getElectrodomesticosProducts().map(renderElectroProductCard).join("");
    promoGrid.innerHTML = electroPromoTiles.map(renderElectroPromoTile).join("");
    appState.currentElectroSlide = 0;
    appState.electroSlideCount = electrodomesticosHeroSlides.length;
    updateElectroCarousel();
    startElectroCarousel();

    const hero = document.getElementById("electro-carousel");
    if (hero && !hero.dataset.touchBound) {
        let startX = 0;
        let endX = 0;
        hero.addEventListener("touchstart", (event) => {
            startX = event.changedTouches[0]?.clientX || 0;
            endX = startX;
            stopElectroCarousel();
        }, { passive: true });
        hero.addEventListener("touchmove", (event) => {
            endX = event.changedTouches[0]?.clientX || startX;
        }, { passive: true });
        hero.addEventListener("touchend", () => {
            const delta = endX - startX;
            if (Math.abs(delta) > 40) {
                moveElectroSlide(delta < 0 ? 1 : -1);
                return;
            }
            startElectroCarousel();
        }, { passive: true });
        hero.dataset.touchBound = "true";
    }
}

function updateSportsCarousel() {
    const track = document.getElementById("sports-carousel-track");
    const dots = document.querySelectorAll("#sports-carousel-dots .hero-dot");
    if (track) track.style.transform = `translateX(-${appState.currentSportsSlide * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle("active", index === appState.currentSportsSlide));
}

function stopSportsCarousel() {
    if (appState.sportsCarouselInterval) {
        window.clearInterval(appState.sportsCarouselInterval);
        appState.sportsCarouselInterval = null;
    }
}

function startSportsCarousel() {
    stopSportsCarousel();
    appState.sportsCarouselInterval = window.setInterval(() => {
        appState.currentSportsSlide = (appState.currentSportsSlide + 1) % appState.sportsSlideCount;
        updateSportsCarousel();
    }, 5000);
}

function setSportsSlide(index) {
    appState.currentSportsSlide = ((index % appState.sportsSlideCount) + appState.sportsSlideCount) % appState.sportsSlideCount;
    updateSportsCarousel();
    startSportsCarousel();
}

function moveSportsSlide(direction) {
    setSportsSlide(appState.currentSportsSlide + direction);
}

function renderSportsFitnessPage() {
    const track = document.getElementById("sports-carousel-track");
    const dotsWrap = document.getElementById("sports-carousel-dots");
    const productsList = document.getElementById("sports-products-list");
    const quickGrid = document.getElementById("sports-quick-grid");
    const lifestyleGrid = document.getElementById("sports-lifestyle-grid");
    const shootingBanner = document.getElementById("sports-shooting-banner");
    const shootingGrid = document.getElementById("sports-shooting-grid");
    const skateBanner = document.getElementById("sports-skate-banner");
    const footballBanner = document.getElementById("sports-football-banner");
    const footballGrid = document.getElementById("sports-football-grid");
    const actionPromos = document.getElementById("sports-action-promos");

    if (!track || !dotsWrap || !productsList || !quickGrid || !lifestyleGrid || !shootingBanner || !shootingGrid || !skateBanner || !footballBanner || !footballGrid || !actionPromos) return;

    track.innerHTML = sportsFitnessHeroSlides.map((slide) => `
        <div class="min-w-full h-full">
            <img src="${slide.image}" class="block w-full h-auto md:h-full md:object-cover" alt="${slide.alt}">
        </div>
    `).join("");

    dotsWrap.innerHTML = sportsFitnessHeroSlides.map((slide, index) => `
        <button class="hero-dot ${index === 0 ? "active" : ""}" onclick="setSportsSlide(${index})" aria-label="${slide.alt}"></button>
    `).join("");

    productsList.innerHTML = getSportsFitnessProducts().map(renderElectroProductCard).join("");
    quickGrid.innerHTML = sportsQuickAccessTiles.map(renderSportsQuickAccessCard).join("");
    lifestyleGrid.innerHTML = sportsLifestyleTiles.map(renderSportsLifestyleCard).join("");
    shootingBanner.innerHTML = `<img src="${sportsShootingAssets.banner}" alt="Tiro esportivo" class="block w-full h-auto rounded-[24px]" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-8','bg-white')">`;
    shootingGrid.innerHTML = sportsShootingAssets.tiles.map(renderSportsDarkTile).join("");
    skateBanner.innerHTML = `<img src="${sportsActionAssets.skateBanner}" alt="Skates e patins" class="block w-full h-auto rounded-[24px]" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-8','bg-white')">`;
    footballBanner.innerHTML = `<img src="${sportsActionAssets.footballBanner}" alt="Futebol" class="block w-full h-auto rounded-[24px]" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-8','bg-white')">`;
    footballGrid.innerHTML = sportsActionAssets.productTiles.map(renderSportsQuickAccessCard).join("");
    actionPromos.innerHTML = sportsActionAssets.promoBanners.map((tile) => `
        <button class="rounded-[24px] overflow-hidden bg-white border border-[#e5e7eb] shadow-[0_12px_34px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-transform text-left" onclick="showPage('esportes-fitness')">
            <img src="${tile.image}" alt="${tile.title}" class="block w-full h-auto" onerror="this.onerror=null;this.src='assets/mercado-livre-logo.png';this.classList.add('p-8','bg-white')">
        </button>
    `).join("");

    appState.currentSportsSlide = 0;
    appState.sportsSlideCount = sportsFitnessHeroSlides.length;
    updateSportsCarousel();
    startSportsCarousel();

    const hero = document.getElementById("sports-carousel");
    if (hero && !hero.dataset.touchBound) {
        let startX = 0;
        let endX = 0;
        hero.addEventListener("touchstart", (event) => {
            startX = event.changedTouches[0]?.clientX || 0;
            endX = startX;
            stopSportsCarousel();
        }, { passive: true });
        hero.addEventListener("touchmove", (event) => {
            endX = event.changedTouches[0]?.clientX || startX;
        }, { passive: true });
        hero.addEventListener("touchend", () => {
            const delta = endX - startX;
            if (Math.abs(delta) > 40) {
                moveSportsSlide(delta < 0 ? 1 : -1);
                return;
            }
            startSportsCarousel();
        }, { passive: true });
        hero.dataset.touchBound = "true";
    }
}

function setActiveNav(triggerEl) {
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("is-active"));
    if (triggerEl?.classList?.contains("nav-link")) triggerEl.classList.add("is-active");
}

function closeCategoriesMenu() {
    document.getElementById("categories-dropdown")?.classList.add("hidden");
}

function getVisiblePageId() {
    const pageMap = ["home", "electrodomesticos", "esportes-fitness", "auth", "purchases", "orders", "history", "addresses", "details", "cart", "cart-loading"];
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
        electrodomesticos: document.getElementById("page-electrodomesticos"),
        "esportes-fitness": document.getElementById("page-esportes-fitness"),
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
    if (pageId !== "electrodomesticos") stopElectroCarousel();
    if (pageId !== "esportes-fitness") stopSportsCarousel();
    setActiveNav(triggerEl);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "auto";
    if (pageId === "electrodomesticos") renderElectrodomesticosPage();
    if (pageId === "esportes-fitness") renderSportsFitnessPage();
    if (pageId === "purchases") renderAccountArea();
    if (pageId === "orders") renderPurchaseHistory();
    if (pageId === "history") renderHistoryPage();
    if (updateHistory) writeNavigationState("push");
    lucide.createIcons();
}

function navigateToSection(sectionId, triggerEl = null) {
    if (sectionId === "eletrodomesticos") {
        showPage("electrodomesticos", triggerEl);
        return;
    }

    if (sectionId === "esportes-fitness") {
        showPage("esportes-fitness", triggerEl);
        return;
    }

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
    document.getElementById("det-favorite-btn").onclick = () => toggleFavorite(id);
    renderRatingStars(meta.rating);
    updateFavoriteButton(id);
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

    const currentProduct = products.find((item) => item.id === currentId);
    const sameCategory = products.filter((item) => item.id !== currentId && item.category === currentProduct?.category);
    const fallback = products.filter((item) => item.id !== currentId && item.category !== currentProduct?.category);
    const related = [...sameCategory, ...fallback].slice(0, 6);
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
    renderHomeShortcuts();
    renderInspiredSection();
    renderFavoritesMenu();
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
    renderFavoritesMenu();
    document.getElementById("nav-guest-actions")?.classList.toggle("hidden", isLoggedIn);
    document.getElementById("nav-user-actions")?.classList.toggle("hidden", !isLoggedIn);
    document.getElementById("nav-common-actions")?.classList.remove("hidden");
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
    renderHomeShortcuts();
    renderInspiredSection();
}

function removeViewedProduct(productId) {
    appState.history = appState.history.filter((item) => item.id !== productId);
    persistState();
    renderHistoryPage();
    renderHomeShortcuts();
    renderInspiredSection();
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
    renderFavoritesMenu();
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
        closeFavoritesMenu();
        if (!event.target.closest(".search-shell")) {
            closeSearchSuggestions();
        }
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
window.setElectroSlide = setElectroSlide;
window.moveElectroSlide = moveElectroSlide;
window.setSportsSlide = setSportsSlide;
window.moveSportsSlide = moveSportsSlide;
window.showPage = showPage;
window.navigateToSection = navigateToSection;
window.openSearchSuggestion = openSearchSuggestion;
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
window.toggleFavorite = toggleFavorite;
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
