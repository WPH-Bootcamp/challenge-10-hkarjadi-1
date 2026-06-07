import { z } from 'zod';

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Alamat pengiriman minimal 10 karakter'),
  phone: z.string().min(8, 'Nomor telepon minimal 8 karakter').optional(),
  paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
