 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 // Simple rate limiting using in-memory store
 const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
 const RATE_LIMIT = 10; // requests per minute
 const RATE_WINDOW = 60000; // 1 minute in ms
 
 function checkRateLimit(ip: string): boolean {
   const now = Date.now();
   const entry = rateLimitMap.get(ip);
   
   if (!entry || now > entry.resetTime) {
     rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
     return true;
   }
   
   if (entry.count >= RATE_LIMIT) {
     return false;
   }
   
   entry.count++;
   return true;
 }
 
 // Validate Solana public key (base58, 32-44 chars)
 function isValidSolanaAddress(address: string): boolean {
   const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
   return base58Regex.test(address);
 }
 
 serve(async (req) => {
   // Handle CORS preflight
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }
 
   try {
     // Rate limiting
     const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
     if (!checkRateLimit(clientIP)) {
       return new Response(
         JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }),
         { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Parse request
     const { publicKey } = await req.json();
     
     if (!publicKey || !isValidSolanaAddress(publicKey)) {
       return new Response(
         JSON.stringify({ error: 'Invalid Solana public key' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Get Helius API key from secrets
     const heliusApiKey = Deno.env.get('HELIUS_API_KEY');
     if (!heliusApiKey) {
       console.error('HELIUS_API_KEY not configured');
       return new Response(
         JSON.stringify({ error: 'Service configuration error' }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Fetch balance from Helius RPC
     const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         jsonrpc: '2.0',
         id: 1,
         method: 'getBalance',
         params: [publicKey]
       })
     });
 
     const data = await response.json();
 
     if (data.error) {
       console.error('Helius RPC error:', data.error);
       return new Response(
         JSON.stringify({ error: 'Failed to fetch balance' }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const lamports = data.result?.value || 0;
     const sol = lamports / 1e9;
 
     console.log(`Balance fetched for ${publicKey}: ${sol} SOL`);
 
     return new Response(
       JSON.stringify({ lamports, sol, publicKey }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   } catch (error) {
     console.error('Balance endpoint error:', error);
     return new Response(
       JSON.stringify({ error: 'Internal server error' }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });