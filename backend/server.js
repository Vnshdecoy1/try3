import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuration - Server Side Only (Protected by environment variables)
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_RPC = HELIUS_API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}` : '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Validate required environment variables
if (!HELIUS_API_KEY) {
  console.error('❌ HELIUS_API_KEY is not set. Please configure environment variables.');
  process.exit(1);
}

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn('⚠️ Telegram configuration incomplete. Notifications will not be sent.');
}

// Setup Connection
const connection = new Connection(HELIUS_RPC);

console.log('-----------------------------------');
console.log('🔒 Backend Security Server Starting');
console.log(`RPC Connected: ${HELIUS_RPC.split('?')[0]}`); // Hide Key in log
console.log('-----------------------------------');

// Route 1: Proxy Balance Check (Protects Helius RPC Key)
app.get('/api/balance/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;
    // Basic validation
    try {
        new PublicKey(publicKey);
    } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid public key' });
    }

    const balance = await connection.getBalance(new PublicKey(publicKey));
    res.json({
        success: true,
        balance: balance,
        sol: balance / LAMPORTS_PER_SOL
    });
  } catch (error) {
    console.error(`Balance Check Error [${req.params.publicKey}]:`, error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ success: false, error: 'Failed to fetch balance' });
  }
});

// Route 2: Proxy Notification (Protects Telegram Token)
app.post('/api/notify', async (req, res) => {
    try {
        const { message } = req.body;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Missing Telegram Config');
            return res.status(500).json({ success: false, error: 'Server misconfigured' });
        }

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        });

        console.log('✅ Telegram Notification Sent via Proxy');
        res.json({ success: true, message: 'Notification sent' });
    } catch (error) {
        console.error('Telegram Proxy Error:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ success: false, error: 'Failed to send notification' });
    }
});

// Route 3: Proxy Price Check
app.get('/api/price', async (req, res) => {
    try {
        // Switch to CoinGecko (Free, no auth)
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const price = response.data.solana.usd;
        console.log(`💰 Fetched SOL Price: $${price}`);
        res.json({ success: true, price: Number(price) });
    } catch (error) {
        console.error('Price check error (CoinGecko):', error instanceof Error ? error.message : 'Unknown error');

        // Fallback to strict mock if API fails (prevent UI freeze)
        console.log('Using fallback price: $150');
        res.json({ success: true, price: 150 });
    }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log('🔒 All API keys are protected - not exposed to client');
});
