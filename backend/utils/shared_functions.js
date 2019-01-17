const axios = require('axios');

function getPromisesByUrls(urlArray) {
  const majorPromise = [];
  urlArray.forEach(url => {
    majorPromise.push(new Promise((res, rej) => {
      axios.get(url)
      .then(response => res(response.data))
      .catch(err => rej(err))
    }));
  });
  return majorPromise;
}


//Is a function to make readable conditions among objects
function parseType(translsationObject, key) {
  const element = translsationObject[key];
  return element;
}

module.exports = {
  getPromisesByUrls
}