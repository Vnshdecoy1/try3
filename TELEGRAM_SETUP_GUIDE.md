# Telegram Notification Setup Guide

## Issue: Telegram Notifications Not Received

Your backend server is running correctly, but you're not receiving Telegram notifications. This is likely because the Telegram credentials in `.env` are not configured correctly.

## How to Fix It

### Step 1: Create/Update Your Telegram Bot
1. Open Telegram and search for **@BotFather**
2. Send the command `/start`
3. Send the command `/newbot` (to create a new bot)
4. Follow the prompts:
   - Give your bot a name (e.g., "LOQ Degen Payment Bot")
   - Give your bot a username (e.g., "loq_degen_payment_bot")
5. **Copy the Bot Token** - It will look like: `8511833737:AAEF34ACL1dHIJyc6tYFUf68CgcH7Tfi61s`

### Step 2: Get Your Telegram Chat ID
There are several ways to get your Chat ID:

**Option A: Using Your Personal Chat (Recommended)**
1. Open Telegram and search for **@userinfobot**
2. Send it any message
3. It will reply with your User ID
4. This is your TELEGRAM_CHAT_ID

**Option B: Using a Private Group**
1. Create a private Telegram group
2. Add your bot to the group
3. Send a message in the group
4. Open this URL in your browser (replace TOKEN):
   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```
5. Look for `"chat":{"id":-123456789}` - that's your Chat ID

### Step 3: Update .env File
Edit the `.env` file and replace:
```
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE
```

### Step 4: Restart the Backend Server
```bash
# Stop current backend (Ctrl+C if running)
# Then run:
npm run backend
```

### Step 5: Test the Notification
Once the backend is restarted, try making a payment again. You should receive:
1. A message when the wallet is created
2. A message when payment is confirmed

## Example .env File
```
BACKEND_PORT=3000
HELIUS_API_KEY=3355e3eb-3fb3-470b-b19d-79249fa883c0
TELEGRAM_BOT_TOKEN=8511833737:YOUR_REAL_BOT_TOKEN
TELEGRAM_CHAT_ID=123456789
VITE_API_URL=http://localhost:3000
```

## Troubleshooting
- **Still not receiving notifications?** Check your Telegram app for notifications settings
- **Getting errors in backend logs?** Make sure you restart the backend after updating `.env`
- **Invalid bot token?** Generate a new bot with @BotFather and try again

Your backend is already running and configured to send notifications. You just need to add valid Telegram credentials!
