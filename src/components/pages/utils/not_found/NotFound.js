import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <>
      <div className="card">
        <div className="w-full flex flex-column align-items-center justify-content-center gap-3 py-5 mt-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              404 Not Found
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
              fugiat veniam occaecat fugiat aliqua.
            </p>
            <div className="w-full flex flex-column align-items-center justify-content-center gap-3 py-5 mt-6">
              <Link
                to="/"
                className="p-button font-bold"
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
