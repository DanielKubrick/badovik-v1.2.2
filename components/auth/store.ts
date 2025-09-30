import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  telegramId: string
  firstName?: string
  lastName?: string
  username?: string
  photoUrl?: string
  totalOrders: number
  totalSpent: number
}

interface AuthState {
  user: User | null
  sessionToken: string | null
  isAuthenticated: boolean
  loading: boolean
  
  // Actions
  login: (initData: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setUser: (user: User) => void
  updateUserStats: (orders: number, spent: number) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionToken: null,
      isAuthenticated: false,
      loading: false,
      
      login: async (initData: string) => {
        try {
          set({ loading: true })
          
          const response = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData })
          })

          const result = await response.json()
          
          if (result.success && result.user && result.sessionToken) {
            set({
              user: result.user,
              sessionToken: result.sessionToken,
              isAuthenticated: true,
              loading: false
            })
            
            return { success: true }
          } else {
            set({ loading: false })
            return { success: false, error: result.error || 'Authentication failed' }
          }
        } catch (error) {
          console.error('Login error:', error)
          set({ loading: false })
          return { success: false, error: 'Network error' }
        }
      },
      
      logout: () => {
        set({
          user: null,
          sessionToken: null,
          isAuthenticated: false
        })
      },
      
      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },
      
      updateUserStats: (orders: number, spent: number) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              totalOrders: orders,
              totalSpent: spent
            }
          })
        }
      }
    }),
    {
      name: 'mini-woo-auth',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          }
        }
        return localStorage
      }),
    }
  )
)

// Hook для получения заголовков авторизации
export const useAuthHeaders = () => {
  const sessionToken = useAuth(state => state.sessionToken)
  
  return sessionToken 
    ? { Authorization: `Bearer ${sessionToken}` }
    : {}
}
