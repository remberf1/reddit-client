const button = document.querySelector('.addSubreddit');
button.addEventListener('click', addElement);

let counter = 1;

function addElement() {
  // create a new div element
  const newDiv = document.createElement("div");
  newDiv.classList.add("subreddit-box");

  // and give it some content
  const innerContent = document.createElement("div");
  innerContent.classList.add("inner-content");
  innerContent.innerHTML = `<div class="subreddit-form">

            <div><p>Enter the name your subreddit</p></div>
           <div> <input class="subreddit-input" type="text" placeholder="subreddit"></div>
          <div>  <button class="subreddit-button">Add Subreddit</button></div>
        </div>`;

  // add the text node to the newly created div
  newDiv.appendChild(innerContent);
   newDiv.id = `subreddit${counter}`; // dynamically assign ID
  counter++;
console.log(counter);
  // add the newly created element and its content into the DOM
  const currentDiv = document.querySelector(".container");
  currentDiv.appendChild(newDiv); 

    const newButton = newDiv.querySelector(".subreddit-button");
  newButton.addEventListener("click", () => {
    const subredditName = newDiv.querySelector(".subreddit-input").value;
    const subredditId = newDiv.id;
    console.log(`Adding subreddit "${subredditName}" to "${subredditId}"`);
  });


}

