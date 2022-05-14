import React, { Component } from "react"; //imrc
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import _ from "lodash";

//components
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";

// reusable
import { paginate } from "../utils/paginate";

//cc
class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    // selectedGenre: [],
    currentPage: 1,
    pageSize: 4,
    sortColumn: {
      path: "title",
      order: "asc",
    },
  };

  componentDidMount() {
    const genres = [
      { name: "All Genres", _id: "specialID_9074386754" },
      ...getGenres(),
    ];
    const selectedGenre = genres[0];

    this.setState({ movies: getMovies(), genres, selectedGenre });
  }

  // arrow function syntax'i kullanıldı. (this ifadesini constructor içinde bind etmeye gerek olmasın diye)
  handleDelete = (movie) => {
    // //console.log(movie); // silinen movie'yi consola bas
    // const updatedMovies = this.state.movies.filter((m) => m._id !== movie._id);
    // this.setState({ movies: updatedMovies }); // this ile erişildiği için direkt "movies" property'si güncellenebilir.

    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
    // modern JavaScript'te değiştirilen değer ile yerine koyulacak değerlerin isimleri aynı ise kod
    // yukarıdaki gibi yazılabilir.
  };

  handleLike = (movie) => {
    //console.log(movie);
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);

    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;

    this.setState({ movies });
  };

  handlePageChange = (pageNumber) => {
    //console.log(pageNumber);
    this.setState({ currentPage: pageNumber });
  };

  handlePrevious = (pageNumber) => {
    // console.log(pageNumber);
    if (pageNumber > 1) this.setState({ currentPage: pageNumber - 1 });
  };
  handleNext = (pageNumber, totalPages) => {
    // console.log(pageNumber);
    if (pageNumber < totalPages) this.setState({ currentPage: pageNumber + 1 });
  };

  handleGenreSelect = (genre) => {
    //console.log(genre);
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  render() {
    const { length: count } = this.state.movies;
    //movies objesine ait lenght metodunun dönüşü count olarak alınıyor

    const {
      currentPage,
      pageSize,
      selectedGenre,
      movies: allMovies,
      genres: allGenres,
      sortColumn,
    } = this.state;

    if (count === 0) return <p>There no movies in the database!</p>;

    let tableHeight = (pageSize + 1) * 50 + 20;
    tableHeight = tableHeight.toString() + "px";

    // aşağıdaki lojik sorgu ifadesinde " selectedGenre.name !== "All Genres" " yerine
    // "selectedGenre._id" de kullanılabilir.
    const filteredMovies =
      selectedGenre && selectedGenre.name !== "All Genres"
        ? allMovies.filter((m) => m.genre._id === selectedGenre._id)
        : allMovies;

    const sortedMovies = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );

    const movies = paginate(sortedMovies, currentPage, pageSize);

    return (
      <div>
        <div
          className="row-sm mb-2"
          style={{
            height: "50px",
            backgroundColor: "aqua",
            border: "3px solid green",
            fontSize: "20px",
            textAlign: "center",
            // display: "block",
            // alignItems: "center",
            // alignContent: "center",
          }}
        >
          <p style={{ marginTop: "5px" }}>
            <strong>
              <i>Vidly</i>
            </strong>{" "}
            Application (Modified by: <strong>TA2LSM</strong>)
          </p>
        </div>
        <div className="row g-2">
          <div className="col-2" style={{ textAlign: "center" }}>
            <p>
              <b>
                <i>SELECT GENRE</i>
              </b>
            </p>
          </div>
          <div className="col" style={{ textAlign: "end" }}>
            <p>
              Showing <b>{filteredMovies.length}</b> movies in the database
            </p>
          </div>
        </div>
        <div className="row g-2">
          <div className="col-2">
            <ListGroup
              items={allGenres}
              selectedItem={selectedGenre}
              // aşağıdaki değerler modül içinde default geçildi. Burada başka bir değer verilirse
              // default değerlerin üstüne yazılır.
              // textProperty="name"
              // valueProperty="_id"
              onItemSelect={this.handleGenreSelect}
            />
          </div>

          <div className="col">
            <div className="col g-2">
              <div
                className="row d-flex flex-column"
                style={{ height: tableHeight }}
              >
                <MoviesTable
                  movies={movies}
                  sortColumn={sortColumn}
                  onLike={this.handleLike}
                  onDelete={this.handleDelete}
                  onSort={this.handleSort}
                />
              </div>

              <hr style={{ border: "1px dashed red" }} />

              <div className="row g-2">
                <div className="col d-flex align-items-center">
                  <span>Items per page</span>
                  <div
                    className="dropdown"
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    <button
                      className="btn btn-outline-info dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      // aria-haspopup="true"
                      // aria-expanded="false"
                    >
                      Select
                    </button>

                    <ul className="dropdown-menu">
                      <li>
                        <span className="dropdown-item">2</span>
                      </li>
                      <li>
                        <span className="dropdown-item">3</span>
                      </li>
                      <li>
                        <span className="dropdown-item">4</span>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <span className="dropdown-item">10</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col">
                  <Pagination
                    itemsCount={filteredMovies.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                    onSelectPrevious={this.handlePrevious}
                    onSelectNext={this.handleNext}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
