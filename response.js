export async function fetchSubredditPosts(subreddit) {
  try {
    const response = await fetch(`https://corsproxy.io/?https://www.reddit.com/r/${subreddit}.json`);

    if (response.status === 404) {
      // Subreddit does not exist
      throw new Error(`Subreddit r/${subreddit} does not exist.`);
    }

    if (!response.ok) {
      // Other HTTP errors
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    // Optional: Check if data exists in expected format
    if (!json.data || !json.data.children) {
      throw new Error('Unexpected API response structure.');
    }

    return json.data.children.map(post => post.data);
  } catch (error) {
    console.error(`Error fetching posts from /r/${subreddit}:`, error);
    // Return the error object/message so the caller can handle/display it
    return { error: error.message };
  }
}
