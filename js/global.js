/*
Quickee Twilio-backed API: https://twilio-hatch.herokuapp.com/ . Endpoints: `GET /folks` (folks list), `POST /folks` (create a folk, need name, message and phone_number params), `GET /folks/:id` (get a specific folk), `GET /messages` (list of messages … these being the messages from replying to texts … after you reply to one, you get a link to tiy/indy)
 */
// Settings
var apiHost = 'https://twilio-hatch.herokuapp.com'

// Events
document.getElementById('btnSignup').addEventListener('click', signupFolk)
document.getElementById('btnSkipSignup').addEventListener('click', skipSignup)
document.getElementById('listFolks').addEventListener('click', fetchMessages)
document.getElementById('viewAllMessages').addEventListener('click', fetchMessages)
document.getElementById('btnReturnToFolks').addEventListener('click', viewFolks)
document.addEventListener('DOMContentLoaded', startApp)

// Functions
function startApp() {
  var folk = JSON.parse(localStorage.getItem('folk'))

  if (folk) {
    skipSignup()
  }
}

function viewSignup() {
  document.getElementById('panelSignup').classList.remove('fade-out')
  document.getElementById('panelFolks').classList.add('fade-out')
  document.getElementById('panelMessages').classList.add('fade-out')
}

function viewFolks() {
  document.getElementById('panelSignup').classList.add('fade-out')
  document.getElementById('panelFolks').classList.remove('fade-out')
  document.getElementById('panelMessages').classList.add('fade-out')
}

function viewMessages() {
  document.getElementById('panelSignup').classList.add('fade-out')
  document.getElementById('panelFolks').classList.add('fade-out')
  document.getElementById('panelMessages').classList.remove('fade-out')
}

function skipSignup() {
  document.getElementById('panelSignup').classList.add('fade-out')

  stashFolk({id:null})
  fetchFolks()
}

function signupFolk() {
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
  .then(folk => {
    stashFolk(folk)
    fetchFolks()
  })
}

function fetchFolks() {
  document.getElementById('listFolks').innerHTML = ''

  fetch(apiHost + '/folks')
  .then(response => response.json())
  .then(folks => {
    folks.forEach(showFolk)
    viewFolks()
  })
}

function showFolk(folk) {
  console.log(folk)
  var list = document.getElementById('listFolks')
  var listItem = document.createElement('li')
  listItem.classList.add('list-group-item')
  listItem.setAttribute('data-id', folk.id)
  listItem.innerHTML = folk.name
  //list.insertBefore(listItem, list.firstChild)

  list.appendChild(listItem)
}

function stashFolk(folk) {
  localStorage.setItem('folk', JSON.stringify(folk))
}

function fetchMessages(e) {
  document.getElementById('listMessages').innerHTML = ''

  if (e.target.classList.contains('list-group-item')) {
    var id = e.target.getAttribute('data-id')
    var name = e.target.innerHTML

    document.querySelector('#panelMessages .panel-heading span').innerHTML = 'From ' + name

    fetch(apiHost + '/folks/' + id)
    .then(response => response.json())
    .then(folk => {
      folk.messages.forEach(showMessage)
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
