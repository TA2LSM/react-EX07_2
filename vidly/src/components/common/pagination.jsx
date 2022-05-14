import React from "react";

import _ from "lodash"; // lodash, underscore'un optimize edilmiş hali
import PropTypes from "prop-types";

const Pagination = (props) => {
  const { itemsCount, pageSize, currentPage, onPageChange } = props;
  const pagesCount = Math.ceil(itemsCount / pageSize); // bölüm sonucunu tam sayıya yuvarlar

  //   console.log(currentPage);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1); //1, 2, ... pagesCount da dahil olmak üzere bir dizi oluşturur.

  return (
    <div className="d-flex justify-content-end">
      <nav aria-label="tablePagination">
        <ul className="pagination">
          <li
            key="previous"
            className={currentPage !== 1 ? "page-item" : "page-item disabled"}
          >
            <a
              className="page-link"
              onClick={() => props.onSelectPrevious(currentPage)}
            >
              <i className="fa fa-fw fa-angle-double-left" />
              <strong>Previous</strong>
            </a>
          </li>

          {/* map metodu kullanıldığı için "key" lazım. Elle yazılsa sorun olmuyor */}
          {pages.map((page) => (
            <li
              key={page}
              className={
                page === currentPage
                  ? "page-item fst-italic fw-bold active"
                  : "page-item"
              }
            >
              <a className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </a>
            </li>
          ))}

          <li
            key="next"
            className={
              currentPage !== pagesCount ? "page-item" : "page-item disabled"
            }
          >
            <a
              className="page-link"
              onClick={() => props.onSelectNext(currentPage, pagesCount)}
            >
              <strong>Next</strong>
              <i className="fa fa-fw fa-angle-double-right" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// metot yanlış yazılırsa (proptypes ya da PropTypes gibi) çalışmayacaktır !!!
//.propTypes olmalı. Tüm veri tipleri için reactjs.org'dan "type checking" olarak
// araştırınız...
Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
