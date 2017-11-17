import React from 'react';
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf';

import './App.css';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books: []
  }

  componentDidMount = () => {
    //TODO: Show loadings?
    BooksAPI.getAll()
    .then((result)=>{
      this.setState((state) => ({
        books: result
      }));
    }).catch((err)=>{
      //TODO: Would be nice adding nice errors showing on the page
      console.error("error is: ", err);
    })
  }

  onChangeShelf = (event, book) => {
    let newShelf = event.target.value;
    if (newShelf !== book.shelf) {
      console.log(`Book should me moved from ${book.shelf} to ${event.target.value}`);
      BooksAPI.update(book, newShelf).then((shelf) => {
        this.setState(state => ({

          books: state.books.map((_book) => {
            if (book.id === _book.id) {
              _book.shelf = newShelf;
            }
            return _book;
          })
        }));
      });
    }
  }

  getBooksByShelf = (shelf) => {
    let booksInShelf = [];
    this.state.books.forEach(book => {
      if (book.shelf === shelf) {
        booksInShelf.push(book);
      }
    });
    return booksInShelf;
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf
                  title="Currently Reading"
                  books={this.getBooksByShelf('currentlyReading')}
                  onChangeShelf={this.onChangeShelf}
                />
                <BookShelf
                  title="Want to read"
                  books={this.getBooksByShelf('wantToRead')}
                  onChangeShelf={this.onChangeShelf}
                />
                <BookShelf
                  title="Read"
                  books={this.getBooksByShelf('read')}
                  onChangeShelf={this.onChangeShelf}
                />
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
