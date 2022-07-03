"use strict";

// STICKY NAVIGATION

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    if (!ent.isIntersecting)
      document.querySelector(".navbar").classList.add("sticky");
    if (ent.isIntersecting)
      document.querySelector(".navbar").classList.remove("sticky");
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);

obs.observe(sectionHeroEl);

const loader = document.querySelector("#loading");

function displayLoading() {
  loader.classList.add("display");
  setTimeout(() => {
    loader.classList.remove("display");
  }, 3000);
}

function hideLoading() {
  loader.classList.remove("display");
}

const API_KEY = "api_key=c6f7e03abe070c06a55335e2c824f3d3";
const BASE_URL = "https://api.themoviedb.org/3";

const getMovies = (searchURL) => {
  displayLoading();
  fetch(searchURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.querySelector(".section-hero").style.paddingTop = "0vh";
      const hero = document.querySelector(".section-hero");
      let html = `
        <div class="search-container">
            <div class="heading flexbox">
              <div class="section-heading">
                <p>Search results</p>
                <p class="section-description">Here's what we found</p>
              </div>
            </div>
          </div>
          <div class="search-results grid grid-6-cols">
        `;
      if (data.results.length !== 0) {
        data.results.forEach((movie) => {
          html += `
              <div class="card">
                ${
                  movie.poster_path == null
                    ? `<div class="no-poster">${movie.original_title}</div>`
                    : `<img class="card-img search-img" src=https://image.tmdb.org/t/p/w185/${movie.poster_path}>`
                }
                <div class="card-rating">${movie.vote_average}⭐</div>
                <div class="card-description">${movie.overview}</div>
                <button class="card-watchlist-btn flexbox"><i class="fa-solid fa-square-plus trending-icon"></i></button>
              </div>
          `;
        });
      } else {
        html += `<p class="section-description">Sorry, looks like we don't have what you are looking for!</p>`;
        document.querySelector(".section-description").style.gridColumn =
          "1/ span 6";
      }
      hero.insertAdjacentHTML("afterbegin", html + `</div>`);

      hideLoading();
    });
};

function handleSearch() {
  const input = document.getElementById("search-input-box").value;
  const searchTerm = input.split(" ").join("+");
  const hero = document.querySelector(".section-hero");
  const image = document.querySelectorAll(".mySlides");
  const heroHTML = hero.innerHTML;
  if (input) {
    hero.innerHTML = " ";
    hero.style.paddingTop = "100vh";
    const bool = getMovies(
      BASE_URL + "/search/movie?" + API_KEY + "&query=" + searchTerm
    );
  } else {
    hero.innerHTML = heroHTML;
  }
}

// Top Rated Section
fetch(
  "https://api.themoviedb.org/3/movie/top_rated?api_key=c6f7e03abe070c06a55335e2c824f3d3&language=en-US&page=1"
)
  .then((response) => response.json())
  .then((data) => {
    const arr = data.results;
    const title = document.querySelector(".hero-movie-details");
    const image = document.querySelector(".slideshow-container");

    for (const [i, x] of arr.entries()) {
      title.innerHTML += `
        <p class="category category-${i + 1}">TOP RATED</p>
        <div class="movie movie-no-${i + 1}">
        <p class="hero-title"></p>
          <p class="hero-description">
          </p>
          <div class="votes flexbox">
            <div class="vote-avg"></div>
            <div class="vote-count"></div>
            <div class="language"></div>
          </div>
        <button class="watchlist-btn flexbox"><i class="fa-solid fa-square-plus icon watchlist-icon"></i>add to watchlist</button>
        </div>`;

      image.innerHTML += `
        <div class="mySlides mySlides-${
          i + 1
        } fade" style="background-image: none"></div>`;

      document.querySelectorAll(".hero-title")[i].textContent =
        arr[i].original_title;
      document.querySelectorAll(".hero-description")[i].textContent =
        arr[i].overview;
      document.querySelectorAll(".vote-avg")[
        i
      ].textContent = `${arr[i].vote_average} ⭐`;
      document.querySelectorAll(".vote-count")[
        i
      ].textContent = `(${arr[i].vote_count} ratings)`;
      document.querySelectorAll(".language")[
        i
      ].textContent = `(${arr[i].original_language})`;
      console.log(document.body.clientWidth <= 430);
      const img_path =
        document.body.clientWidth <= 430
          ? `${arr[i].poster_path}`
          : `${arr[i].backdrop_path}`;
      document.querySelectorAll(".mySlides")[
        i
      ].style.backgroundImage = `linear-gradient(0deg,
          rgba(0, 0, 0, 0.8) 0%,
          rgba(17, 17, 17, 0.5) 80%,
          rgba(52, 52, 52, 0) 100%
        ), url(https://image.tmdb.org/t/p/w1280${img_path})`;
    }
  });

