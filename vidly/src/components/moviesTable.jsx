import React, { Component } from 'react';
//import React from "react"; //imr kısayolu

//components
import Like from './common/like';
import TableHeader from './common/tableHeader';

class MoviesTable extends Component {
  columns = [
    { path: 'title', label: 'Title', sortable: 'true' },
    { path: 'genre.name', label: 'Genre', sortable: 'true' },
    { path: 'numberInStock', label: 'Stock', sortable: 'true' },
    { path: 'dailyRentalRate', label: 'Rate', sortable: 'true' },
    { label: 'Like', sortable: 'false' },
    { label: 'Modify', sortable: 'false' },
    // { key: "like", label: "Modify" },
  ];

  render() {
    const { movies, onDelete, onLike, sortColumn, onSort } = this.props;

    return (
      <div>
        {/* table.table>thead>tr>th*4 yazıp enter'a basınca template otomatik olarak çıkıyor. (Zen coding) */}
        <table className='table'>
          <TableHeader
            columns={this.columns}
            sortColumn={sortColumn}
            onSort={onSort}
          />
          <tbody>
            {movies.map(movie => (
              <tr
                className='align-middle'
                key={movie._id}
                style={{ height: '50px' }}
              >
                <td>{movie.title}</td>
                <td>{movie.genre.name}</td>
                <td className='fw-bold'>{movie.numberInStock}</td>
                <td>{movie.dailyRentalRate}</td>
                <td>
                  <Like
                    liked={movie.liked}
                    onClick={() => onLike(movie)}
                  />
                </td>
                <td>
                  {/* 
                    button.btn.btn-danger.btn-sm yazıp tab'a basınca aşağıdaki template çıkıyor 
                    bir metoda parametre geçebilmek için () => this.method(param) şeklinde yazmak gerekiyor.
                    parametre almayan bir metot ise ASLA this.method() olarak yazmıyoruz this.method olarak yazıyoruz.
                */}
                  <button
                    onClick={() => onDelete(movie)}
                    className='btn btn-danger btn-sm fw-bold'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MoviesTable;
