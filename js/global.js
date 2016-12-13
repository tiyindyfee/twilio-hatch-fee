// Settings
var apiHost = 'https://twilio-hatch.herokuapp.com'

// Events
document.getElementById('btnSignup').addEventListener('click', signupUser)
document.getElementById('btnSkipSignup').addEventListener('click', skipSignup)
document.getElementById('listUsers').addEventListener('click', fetchMessages)
document.getElementById('viewAllMessages').addEventListener('click', fetchMessages)
document.getElementById('btnReturnToUsers').addEventListener('click', viewUsers)
document.addEventListener('DOMContentLoaded', startApp)

// Functions
function startApp() {
  var user = JSON.parse(sessionStorage.getItem('user'))

  if (user) {
    skipSignup()
  }
}

function viewSignup() {
  document.getElementById('panelSignup').classList.remove('fade-out')
  document.getElementById('panelUsers').classList.add('fade-out')
  document.getElementById('panelMessages').classList.add('fade-out')
}

function viewUsers() {
  document.getElementById('panelSignup').classList.add('fade-out')
  document.getElementById('panelUsers').classList.remove('fade-out')
  document.getElementById('panelMessages').classList.add('fade-out')
}

function viewMessages() {
  document.getElementById('panelSignup').classList.add('fade-out')
  document.getElementById('panelUsers').classList.add('fade-out')
  document.getElementById('panelMessages').classList.remove('fade-out')
}

function skipSignup() {
  document.getElementById('panelSignup').classList.add('fade-out')

  stashUser({id:null})
  fetchUsers()
}

function signupUser() {
  var name = document.getElementById('name').value
  var message = document.getElementById('message').value
  var phoneNumber = document.getElementById('phone_number').value

  document.getElementById('panelSignup').classList.add('fade-out')

  fetch(apiHost + '/folks', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: name,
      message: message,
      phone_number: phoneNumber,
    })
  })
  .then(response => response.json())
  .then(user => {
    stashUser(user)
    fetchUsers()
  })
}

function fetchUsers() {
  document.getElementById('listUsers').innerHTML = ''

  fetch(apiHost + '/folks')
  .then(response => response.json())
  .then(users => {
    users.forEach(showUser)
    viewUsers()
  })
}

function showUser(user) {
  console.log(user)
  var list = document.getElementById('listUsers')
  var listItem = document.createElement('li')
  listItem.classList.add('list-group-item')
  listItem.setAttribute('data-id', user.id)
  listItem.innerHTML = user.name
  //list.insertBefore(listItem, list.firstChild)

  list.appendChild(listItem)
}

function stashUser(user) {
  sessionStorage.setItem('user', JSON.stringify(user))
}

function fetchMessages(e) {
  document.getElementById('listMessages').innerHTML = ''

  if (e.target.classList.contains('list-group-item')) {
    var id = e.target.getAttribute('data-id')
    var name = e.target.innerHTML

    document.querySelector('#panelMessages .panel-heading span').innerHTML = 'From ' + name

    fetch(apiHost + '/folks/' + id)
    .then(response => response.json())
    .then(user => {
      user.messages.forEach(showMessage)
      viewMessages()
    })
  }
  else {
    document.querySelector('#panelMessages .panel-heading span').innerHTML = ''

    fetch(apiHost + '/messages')
    .then(response => response.json())
    .then(messages => {
      messages.forEach(showMessage)
      viewMessages()
    })
  }
}

function showMessage(message) {
  var list = document.getElementById('listMessages')
  var listItem = document.createElement('li')
  listItem.classList.add('list-group-item')
  listItem.innerHTML = message.body

  if (message.folk) {
    listItem.innerHTML = ''
    var row = document.createElement('div')
    row.classList.add('row')
    listItem.appendChild(row)
    var colLeft = document.createElement('div')
    colLeft.classList.add('col-xs-8')
    colLeft.innerHTML = message.body
    row.appendChild(colLeft)
    var colRight = document.createElement('div')
    colRight.classList.add('col-xs-4', 'text-muted', 'small')
    colRight.innerHTML = 'Created by ' + message.folk.name
    row.appendChild(colRight)
  }

  list.appendChild(listItem)
}
