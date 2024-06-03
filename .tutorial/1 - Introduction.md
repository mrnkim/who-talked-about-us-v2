## 👋 Introduction

"Who Talked About Us?" is an influencer-filtering app where a user can:

1. Create an index (a library of videos)
2. Upload YouTube videos in bulk by YouTube playlist ID, channel ID, or a JSON file
3. Filter the videos and channels that mention a provided keyword (e.g., Rare Beauty lip oil)
4. View specific timelines or references of videos mentioning the keyword

This application utilizes [Twelve Labs API](https://docs.twelvelabs.io/docs) for the rich, contextual video search. Twelve Labs is an AI-powered video understanding platform that extracts various types of information from videos, such as movement and actions, objects and people, sound, text on screen, and speech.

📌 Check out the [Demo](https://who-talked-about-us-vercel-client.vercel.app/)! (_Please note: This is a simplified version of the app_)

<div align="center">
  <a href="https://who-talked-about-us-vercel-client.vercel.app/">
    <img src="search.gif" alt="search result screenshot" style="border: 1px solid black;" />
  </a>
</div>

### Built With

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node](https://nodejs.org/en)
- [React](https://react.dev/)
- [React Query](https://tanstack.com/query/latest)
- [React Bootstrap](https://react-bootstrap.netlify.app/)
- [ytdl-core](https://www.npmjs.com/package/ytdl-core)
- [ytpl](https://www.npmjs.com/package/ytpl)
- [React Player](https://www.npmjs.com/package/react-player)