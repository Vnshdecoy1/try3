 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 // In-memory cache for SOL price
 let cachedPrice: { price: number; timestamp: number } | null = null;
 const CACHE_DURATION = 15000; // 15 seconds
 const FALLBACK_PRICE = 150; // Fallback price if API fails
 
 async function fetchSolPrice(): Promise<number> {
   const now = Date.now();
   
   // Return cached price if still valid
   if (cachedPrice && (now - cachedPrice.timestamp) < CACHE_DURATION) {
     console.log('Returning cached SOL price:', cachedPrice.price);
     return cachedPrice.price;
   }
 
   try {
     const response = await fetch(
       'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
       { headers: { 'Accept': 'application/json' } }
     );
 
     if (!response.ok) {
       throw new Error(`CoinGecko API error: ${response.status}`);
     }
 
     const data = await response.json();
     const price = data.solana?.usd;
 
     if (typeof price !== 'number') {
       throw new Error('Invalid price data from CoinGecko');
     }
 
     // Update cache
     cachedPrice = { price, timestamp: now };
     console.log('Fetched fresh SOL price:', price);
     return price;
   } catch (error) {
     console.error('Failed to fetch SOL price:', error);
     
     // Return cached price if available, otherwise fallback
     if (cachedPrice) {
       console.log('Using stale cached price:', cachedPrice.price);
       return cachedPrice.price;
     }
     
     console.log('Using fallback price:', FALLBACK_PRICE);
     return FALLBACK_PRICE;
   }
 }
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }
 
   try {
     const price = await fetchSolPrice();
     
     return new Response(
       JSON.stringify({
         price,
         currency: 'USD',
         symbol: 'SOL',
         cached: cachedPrice ? (Date.now() - cachedPrice.timestamp) < 1000 ? false : true : false,
         timestamp: Date.now()
       }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   } catch (error) {
     console.error('Price endpoint error:', error);
     return new Response(
       JSON.stringify({ error: 'Failed to fetch price' }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });