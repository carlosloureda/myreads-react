import React from 'react';
import { Route, Link } from 'react-router-dom';

import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf';
import Book from './Book';

import './App.css';

class BooksApp extends React.Component {
  state = {
    // My collection of books
    books: [],
    /**
     * My shelf status, an object containing the ids of the books in each shelf     *
     * This object is mounted manually on FindAll but is auto-merged on afterUpdate
     * as it is the return value of API
     */
    shelf: {currentlyReading: [], wantToRead: [], read: []},
    // The result of the search from all the books in API
    searchedBooks: []
  }

  initShelfData = () => {
      // Mount my self object
      let shelf = {currentlyReading: [], wantToRead: [], read: []};
      if ( this.state.books && this.state.books.length) {
        this.state.books.forEach(book => {
          shelf[book.shelf].push(book.id);
        });
      }
      this.setState((state) => ({
        shelf: shelf
      }));
  }
  componentDidMount = () => {
    // Get all MY books
    BooksAPI.getAll()
    .then((result)=>{
      this.setState((state) => ({
        books: result
      }));
      this.initShelfData();
    }).catch((err)=>{
      //TODO: Would be nice adding nice errors showing on the page
      console.error("error is: ", err);
    })
  }

  onChangeShelf = (event, book) => {
    let newShelf = event.target.value;
    // if book not in shelf we have to add it ..
    if (newShelf !== book.shelf) {
      console.log(`Book should me moved from ${book.shelf} to ${event.target.value}`);
      BooksAPI.update(book, newShelf).then((shelf) => {

        //TODO: Maybe add and update is easier calling getAll but wanted to
        // avoid extra server calls and manage this manually, would love to know
        // the best answe for this
        let _books = this.state.books;
        let booksIds = this.state.books.map(book => book.id);
        if (booksIds.indexOf(book.id) === -1) {
          _books.push(book);
        } else {
          _books = this.state.books.map((_book) => {
            if (book.id === _book.id) {
              _book.shelf = newShelf;
            }
            return _book;
          });
        }
        this.setState(state => ({
          shelf: shelf,
          books: _books
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

  searchBooks = (query) => {
    if (!query) {
      this.setState((state) => ({ searchedBooks: [] }));
      return;
    }
    BooksAPI.search(query, null).then((data) => {
      this.setState((state) => ({
        searchedBooks: ( ! data || data.error ) ? [] : data,
      }));
    }).catch((err)=> {
      console.error("error: ", err);
    });
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => (
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
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />

        <Route path="/search" render={(history) => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link
                className="close-search"
                to="/"
                onClick={()=>  history.push('/') }
              >Close</Link>
              <div className="search-books-input-wrapper">
                <input
                  type="text" placeholder="Search by title or author"
                  onChange={(event) => this.searchBooks(event.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.searchedBooks.length > 0
                  && this.state.searchedBooks.map(book => (
                  <li key={book.id}>
                    <Book
                        book={book}
                        onChangeShelf={this.onChangeShelf}
                        shelf={this.state.shelf}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )} />

      </div>
    )
  }
}

export default BooksApp
