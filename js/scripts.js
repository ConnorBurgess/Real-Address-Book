// Business Logic for AddressBook ---------
function AddressBook() {
  this.contacts = {};
  this.currentId = 0;
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId();
  this.contacts[contact.id] = contact;
}

AddressBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

AddressBook.prototype.findContact = function(id) {
  if (this.contacts[id] != undefined) {
    return this.contacts[id];
  }
  return false;
}

AddressBook.prototype.deleteContact = function(id) {
  if (this.contacts[id] === undefined) {
    return false;
  }
  delete this.contacts[id];
  return true;
}

// Business Logic for Contacts ---------
function Contact(firstName, lastName, phoneNumber) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phoneNumber = phoneNumber;
  this.address = {};
}

Contact.prototype.fullName = function() {
  return this.firstName + " " + this.lastName;
}

function Address(physical, email = null) {
  this.physical = physical;
  this.email = email;
}

// User Interface Logic ---------
let addressBook = new AddressBook();
function displayContactDetails(addressBookToDisplay) {
  let contactsList = $("ul#contacts");
  let htmlForContactInfo = "";

  Object.keys(addressBookToDisplay.contacts).forEach(function(key) {
    const contact = addressBookToDisplay.findContact(key);
    htmlForContactInfo += "<li id=" + contact.id + ">" + contact.firstName + " " + contact.lastName + "</li>";
  });
  contactsList.html(htmlForContactInfo);
};

function showContact(contactId) {
  const contact = addressBook.findContact(contactId);
  $("#show-contact").show();
  $(".first-name").html(contact.firstName);
  $(".last-name").html(contact.lastName);
  $(".phone-number").html(contact.phoneNumber);
  $(".physical-address").html(contact.address.physical);
  $(".email").html(contact.address.email)
  let buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='deleteButton' id=" +  + contact.id + ">Delete</button>");
}

function attachContactListeners() {
  $("ul#contacts").on("click", "li", function() {
    showContact(this.id);
  });
  $("#buttons").on("click", ".deleteButton", function() {
    addressBook.deleteContact(this.id);
    $("#show-contact").hide();
    displayContactDetails(addressBook);
  });
};

$(document).ready(function() {
  attachContactListeners();
  $("form#new-contact").submit(function(event) {
    event.preventDefault();
    var inputtedFirstName = $("input#new-first-name").val();
    var inputtedLastName = $("input#new-last-name").val();
    var inputtedPhoneNumber = $("input#new-phone-number").val();
    var inputtedEmailAddress = $("input#new-email-address").val();
    var inputtedAddress = $("input#new-address").val();

    let formattedPhoneNumber = inputtedPhoneNumber.toString();
    if(formattedPhoneNumber.length === 11) {
      formattedPhoneNumber = `+1-${formattedPhoneNumber.slice(1, 4)}-${formattedPhoneNumber.slice(4, 7)}-${formattedPhoneNumber.slice(7)}`;
    } else if (formattedPhoneNumber.length === 10) {
      formattedPhoneNumber = `${formattedPhoneNumber.slice(0, 4)}-${formattedPhoneNumber.slice(4, 7)}-${formattedPhoneNumber.slice(7)}`;
    } else {
      formattedPhoneNumber = `${formattedPhoneNumber.slice(0, 4)}-${formattedPhoneNumber.slice(4)}`;
    }

    let newAddress = new Address(inputtedAddress, inputtedEmailAddress);
    var newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber);
    newContact.address = {...newAddress};
    addressBook.addContact(newContact);
    displayContactDetails(addressBook);

    $("form#new-contact")[0].reset();
  });
});