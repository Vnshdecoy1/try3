# Tools Pricing System Integration Guide

## Overview
The tools system has a complete pricing integration across 14 different services with support for both SOL and USD pricing, custom inputs, and multi-step selections.

## Pricing System Architecture

### 1. **Tools Data Structure (ToolsSection.tsx)**
All 14 tools are defined in the `TOOLS_DATA` array with complete pricing information:

```tsx
{
  name: 'Tool Name',
  desc: 'Short description',
  gradient: 'CSS gradient classes',
  icon: 'Emoji',
  pricing: [{ tier: 'Tier Name', price: number, emoji: '📊' }], // Fixed tier pricing
  usdPricing: true/false, // false = SOL, true = USD
  customInput: true/false, // For variable quantity inputs
  bumpQuantities: [...], // For Bumps tool (2-step selection)
}
```

## 14 Tools with Pricing

### SOL-Based Tools (Fixed Tiers)

#### 1. **Dex Ranking** (SOL)
- Top 70-100: 2.5 SOL
- Top 50-70: 3.5 SOL
- Top 30-50: 5.0 SOL
- Top 20-30: 7.0 SOL
- Top 10-20: 10.0 SOL
- Top 1-10: 12.0 SOL
- Guaranteed Top 1: 20.0 SOL

#### 2. **Volume Boosters** (SOL, Custom Input)
- Minimum: 1 SOL
- Service Fee: 20%
- Volume Generation: 80%
- 1 SOL → ~300 SOL trading volume

#### 3. **Bumps** (SOL, 2-Step Selection)
- Speed Tiers: 9 to 600 bumps/min (12 options)
- Quantity Tiers:
  - 500 Bumps: 0.2 SOL
  - 1,000 Bumps: 0.4 SOL
  - 2,000 Bumps: 0.75 SOL
  - 5,000 Bumps: 1.75 SOL
  - 10,000 Bumps: 3.4 SOL
  - 25,000 Bumps: 8.2 SOL

#### 7. **Holder Boost** (SOL, Custom Input)
- 100 Holders: 0.3 SOL
- Multiples of 100 only
- Custom calculator: (number / 100) × 0.3 SOL

#### 11. **PF Comments** (SOL, Custom Input)
- Per Comment: 0.005 SOL
- Any quantity supported

### USD-Based Tools (Fixed Tiers)

#### 4. **Bundle Terminal** (USD)
- Lifetime Access: $200 (one-time)

#### 5. **Phantom Trending** (USD)
- 6 Hours: $200
- 12 Hours: $370
- 24 Hours: $700

#### 6. **DEX Reactions** (USD)
- 100 Votes: $8
- 500 Votes: $30
- 1,000 Votes: $55
- Special: 10 free reactions per project trial

#### 8. **Chat Managers** (USD)
- 1 Week: $70
- 2 Weeks: $120
- 1 Month: $200

#### 9. **Raiders** (USD)
- 1 Week: $120
- 2 Weeks: $210
- 1 Month: $400

#### 12. **Phantom Group Chats** (USD)
- 1 Week: $70
- 2 Weeks: $120
- 1 Month: $200

### Special Status Tools

#### 10. **PF Stream Viewers** (OUT OF SERVICE)
- Status: Temporarily unavailable
- 50 Viewers: 1.5 SOL
- 200 Viewers: 5.0 SOL
- 500+ Viewers: 10.0 SOL

## Payment Flow

### Step-by-Step Process:

1. **Tool Selection** (ToolsSection.tsx)
   - User clicks on a tool card to expand details modal
   - All pricing tiers are displayed with hover effects
   - User clicks on desired price tier (price card becomes highlighted)

2. **Tier Selection with Visual Feedback**
   - Selected tier gets `border-cyan-400` and highlighted background
   - Button text changes based on selection status
   - Disabled state until tier is selected

3. **Form Entry** (User Details Modal)
   - User provides contract address, email, Twitter, Telegram
   - Chat Managers/Raiders only need Telegram username
   - Bundle Terminal skips CA field

4. **Payment Modal** (Step 1: Package Selection)
   - Selected pricing tier is pre-populated
   - For custom input tools: user enters quantity, price calculated
   - For custom input tools: real-time price preview
   - For Bumps: 2-step selection (speed → quantity)

5. **Payment Gateway** (Step 2: Wallet Generation)
   - Display: Price in format: `{tier} • {amount} SOL or $USD`
   - Generate Solana keypair
   - Display wallet address for deposit
   - Poll balance every 2 seconds

6. **Price Verification**
   - SOL tools: Direct SOL balance comparison
   - USD tools: Fetch SOL price from CoinGecko via backend
   - Accept 95% of required amount (handles slippage)
   - Payment threshold: `balance >= (requiredAmount * 0.95)`

