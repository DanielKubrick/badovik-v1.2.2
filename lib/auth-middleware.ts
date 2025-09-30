import { NextRequest } from 'next/server'
import { validateSessionToken } from './telegram-auth'
import { prisma } from './prisma'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    telegramId: string
    firstName?: string
    lastName?: string
    username?: string
  }
}

/**
 * Получить пользователя из заголовка авторизации
 */
export async function getUserFromRequest(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.slice(7) // Убираем 'Bearer '
  const sessionData = validateSessionToken(token)
  
  if (!sessionData) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      select: {
        id: true,
        telegramId: true,
        firstName: true,
        lastName: true,
        username: true,
        photoUrl: true,
        totalOrders: true,
        totalSpent: true,
      }
    })

    if (user) {
      // Обновляем последнюю активность
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() }
      })
    }

    return user
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
}

/**
 * Middleware для защищенных роутов
 */
export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request)
  
  if (!user) {
    return {
      error: 'Unauthorized',
      status: 401
    }
  }

  return { user }
}

/**
 * Верифицирует аутентификацию пользователя
 */
export async function verifyAuth(request: NextRequest) {
  const user = await getUserFromRequest(request)
  
  if (!user) {
    return {
      success: false,
      error: 'Unauthorized',
      user: null
    }
  }

  return {
    success: true,
    user,
    error: null
  }
}
