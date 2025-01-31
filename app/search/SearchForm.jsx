'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SearchForm({ onSearchResult }) {
  const [searchResult, setSearchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  async function handleSearch(e) {
    e.preventDefault();
    const email = e.target.elements.email.value;
    if (!email) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_user_by_email', { input_email: email })

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setSearchResult('not_found');
        onSearchResult(null);
      } else {
        setSearchResult(data);
        onSearchResult(data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Search users by email..."
          className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-60 text-black placeholder-gray-800 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
        />
        <button 
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searchResult === 'not_found' ? (
        <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg">
          <p className="text-white">User not found</p>
        </div>
      ) : searchResult && (
        <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg">
          <p className="text-white">User: {searchResult[0].email}</p>
          <button 
            onClick={() => onSearchResult({ ...searchResult[0], showGallery: true })}
            className="text-blue-400 hover:underline mt-2"
          >
            View Gallery
          </button>
        </div>
      )}
    </div>
  )
}