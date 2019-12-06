let ourKey = '8pLR2'; // api måste alltid ha något av typ av key
const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php';
console.log('Script started');

window.addEventListener('load', () => {
    console.log('Window load');

// API key
let keyButton = document.querySelector('.key-button');
let keyFrame = document.querySelector('.key-frame');

keyButton.addEventListener('click', async event => {
    console.log('Click on key-button'); // async måste vara med om await används
    const urlKey = baseUrl + '?requestKey';
    const response = await fetch(urlKey);
    console.log('Key - Got response from server', response); // måste gör om det till json (inte säker på att det går, annars måste den göras om)
    const data = await response.json(); // omvandlar json sträng till i detta fallet objekt
    console.log('JSON key', data); 
    console.log('key: ', data.key);

keyFrame.innerHTML = data.key; // nyckeln skrivs ut på konsolen
ourKey = data.key;
});


// Login in /view data
let loginButton = document.querySelector('.login-button');
let loginInput = document.querySelector('.login-input');
let fail = document.querySelector('.fail');

loginButton.addEventListener('click', async event => { 
    ourKey = loginInput.value;
    const urlView = baseUrl+ "?key=" + ourKey + "&op=select";
  
    

    
    
    let failMessageList=[];
    let count=1; 
    for (let i=0; i<5; i++) // när status = fail ska du göra detta fem gånger
    {
        const response = await fetch (urlView);
        const data = await response.json();
        console.log('respons från server login/view', data);
        console.log('här försöker vi för gång nummer', count);
        count++;
        
        
        if (data.status === "success"){
            
            for (i=0; i < data.data.length; i++){
                console.log("inne i loopjävlen");
                let viewAuthor= data.data[i].author;
                console.log("Author är: ",viewAuthor);
                let viewTitle= data.data[i].title;
                console.log("Title är: ",viewTitle);
                let viewUpdated= data.data[i].updated;
                console.log("Updated är: ",viewUpdated);
        
                    createBook(viewTitle, viewAuthor, viewUpdated);             
            }
            break;
        }
        else{
            //TODO 1. lägg allt detta i en funktion med parametrar till failmessage 
            let failMessage=data.message;
            console.log('här är vårt fel meddelanden: ', failMessage); 
            failMessageList.push(failMessage);

        } 
    }//Loop slut
    
    
   
    //TODO 2. lägg allt detta i en funktion med parametrar till failmessage 
    fail.innerHTML=failMessageList[0];

    for (i=0; i<failMessageList.length; i++){
        let newP=document.createElement("p")
        newP.innerHTML=failMessageList[i];
        fail.appendChild(newP);
    }

    
});//Login button slut

// Add book
let buttonAddBook=document.querySelector(".add-Books-Button");
let bookList=document.querySelector(".book-List");
let inputTitle=document.querySelector("#input-title");
let inputAuthor=document.querySelector("#input-author");

buttonAddBook.addEventListener('click', async event =>{
    const urlAdd = baseUrl + "?key=" + ourKey + "&op=insert&title=" + inputTitle.value + "&author=" + inputAuthor.value;
    
    let count1=1;
    for(let i=0; i<5; i++){
        const response = await fetch(urlAdd);
        console.log('Add book - Got response from server', response); 
        const data = await response.json();
        console.log('JSON Add book', data);
        console.log('räknar: ', count1++)

        if (data.status==="success"){
            console.log("Inne i if success")
            console.log("Bokens id: ", data.id);
            createBook(inputTitle.value, inputAuthor.value, data.id);
            let savedId=data.id // id
            console.log("Vårt sparade id är: ", savedId);
            

            
            break;
        }
        else {
            console.log('Misslyckades att lägga in ny bok');
        }   
        
        
    }//slut loop
    
    let deleteButton=document.querySelector(".book-delete")
            console.log("HÄr är deletebutton: ", deleteButton)
          
            deleteButton.addEventListener("click",async event=>{
                console.log('Inne i delete button');
                const urlDelete = baseUrl + "?key=" + ourKey + "&op=delete&id=" + savedId; // skicka med id
                const response = await fetch(urlDelete);
                const data = await response.json();
                console.log('Response från server när vi deletear', data);
                console.log("klicket i deletebutton funkar");
                deleteBook();


                //TODO Lägg till en loop
                // if(data.status === 'success'){
                //     deleteBook();
                // }  
                // else{
                //     console.log('Misslyckade att ta bort bok');
                // } 
            }); // delete book
        
});






// Delete book
/* let id = data.id;  */


    //detta är funktionen för delete som sedan anropas när man klickar på deletebutton
    function deleteBook(){//!denna funktion ska anropas i delteknappeventet
    //TODO se till att få in id i funktionen
    // console.log("Följde id:t med hela vägen? ", id)
    console.log("Inne i function deletebook");
    bookList.removeChild(bookList.childNodes[0]);
}


/* Delete data
Delete the information for a specific book in the database. Querystring parameters:

op=delete
key - an API key that identifies the request
id - identifies what book you want to remove
This request will output a JSON object of the following form if successful:

{
	"status": "success"
}  */


//Karins kod för att lägga till ett bokobjekt-------------

function createNewDivImage(id){
    
    let newDivImage=document.createElement("div");
    newDivImage.className="book-image";
    let modifyElem=createNewButtonModify();
    newDivImage.appendChild(modifyElem);
    let deleteElem=createNewButtonDelete(id);
    newDivImage.appendChild(deleteElem);
    return newDivImage;

}
function createNewButtonDelete(id){
    let newButtonDelete=document.createElement("button");
    newButtonDelete.className="book-delete";
    let BookId=id;
    return newButtonDelete
}


function createNewButtonModify(){
    let newButtonModify=document.createElement("button");
    newButtonModify.className="book-modify";
    return newButtonModify
}

function createNewDivTitle(title){

    let newDivTitle=document.createElement("div");
    newDivTitle.className="book-title";
    newDivTitle.innerText="Title: " + title;
    return newDivTitle;
}

function createNewDivAuthor(author){
    
    let newDivAuthor=document.createElement("div");
    newDivAuthor.className="book-author";
    newDivAuthor.innerText="Author: " + author;
    return newDivAuthor;    
}

//Den här funktionen skapar hela boken inkl alla tre element som ligger i och appendar den till book-list

function createBook(title, author,id){
    let bookDiv=document.createElement("div")
    bookDiv.className="book";
    let imageElem=createNewDivImage(id);
    let titleElem = createNewDivTitle(title);
    let authorElem=createNewDivAuthor(author);
    //här skapas alla de tre elementen som ska ligga i 
    bookDiv.appendChild(imageElem);
    bookDiv.appendChild(titleElem);
    bookDiv.appendChild(authorElem);
    
    bookList.appendChild(bookDiv);
   
}
  



}); // Load



