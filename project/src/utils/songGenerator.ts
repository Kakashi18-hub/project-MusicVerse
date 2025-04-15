import { Song } from '../types';

const songTitles = {
  Rock: [
    "Electric Dreams", "Midnight Rider", "Thunder Road", "Wild Heart", "Neon Lights",
    "Desert Storm", "City Lights", "Breaking Free", "Lost Highway", "Rising Sun"
  ],
  Pop: [
    "Dancing Queen", "Summer Love", "Heartbeat", "Starlight", "Ocean Eyes",
    "Golden Hour", "Midnight Sky", "Sweet Dreams", "Paradise", "Wonderland"
  ],
  HipHop: [
    "Street Life", "Urban Flow", "City Beats", "Rhythm & Poetry", "Concrete Jungle",
    "Downtown", "Night Life", "Street Dreams", "City Lights", "Urban Legend"
  ],
  Jazz: [
    "Blue Moon", "Midnight Jazz", "Smooth Sailing", "Night & Day", "Sweet Melody",
    "Autumn Leaves", "Moonlight", "Star Dust", "Blue Sky", "Night Train"
  ],
  Classical: [
    "Moonlight", "Spring Symphony", "Winter Dreams", "Summer Night", "Autumn Wind",
    "Morning Light", "Evening Song", "Night Music", "Dawn Chorus", "Twilight"
  ],
  Electronic: [
    "Digital Dreams", "Electric Sky", "Neon Nights", "Cyber Space", "Future World",
    "Tech Life", "Digital Age", "Virtual Reality", "Electric City", "Cyber Dreams"
  ]
} as const;

const artists = {
  Rock: [
    "The Stone Raiders", "Electric Thunder", "Midnight Riders", "Desert Storm",
    "The Night Owls", "Solar Eclipse", "Thunder Gods", "Lightning Strike",
    "Mountain Kings", "Ocean Drive"
  ],
  Pop: [
    "Starlight Sisters", "Dream Makers", "The Harmony", "Sweet Symphony",
    "Crystal Clear", "Golden Voice", "Silver Sound", "Diamond Dreams",
    "Pearl Junction", "Ruby Nights"
  ],
  HipHop: [
    "Urban Poets", "Street Kings", "City Slickers", "Beat Masters",
    "Rhythm Nation", "Flow Masters", "Word Smith", "Beat Boxers",
    "Rhyme Masters", "Flow Dynasty"
  ],
  Jazz: [
    "Blue Note Quartet", "Smooth Operators", "Night Birds", "Jazz Messengers",
    "Cool Cats", "Swing Kings", "Blues Brothers", "Jazz Masters",
    "Night Owls", "Blue Moon"
  ],
  Classical: [
    "Vienna Philharmonic", "London Symphony", "Royal Orchestra", "Berlin Philharmonic",
    "New York Philharmonic", "Paris Orchestra", "Moscow Symphony", "Tokyo Philharmonic",
    "Amsterdam Concertgebouw", "Cleveland Orchestra"
  ],
  Electronic: [
    "Digital Masters", "Electric Dreams", "Cyber Punks", "Tech Lords",
    "Virtual Reality", "Digital Age", "Electric Sky", "Neon Knights",
    "Future World", "Cyber Space"
  ]
} as const;

function generateDuration(): string {
  const minutes = Math.floor(Math.random() * 7) + 2; // 2-8 minutes
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function generateSongs(genre: keyof typeof songTitles, count: number): Song[] {
  const songs: Song[] = [];
  const titles = songTitles[genre];
  const genreArtists = artists[genre];

  for (let i = 0; i < count; i++) {
    const titleBase = titles[i % titles.length];
    const artist = genreArtists[i % genreArtists.length];
    const songNumber = Math.floor(i / titles.length) + 1;
    const title = songNumber > 1 ? `${titleBase} ${songNumber}` : titleBase;
    
    songs.push({
      title,
      artist,
      duration: generateDuration(),
      genre,
      audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`
    });
  }

  return songs;
}

export function generateMusicLibrary(): Song[] {
  const songsPerGenre = Math.floor(1000 / Object.keys(songTitles).length);
  let allSongs: Song[] = [];

  (Object.keys(songTitles) as (keyof typeof songTitles)[]).forEach(genre => {
    allSongs = [...allSongs, ...generateSongs(genre, songsPerGenre)];
  });

  // Shuffle the songs array
  for (let i = allSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSongs[i], allSongs[j]] = [allSongs[j], allSongs[i]];
  }

  return allSongs;
}