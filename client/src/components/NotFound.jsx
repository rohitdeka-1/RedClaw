import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">Sorry  the page you were looking for doesn’t exist.</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:shadow-sm"
          >
            Go back
          </button>

          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Take me home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
