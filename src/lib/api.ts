const API_BASE = 'http://localhost:8080';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('dot_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || `Error: ${response.status}` };
    }

    const text = await response.text();
    if (!text) {
      return { data: undefined as T };
    }
    
    const data = JSON.parse(text);
    return { data };
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

// Auth endpoints (no token required)
export const createUser = (email: string, password: string) =>
  apiRequest('/create_user', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const login = (email: string, password: string) =>
  apiRequest<{ token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const updatePassword = (oldPassword: string, newPassword: string) =>
  apiRequest('/update_password', {
    method: 'PATCH',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });

// Wallet endpoints (token required)
export interface WalletInfo {
  wallet_name: string;
  holding_amount: number;
}

export interface GetWalletsResponse {
  wallets: WalletInfo[];
}

export const getWallets = () =>
  apiRequest<GetWalletsResponse>('/get_wallets', { method: 'GET' });

export const createWallet = (walletName: string) =>
  apiRequest<{ wallet_name: string }>('/create_wallet', {
    method: 'POST',
    body: JSON.stringify({ wallet_name: walletName }),
  });

export const updateWalletName = (oldWalletName: string, newWalletName: string) =>
  apiRequest('/update_wallet_name', {
    method: 'POST',
    body: JSON.stringify({ old_wallet_name: oldWalletName, new_wallet_name: newWalletName }),
  });

export const fundWallet = (walletName: string, amount: number, userId: number) =>
  apiRequest('/fund_wallet', {
    method: 'POST',
    body: JSON.stringify({ wallet_name: walletName, amount, userId }),
  });

export const deleteWallet = (walletName: string) =>
  apiRequest('/delete_wallet', {
    method: 'DELETE',
    body: JSON.stringify({ wallet_name: walletName }),
  });

export const offrampWallet = (walletName: string) =>
  apiRequest(`/offramp_wallet?wallet_name=${encodeURIComponent(walletName)}`, { method: 'GET' });

// Auth helpers
export const setToken = (token: string) => {
  localStorage.setItem('dot_token', token);
};

export const getToken = () => localStorage.getItem('dot_token');

export const clearToken = () => {
  localStorage.removeItem('dot_token');
};

export const isAuthenticated = () => !!getToken();
