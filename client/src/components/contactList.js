import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class ContactList extends Component {
  state = {
    contacts: [],
    showModal: false,
    loading: false,
    editContact: {
      id: "",
      name: "",
      email: "",
      phone: "",
    },
  };

  componentDidMount() {
    this.fetchContacts();
  }

  // GET contacts
  fetchContacts = async () => {
    try {
      this.setState({ loading: true });
      const response = await fetch("http://localhost:5000/get-contacts");
      const data = await response.json();
      this.setState({ contacts: data, loading: false });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      this.setState({ loading: false });
    }
  };

  // Handle Edit button click
  handleEditClick = (contact) => {
    this.setState({
      showModal: true,
      editContact: { ...contact },
    });
  };

  // Handle Delete button click
  handleDeleteClick = async (contact) => {
    try {
      const response = await fetch("http://localhost:5000/delete-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: contact.id }),
      });

      const data = await response.json();
      alert(data.message);
      this.fetchContacts();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete contact.");
    }
  };

  // Handle input changes in modal
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      editContact: {
        ...prevState.editContact,
        [name]: value,
      },
    }));
  };

  // Update contact
  handleUpdate = async () => {
    const { id, name, email, phone } = this.state.editContact;
    try {
      await fetch(`http://localhost:5000/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      this.setState({ showModal: false });
      this.fetchContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  render() {
    const { contacts, showModal, editContact, loading } = this.state;

    return (
      <div className="container mt-5">
        <h3 className="mb-4">Contact List</h3>

        {loading && <div className="alert alert-info">Loading contacts...</div>}

        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={() => this.handleEditClick(contact)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => this.handleDeleteClick(contact)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div
              className="modal show fade d-block"
              tabIndex="-1"
              role="dialog"
              style={{ overflow: "auto" }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">

                  <div className="modal-header">
                    <h5 className="modal-title">Edit Contact</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => this.setState({ showModal: false })}
                    >
                      <span>&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        name="name"
                        className="form-control"
                        value={editContact.name}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        name="email"
                        className="form-control"
                        value={editContact.email}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        name="phone"
                        type="tel"
                        pattern="[0-9]*"
                        className="form-control"
                        value={editContact.phone}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => this.setState({ showModal: false })}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={this.handleUpdate}
                    >
                      Update
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default ContactList;
