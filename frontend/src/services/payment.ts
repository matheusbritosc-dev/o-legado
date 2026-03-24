/**
 * Stub de Integração de Gateway de Pagamento.
 * Arquitetura mapeada para Stripe ou MercadoPago.
 * Requisitos Habilitados: PIX Transparente, Cartão de Crédito via Elementos PCI-DSS.
 * Toda chamada daqui deve apontar para uma API HTTPS onde a Secret Key vive.
 */

const BACKEND_PAYMENT_API = "https://legado.com.br/api/v1/checkout";

export interface PaymentIntent {
  clientSecret: string;
  pixCode?: string;
  pixQrCodeUrl?: string;
}

export async function createCheckoutSession(amount: number, planType: 'membro_anual' | 'base_mensal'): Promise<PaymentIntent> {
  // Simulação de chamada PCI Compliant ao backend
  console.log(`📡 Solicitando Intent no Backend (HTTPS) para Plano: ${planType}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        clientSecret: "pi_1M..._secret_...",
        pixCode: "00020126580014BR.GOV.BCB.PIX0136legado-doacao@gov.br...",
        pixQrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example_pix_code"
      });
    }, 1500);
  });
}

/**
 * Função simulada para ouvir Webhooks ou polled status de recebimento PIX.
 */
export async function verifyPaymentStatus(intentId: string): Promise<boolean> {
  // Na prática, a API ou o Webhook validaria a transação final
  return true;
}
