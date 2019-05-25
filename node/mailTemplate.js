module.exports = (request, response) => {
  response.render('mail', {
    title: 'Daniel & Wilma gaan trouwen!',
    domain: 'http://localhost:3000/',
    body: `Dat willen we graag vieren met jou en andere mensen die je misschien kent of nog kunt leren kennen. Kom je ook?`,
    link: 'http://localhost:3000'
  })
};