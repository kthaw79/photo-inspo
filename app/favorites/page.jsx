import SignOutButton from "../components/SignOutButton"
import PhotoGrid from "../components/PhotoGrid"
import Nav from "../components/Nav"

export default function Favorites(){
    return (
        <main className="min-h-screen bg-gray-800 text-white relative p-10"
        style={{ 
            backgroundImage: 'url("https://cdn.mos.cms.futurecdn.net/gvQ9NhQP8wbbM32jXy4V3j.jpg.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <Nav />
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col items-center mb-6">
                <h1 className="text-4xl font-bold mb-4">Favorites</h1>
                <h2> The collection of your favorited photos </h2>
                </div>
                <PhotoGrid favorites={true}/>
            </div>
            <div className="absolute top-4 right-4">
                <SignOutButton/>
            </div>
        </main>
    )
}