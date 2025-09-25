# FiveM TypeScript Boilerplate

A modern, easy-to-use TypeScript boilerplate for FiveM development with React UI support. This boilerplate includes custom hooks for seamless communication between FiveM and your React UI.

## Installation

This project has two main parts that need dependency installation:

### 1. Main Project (FiveM Scripts)
```bash
# In the root directory
pnpm install
```

### 2. Web UI (React Application)
```bash
# Navigate to web folder
cd web
pnpm install
```

## Build Commands

### Development
```bash
# For instant updates during development
pnpm watch
```

### Production
```bash
# Build optimized version for production
pnpm build
```

### Web UI Development
```bash
# Navigate to web folder first
cd web

# Start development server (for browser testing)
pnpm dev
```

## Custom Hooks

This boilerplate includes two powerful custom hooks for FiveM-React communication:

### `useNuiEvent` - For FiveM to React Communication

This hook listens for events sent from FiveM to your React UI using `RegisterNuiEvent`.

#### Example Usage:

**In your React component:**
```tsx
import { useNuiEvent } from './hooks/useNuiEvent';

interface PlayerData {
  name: string;
  id: number;
  money: number;
}

const PlayerInfo: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  // Listen for player data updates from FiveM
  useNuiEvent<PlayerData>('updatePlayerInfo', (data) => {
    setPlayerData(data);
  });

  return (
    <div>
      {playerData && (
        <div>
          <h3>Player: {playerData.name}</h3>
          <p>ID: {playerData.id}</p>
          <p>Money: ${playerData.money}</p>
        </div>
      )}
    </div>
  );
};
```

**In your FiveM client script (TypeScript):**
```typescript
// client/client.ts
interface PlayerData {
  name: string;
  id: number;
  money: number;
}

// Function to update player info in UI
function updatePlayerInfoUI(): void {
  const playerData: PlayerData = {
    name: GetPlayerName(PlayerId()),
    id: GetPlayerServerId(PlayerId()),
    money: 5000
  };
  
  SendNUIMessage({
    action: 'updatePlayerInfo',
    Data: playerData
  });
}

// Register command to trigger UI update
RegisterCommand('showplayerinfo', () => {
  updatePlayerInfoUI();
}, false);

// Example: Update UI when player spawns
on('playerSpawned', () => {
  updatePlayerInfoUI();
});
```

### Sending Data from UI to FiveM Client - `fetchNui` Hook

Your boilerplate includes a custom `fetchNui` hook for sending data from React UI back to the FiveM client:

**In your React component:**
```tsx
import { fetchNui } from './hooks/useFetchNui';

interface BuyItemData {
  itemId: string;
  price: number;
}

interface BuyItemResponse {
  success: boolean;
  message?: string;
}

const PlayerActions: React.FC = () => {
  const handleBuyItem = async () => {
    try {
      const response = await fetchNui<BuyItemResponse>('buyItem', {
        itemId: 'weapon_pistol',
        price: 500
      });
      
      if (response.success) {
        console.log('Item purchased successfully!');
      } else {
        console.log('Purchase failed:', response.message);
      }
    } catch (error) {
      console.error('Failed to buy item:', error);
    }
  };

  const handleCloseUI = async () => {
    try {
      await fetchNui('closeUI', {});
    } catch (error) {
      console.error('Failed to close UI:', error);
    }
  };

  return (
    <div>
      <button onClick={handleBuyItem}>Buy Pistol ($500)</button>
      <button onClick={handleCloseUI}>Close UI</button>
    </div>
  );
};
```

**In your FiveM client script (TypeScript):**
```typescript
// client/client.ts
interface BuyItemData {
  itemId: string;
  price: number;
}

// Register NUI callback to handle UI requests
RegisterNuiCallbackType('buyItem');
on('__cfx_nui:buyItem', (data: BuyItemData, cb: Function) => {
  console.log(`Player wants to buy ${data.itemId} for $${data.price}`);
  
  // Your game logic here
  const success = handleItemPurchase(data.itemId, data.price);
  
  // Send response back to UI
  cb(JSON.stringify({ 
    success,
    message: success ? 'Item purchased!' : 'Not enough money!'
  }));
});

// Register callback to close UI
RegisterNuiCallbackType('closeUI');
on('__cfx_nui:closeUI', (data: any, cb: Function) => {
  SetNuiFocus(false, false);
  cb(JSON.stringify({ success: true }));
});

function handleItemPurchase(itemId: string, price: number): boolean {
  // Add your purchase logic here
  // Check player money, give item, etc.
  return true; // Return true if successful
}
```

**Key Features of `fetchNui`:**
- **Automatic Resource Name Detection** - Uses `GetParentResourceName()` or falls back to default
- **Type Safety** - Generic function `fetchNui<T>()` for typed responses
- **Browser Safety** - Returns `undefined` in browser environment to prevent errors
- **Error Handling** - Proper error throwing with descriptive messages
- **JSON Handling** - Automatically parses JSON responses

### `useReactMessage` - For Browser Development & Testing

This hook is specifically designed for testing your UI in the browser with mock data, making development much easier.

#### Example Usage:

**In your React component:**
```tsx
import { useReactMessage } from './hooks/useReactMessage';
import { DebugData } from './utils/debug';

const TestComponent: React.FC = () => {
  const [message, setMessage] = useState('');

  // Listen for test messages (only works in browser)
  useReactMessage<{text: string}>('testMessage', (data) => {
    setMessage(data.text);
  });

  // Simulate FiveM events for browser testing
  useEffect(() => {
    DebugData([
      {
        action: 'testMessage',
        data: { text: 'Hello from mock FiveM!' }
      }
    ], 2000); // Send after 2 seconds
  }, []);

  return <div>{message}</div>;
};
```

### Debug Utility - `DebugData`

The `DebugData` function allows you to simulate FiveM events when developing in the browser:

```tsx
import { DebugData } from './utils/debug';

// Simulate multiple events
DebugData([
  {
    action: 'showNotification',
    data: { message: 'Welcome!' }
  },
  {
    action: 'updateMoney',
    data: { amount: 1000 }
  }
], 1000); // 1 second delay
```

## Project Structure

```
script-boilerplate/
├── client/              # FiveM client-side scripts
│   ├── client.ts
│   └── tsconfig.json
├── server/              # FiveM server-side scripts
│   ├── server.ts
│   └── tsconfig.json
├── web/                 # React UI application
│   ├── src/
│   │   ├── hooks/       # Custom React hooks
│   │   │   ├── useNuiEvent.ts      # FiveM → React communication
│   │   │   └── useReactMessage.ts  # Browser testing helper
│   │   ├── utils/
│   │   │   └── debug.ts            # Debug utilities
│   │   └── App.tsx
│   └── package.json
├── fxmanifest.lua       # FiveM resource manifest
└── package.json
```

## How It Works

1. **FiveM Communication**: The `useNuiEvent` hook creates a bridge between your FiveM Lua scripts and React components
2. **Browser Testing**: The `useReactMessage` hook combined with `DebugData` allows you to test your UI in a regular browser without FiveM
3. **Environment Detection**: The hooks automatically detect if they're running in FiveM or a browser and behave accordingly

## Development Workflow

1. **Setup**: Install pnpm globally, then run `pnpm install` in root and `cd web && pnpm install`
2. **UI Development**: Use `cd web && pnpm dev` to develop your React UI in the browser with mock data
3. **FiveM Integration**: Use `pnpm watch` to build and test with actual FiveM
4. **Production**: Use `pnpm build` for optimized production builds

## Contributing

Feel free to submit issues and enhancement requests!
