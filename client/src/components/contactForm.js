import React, { Component } from "react";

class ContactForm extends Component {
  state = {
    id: "",
    name: "",
    email: "",
    phone: "",
  };

  componentDidUpdate(prevProps) {
    if (this.props.selectedContact !== prevProps.selectedContact) {
      const contact = this.props.selectedContact;
      if (contact) {
        this.setState(contact);
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, email, phone } = this.state;
    const contact = { name, email, phone };
    const response = await fetch("http://localhost:5000/add-contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...contact
        }),
    });
    const data = await response.json()
    alert(data.message)
    this.setState({name: '', email: '', phone: ''})
  };

  render() {
    const { name, email, phone } = this.state;
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="mb-4 container p-5 shadow-lg rounded-5 mt-5">
            <div className="form-group mt-2">
                <input type="text" className="form-control" placeholder="Name" name="name" value={name} onChange={this.handleChange} required />
            </div>
            <div className="form-group mt-2">
                <input type="email" className="form-control" placeholder="Email" name="email" value={email} onChange={this.handleChange} required />
            </div>
            <div className="form-group mt-2">
                <input type="text" className="form-control" placeholder="Phone" name="phone" value={phone} onChange={this.handleChange} required />
            </div>
            <button className="btn btn-success w-100 mt-3" type="submit">
                {this.props.selectedContact ? "Update Contact" : "Add Contact"}
            </button>
        </form>
      </div>
    );
  }
}

export default ContactForm;
