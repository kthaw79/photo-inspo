'use client'

import Nav from "../components/Nav"
import SignOutButton from "../components/SignOutButton"
import SearchForm from "./SearchForm"
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Photo from "../components/Photo"

export default function Search() {
  const [photos, setPhotos] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!searchResult || !searchResult.showGallery) return;

    const fetchPhotos = async () => {
      const { data: photosList, error: photosError } = await supabase.storage
      .from('photos')
      .list(`user_uploads/${searchResult.id}/`)

      if (photosError) {
        console.error('Error fetching photos:', photosError);
        return;
      }

      const photoUrls = await Promise.all(photosList.map(async (photo) => {
        const { data, error } = await supabase.storage
          .from('photos')
          .createSignedUrl(`user_uploads/${searchResult.id}/${photo.name}`, 60 * 60);

        if (error) {
          console.error('Error generating signed url:', error);
          return null;
        }
        return { 
          url: data.signedUrl, 
          photoName: photo.name,
          isFavorited: false
        };
      }));

      setPhotos(photoUrls.filter(Boolean));
    };

    fetchPhotos();
  }, [searchResult, supabase]);

  return(
    <main className="min-h-screen bg-gray-800 text-white relative p-10"
      style={{ 
        backgroundImage: 'url("https://cdn.mos.cms.futurecdn.net/gvQ9NhQP8wbbM32jXy4V3j.jpg.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      <Nav />
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-[700px] mx-auto mt-12">
          <SearchForm onSearchResult={setSearchResult} />
          
          {searchResult?.showGallery && photos.length > 0 && (
            <div className="mt-8 bg-gray-900 bg-opacity-80 rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-4">Photos from {searchResult.email}</h1>
              <div className="flex flex-wrap justify-center gap-4">
                {photos.map((photo) => (
                  <Photo
                    key={photo.photoName}
                    src={photo.url}
                    alt={`Photo ${photo.photoName}`}
                    width={200}
                    height={200}
                    photoName={photo.photoName}
                    showFavorites={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <SignOutButton/>
      </div>
    </main>
  )
}