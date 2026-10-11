package com.library.service;

import com.library.entity.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<Book> getAllBooks(String query, String category) {
        if ((query != null && !query.trim().isEmpty()) || (category != null && !category.trim().isEmpty())) {
            return bookRepository.searchBooks(
                    (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                    (category != null && !category.trim().isEmpty()) ? category.trim() : null
            );
        }
        return bookRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book addBook(Book book) {
        if (book.getQuantity() == null || book.getQuantity() < 0) {
            book.setQuantity(1);
        }
        if (book.getAvailableQuantity() == null) {
            book.setAvailableQuantity(book.getQuantity());
        }
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book details) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with ID: " + id));

        book.setTitle(details.getTitle());
        book.setAuthor(details.getAuthor());
        book.setCategory(details.getCategory());
        book.setIsbn(details.getIsbn());

        int diff = (details.getQuantity() != null ? details.getQuantity() : book.getQuantity()) - book.getQuantity();
        book.setQuantity(details.getQuantity());
        book.setAvailableQuantity(Math.max(0, book.getAvailableQuantity() + diff));

        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("Book not found with ID: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return bookRepository.findAllCategories();
    }
}
