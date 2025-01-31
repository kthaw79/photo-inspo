'use client'

import Nav from "../../components/Nav"
import SignOutButton from "../../components/SignOutButton"
import SearchForm from "../../search/SearchForm"
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Photo from "../../components/Photo"
import React from 'react'

export default function Page({params}) {
  const [photos, setPhotos] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const supabase = createClientComponentClient();
  const id = (React.use(params)).id;

  useEffect(() => {
    const fetchPhotos = async () => {
      // Fetch favorites first
      const { data: favoritesList, error: favoritesError } = await supabase.storage
      .from('photos')
      .list(`user_uploads/${id}/`)


      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
        return;
      }

      // Get signed URLs only for favorited photos
      const photoUrls = await Promise.all(favoritesList.map(async (favorite) => {
        const { data, error } = await supabase.storage
          .from('photos')
          .createSignedUrl(`user_uploads/${id}/${favorite.name}`, 60 * 60);

          console.log("favorite:", favorite);
          console.log("data:", data);
        if (error) {
          console.error('Error generating signed url:', error);
          return null;
        }
        return { 
          url: data.signedUrl, 
          photoName: favorite.photo_name,
          isFavorited: favorite.favorite 
        };
      }));

      setPhotos(photoUrls.filter(Boolean));
    };

    fetchPhotos();
  }, [supabase]);

  return(
    <main className="min-h-screen bg-gray-800 text-white relative p-10"
      style={{ 
        backgroundImage: 'url("https://cdn.mos.cms.futurecdn.net/gvQ9NhQP8wbbM32jXy4V3j.jpg.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      <Nav />
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-[700px] mx-auto mt-12 bg-gray-900 bg-opacity-80 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Photos</h1>
          <div className="flex flex-wrap justify-center gap-4">
            {photos.map((photo) => (
              <Photo
                key={photo.photoName}
                src={photo.url}
                alt={`Photo ${photo.photoName}`}
                width={200}
                height={200}
                photoName={photo.photoName}
                isFavorited={photo.isFavorited}
                showFavorites={false}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <SignOutButton/>
      </div>
    </main>
  )
}