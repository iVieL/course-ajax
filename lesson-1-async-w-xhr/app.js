(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 2b34233aac3d6ffef3c9651e4f518f0fbc58c11d122ea01b3ef45989986ff744');
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function (err) {
          requestError(err, 'image');
        }
        
        unsplashRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticle;
        articleRequest.onerror = function(err) {
          requestError(err, 'article');
        }
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=630666f4439747309f4a9b2e1f265b84`);
        articleRequest.send();

    });

    function addImage() {
      let htmlContent = '';
      const data = JSON.parse(this.responseText);
      const firstImage = data.results[0];

      if(data && data.results && data.results[0]) {
      htmlContent = `<figure>
        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
      </figure>`;
      } else {
        htmlContent = '<div class="error-no-image">No Images available</div>';
      }

      responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
    }

    function addArticle() {
      let htmlContent = '';

      const data = JSON.parse(this.responseText);

      if(data.response && data.response.docs && data.response.docs.length > 1) {
      htmlContent = '<ul>'+ data.response.docs.map(article => `<li class="article">
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
    }
})();
