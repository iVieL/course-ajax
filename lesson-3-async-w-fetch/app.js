(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 2b34233aac3d6ffef3c9651e4f518f0fbc58c11d122ea01b3ef45989986ff744'
            }
        })
        .then(response => response.json())
        .then(addImage) // response.json returns a new promise from Responde.body parsing to json
        .catch(e => requestError(e, 'image'))
        ;

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=630666f4439747309f4a9b2e1f265b84`)
        .then(response => response.json())
        .then(addArticle)
        .catch(e => requestError(e, 'articles'))
        ;

    });

    function addImage(images) {
      let htmlContent = '';
      const firstImage = images.results[0];

      if(images && images.results && images.results[0]) {
          htmlContent = `<figure>
            <img src="${firstImage.urls.small}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
          </figure>`;
      } else {
        htmlContent = '<div class="error-no-image">No Images available</div>';
      }

      responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
    }

    function addArticle(articles) {
      let htmlContent = '';

      if(articles.response && articles.response.docs && articles.response.docs.length > 1) {
      htmlContent = '<ul>'+ articles.response.docs.map(article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
         </li>`
         ).join('')+ '</ul>'
        
      } else {
        htmlContent = '<div class="error-no-article">No Articles available</div>';
      }

      responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
    }

    function requestError(e, part) {
      console.log(e);
      responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-no-${part}">something wrong!</p>`)
    }

})();
