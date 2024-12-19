import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookForm.css'; 


import { FaBook} from 'react-icons/fa';
import Logo from '../assets/logo.png';
import Headerlogo from '../assets/Bokooralogo.png';
import santa from '../assets/santa.png';
import SideModal from '../assets/modalxmas.png';
import Gift from '../assets/Gift.png';


const BookForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(false); // For showing synopsis in modal
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: '',
    genre: '',
    published_year: '',
    sbn: '',
    synopsis: ''
  });
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost/bookmanagementim/books.php');
      console.log(response.data); // Log the response to check the data
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      let newBookData;
  
      if (formData.id) {
        // Edit book
        await axios.put(
          `http://localhost/bookmanagementim/books.php?id=${formData.id}`,
          new URLSearchParams(formData),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        newBookData = { ...formData }; // Prepare the updated book data
      } else {
        // Add book
        const response = await axios.post(
          'http://localhost/bookmanagementim/books.php',
          new URLSearchParams(formData),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        newBookData = response.data; // Assuming the response returns the newly added book
      }
  
      // Update books state immediately
      if (formData.id) {
        setBooks(books.map((book) => (book.id === formData.id ? newBookData : book)));
      } else {
        setBooks([...books, newBookData]); // Add the new book to the list
      }
  
      setShowModal(false);
      setFormData({
        id: '',
        title: '',
        author: '',
        genre: '',
        published_year: '',
        sbn: '',
        synopsis: ''
      });
      alert('Book saved successfully!');
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book.');
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost/bookmanagementim/books.php?id=${id}`);
      
      if (response.data.message === 'Book deleted successfully!') {
        setBooks(books.filter((book) => book.id !== id)); // Remove the deleted book from the list
        alert('Book deleted successfully!');
      } else {
        alert('Failed to delete book.');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  };
  
  

  // Handle showing the synopsis in a modal
  const handleShowSynopsis = (book) => {
    setFormData(book);
    setShowSynopsis(true);
  };
  

  return (
    
    <div className="container">
      <img src={Headerlogo} alt="Header" className="header-logo" />
      <img src={santa} alt="santa" className="santa" />
      <button className="add-book-button" onClick={() => setShowModal(true)}>
        <FaBook className="plusicon" />
        Add Book
      </button>
       
    <div className="book-form-container">
    
      {/* Modal for Book Details */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3> Book Details</h3>
            <img src={SideModal} alt="decor" className="decor" />
            <form>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Author:
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Genre:
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Published Year:
                <input
                  type="number"
                  name="published_year"
                  value={formData.published_year}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                SBN:
                <input
                  type="text"
                  name="sbn"
                  value={formData.sbn}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Synopsis:
                <textarea
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleChange}
                  required
                ></textarea>
              </label>
              <div className="modal-actions">
                <button type="button" onClick={handleSave}>
                  Save
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      {/* Modal for Synopsis */}
      {showSynopsis && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Synopsis</h3>
            <p>{formData.synopsis}</p>
            <button type="button" onClick={() => setShowSynopsis(false)}>
              Close
            </button>
          </div>
        </div>
      )}
  
      {/* Book Cards */}
      <div className="book-cards">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img src={Logo} alt="logo" className="logo" />
            <h4>{book.title}</h4>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>SBN:</strong> {book.sbn}</p>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Published Year:</strong> {book.published_year}</p>
            <div className="card-actions">
              <button onClick={() => handleEdit(book)} className="edit">Edit</button>
              <button onClick={() => handleShowSynopsis(book)} className="synopsis">View Synopsis</button>
              <button onClick={() => handleDelete(book.id)} className="delete">Delete</button>
            </div>
          </div>
         
        ))}
      </div>
  
      
      <img src={Gift} alt="santa" className="Gift" />
      <footer className="app-footer">
        <p>&copy; 2024 Bookora. All rights reserved.</p>
      </footer>
    </div>
  </div>
  
   
  );
};

export default BookForm;
