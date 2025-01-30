import PhotoUploader from "../components/PhotoUploader"
import SignOutButton from "../components/SignOutButton"
import PhotoGrid from "../components/PhotoGrid"
import Nav from "../components/Nav"

export default function Photos(){
    return (
        <main className="min-h-screen bg-black text-gray-200 relative p-8"
            style={{ 
                backgroundImage: 'url("https://cdn.mos.cms.futurecdn.net/gvQ9NhQP8wbbM32jXy4V3j.jpg.webp")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
            <Nav />
            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <div className="flex flex-col items-center mb-10">
                <h1 className="text-5xl font-extrabold mb-6">Photo Collection</h1>
                <PhotoUploader/>
                </div>
                <PhotoGrid/>
            </div>
            <div className="absolute top-5 right-5">
                <SignOutButton/>
            </div>
        </main>
    )
}