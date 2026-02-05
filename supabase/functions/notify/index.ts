 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 // Rate limiting
 const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
 const RATE_LIMIT = 5; // requests per minute
 const RATE_WINDOW = 60000;
 
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
 
 // Sanitize message for Telegram
 function sanitizeMessage(msg: string): string {
   return msg
     .replace(/[<>]/g, '')
     .slice(0, 4000); // Telegram message limit
 }
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }
 
   try {
     // Rate limiting
     const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
     if (!checkRateLimit(clientIP)) {
       return new Response(
         JSON.stringify({ error: 'Rate limit exceeded' }),
         { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const { message, type = 'info' } = await req.json();
 
     if (!message || typeof message !== 'string') {
       return new Response(
         JSON.stringify({ error: 'Message is required' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
     const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
 
     if (!botToken || !chatId) {
       console.error('Telegram credentials not configured');
       return new Response(
         JSON.stringify({ error: 'Notification service not configured' }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Format message with emoji based on type
     const emoji = type === 'error' ? '🚨' : type === 'success' ? '✅' : 'ℹ️';
     const formattedMessage = `${emoji} *LOQ Degen Alert*\n\n${sanitizeMessage(message)}`;
 
     // Send to Telegram
     const telegramResponse = await fetch(
       `https://api.telegram.org/bot${botToken}/sendMessage`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           chat_id: chatId,
           text: formattedMessage,
           parse_mode: 'Markdown'
         })
       }
     );
 
     const result = await telegramResponse.json();
 
     if (!result.ok) {
       console.error('Telegram API error:', result);
       return new Response(
         JSON.stringify({ error: 'Failed to send notification' }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     console.log('Notification sent successfully');
 
     return new Response(
       JSON.stringify({ success: true }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   } catch (error) {
     console.error('Notify endpoint error:', error);
     return new Response(
       JSON.stringify({ error: 'Internal server error' }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });