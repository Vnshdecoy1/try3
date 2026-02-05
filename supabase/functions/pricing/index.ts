 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get('SUPABASE_URL');
     const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
 
     if (!supabaseUrl || !supabaseAnonKey) {
       console.error('Supabase credentials not configured');
       return new Response(
         JSON.stringify({ error: 'Service configuration error' }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const supabase = createClient(supabaseUrl, supabaseAnonKey);
 
     // Fetch all active tools with their pricing tiers
     const { data: tools, error: toolsError } = await supabase
       .from('tools')
       .select(`
         id,
         slug,
         name,
         description,
         icon,
         category,
         sort_order,
         pricing_tiers (
           id,
           duration,
           price,
           sort_order
         )
       `)
       .eq('is_active', true)
       .order('sort_order', { ascending: true });
 
     if (toolsError) {
       console.error('Database error:', toolsError);
       return new Response(
         JSON.stringify({ error: 'Failed to fetch pricing data' }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Sort pricing tiers within each tool
     const sortedTools = tools?.map(tool => ({
       ...tool,
       pricing_tiers: tool.pricing_tiers?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
     })) || [];
 
     console.log(`Fetched ${sortedTools.length} tools with pricing`);
 
     return new Response(
       JSON.stringify({ tools: sortedTools }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   } catch (error) {
     console.error('Pricing endpoint error:', error);
     return new Response(
       JSON.stringify({ error: 'Internal server error' }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });