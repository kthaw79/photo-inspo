export default function SignOutButton() {
    return(
        <form action="/auth/signout" method="post">
            <button 
            type="submit"
            className="bg-gray-800 text-white font-bold py-3 px-5 rounded-lg transition duration-200 ease-in-out transform hover:bg-gray-600 hover:-translate-y-1 hover:shadow-lg">
                Sign Out
            </button>
        </form>
    )
}