import { fetchSubredditPosts } from './response.js';

window.addEventListener('load', () => {
  if (!localStorage.getItem('hasLoadedBefore')) {
    // Create container for the question
    const questionDiv = document.createElement('div');
    questionDiv.id = 'load-question';
    questionDiv.style.padding = '20px';
    questionDiv.style.border = '1px solid #ccc';
    questionDiv.style.margin = '20px';
    questionDiv.style.textAlign = 'center';
    questionDiv.innerHTML = `
      <p>Do you want to load your saved subreddit lanes?</p>
      <button id="load-yes">Yes</button>
      <button id="load-no">No</button>
    `;

    document.body.prepend(questionDiv);

    document.getElementById('load-yes').addEventListener('click', () => {
      simulateInitialLoad(() => {
        renderSavedUserLanes();
        localStorage.setItem('hasLoadedBefore', 'true');
        questionDiv.remove();
      });
    });

    document.getElementById('load-no').addEventListener('click', () => {
      localStorage.setItem('hasLoadedBefore', 'true');
      questionDiv.remove();
    });

  } else {
    // Already visited before — do whatever your default is here, if anything
  }
});


const button = document.querySelector('.addSubreddit');
button.addEventListener('click', addElement);

let counter = 1;

function addElement() {
  const newDiv = document.createElement("div");
  newDiv.classList.add("subreddit-box");

  const innerContent = document.createElement("div");
  innerContent.classList.add("inner-content");
  innerContent.innerHTML = `
    <div class="subreddit-form">
      <div><p>Enter the name of your subreddit</p></div>
      <div><input class="subreddit-input" type="text" placeholder="subreddit"></div>
      <div><button class="subreddit-button">Add Subreddit</button></div>
    </div>
  `;

  newDiv.appendChild(innerContent);
  newDiv.id = `subreddit${counter++}`;

  const currentDiv = document.querySelector(".container");
  const buttonWrapper = document.querySelector(".addtooltip");
  currentDiv.insertBefore(newDiv, buttonWrapper);

  const newButton = newDiv.querySelector(".subreddit-button");
  const input = newDiv.querySelector(".subreddit-input");
  newButton.addEventListener("click", () => handleSubredditSubmit(input, newDiv));
}

