import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ContactForm from './components/contactForm';
import ContactList from './components/contactList';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ContactForm />} />
          <Route path="/contacts" element={<ContactList />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
