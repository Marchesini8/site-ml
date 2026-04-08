const axios = require('axios');

exports.createPixPayment = async ({ items, customer, delivery, total }) => {
  const parsedTotal = Number(total || 0);
  const totalInCents = Math.round(parsedTotal * 100);
  const fakePixCode =
    `00020126580014BR.GOV.BCB.PIX0136fakepix1234567895204000053039865405${parsedTotal.toFixed(2)}`;
  const allowMockFallback = process.env.ALLOW_MOCK_PIX === 'true';
  const pixEndpoint = process.env.PAYMENT_PIX_ENDPOINT || '/payments';
  const offerHash = process.env.IRONPAY_OFFER_HASH;
  const productHash = process.env.IRONPAY_PRODUCT_HASH;
  const postbackUrl = process.env.IRONPAY_POSTBACK_URL;
  const expireInDays = Number(process.env.IRONPAY_EXPIRE_IN_DAYS || 1);
  const cart = (items || []).map((item) => ({
    product_hash: item.product_hash || productHash,
    title: item.title,
    cover: item.cover || null,
    price: Math.round(Number(item.price || 0) * 100),
    quantity: Number(item.qty || 1),
    operation_type: Number(item.operation_type || 1),
    tangible: Boolean(item.tangible || false),
  }));

  if (!process.env.PAYMENT_API_URL || !process.env.PAYMENT_API_KEY) {
    return {
      pix_code: fakePixCode,
      pix_base64: null,
      source: 'mock',
    };
  }

  if (!offerHash) {
    const error = new Error('IRONPAY_OFFER_HASH nao configurado no .env');
    error.statusCode = 500;
    throw error;
  }

  if (!productHash) {
    const error = new Error('IRONPAY_PRODUCT_HASH nao configurado no .env');
    error.statusCode = 500;
    throw error;
  }

  try {
    const response = await axios.post(
      `${process.env.PAYMENT_API_URL}${pixEndpoint}`,
      {
        offer_hash: offerHash,
        amount: totalInCents,
        payment_method: 'pix',
        expire_in_days: expireInDays,
        transaction_origin: 'api',
        postback_url: postbackUrl,
        cart,
        customer: {
          name: customer.name,
          email: customer.email,
          phone_number: customer.phone_number || customer.phone || process.env.DEFAULT_PHONE_NUMBER || '',
          document: customer.document || customer.cpf || '',
          street_name: customer.street_name || delivery.address || '',
          number: customer.number || delivery.number || '',
          complement: customer.complement || delivery.complement || '',
          neighborhood: customer.neighborhood || delivery.neighborhood || process.env.DEFAULT_NEIGHBORHOOD || '',
          city: customer.city || delivery.city || '',
          state: customer.state || delivery.state || process.env.DEFAULT_STATE || '',
          zip_code: customer.zip_code || delivery.zip_code || delivery.cep || '',
        },
        tracking: {
          src: '',
          utm_source: '',
          utm_medium: '',
          utm_campaign: '',
          utm_term: '',
          utm_content: '',
        },
      },
      {
        params: {
          api_token: process.env.PAYMENT_API_KEY,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        proxy: false,
      }
    );

    return {
      pix_code:
        response.data.pix_code ||
        response.data.pixCode ||
        response.data.pix?.pix_qr_code ||
        fakePixCode,
      pix_base64:
        response.data.qr_code ||
        response.data.pix_base64 ||
        response.data.qrCode ||
        response.data.pix?.qr_code_base64 ||
        null,
      source: 'ironpay',
      raw: response.data,
    };
  } catch (error) {
    const providerError = error.response?.data || error.message;
    console.error('Erro ao criar pagamento na IronPay:', providerError);

    if (allowMockFallback) {
      return {
        pix_code: fakePixCode,
        pix_base64: null,
        source: 'mock_fallback',
        provider_error: providerError,
      };
    }

    const paymentError = new Error(
      `Falha ao gerar PIX na IronPay: ${typeof providerError === 'string' ? providerError : JSON.stringify(providerError)}`
    );
    paymentError.statusCode = error.response?.status || 502;
    throw paymentError;
  }
};
