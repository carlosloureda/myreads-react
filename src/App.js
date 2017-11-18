import React from 'react';
import { Route, Link } from 'react-router-dom';

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
    books: [],
    searchedBooks: []
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
        // console.log("The self is now: ", shelf);
        // console.log("On setState change for books");
         this.setState(state => ({

          books: state.books.map((_book) => {
            if (book.id === _book.id) {
              console.warn("BOOK REALLY MOVED")
              _book.shelf = newShelf;
            } else {
              // it is a new book so we add it
            }
            return _book;
          })
        }));
      });
    }
  }

  getBooksByShelf = (shelf) => {
    console.log("Calling getBooksByShelf");
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
    console.warn("On render, this.state.showSearchPage: ", this.state.showSearchPage);
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

        <Route path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input
                  type="text" placeholder="Search by title or author"
                  onChange={(event) => this.searchBooks(event.target.value)}
                />

                {this.state.searchedBooks.length > 0 &&
                  <BookShelf
                    title="Resultados"
                    books={this.state.searchedBooks}
                    onChangeShelf={this.onChangeShelf}
                  />}

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        )} />

      </div>
    )
  }
}

export default BooksApp
