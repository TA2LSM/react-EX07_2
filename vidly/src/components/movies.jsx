import React, { Component } from 'react'; //imrc
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';
import _ from 'lodash';

//components
import Pagination from './common/pagination';
import ListGroup from './common/listGroup';
import MoviesTable from './moviesTable';

// reusable
import { paginate } from '../utils/paginate';

//cc
class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    // selectedGenre: [],
    defaultPageSizes: [1, 2, 3, 4, 5, 10],
    currentPage: 1,
    //pageSize: 1,
    sortColumn: {
      path: 'title',
      order: 'asc',
    },
  };

  componentDidMount() {
    const genres = [{ name: 'All Genres', _id: 'specialID_9074386754' }, ...getGenres()];
    const selectedGenre = genres[0];

    const availablePageSizes = [...this.state.defaultPageSizes];
    const pageSize = availablePageSizes[2];

    this.setState({ movies: getMovies(), genres, selectedGenre, pageSize });
  }

  // arrow function syntax'i kullanıldı. (this ifadesini constructor içinde bind etmeye gerek olmasın diye)
  handleDelete = movie => {
    // //console.log(movie); // silinen movie'yi consola bas
    // const updatedMovies = this.state.movies.filter((m) => m._id !== movie._id);
    // this.setState({ movies: updatedMovies }); // this ile erişildiği için direkt "movies" property'si güncellenebilir.

    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });
    // modern JavaScript'te değiştirilen değer ile yerine koyulacak değerlerin isimleri aynı ise kod
    // yukarıdaki gibi yazılabilir.
  };

  handleLike = movie => {
    //console.log(movie);
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);

    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;

    this.setState({ movies });
  };

  handlePageChange = pageNumber => {
    //console.log(pageNumber);
    this.setState({ currentPage: pageNumber });
  };

  handlePageSizeChange = pageSize => {
    //console.log(pageSize);
    this.setState({ pageSize, currentPage: 1 });
  };

  handlePrevious = pageNumber => {
    // console.log(pageNumber);
    if (pageNumber > 1) this.setState({ currentPage: pageNumber - 1 });
  };
  handleNext = (pageNumber, totalPages) => {
    // console.log(pageNumber);
    if (pageNumber < totalPages) this.setState({ currentPage: pageNumber + 1 });
  };

  handleGenreSelect = genre => {
    //console.log(genre);
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPageData = () => {
    const { movies: allMovies, currentPage, pageSize, selectedGenre, sortColumn } = this.state;

    // aşağıdaki lojik sorgu ifadesinde " selectedGenre.name !== "All Genres" " yerine
    // "selectedGenre._id" de kullanılabilir.
    const filteredMovies =
      selectedGenre && selectedGenre.name !== 'All Genres'
        ? allMovies.filter(m => m.genre._id === selectedGenre._id)
        : allMovies;

    const sortedMovies = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sortedMovies, currentPage, pageSize);

    return { totalCount: filteredMovies.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies;
    //movies objesine ait lenght metodunun dönüşü count olarak alınıyor
    if (count === 0) return <p>There no movies in the database!</p>;

    const { genres: allGenres, defaultPageSizes, currentPage, pageSize, selectedGenre, sortColumn } = this.state;

    let tableHeight = pageSize * 50 + 45;
    tableHeight = tableHeight.toString() + 'px';

    const { totalCount, data: movies } = this.getPageData();

    return (
      <div>
        <div
          className='row-sm mb-2'
          style={{
            height: '50px',
            backgroundColor: 'aqua',
            border: '3px solid green',
            fontSize: '20px',
            textAlign: 'center',
            // display: "block",
            // alignItems: "center",
            // alignContent: "center",
          }}
        >
          <p style={{ marginTop: '5px' }}>
            <strong>
              <i>Vidly</i>
            </strong>{' '}
            Application (Modified by: <strong>TA2LSM</strong>)
          </p>
        </div>
        <div className='row g-2'>
          <div
            className='col-2'
            style={{ textAlign: 'center' }}
          >
            <p>
              <b>
                <i>SELECT GENRE</i>
              </b>
            </p>
          </div>

          <div
            className='col'
            style={{ textAlign: 'end' }}
          >
            <p>
              Showing <b>{totalCount}</b> movies in the database
            </p>
          </div>
        </div>

        <div className='row g-2'>
          <div className='col-2 me-2'>
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

          <div className='col'>
            <div className='col g-2'>
              <div
                className='row d-flex flex-column'
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

              <hr
                className='border-2 border-bottom border-danger'
                // style={{ border: "2px red dashed" }}
                // bg-danger
              />

              <div
                className='row g-2'
                // style={{ border: '1px solid red' }}
              >
                <Pagination
                  itemsCount={totalCount}
                  pageSize={pageSize}
                  defaultPageSizes={defaultPageSizes}
                  currentPage={currentPage}
                  onPageChange={this.handlePageChange}
                  onSelectPrevious={this.handlePrevious}
                  onSelectNext={this.handleNext}
                  onPageSizeSelection={this.handlePageSizeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
