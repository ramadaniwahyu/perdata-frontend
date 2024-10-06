import { Link } from "react-router-dom"

function Home() {
    return (
        <>
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Latihan React untuk Pemula
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                            fugiat veniam occaecat fugiat aliqua.
                        </p>
                        <div className="w-full flex flex-column align-items-center justify-content-center gap-3 py-5 mt-6">

                            <Link
                                to="/login"
                                className="p-button font-bold"
                            >
                                Log in untuk memulai
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home