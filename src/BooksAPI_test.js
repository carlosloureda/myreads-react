import { getAll } from "./BooksAPI";
// const mockFetch = require("fetch")

jest.mock('fetch');

test("fetches results from books api", () => {
    // mockFetch.get.mockImplementationOnce(() =>
    //     Promise.resolve({})
    // );
    return getAll().then(response => {
        expect(response).toBeDefined();
        // expect(response).toEqual();
    });
});