function renderSubredditPosts(subreddit, posts, container) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = `r/${subreddit} - Top 5 Posts `;

  // Create dropdown wrapper
  const dropdownWrapper = document.createElement('div');
  dropdownWrapper.classList.add('dropdown');

  // Dropdown toggle button (3 dots icon)
  dropdownWrapper.innerHTML = `
    <div class="dropbtn" style="display:inline-block; cursor:pointer;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        class="bi bi-three-dots" viewBox="0 0 16 16">
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 
          1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 
          0 1 1 0-3 1.5 1.5 0 0 1 0 
          3m5 0a1.5 1.5 0 1 1 0-3 
          1.5 1.5 0 0 1 0 3"/>
      </svg>
    </div>
  `;

  // Append the title text and then dropdown toggle button
  // Make title a flex container to align text and button horizontally
  title.style.display = 'flex';
  title.style.justifyContent = 'space-between';
  title.style.alignItems = 'center';

  // Clear default title text and add it inside a span
  const titleTextSpan = document.createElement('span');
  titleTextSpan.textContent = `r/${subreddit} - Top 5 Posts `;
  title.textContent = ''; // Clear before appending children
  title.appendChild(titleTextSpan);
  title.appendChild(dropdownWrapper);

  container.appendChild(title);

  // Create dropdown content div, hidden by default
  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown-content');
  dropdown.style.display = 'none';
  dropdown.style.position = 'absolute';
  dropdown.style.backgroundColor = 'white';
  dropdown.style.border = '1px solid #ccc';
  dropdown.style.minWidth = '100px';
  dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
  dropdown.style.zIndex = '1000';

  dropdown.innerHTML = `
    <a href="#" class="refresh">Refresh</a>
    <a href="#" class="delete">Delete</a>
  `;

  // Append dropdown content as a sibling of container (or inside container)
  container.style.position = 'relative'; // For absolute positioning of dropdown inside container
  container.appendChild(dropdown);

  // Event listener for dropdown toggle button
  const dropbtn = dropdownWrapper.querySelector('.dropbtn');
  dropbtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });

  // Delete handler removes the entire subreddit container div
  dropdown.querySelector('.delete').addEventListener('click', (e) => {
    e.preventDefault();
    deleteSubreddit(subreddit);
  });

  // Refresh handler placeholder
  dropdown.querySelector('.refresh').addEventListener('click', async(e) => {
    e.preventDefault();
    
  container.innerHTML = '<p class="refreshstate">Loading posts again...</p>';
    // Optionally re-fetch posts here and rerender
    const newPosts = await fetchSubredditPosts(subreddit);
  if (newPosts) {
    renderSubredditPosts(subreddit, newPosts.slice(0, 5), container);
  }
  });

  // Render list of posts
  const list = document.createElement('ul');
  list.classList.add('subreddit-post-list');

  posts.forEach(post => {
    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${post.title}</strong><br>
      <small>🔼 ${post.ups} | u/${post.author}</small>
    `;
    list.appendChild(item);
  });

  container.appendChild(list);
}


async function handleSubredditSubmit(input, container) {
  const subreddit = input.value.trim();
  if (!subreddit) return;

  container.innerHTML = '<p class="loading">Loading posts...</p>';
  container.classList.add("disable-center");

  try {
    const result = await fetchSubredditPosts(subreddit);

    if (result?.error) {
      container.innerHTML = `<p>Error: ${result.error}</p>`;
      return;
    }

    if (!result || result.length === 0) {
      container.innerHTML = `<p class="error">No posts found for r/${subreddit}</p>`;
      return;
    }

    renderSubredditPosts(subreddit, result.slice(0, 5), container);
    saveSubredditToLocalStorage(subreddit); 


  } catch (error) {
    container.innerHTML = `<p class="error">Error loading posts for r/${subreddit}</p>`;
    console.error(error);
  }
}





function renderDropdownMenu(event) {
  event.stopPropagation(); // Prevent event bubbling
  const dropdown = event.currentTarget.nextElementSibling;
  dropdown.classList.toggle("show");

  // Close other open dropdowns
  document.querySelectorAll(".dropdown-content").forEach(menu => {
    if (menu !== dropdown) {
      menu.classList.remove("show");
    }
  });
}

function deleteSubreddit(subreddit) {
  const subredditDiv = document.getElementById(`subreddit${subreddit}`);
  subredditDiv.remove();
}


function simulateInitialLoad(callback) {
  const loadingMsg = document.createElement('p');
  loadingMsg.className = 'loading';
  loadingMsg.textContent = 'Loading your saved lanes...';
  document.body.appendChild(loadingMsg);

  setTimeout(() => {
    document.body.removeChild(loadingMsg);
    callback();
  }, 1500); // Delay for effect
}

function saveSubredditToLocalStorage(subreddit) {
  let stored = JSON.parse(localStorage.getItem('userLanes')) || [];
  // Avoid duplicates
  if (!stored.find(item => item.subreddit === subreddit)) {
    stored.push({ subreddit });
    localStorage.setItem('userLanes', JSON.stringify(stored));
  }
}

function renderSavedUserLanes() {
 const saved = JSON.parse(localStorage.getItem('userLanes'));
  const container = document.querySelector('.container');

  if (saved && saved.length > 0) {
    saved.forEach(item => {
      addElement();
      const lastBox = document.querySelectorAll(".subreddit-box");
      const last = lastBox[lastBox.length - 1];
      const input = last.querySelector(".subreddit-input");
      input.value = item.subreddit;
      handleSubredditSubmit(input, last);
    });
  } else {
    // ⬇️ Append a non-intrusive message to the container
    const message = document.createElement('div');
    message.className = 'no-saved-message';
    message.innerHTML = `
      <p style="text-align: center; padding: 1rem; font-size: 1.1rem; color: #666;">
        You don’t have any saved subreddit lanes yet.
      </p>
    `;
    container.appendChild(message);
  }
}