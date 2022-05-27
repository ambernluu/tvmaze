const url = 'https://api.tvmaze.com';
const genericImage = 'https://tinyurl.com/tv-missing';

async function searchShows(query) {
  try {
    const res = await axios.get(`${url}/search/shows?q=${query}`);
    return res.data.map((entry) => {
      return {
        id: entry.show.id,
        name: entry.show.name,
        summary: entry.show.summary,
        image: entry.show.image ? entry.show.image.medium : genericImage,
      };
    });
  } catch (error) {
    console.log(error);
  }
}

function populateShows(shows) {
  const $showsList = $('#shows-list');
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="show-episodes">Show Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

$('#search-form').on('submit', async function handleSearch(e) {
  e.preventDefault();

  let query = $('#search-query').val();
  if (!query) return;

  $('#episodes-area').hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

async function getEpisodes(id) {
  try {
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    return res.data.map((entry) => {
      return {
        id: entry.id,
        name: entry.name,
        season: entry.season,
        number: entry.number,
      };
    });
  } catch (error) {
    console.log(error);
  }
}

function populateEpisodes(episodes) {
  const episodesList = document.getElementById('episodes-list');
  for (let episode of episodes) {
    const episodeLi = document.createElement('li');
    episodeLi.innerText = `${episode.name} (Season ${episode.season}, Episode: ${episode.number})`;
    episodesList.append(episodeLi);
  }
  $('#episodes-area').show();
}

$('#shows-list').on(
  'click',
  '.show-episodes',
  async function handleEpisodeClick(e) {
    let showId = $(e.target).closest('.Show').data('show-id');
    let episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  }
);
