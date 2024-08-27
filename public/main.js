const socket = io()

const clientsTotal = document.getElementById('client-total')
const nameInput  = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const feedBack = document.getElementById('feedback')
const messageInput = document.getElementById('message-input')
const messageContainer = document.getElementById('message-container')

const messageTone = new Audio("/level-up-2-199574.mp3")

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total',(data)=>{
    clientsTotal.innerText = `Total clients : ${data}`
})


function sendMessage(){

    if(messageInput.value === ''){
        return
    }
    const data = {
        name: nameInput.value,
        message:  messageInput.value,
        date: new Date()
    }

    socket.emit('message', data)
    addNewMessage(true, data)
    messageInput.value = ''
}

socket.on('chat-message',(data)=>{
    messageTone.play()
   addNewMessage(false, data)
})

function addNewMessage(isOwnMessage, data){
    clearFeedback()
    const element = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
                        <p>${data.message}
                            <span>${data.name}</span>
                        </p> 
                    </li>`

    messageContainer.innerHTML += element
    scrollbottom()
}

function scrollbottom(){
    messageContainer.scroll(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing...`
    })
})

messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing...`
    })
})


messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:''
    })
})

socket.on('feedback', (data)=>{
    clearFeedback()
    const element = `<li class="message-feedback">
                        <p class="feedback" id="feedback">${data.feedback}</p>
                    </li>`
    
    messageContainer.innerHTML += element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}


