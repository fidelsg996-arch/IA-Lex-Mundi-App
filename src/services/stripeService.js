// Stripe desactivado - Modo prueba
export const createConnectAccount = async () => ({ accountId: 'mock' });
export const getOnboardingStatus = async () => ({ onboardingCompleted: true });
export default { createConnectAccount, getOnboardingStatus };
