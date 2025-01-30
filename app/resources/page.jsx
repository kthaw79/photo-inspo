import SignOutButton from "../components/SignOutButton"
import Nav from "../components/Nav"
import React from 'react'

export default function Resources(){
    return (
        <main className="min-h-screen bg-gray-800 text-white relative p-10"
        style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <Nav />
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col items-center mb-6">
                <h1 className="text-4xl font-bold mb-4">Resources</h1>
                <h2> Click on the links below to direct yourself to tutorial videos and resources </h2>
                </div>

                <div className="flex flex-col items-start">
                    <h1 className="text-2xl flex-col mb-6">Videos</h1>
                    <a href="https://www.youtube.com/watch?v=yhAmMUi2NmM" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        Learn Photography for Beginners
                    </a>
                    <a href="https://www.youtube.com/watch?v=V7z7BAZdt2M" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        Photograhy Basics in 10 minutes
                    </a>
                    <a href="https://www.youtube.com/watch?v=O5oAxxzTG34" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        5 Street Photography Tips Every Photograher Should Know
                    </a>
                    <a href="https://www.youtube.com/watch?v=AtdIdoQMISM" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        5 Tips to Instantly Improve your Portraits
                    </a>
                    <a href="https://www.youtube.com/watch?v=-UiMQi9L2ek" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-20">
                        How to Build a Professional Photography Portfolio in Under 10 Minutes
                    </a>
                </div>

                <div className="flex flex-col items-start">
                    <h1 className="text-2xl flex-col mb-6">Articles</h1>
                    <a href="https://photographylife.com/what-is-photography" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        Introduction to Photography: The Universal Language
                    </a>
                    <a href="https://www.naturephotographers.network/articles/" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        Nature Photography Articles
                    </a>
                    <a href="https://www.newyorker.com/culture/open-questions/what-can-you-learn-from-photographing-your-life" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        What Can You Learn From Photographing Your Life?
                    </a>
                    <a href="https://streetphotographymagazine.com/" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        Street Photography Magazine
                    </a>
                    <a href="https://www.travelphotographyguru.com/travel-blogs/portrait-photos-why-make-them-and-why-are-they-so-important" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition duration-300 ease-in-out px-4 py-2 rounded-md shadow-lg hover:shadow-xl bg-gray-500 hover:bg-gray-700 mb-4">
                        Portrait Photos: Why Make Them And Why Are They So Important
                    </a>
                </div>


            </div>
            <div className="absolute top-4 right-4">
                <SignOutButton/>
            </div>
        </main>
    )
}