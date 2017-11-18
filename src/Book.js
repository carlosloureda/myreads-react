import React, { Component } from 'react';
import PropTypes from 'prop-types'

/**
 * Book Component, shows the author, cover iamge and name of the book.
 * Also allows to move the shelf where this book is stored.
 */
class Book extends Component {

    static propTypes = {
        /* The book object */
        book: PropTypes.any.isRequired,
        /* An object containing our shelf structure. */
        shelf: PropTypes.any
    }

    /**
    * @description Calculates the shelf where this book is stored.
    *   Needed because this view is used for both books in shelf and books in
    *   search results view. The first ones have an attribute that points to its
    *   shelf but the books on API search results must be compared agains our
    *   shelf state.
    * @returns {string} The shelf name where it is stored: currentlyReading, wantToRead, read
    *                   If not in a shelf, the 'none' name is returned.
    */
    getDefaultShelf = () => {
        let defaultShelf = this.props.book.shelf;
        if ( ! defaultShelf ) {
            // TODO: Avoid for-in loop
            for (let shelfElement in this.props.shelf) {
                this.props.shelf[shelfElement].length &&
                this.props.shelf[shelfElement].forEach(bookId => {
                    if (bookId === this.props.book.id) {
                        defaultShelf = shelfElement;
                    }
                });
            };
        }
        return defaultShelf ? defaultShelf : 'none'
    }

    render() {
        const book = this.props.book;
        const coverUrl = this.props.book.imageLinks.smallThumbnail;
        const defaultShelf = this.getDefaultShelf();
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{width: 128, height: 192, backgroundImage: `url("${coverUrl}"` }}></div>

                    <div className="book-shelf-changer">
                        <select onChange={(event) => this.props.onChangeShelf(event, book)} defaultValue={defaultShelf}>
                            <option value="none" disabled>Move to...</option>
                            <option name="currentlyReading" value="currentlyReading">Currently Reading</option>
                            <option name="wantToRead" value="wantToRead">Want to Read</option>
                            <option name="read" value="read">Read</option>
                            <option name="none" value="none">None</option>
                        </select>
                    </div>
                </div>

                <div className="book-title">{book.title}</div>

                {book.authors && book.authors.map((author) => {
                    return <div key={author} className="book-authors">{author}</div>
                })}
            </div>
        )
    }
}

export default Book;