 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 
 export interface PricingTier {
   id: string;
   duration: string;
   price: string;
   sort_order: number;
 }
 
 export interface Tool {
   id: string;
   slug: string;
   name: string;
   description: string;
   icon: string;
   category: string;
   sort_order: number;
   pricing_tiers: PricingTier[];
 }
 
 export function useToolsPricing() {
   return useQuery({
     queryKey: ['tools-pricing'],
     queryFn: async (): Promise<Tool[]> => {
       const { data, error } = await supabase.functions.invoke('pricing');
       
       if (error) {
         console.error('Failed to fetch pricing:', error);
         throw error;
       }
       
       return data.tools || [];
     },
     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
     gcTime: 10 * 60 * 1000,
   });
 }