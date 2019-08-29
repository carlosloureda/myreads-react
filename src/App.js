import React from 'react';
import { Route, Link } from 'react-router-dom';

import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf';
import Book from './Book';

import './App.css';

/**
 * Main component for my myreads application
 */

class BooksApp extends React.Component {
  state = {
    /**
     * My collection of books
     */
    books: [],
    /**
     * My shelf status, an object containing the ids of the books in each shelf
     * separated by shelfName.
     */
    shelf: {
      currentlyReading: [],
      wantToRead: [],
      read: []
    },
    /**
     * The result of the search from all the books in API
     */
    searchedBooks: []
  }

  /**
  * @description As I store the books in the books array, and some API calls
  *   (update) returns the shelf object to know wherea are them stored
  *   so I want to have it set manually on component start.
  *   The sheld data is stored in the component state
  */
  initShelfData = (shelf) => {
      // Mount my self object
      if ( this.state.books && this.state.books.length) {
        this.state.books.forEach(book => {
          shelf[book.shelf].push(book.id);
        });
      }
      this.setState((state) => ({shelf}));
  }

  componentDidMount = () => {
    // Get all MY books
    BooksAPI.getAll()
    .then((result)=>{
      this.setState((state) => ({
        books: result
      }));
      this.initShelfData(this.state.shelf);
    }).catch((err)=>{
      //TODO: Would be nice adding nice errors showing on the page
      console.error("error is: ", err);
    })
  }

  /**
  * @description Manages event for adding a book to a shelf or updating
  *   the shelf where a book is placed
  * @param {object} event - The event that triggered the change (option clicked on select)
  * @param {object} book - The book added to the shelf or updated
  */
  onChangeShelf = (event, book) => {
    const newShelf = event.target.value;
    // if book not in shelf we have to add it ..
    if (newShelf !== book.shelf) {
      console.log(`Book should me moved from ${book.shelf} to ${event.target.value}`);
      BooksAPI.update(book, newShelf).then((shelf) => {
        //TODO: Maybe add and update are easier calling getAll to re-fill array of books
        const booksIds = this.state.books.map(book => book.id);
        let _books = this.state.books;
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

  /**
  * @description Retreives the books in a shelf given
  * @param {name} shelf - The name of the shelf from which we want to retrieve
  *   the books from
  * @returns {object[]} booksInShelf - An array containing the books in the shelf
  */
  getBooksByShelf = (shelf) => {
    let booksInShelf = [];

    this.state.books.forEach(book => {
      if (book.shelf === shelf) {
        booksInShelf.push(book);
      }
    });
    return booksInShelf;
  }

  /**
  * @description Retreives the books in a shelf given. This books are stored in
      component state (searchedBooks)
  * @param {name} query - The query string to search for in the API (author or book names)  *
  */
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
