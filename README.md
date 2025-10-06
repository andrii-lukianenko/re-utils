# @andrii_lukianenko/re-utils

[![Version](https://img.shields.io/badge/version-0.0.1--alpha.0-blue)](https://github.com/andrii-lukianenko/re-utils)
[![CI](https://github.com/andrii-lukianenko/re-utils/workflows/CI/badge.svg)](https://github.com/andrii-lukianenko/re-utils/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Shared utilities and React hooks for frontend development. This package provides type-safe helpers and reusable React hooks to streamline common frontend tasks.

## Features

- 🔧 **Type-safe utilities** - Written in TypeScript with full type support
- ⚛️ **React hooks** - Reusable hooks for common React patterns
- 📦 **Dual package** - Supports both ESM and CommonJS
- 🎯 **Tree-shakable** - Import only what you need
- ✅ **Well-tested** - Comprehensive test coverage

## Installation

```bash
npm install @andrii_lukianenko/re-utils
```

## Usage

### Helpers

Type-safe utility functions for common operations.

```typescript
import { checkIsArrayValue } from '@andrii_lukianenko/re-utils/helpers';

// Type guard for array value checking
const fruits = ['apple', 'banana', 'orange'] as const;
const userInput: unknown = 'apple';

if (checkIsArrayValue(fruits, userInput)) {
  // userInput is now typed as 'apple' | 'banana' | 'orange'
  console.log(`Selected fruit: ${userInput}`);
}

// Example with enum-like values
const statuses = ['pending', 'approved', 'rejected'] as const;
const apiResponse: unknown = 'approved';

if (checkIsArrayValue(statuses, apiResponse)) {
  // apiResponse is now typed as 'pending' | 'approved' | 'rejected'
  handleStatus(apiResponse);
}
```

### Hooks

React hooks for common UI patterns.

```typescript
import React, { useRef } from 'react';
import { useClickOutside } from '@andrii_lukianenko/re-utils/hooks';

function DropdownMenu() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Menu
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <a href="#option1">Option 1</a>
          <a href="#option2">Option 2</a>
          <a href="#option3">Option 3</a>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### Helpers

#### `checkIsArrayValue<T>(array: T[], value: unknown): value is T`

Type guard that checks if a value exists in an array and narrows the type accordingly.

**Parameters:**
- `array` - The array to check against
- `value` - The value to check

**Returns:** `true` if value is found in array, `false` otherwise

### Hooks

#### `useClickOutside(ref: RefObject<HTMLElement>, handler: () => void): void`

Hook that triggers a callback when clicking outside a referenced element.

**Parameters:**
- `ref` - React ref object pointing to the target element
- `handler` - Callback function to execute on outside click

## Requirements

- React ≥16.8.0 (for hooks)
- TypeScript ≥4.0 (recommended)

## License

MIT © [Andrii Lukianenko](https://github.com/andrii-lukianenko)
