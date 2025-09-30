import crypto from 'crypto'
import { prisma } from './prisma'

// Интерфейсы для Telegram WebApp
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TelegramWebAppInitData {
  user?: TelegramUser
  chat_instance?: string
  chat_type?: string
  start_param?: string
  auth_date: number
  hash: string
  query_id?: string
}

/**
 * Валидация данных от Telegram WebApp
 */
export function validateTelegramWebAppData(
  initData: string, 
  botToken: string
): TelegramWebAppInitData | null {
  try {
    // Парсим URL параметры
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    
    if (!hash) {
      console.error('Missing hash in init data')
      return null
    }

    // Создаем строку для проверки подписи
    params.delete('hash')
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    // Создаем секретный ключ
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Проверяем подпись
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    if (calculatedHash !== hash) {
      console.error('Invalid hash')
      return null
    }

    // Проверяем временную метку (не старше 24 часов)
    const authDate = parseInt(params.get('auth_date') || '0')
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime - authDate > 86400) { // 24 часа
      console.error('Init data is too old')
      return null
    }

    // Парсим данные пользователя
    const userData = params.get('user')
    const user = userData ? JSON.parse(userData) as TelegramUser : undefined

    return {
      user,
      chat_instance: params.get('chat_instance') || undefined,
      chat_type: params.get('chat_type') || undefined,
      start_param: params.get('start_param') || undefined,
      auth_date: authDate,
      hash,
      query_id: params.get('query_id') || undefined
    }
  } catch (error) {
    console.error('Error validating Telegram WebApp data:', error)
    return null
  }
}

/**
 * Найти или создать пользователя в базе данных
 */
export async function findOrCreateUser(telegramUser: TelegramUser) {
  try {
    const telegramId = telegramUser.id.toString()
    
    // Попытаемся найти существующего пользователя
    let user = await prisma.user.findUnique({
      where: { telegramId }
    })

    if (!user) {
      // Создаем нового пользователя
      user = await prisma.user.create({
        data: {
          telegramId,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
          languageCode: telegramUser.language_code,
          isPremium: telegramUser.is_premium || false,
          photoUrl: telegramUser.photo_url,
        }
      })
      
      console.log(`New user created: ${telegramId} (${telegramUser.first_name})`)
    } else {
      // Обновляем последнюю активность и данные пользователя
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
          languageCode: telegramUser.language_code,
          isPremium: telegramUser.is_premium || false,
          photoUrl: telegramUser.photo_url,
          lastActiveAt: new Date(),
        }
      })
    }

    return user
  } catch (error) {
    console.error('Error finding or creating user:', error)
    throw error
  }
}

/**
 * Создание JWT токена (простая версия)
 */
export function createSessionToken(userId: string): string {
  const payload = { userId, timestamp: Date.now() }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

/**
 * Валидация JWT токена
 */
export function validateSessionToken(token: string): { userId: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Проверяем, что токен не старше 30 дней
    if (Date.now() - payload.timestamp > 30 * 24 * 60 * 60 * 1000) {
      return null
    }
    
    return { userId: payload.userId }
  } catch {
    return null
  }
}
