import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Book extends Component {

    static propTypes = {
        book: PropTypes.any.isRequired,
        shelf: PropTypes.any
    }

    getDefaultShelf = () => {
        let defaultShelf = this.props.book.shelf;
        if ( ! defaultShelf ) {
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
        let defaultShelf = this.getDefaultShelf();
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