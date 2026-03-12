'use server';

import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripeInstance() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-01-27.acacia',
    });
  }
  return stripeInstance;
}

export interface StripePlan {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  interval: string;
  features: string[];
}

export async function getStripePlans(): Promise<StripePlan[]> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    return [];
  }

  try {
    const stripe = getStripeInstance();
    const priceIds = ['fidd_price_lite', 'fidd_price_pro'];
    
    const plans = await Promise.all(
      priceIds.map(async (id) => {
        try {
          const price = await stripe.prices.retrieve(id, {
            expand: ['product'],
          });

          const product = price.product as Stripe.Product;

          return {
            id: price.id,
            name: product.name,
            description: product.description,
            amount: (price.unit_amount || 0) / 100,
            currency: price.currency,
            interval: price.recurring?.interval || 'month',
            features: product.metadata.features ? JSON.parse(product.metadata.features) : [],
          };
        } catch (err) {
          console.error(`Error fetching Stripe price ${id}:`, err);
          return null;
        }
      })
    );

    return plans.filter((plan): plan is StripePlan => plan !== null);
  } catch (error) {
    console.error('Error fetching Stripe plans:', error);
    return [];
  }
}
