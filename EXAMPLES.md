# Time Warp Backend Usage Examples

This document provides practical examples for integrating with the Time Warp Backend API using various programming languages and tools.

## Table of Contents

1. [cURL Examples](#curl-examples)
2. [JavaScript/TypeScript Examples](#javascripttypescript-examples)
3. [Python Examples](#python-examples)
4. [Postman Collection](#postman-collection)
5. [Frontend Integration Examples](#frontend-integration-examples)

## cURL Examples

### Authentication Flow

#### 1. User Registration
```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securePassword123"
  }'

# Expected Response:
# {
#   "user": {
#     "id": 1,
#     "username": "johndoe"
#   },
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

#### 2. User Login
```bash
# Login with existing credentials
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securePassword123"
  }'
```

#### 3. Using the Access Token
```bash
# Store the token for reuse
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get all users (protected endpoint)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"

# Get specific user
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"

# Create new user (admin operation)
curl -X POST http://localhost:3000/users/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "anotherPassword456"
  }'
```

## JavaScript/TypeScript Examples

### Using Fetch API

```javascript
class TimeWarpAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  // Helper method for making authenticated requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication methods
  async register(username, password) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    // Store token for future requests
    this.token = response.accessToken;
    localStorage.setItem('authToken', this.token);

    return response;
  }

  async login(username, password) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    // Store token for future requests
    this.token = response.accessToken;
    localStorage.setItem('authToken', this.token);

    return response;
  }

  // User management methods
  async getAllUsers() {
    return this.makeRequest('/users');
  }

  async getUserById(id) {
    return this.makeRequest(`/users/${id}`);
  }

  async createUser(username, password) {
    return this.makeRequest('/users/create', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  // Utility methods
  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Usage examples
const api = new TimeWarpAPI();

// Register a new user
api.register('johndoe', 'securePassword123')
  .then(response => {
    console.log('Registration successful:', response.user);
  })
  .catch(error => {
    console.error('Registration failed:', error);
  });

// Login
api.login('johndoe', 'securePassword123')
  .then(response => {
    console.log('Login successful:', response.user);

    // Now make authenticated requests
    return api.getAllUsers();
  })
  .then(users => {
    console.log('Users:', users);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### TypeScript with Interfaces

```typescript
interface User {
  id?: number;
  username: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface CreateUserDto {
  username: string;
  password: string;
}

class TimeWarpAPIClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(userData: CreateUserDto): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    this.token = response.accessToken;
    localStorage.setItem('authToken', this.token);

    return response;
  }

  async login(credentials: CreateUserDto): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    this.token = response.accessToken;
    localStorage.setItem('authToken', this.token);

    return response;
  }

  async getAllUsers(): Promise<{ users: string[] }> {
    return this.makeRequest('/users');
  }

  async getUserById(id: string): Promise<{ user: string }> {
    return this.makeRequest(`/users/${id}`);
  }
}
```

## Python Examples

### Using requests library

```python
import requests
import json
from typing import Dict, Any, Optional

class TimeWarpAPI:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.token: Optional[str] = None
        self.session = requests.Session()

    def _get_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers()

        response = self.session.request(
            method=method,
            url=url,
            headers=headers,
            json=data
        )

        response.raise_for_status()
        return response.json()

    def register(self, username: str, password: str) -> Dict[str, Any]:
        """Register a new user"""
        data = {"username": username, "password": password}
        response = self._make_request("POST", "/auth/register", data)

        # Store token for future requests
        self.token = response["accessToken"]
        return response

    def login(self, username: str, password: str) -> Dict[str, Any]:
        """Login with existing credentials"""
        data = {"username": username, "password": password}
        response = self._make_request("POST", "/auth/login", data)

        # Store token for future requests
        self.token = response["accessToken"]
        return response

    def get_all_users(self) -> Dict[str, Any]:
        """Get all users (requires authentication)"""
        return self._make_request("GET", "/users")

    def get_user_by_id(self, user_id: str) -> Dict[str, Any]:
        """Get user by ID (requires authentication)"""
        return self._make_request("GET", f"/users/{user_id}")

    def create_user(self, username: str, password: str) -> Dict[str, Any]:
        """Create new user (requires authentication)"""
        data = {"username": username, "password": password}
        return self._make_request("POST", "/users/create", data)

    def logout(self):
        """Clear authentication token"""
        self.token = None

# Usage examples
def main():
    api = TimeWarpAPI()

    try:
        # Register a new user
        print("Registering user...")
        register_response = api.register("pythonuser", "securePassword123")
        print(f"Registration successful: {register_response['user']}")

        # Login (optional since registration already provides token)
        print("\nLogging in...")
        login_response = api.login("pythonuser", "securePassword123")
        print(f"Login successful: {login_response['user']}")

        # Get all users
        print("\nGetting all users...")
        users = api.get_all_users()
        print(f"Users: {users}")

        # Get specific user
        print("\nGetting user by ID...")
        user = api.get_user_by_id("1")
        print(f"User: {user}")

        # Create new user
        print("\nCreating new user...")
        new_user = api.create_user("anotheruser", "password456")
        print(f"New user created: {new_user}")

    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
    except KeyError as e:
        print(f"Unexpected response format: {e}")

if __name__ == "__main__":
    main()
```

## Postman Collection

### Collection Structure
```json
{
  "info": {
    "name": "Time Warp Backend API",
    "description": "Complete API collection for Time Warp Backend"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{authToken}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "authToken",
      "value": "",
      "type": "string"
    }
  ]
}
```

### Pre-request Script for Auth Endpoints
```javascript
// Store token from response
pm.test("Store auth token", function () {
    var jsonData = pm.response.json();
    if (jsonData.accessToken) {
        pm.collectionVariables.set("authToken", jsonData.accessToken);
    }
});
```

## Frontend Integration Examples

### React Hook Example

```typescript
// hooks/useAuth.ts
import { useState, useContext, createContext, ReactNode } from 'react';

interface User {
  id?: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );
  const [isLoading, setIsLoading] = useState(false);

  const makeAuthRequest = async (endpoint: string, data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const result = await response.json();
      setUser(result.user);
      setToken(result.accessToken);
      localStorage.setItem('authToken', result.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    await makeAuthRequest('/auth/login', { username, password });
  };

  const register = async (username: string, password: string) => {
    await makeAuthRequest('/auth/register', { username, password });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Vue.js Composable Example

```typescript
// composables/useAuth.ts
import { ref, computed } from 'vue';

interface User {
  id?: number;
  username: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

const user = ref<User | null>(null);
const token = ref<string | null>(localStorage.getItem('authToken'));
const isLoading = ref(false);

export const useAuth = () => {
  const isAuthenticated = computed(() => !!token.value);

  const makeAuthRequest = async (endpoint: string, data: any): Promise<AuthResponse> => {
    isLoading.value = true;
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const result: AuthResponse = await response.json();
      user.value = result.user;
      token.value = result.accessToken;
      localStorage.setItem('authToken', result.accessToken);

      return result;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (username: string, password: string) => {
    return makeAuthRequest('/auth/login', { username, password });
  };

  const register = async (username: string, password: string) => {
    return makeAuthRequest('/auth/register', { username, password });
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('authToken');
  };

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    login,
    register,
    logout,
  };
};
```

## Error Handling Examples

### JavaScript with Proper Error Handling

```javascript
class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

async function handleAPICall(apiFunction) {
  try {
    return await apiFunction();
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case 401:
          console.error('Authentication failed. Please log in again.');
          // Redirect to login page
          break;
        case 403:
          console.error('Access denied. You don\'t have permission for this action.');
          break;
        case 400:
          console.error('Bad request:', error.response?.message || error.message);
          break;
        default:
          console.error('API Error:', error.message);
      }
    } else {
      console.error('Network or other error:', error.message);
    }
    throw error;
  }
}

// Usage
handleAPICall(() => api.getAllUsers())
  .then(users => console.log('Users loaded:', users))
  .catch(error => {
    // Error already handled in handleAPICall
    // Additional UI updates can be done here
  });
```

These examples demonstrate various ways to integrate with the Time Warp Backend API across different platforms and programming languages. Choose the approach that best fits your application's architecture and requirements.