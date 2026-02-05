# Tools System Integration Guide

## 📋 Overview

This document outlines the complete tools system migration from the source project (LOQ/X) to the new project (pixel-perfect-performance). The system includes 14 different tools with pricing in SOL and USD, payment processing via Solana blockchain, and Telegram notifications.

## 🏗️ Architecture

### Frontend Components
- **ToolsSection.tsx** - Main tools grid with all 14 tools and pricing display
- **PaymentModal.tsx** - Complete payment flow with wallet generation and balance polling
- **Integration** - Seamlessly integrated into the main application

### Backend Services
- **backend/server.js** - Express.js server with 3 protected routes
- **Routes:**
  - `GET /api/balance/:publicKey` - Check SOL balance (protects Helius RPC key)
  - `POST /api/notify` - Send Telegram notifications (protects bot token)
  - `GET /api/price` - Fetch SOL price from CoinGecko (fallback: $150)

## 🔐 Security Architecture

### Hardcoded Secrets → Environment Variables
All sensitive credentials have been moved to environment variables:

| Secret | Old Location | New Location | Example |
|--------|---|---|---|
| Helius API Key | Hardcoded in server.js | `.env` as `HELIUS_API_KEY` | (hidden in .env) |
| Telegram Bot Token | Hardcoded in server.js | `.env` as `TELEGRAM_BOT_TOKEN` | (hidden in .env) |
| Telegram Chat ID | Hardcoded in server.js | `.env` as `TELEGRAM_CHAT_ID` | (hidden in .env) |

### Frontend Security
- **No API keys in client code** - Frontend never exposes Helius or Telegram credentials
- **Backend proxy pattern** - All sensitive operations go through backend routes
- **Relative API URLs** - Production uses relative paths, localhost uses http://localhost:3000

### Backend Security
- **Environment validation** - Server exits if required env vars missing
- **Error logging** - Errors logged server-side, never exposed to client
- **Fallback price** - If CoinGecko fails, uses $150 fallback to prevent UI freeze

## 🛠️ Tools Inventory

### 1. Dex Ranking (SOL-priced)
- 7 tiers from "Top 70-100" @ 2.5 SOL to "Guaranteed Top 1" @ 20.0 SOL
- Fixed pricing tiers

### 2. Volume Boosters (SOL-priced, Custom Input)
- Minimum 1 SOL
- 20% service fee, 80% for volume generation
- 1 SOL generates ~300 SOL worth of volume

### 3. Bumps (SOL-priced, Two-step)
- 12 speed tiers (9-600 Bumps/Min)
- 6 quantity options (500-25000 bumps @ 0.2-8.2 SOL)

### 4. Bundle Terminal (USD-priced)
- Lifetime access @ $200
- Includes token launch, trading, wallet tools

### 5. Phantom Trending (USD-priced)
- 6 Hours @ $200, 12 Hours @ $370, 24 Hours @ $700

### 6. DEX Reactions (USD-priced)
- 100 votes @ $8, 500 @ $30, 1000 @ $55
- 50% 🔥 fires, 50% 🚀 rockets

### 7. Holder Boost (SOL-priced, Custom Input)
- 100 holders = 0.3 SOL (multiples of 100 only)
- Configurable quantities

### 8. Chat Managers (USD-priced)
- 1 Week @ $70, 2 Weeks @ $120, 1 Month @ $200
- Requires Telegram username

### 9. Raiders (USD-priced)
- 1 Week @ $120, 2 Weeks @ $210, 1 Month @ $400
- Requires Telegram username
- Daily raids with flexible timing

### 10. PF Stream Viewers (SOL-priced, OUT OF SERVICE)
- 50 @ 1.5 SOL, 200 @ 5.0 SOL, 500+ @ 10.0 SOL
- Currently unavailable

### 11. PF Comments (SOL-priced, Custom Input)
- 0.005 SOL per comment
- Any quantity

### 12. Phantom Group Chats (USD-priced)
- 1 Week @ $70, 2 Weeks @ $120, 1 Month @ $200
- 24/7 active community chat

### 13-14. (Additional tools from original implementation)

## 💳 Payment Flow

```
User Selection
  ↓
User Details Form (CA, Email, Twitter, Telegram)
  ↓
Package Selection
  ↓
Wallet Generation (via @solana/web3.js Keypair)
  ↓
Display wallet address to user
  ↓
Poll backend /api/balance every 2 seconds
  ↓
Compare received SOL vs required amount (95% threshold)
  ↓
Send notifications via /api/notify
  ↓
Show confirmation
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

Required packages already in package.json:
- `@solana/web3.js` - Solana wallet integration
- `bs58` - Base58 encoding for keys
- `axios` - HTTP requests
- `express` - Backend server
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### 2. Configure Environment Variables

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Then fill in your actual values:
```env
BACKEND_PORT=3000
HELIUS_API_KEY=your_actual_api_key_here
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
TELEGRAM_CHAT_ID=your_actual_chat_id_here
VITE_API_URL=http://localhost:3000
```

### 3. Get Required Credentials

#### Helius API Key
1. Visit https://www.helius.dev/
2. Sign up for free account
3. Create an API key in dashboard
4. Copy and paste into `.env`

#### Telegram Bot Token
1. Message @BotFather on Telegram
2. `/newbot` and follow prompts
3. Copy token into `.env`

#### Telegram Chat ID
1. Get your personal chat ID from @userinfobot
2. Copy into `.env`

### 4. Start Backend Server
```bash
node backend/server.js
```

Expected output:
```
-----------------------------------
🔒 Backend Security Server Starting
RPC Connected: https://mainnet.helius-rpc.com/
-----------------------------------
✅ Server is running on http://localhost:3000
🔒 All API keys are protected - not exposed to client
```

### 5. Start Frontend (separate terminal)
```bash
npm run dev
```

## 🧪 Testing

### Test Payment Flow (Devnet)
```bash
# Generate devnet wallet with airdrop
solana airdrop 5 --network devnet

