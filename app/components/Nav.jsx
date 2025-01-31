import Link from "next/link";

export default function Nav(){
    return(
        <nav className="fixed top-0 left-0 p-4 z-10">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/photos" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
                        Photo Collection
                    </Link>
                </li>
                <li>
                    <Link href="/favorites" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
                        Favorites
                    </Link>
                </li>
                <li>
                    <Link href="/resources" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
                        Resources
                    </Link>
                </li>
                <li>
                    <Link href="/discussions" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
                        Discussions
                    </Link>
                </li>
                <li>
                    <Link href="/search" className="text-gray-300 hover:text-white transition duration-300 ease-in-out">
                        Search Users
                    </Link>
                </li>
            </ul>
        </nav>
    )
}