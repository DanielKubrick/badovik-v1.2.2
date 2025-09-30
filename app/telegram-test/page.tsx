import Link from 'next/link'

export default function TelegramTest() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ SSL Test Success!
        </h1>
        <p className="text-gray-700 mb-4">
          Если вы видите эту страницу в Telegram Mini App, значит SSL сертификат работает корректно!
        </p>
        <div className="bg-gray-100 rounded p-4 text-sm">
          <p><strong>Domain:</strong> badovik.dedyn.io</p>
          <p><strong>SSL:</strong> Let&apos;s Encrypt</p>
          <p><strong>Status:</strong> ✅ Working</p>
          <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
        </div>
        <div className="mt-4">
          <Link 
            href="/"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Перейти в магазин
          </Link>
        </div>
      </div>
    </div>
  )
}
