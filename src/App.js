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
    books: [],
    booksReading: [],
    booksRead: [],
    booksWantRead: []
  }

  componentDidMount(){
    //TODO: Show loadings?
    let booksReading = [];
    let booksRead = [];
    let booksWantRead = [];

    BooksAPI.getAll()
    .then((result)=>{
      this.books=result;
      result.forEach((book) => {
        switch(book.shelf) {
          case 'currentlyReading':
            booksReading.push(book);
            break;
          case 'read':
            booksRead.push(book);
            break;
          case 'wantToRead':
            booksWantRead.push(book);
            break;
          default:
            break;
        }
      });
      this.setState((state) => ({
        booksReading: booksReading
      }));
      this.setState((state) => ({
        booksRead: booksRead
      }));
      this.setState((state) => ({
        booksWantRead: booksWantRead
      }));

    }).catch((err)=>{
      //TODO: Would be nice adding nice errors showing on the page
      console.error("error is: ", err);
    })
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
                <BookShelf title="Currently Reading" books={this.state.booksReading}/>
                <BookShelf title="Want to read" books={this.state.booksWantRead}/>
                <BookShelf title="Read" books={this.state.booksRead}/>
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