# Test payment detection script
node test-payment.js
```

### Test Routes
```bash
# Test balance route
curl http://localhost:3000/api/balance/YOUR_WALLET_ADDRESS

# Test price route
curl http://localhost:3000/api/price

# Test notify route
curl -X POST http://localhost:3000/api/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Test notification"}'
```

## 📊 Pricing Math

### SOL to USD Conversion
When USD-priced tool is selected:
1. Fetch current SOL price from `/api/price`
2. Check received SOL balance via `/api/balance/:publicKey`
3. Calculate: `receivedSOL * solPrice >= requiredUSD * 0.95`

### Volume Booster Calculation
- User deposits X SOL
- Service fee: 20% (0.2X SOL)
- Volume generation: 80% (0.8X SOL)
- Expected volume: ~300X SOL

### Holder Boost Calculation
- Price per 100 holders: 0.3 SOL
- Formula: `(numHolders / 100) * 0.3`
- Only multiples of 100 allowed

## 🔄 Pricing Updates

All pricing is defined in `TOOLS_DATA` array in `src/components/ToolsSection.tsx`:

```tsx
const TOOLS_DATA = [
  {
    name: 'Dex Ranking',
    pricing: [
      { tier: 'Top 70-100', price: 2.5 },
      // ... more tiers
    ]
  },
  // ... more tools
]
```

To update prices:
1. Edit the `pricing` array in the tool definition
2. No backend changes needed
3. Changes take effect immediately on page reload

## 🚨 Troubleshooting

### "Backend server not responding"
- Ensure `node backend/server.js` is running
- Check that port 3000 is not in use
- Verify `HELIUS_API_KEY` is set in `.env`

### "Payment not detected"
- Check that wallet received correct amount
- Verify balance polling is running (check browser console)
- Ensure required amount threshold is met (95% of requested amount)
- Check backend logs for balance check errors

### "Telegram notifications not sending"
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Verify `TELEGRAM_CHAT_ID` is correct
- Test bot token with BotFather
- Check backend logs for Telegram API errors

### "SOL price not fetching"
- Backend will use $150 fallback
- This is intentional to prevent UI freeze
- CoinGecko API may be rate-limited

## 📝 Pricing Logic Preservation

✅ **PRESERVED EXACTLY:**
- All 14 tools with exact names
- All pricing tiers and amounts
- Custom input logic (Volume Boosters, Holder Boost, PF Comments)
- Two-step selection for Bumps (speed → quantity)
- USD vs SOL pricing distinction
- Out of service flag for PF Stream Viewers
- 95% payment threshold
- 20%/80% split for Volume Boosters
- 100 holder multiples requirement
- 2-second polling interval

## 🔒 Production Deployment

### Before Deploying:
1. Ensure `.env` file is in `.gitignore`
2. Never commit `.env` file
3. Set environment variables on production server:
   ```bash
   export HELIUS_API_KEY=prod_key_here
   export TELEGRAM_BOT_TOKEN=prod_token_here
   export TELEGRAM_CHAT_ID=prod_chat_id_here
   export VITE_API_URL=https://api.yourdomain.com
   ```

4. Update frontend API URL:
   - Development: `http://localhost:3000`
   - Production: `https://api.yourdomain.com`

5. Update CORS configuration if needed:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
     credentials: true
   }));
   ```

## 📚 File Structure
```
pixel-perfect-performance/
├── .env                          # Environment variables (NOT in git)
├── .env.example                  # Template with all required vars
├── backend/
│   └── server.js                 # Express backend with 3 routes
├── src/
│   ├── components/
│   │   ├── PaymentModal.tsx      # Payment UI and logic
│   │   └── ToolsSection.tsx      # Tools grid with 14 tools
│   └── pages/
│       └── Index.tsx             # Import ToolsSection here
└── package.json                  # Dependencies
```

## ✅ Verification Checklist

Before going live:
- [ ] All 14 tools display correctly
- [ ] Pricing displays correctly (SOL and USD)
- [ ] Payment modal opens on tool selection
- [ ] Wallet generates successfully
- [ ] Balance checking works (test with Helius API)
- [ ] SOL price fetches correctly
- [ ] Telegram notifications send
- [ ] Payment detection triggers at 95% threshold
- [ ] Success page displays after payment
- [ ] No API keys in browser console
- [ ] No API keys in network requests
- [ ] Environment variables loaded correctly

## 🎯 Next Steps

1. Add ToolsSection to your main Index page
2. Test full payment flow with testnet SOL
3. Configure production environment variables
4. Deploy backend server
5. Update frontend API URL for production
6. Test with real SOL on mainnet
7. Monitor Telegram notifications
8. Track payment conversions

---

**Last Updated:** February 1, 2026  
**Version:** 1.0 - Initial Migration Complete
