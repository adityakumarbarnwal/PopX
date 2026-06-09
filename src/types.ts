/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  fullName: string;
  phone: string;
  email: string;
  companyName?: string;
  isAgency: 'yes' | 'no';
}

export type ScreenType = 'welcome' | 'login' | 'signup' | 'profile';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
