import AuthForm from "./components/AuthForm"

export default function Home() {
  return (
    <main className="flex items-center justify-center bg-gray-800 bg-opacity-50 bg-cover bg-center min-h-screen"
          style={{ backgroundImage: 'url("https://www.findbanquet.com/blog/wp-content/uploads/2024/06/photographers.jpg")' }}>
      <div className="bg-gray-600 bg-opacity-90 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-white text-3xl font-semibold mb-5 text-center">Welcome to Photo Inspo</h2>
        <p className="text-gray-300 text-xl mb-8 text-center">
          Where moments captured through lens are collected
        </p>
        <AuthForm />
      </div>
    </main>
  )
}

