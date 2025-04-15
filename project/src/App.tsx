import React, { useState, useRef, useEffect } from 'react';
import { Music2, Headphones, Heart, PlayCircle, Radio, Mic2, Guitar, Drum, Piano, Clock, Play, Pause, SkipBack, SkipForward, Volume2, List, Search } from 'lucide-react';
import { generateMusicLibrary } from './utils/songGenerator';
import type { Song } from './types';

interface GenreCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  songs: Song[];
  onPlaySong: (song: Song) => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ icon, title, description, imageUrl, songs, onPlaySong }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"/>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex items-center gap-3 text-white mb-2">
            {icon}
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <p className="text-gray-200 text-sm">{description}</p>
        </div>
      </div>
      
      <div className="p-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-500 hover:text-green-400 font-medium flex items-center gap-2"
        >
          {isExpanded ? 'Hide Songs' : 'View Songs'}
          <PlayCircle className="w-4 h-4" />
        </button>
        
        {isExpanded && (
          <div className="mt-4 space-y-2">
            {songs.slice(0, 10).map((song, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <button 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onPlaySong(song)}
                  >
                    <Play className="w-4 h-4 text-green-500" />
                  </button>
                  <div>
                    <p className="text-white font-medium">{song.title}</p>
                    <p className="text-gray-400 text-sm">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">{song.duration}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-green-500" />
                  </button>
                </div>
              </div>
            ))}
            {songs.length > 10 && (
              <button 
                className="text-green-500 hover:text-green-400 text-sm mt-4"
                onClick={() => setShowAllSongs(true)}
              >
                View all {songs.length} songs
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const allSongs = generateMusicLibrary();

const genres = [
  {
    icon: <Piano className="w-6 h-6" />,
    title: "Classical",
    description: "Timeless compositions from the greatest composers",
    imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800",
    songs: allSongs.filter(song => song.genre === "Classical")
  },
  {
    icon: <Guitar className="w-6 h-6" />,
    title: "Rock",
    description: "From classic rock to modern alternatives",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800",
    songs: allSongs.filter(song => song.genre === "Rock")
  },
  {
    icon: <Mic2 className="w-6 h-6" />,
    title: "Hip Hop",
    description: "Beats, rhymes and urban culture",
    imageUrl: "https://images.unsplash.com/photo-1571609860554-389b61eda71d?auto=format&fit=crop&w=800",
    songs: allSongs.filter(song => song.genre === "HipHop")
  },
  {
    icon: <Radio className="w-6 h-6" />,
    title: "Electronic",
    description: "Digital sounds and electronic beats",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800",
    songs: allSongs.filter(song => song.genre === "Electronic")
  },
  {
    icon: <Drum className="w-6 h-6" />,
    title: "Jazz",
    description: "Smooth rhythms and improvised melodies",
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800",
    songs: allSongs.filter(song => song.genre === "Jazz")
  },
  {
    icon: <Music2 className="w-6 h-6" />,
    title: "Pop",
    description: "Chart-topping hits and catchy tunes",
    imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=800",
    songs: allSongs.filter(song => song.genre === "Pop")
  }
];

function App() {
  const [showAllSongs, setShowAllSongs] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [volume, setVolume] = useState(0.75);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 50;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredSongs = allSongs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const paginatedSongs = filteredSongs.slice(
    (currentPage - 1) * songsPerPage,
    currentPage * songsPerPage
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlaySong = (song: Song) => {
    if (currentSong?.title === song.title) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleSkipForward = () => {
    const currentIndex = allSongs.findIndex(song => song.title === currentSong?.title);
    if (currentIndex > -1 && currentIndex < allSongs.length - 1) {
      setCurrentSong(allSongs[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const handleSkipBack = () => {
    const currentIndex = allSongs.findIndex(song => song.title === currentSong?.title);
    if (currentIndex > 0) {
      setCurrentSong(allSongs[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl}
        onEnded={() => handleSkipForward()}
      />

      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Headphones className="w-8 h-8 text-green-500" />
              <span className="ml-2 text-xl font-bold">MusicVerse</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="hover:text-green-500 transition-colors flex items-center gap-2"
                onClick={() => setShowAllSongs(!showAllSongs)}
              >
                <List className="w-6 h-6" />
                Library
              </button>
              <button className="hover:text-green-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showAllSongs ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Your Library ({filteredSongs.length} songs)</h2>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search songs, artists, or genres..."
                  className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="grid grid-cols-[auto,1fr,auto] gap-4 text-sm text-gray-400 px-4 py-2 border-b border-gray-700">
                <span>#</span>
                <span>TITLE</span>
                <span>DURATION</span>
              </div>
              <div className="space-y-2 mt-2">
                {paginatedSongs.map((song, idx) => (
                  <div 
                    key={idx}
                    className="grid grid-cols-[auto,1fr,auto] gap-4 items-center px-4 py-2 hover:bg-gray-700/50 rounded-lg group cursor-pointer"
                    onClick={() => handlePlaySong(song)}
                  >
                    <span className="text-gray-400 group-hover:hidden">
                      {(currentPage - 1) * songsPerPage + idx + 1}
                    </span>
                    <button className="hidden group-hover:block text-green-500">
                      {currentSong?.title === song.title && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <div>
                      <p className="text-white font-medium">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist} • {song.genre}</p>
                    </div>
                    <span className="text-gray-400">{song.duration}</span>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Discover Your Sound</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explore different genres of music and find your perfect rhythm. From classical masterpieces to modern beats, 
                your next favorite track is waiting to be discovered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genres.map((genre, index) => (
                <GenreCard key={index} {...genre} onPlaySong={handlePlaySong} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-white font-medium">{currentSong.title}</p>
                  <p className="text-sm text-gray-400">{currentSong.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={handleSkipBack}
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button 
                  className="bg-white rounded-full p-2 hover:scale-105 transition-transform"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-black" />
                  ) : (
                    <Play className="w-6 h-6 text-black" />
                  )}
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={handleSkipForward}
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            © 2025 MusicVerse. All rights reserved. Created with passion for music lovers.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;