// Trending Section

fetch(
  `https://api.themoviedb.org/3/trending/all/day?api_key=c6f7e03abe070c06a55335e2c824f3d3`
)
  .then((response) => response.json())
  .then((data) => {
    const arr = data.results;
    console.log(arr);
    const grid = document.querySelector(".grid-container-trending");
    for (let i = 0; i < 12; i++) {
      grid.innerHTML += `
        <div class="card card-${i + 1}">
          <img class="card-img grid-card-img" src="">
          <div class="card-rating">${arr[i].vote_average}⭐</div>
          <div class="card-description">${arr[i].overview}</div>
          <button class="card-watchlist-btn flexbox"><i class="fa-solid fa-square-plus trending-icon"></i></button>
        </div>`;
      document.querySelectorAll(".card-img")[
        i
      ].src = `https://image.tmdb.org/t/p/w185/${arr[i].poster_path}`;
    }
  });

// Upcoming section
let genres = new Map();

fetch(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=c6f7e03abe070c06a55335e2c824f3d3&language=en-US`
)
  .then((response) => response.json())
  .then((data) => {
    const arr = data.genres;
    for (const x of arr) {
      genres.set(x.id, x.name);
    }
    console.log(genres);
  });

let genreColor = new Map();
genreColor.set("Action", "red");
genreColor.set("Adventure", "yellow");
genreColor.set("Animation", "yellow");
genreColor.set("Comedy", "yellow");
genreColor.set("Crime", "red");
genreColor.set("Documentary", "blue");
genreColor.set("Drama", "blue");
genreColor.set("Family", "yellow");
genreColor.set("Fantasy", "pink");
genreColor.set("History", "pink");
genreColor.set("Horror", "red");
genreColor.set("Music", "yellow");
genreColor.set("Mystery", "blue");
genreColor.set("Romance", "pink");
genreColor.set("Science Fiction", "blue");
genreColor.set("TV Movie", "blue");
genreColor.set("Thriller", "red");
genreColor.set("War", "red");
genreColor.set("Western", "blue");
let page = 1;

fetch(
  `https://api.themoviedb.org/3/movie/upcoming?api_key=c6f7e03abe070c06a55335e2c824f3d3&language=en-US&page=1`
)
  .then((response) => response.json())
  .then((data) => {
    const arr = data.results;
    const grid = document.querySelector(".flex-container-upcoming");
    if (grid.innerHTML != "") {
      grid.innerHTML = "";
    }
    for (let i = 0; i < 20; i++) {
      const primaryGenre = genres.get(arr[i].genre_ids[0]);
      grid.innerHTML += `
          <div class="card card-${i + 1}">
            <div class="card-genre">${primaryGenre}</div>
            <img class="card-img upcoming" src="">
            <div class=" card-rating card-release-date">${
              arr[i].release_date
            }</div>
            <div class="card-description">${arr[i].overview}</div>
            <button class="card-watchlist-btn flexbox"><i class="fa-solid fa-square-plus trending-icon"></i></button>
          </div>`;
      document.querySelectorAll(".upcoming")[
        i
      ].src = `https://image.tmdb.org/t/p/w185/${arr[i].poster_path}`;
      document.querySelectorAll(".card-genre")[
        i
      ].style.backgroundColor = `${genreColor.get(primaryGenre)}`;
      document.querySelectorAll(".card-genre")[i].style.color =
        document.querySelectorAll(".card-genre")[i].style.backgroundColor ==
        ("yellow" || "blue" || "pink")
          ? "#000"
          : "#fff";
    }
  });

function plusGridSlides() {
  document.querySelector(".flex-container-upcoming").style.transform =
    "translateX(-110rem)";
}
function minusGridSlides() {
  document.querySelector(".flex-container-upcoming").style.transform =
    "translateX(110rem)";
}

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let slideDescription = document.getElementsByClassName("movie");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    slideDescription[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
  slideDescription[slideIndex - 1].style.display = "block";
}

function addToWatchList() {
  document.querySelectorAll(".watchlist-btn");
  document.querySelectorAll(".card-watchlist-btn");
}
