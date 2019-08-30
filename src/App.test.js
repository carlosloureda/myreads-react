import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import data from "./mocked_data.json"
import * as BooksAPI from './BooksAPI'

beforeAll(() => {  
  const ls = require("./utils/mockedLocalStorage.js");
  ls.setLocalStorage();
});

it('componentDidMount calls API books', async() => {  

  global.fetch = jest.fn(() => Promise.resolve({
    json: () => ({books: data.books})
         
  }));
  let result = await BooksAPI.getAll();  
  expect(result).toMatchObject(data.books);

  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

// TODO: onChangeSelf
// TODO: initShelfData
// TODO: getBooksByShelf
// TODO: searchBooks



