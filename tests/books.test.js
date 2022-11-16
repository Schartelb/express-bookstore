const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");


describe("POST Book create", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM books");
    });


    test("can create", async function () {
        let response = await request(app)
            .post("/books")
            .send({
                isbn: 1234567890,
                amazon_url: "amazon.sell",
                author: "Writer Guy",
                language: "English",
                pages: 160,
                publisher: "Self-Published",
                title: "Writing with Writing",
                year: 2020
            });
        expect(response.body.book.title).toBe("Writing with Writing");
        expect(response.body.book.isbn).not.toBe(undefined);
    });

    test("won't create w/incorrect parts", async function () {
        let response = await request(app)
            .post("/books")
            .send({
                "isbn": 1123456789,
                "amazon_url": "amazon.sell",
                "author": "Ty Pryter",
                "language": "English",
                "pages": 300,
                "publisher": "Self-Published",
                "title": "Mechanical Keyboards and You",
                "year": "2020"
            });
        expect(response.body.error.status).toEqual(400);

    });

    test("won't create while missing parts", async function () {
        let response = await request(app)
            .post("/books")
            .send({
                "isbn": 1123456789,
                "amazon_url": "amazon.sell",
                "author": "Ty Pryter",
                "language": "English",
                "publisher": "Self-Published",
                "title": "Mechanical Keyboards and You",
                "year": 2020
            });
        expect(response.error.status).toEqual(400);
        expect(response.error.message).toContain("cannot POST /books (400)")
    });
})

describe("PUT Book edit", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM books")
    });
    beforeEach(async function () {
        let response = await request(app)
            .post("/books")
            .send({
                isbn: 1234567890,
                amazon_url: "amazon.sell",
                author: "Writer Guy",
                language: "English",
                pages: 160,
                publisher: "Self-Published",
                title: "Writing with Writing",
                year: 2020
            });
    })



    test("can edit", async function () {
        let response = await request(app)
            .put("/books/1234567890")
            .send({
                isbn: 1234567890,
                language: "Laotian",
            });
        expect(response.body.book.language).toBe("Laotian");
        expect(response.body.book.author).not.toBe(undefined);
    });

    test("won't edit w/o isbn", async function () {
        let response = await request(app)
            .put("/books/1234567890")
            .send({
                amazon_url: "amazon.sell",
                author: "Ty Pryter",
                language: "English",
                pages: 300,
                publisher: "Self-Published",
                title: "Mechanical Keyboards and You",
                year: 2020
            });
        expect(response.error.status).toEqual(400);
        expect(response.error.message).toContain("cannot PUT /books/1234567890 (400)")
    });
});
afterAll(async function () {
    await db.end();
});