7. **Confirmation** (Step 3: Success)
   - Display package tier, amount, transaction wallet
   - Send Telegram notification
   - Direct user to support or Bot (Bundle Terminal)

## Price Display Formatting

### In Tool Details Modal:
```
SOL-based: "2.5 SOL" (no currency symbol)
USD-based: "$200" (currency symbol)
```

### In Payment Modal:
```
Step 1 (Package Selection):
- Fixed tiers: "{tier} • {price} SOL" or "{tier} • ${price}"
- Custom input: Real-time calculation (e.g., "5 Bumps → 25 SOL")

Step 2 (Payment Gateway):
- Display format: "{tier} • {amount} SOL or ${amount}"
```

## Custom Input Pricing Logic

### Volume Boosters:
```typescript
const expectedVolume = depositAmount * 300;
const expectedFee = depositAmount * 0.2;
const expectedVolumeGeneration = depositAmount * 0.8;
```

### Holder Boost:
```typescript
const priceInSOL = (numberOfHolders / 100) * 0.3; // Must be multiple of 100
```

### PF Comments:
```typescript
const priceInSOL = numberOfComments * 0.005;
```

## Backend Integration

### Price Fetching:
- Endpoint: `GET /api/price`
- Returns: CoinGecko SOL/USD price
- Fallback: $150 if API fails

### Balance Checking:
- Endpoint: `GET /api/balance/:publicKey`
- Returns: Current SOL balance for wallet
- Used for payment detection

### Payment Notifications:
- Endpoint: `POST /api/notify`
- Sends: Telegram message with transaction details
- Includes: Service name, amount, wallet, user details

## Price State Management

### ToolsSection.tsx:
```typescript
const [selectedPricingTier, setSelectedPricingTier] = useState<any>(null);
```

### PaymentModal.tsx:
```typescript
const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
```

### Data Flow:
1. User selects tier in ToolsSection → `selectedPricingTier` updated
2. User clicks "Get Started" → `selectedToolData.selectedTier` = tier
3. PaymentModal receives `selectedService` with `selectedTier`
4. Effect hook initializes `selectedPackage` from `selectedTier`
5. Polling uses `selectedPackage.price` for verification

## Edge Cases & Validation

### Bumps Tool:
- Speed selection required before quantity
- Can change speed via "Change" button
- Price = quantity × speed interaction

### Custom Input Tools:
- Holder Boost: Must be multiples of 100 (0, 100, 200, etc.)
- Volume Boosters: Minimum 1 SOL
- PF Comments: Any positive number

### Chat Managers & Raiders:
- Only require Telegram username (no CA field)
- Different form validation

### Out of Service Tools:
- PF Stream Viewers flagged with `outOfService: true`
- Shows warning modal instead of normal pricing
- Provides support contact link

## Testing Checklist

- [ ] Click each tool and verify all pricing tiers display
- [ ] Select different price tiers and verify highlighting
- [ ] Verify "Get Started" button enablement/disablement
- [ ] Fill user form and proceed to payment modal
- [ ] Verify selected price appears in payment modal
- [ ] Test SOL vs USD price formatting
- [ ] Test custom input price calculations
- [ ] Test Bumps 2-step selection flow
- [ ] Verify payment detection at 95% threshold
- [ ] Verify success confirmation page

## Price Update Procedure

To update prices:

1. **Edit ToolsSection.tsx**:
   - Modify `TOOLS_DATA` array
   - Update `pricing` array for fixed tiers
   - Update `pricePerUnit` for custom inputs
   - Update `bumpQuantities` for Bumps tool

2. **Example - Update Dex Ranking**:
```tsx
{
  name: 'Dex Ranking',
  pricing: [
    { tier: 'Top 70-100', price: 3.0, emoji: '🔥' }, // Changed from 2.5
    // ... rest of tiers
  ]
}
```

3. **Test Changes**:
   - Verify display in details modal
   - Verify calculations in payment modal
   - Check payment detection logic if amounts changed significantly

## API Integration Points

All prices flow through these key integration points:

1. **Frontend Display** → ToolsSection (fixed display)
2. **Payment Selection** → PaymentModal (selection & confirmation)
3. **Balance Checking** → Backend API (`/api/balance/:address`)
4. **Price Conversion** → Backend API (`/api/price`)
5. **Notification** → Backend API (`/api/notify`)

---

## Summary

The pricing system is fully integrated with:
- ✅ 14 tools with complete pricing data
- ✅ SOL and USD pricing support
- ✅ Custom input calculations
- ✅ 2-step selection (Bumps)
- ✅ Real-time price verification
- ✅ 95% threshold acceptance
- ✅ Visual feedback and validation
- ✅ Backend price/balance proxies
- ✅ Telegram notifications
