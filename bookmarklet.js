/* 
 * INSTAGRAM AUTO CAPTIONER
 * not a serious tool, and definitely not production ready.
 * PSA this should only be used on photos you have consent to use / own
 *
*/

const apiUrl = 'https://eastus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=description';
const apiKey = '';

function replaceAlt(image) {
  if (!image.src) return;
  
  const body = JSON.stringify({url: image.src});

  const options = {
    method: 'POST',
    body,
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/json'
    }
  };

  fetch(apiUrl, options)
    .then((r) => r.json())
    .then((r) => {
      const description = r.description.captions[0].text;
      image.setAttribute('alt', description);
      console.log('found caption: ' + description);
    })
    .catch(console.log)
}

const images = document.querySelectorAll('article > div img');
images.forEach(replaceAlt);

const articleContainer = document.querySelector('#mainFeed > div > div > div > div');

const observer = new MutationObserver(function(mutations) {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((article) => {
        const image = article.querySelector('div > img');
        console.log('new image:', image);
        // image src can sometimes be delayed for a while after the mutation has occurred
        setTimeout(() => {replaceAlt(image)}, 700);
      });
    }
  });    
});

const config = {childList: true};
observer.observe(articleContainer, config);
