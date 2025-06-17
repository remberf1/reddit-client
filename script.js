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
    newDiv.innerHTML = `<table>
  <tr>
    <th>Company 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
</svg>
</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
  </tr>
  <tr>
    <td>Ernst Handel</td>
  </tr>
  <tr>
    <td>Island Trading</td>
  </tr>
  <tr>
    <td>Laughing Bacchus Winecellars</td>
  </tr>
</table>`
  });


}

