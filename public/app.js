//Perform scrape and show results from API route
$("#scrape-btn").click(function () {
  $.ajax({
    url: "/scrape",
    type: 'GET'
  })
  //Display articles from db
  // function displayArticle(articles) {
  //   articles.forEach(function (articledata) {
  //     $('#articles')
  //   })
  // }

})

