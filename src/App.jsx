import React, { useState, useEffect } from 'react';

// Main App Component
function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyapi.online/api/movies/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setMovies(data);
        setFilteredMovies(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = movies.filter(movie => 
      movie.title.toLowerCase().includes(term) || 
      movie.genre.toLowerCase().includes(term)
    );
    
    setFilteredMovies(filtered);
  };

  // Handle movie selection for detailed view
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  // Go back to movie list
  const handleBackToList = () => {
    setSelectedMovie(null);
  };

  if (loading) return <div className="container mx-auto p-4 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="bg-blue-600 text-white p-4 mb-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Movie Database</h1>
      </header>

      {!selectedMovie ? (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search movies by title or genre..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border rounded shadow-sm"
            />
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center p-4">No movies found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onSelect={handleMovieSelect} 
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <MovieDetail movie={selectedMovie} onBack={handleBackToList} />
      )}
    </div>
  );
}

// Movie Card Component
function MovieCard({ movie, onSelect }) {
  return (
    <div 
      className="border rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(movie)}
    >
      {movie.posterUrl && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={movie.posterUrl || "/api/placeholder/300/200"} 
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/api/placeholder/300/200";
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{movie.year}</span>
          <span>{movie.genre}</span>
        </div>
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            ★ {movie.rating || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Movie Detail Component
function MovieDetail({ movie, onBack }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <button 
        onClick={onBack}
        className="bg-blue-600 text-white px-4 py-2 m-4 rounded hover:bg-blue-700"
      >
        Back to Movies
      </button>
      
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={movie.posterUrl || "/api/placeholder/400/600"} 
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/api/placeholder/400/600";
            }}
          />
        </div>
        
        <div className="p-6 md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-200 px-2 py-1 rounded text-sm">{movie.year}</span>
            <span className="bg-gray-200 px-2 py-1 rounded text-sm">{movie.genre}</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">★ {movie.rating || 'N/A'}</span>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Director</h2>
            <p>{movie.director || 'Unknown'}</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Plot</h2>
            <p className="text-gray-700">{movie.plot || 'No plot description available.'}</p>
          </div>
          
          {movie.cast && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Cast</h2>
              <p className="text-gray-700">{movie.cast}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;