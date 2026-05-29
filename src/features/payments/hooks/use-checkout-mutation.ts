import { useMutation } from '@tanstack/react-query';
import { useInvoiceStore } from '@/features/invoices/stores/use-invoice-store';

interface CheckoutRequest {
  invoiceId: string;
}

interface CheckoutResponse {
  invoiceId: string;
  redirectUrl: string;
}

export function useCheckoutMutation() {
  const { setProcessing } = useInvoiceStore();

  return useMutation<CheckoutResponse, Error, CheckoutRequest>({
    mutationFn: async ({ invoiceId }) => {
      // 1. Instantly update invoice state to PROCESSING to lock any simultaneous actions
      setProcessing(invoiceId);

      // 2. Simulate randomized bank API network latency (800ms - 2000ms)
      const latency = Math.floor(Math.random() * 1200) + 800;
      await new Promise((resolve) => setTimeout(resolve, latency));

      // 3. Simulating a mock backend failure rate of 5% (reassuring failure UX testing)
      const shouldFail = Math.random() < 0.05;
      if (shouldFail) {
        throw new Error('Checkout initialization failed due to network instability.');
      }

      // 4. Resolve with the checkout simulator redirect path
      return {
        invoiceId,
        redirectUrl: `/checkout/${invoiceId}`,
      };
    },
  });
}
