import MovieCard from "../components/MovieCard";
import { useEffect, useState } from "react";
import { searchMovies, getPopularMoviews } from "../services/api";
import "../css/Home.css";

function Home() {
  const [serachQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMoviews();
        setMovies(popularMovies);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if(!serachQuery.trim()) return
    if(loading) return

    setLoading(true)
    try{
      const searchResults = await searchMovies(serachQuery)
      setMovies(searchResults)
      setError(null)
    }catch(err) {
      setError("Failed to search movies...")
    }
    finally {
      setLoading(false)
    }

  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movie..."
          className="search-input"
          value={serachQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (<div className="loading">Loading...</div>)
      : (
        <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
      )}
    </div>
  );
}

export default Home;
