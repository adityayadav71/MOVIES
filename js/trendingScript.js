"use strict";

fetch(
  `https://api.themoviedb.org/3/trending/all/day?api_key=c6f7e03abe070c06a55335e2c824f3d3`
)
  .then((response) => response.json())
  .then((data) => {
    const arr = data.results;
    console.log(arr);
    const trendingList = document.querySelector(".trending-li");
    for (const [i, x] of arr.entries()) {
      trendingList.innerHTML += `
      <li class="trending-li-item flexbox">
        <div class="trending-li-left card">
          <img
            src="https://image.tmdb.org/t/p/w342${arr[i].poster_path}"
            class="trending-li-img card-img"
            width="100%"
            height="100%"
          />
          <button class="card-watchlist-btn flexbox"><i class="fa-solid fa-square-plus trending-icon"></i></button>
        </div>
        <div class="trending-li-right">
          <div class="flexbox" style="justify-content: flex-start">
            <div class="trending-li-title" >
              <div class="genres"></div>
            </div>
          </div>
          <div class="trending-li-description">
          </div>
          <div class="votes flexbox">
          <div class="vote-avg"></div>
          <div class="vote-count"></div>
          <div class="language"></div>
          </div>
          
        </div>
      </li>
    `;
      document.querySelectorAll(".trending-li-title")[i].textContent =
        `${i + 1}. ` + (arr[i].original_title || arr[i].original_name);
      document.querySelectorAll(".trending-li-description")[i].textContent =
        arr[i].overview;
      document.querySelectorAll(".vote-avg")[
        i
      ].textContent = `${arr[i].vote_average}⭐`;
      document.querySelectorAll(".vote-count")[
        i
      ].textContent = `(${arr[i].vote_count} votes)`;
      document.querySelectorAll(".language")[
        i
      ].textContent = `(${arr[i].original_language})`;
    }
  });
