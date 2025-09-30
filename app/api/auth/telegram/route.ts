import { NextRequest, NextResponse } from 'next/server'
import { 
  validateTelegramWebAppData, 
  findOrCreateUser, 
  createSessionToken 
} from '@/lib/telegram-auth'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json()
    
    if (!initData) {
      return NextResponse.json(
        { success: false, error: 'Missing initData' }, 
        { status: 400 }
      )
    }

    // Валидируем данные Telegram
    const telegramData = validateTelegramWebAppData(initData, BOT_TOKEN)
    
    if (!telegramData || !telegramData.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid Telegram data' }, 
        { status: 401 }
      )
    }

    // Находим или создаем пользователя
    const user = await findOrCreateUser(telegramData.user)
    
    // Создаем сессионный токен
    const sessionToken = createSessionToken(user.id)
    
    // Возвращаем данные пользователя и токен
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        photoUrl: user.photoUrl,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent,
      },
      sessionToken
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
