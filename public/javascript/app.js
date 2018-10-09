$(document).ready(function() {

    //setting up default variables
    var articleList = [];
    var articleID = '';
    var article = '';
    var previousArticle = 0;
    var currentArticle = 0;
    var nextArtilce = 0;

    $('#comments').addClass('hidden');

    //scraping website on initial page load
    $.getJSON('/scrape', function() {
    });

    //getting articles when button clicked and setting an array of articles
    $(document).on('click', '#getArticles', function() {
        $.getJSON('/articles', function(data) {
            articleList = data;
            article = articleList[0];
            showArticle(article);
        });
    });

    //show previous article from the array of articles
    $(document).on('click', '.previous', function() {
        article = articleList[previousArticle];
        currentArticle = previousArticle;
        showArticle(article);
    });

    //show next article 
    $(document).on('click', '.next', function() {
        article = articleList[nextArticle];
        currentArticle = nextArticle;
        showArticle(article);
    });

    //adding and showing comments to article
    $(document).on('click', '#addComment', function() {
        if($('#commentText').val() != '') {
            var name = $('#name').val();
            var comment = $('#commentText').val();
            $.post("/addcomment/" + articleId, {name: name, comment: comment}, function(e) {
                e.preventDefault();
            });
            $('#name').val('');
            $('#commentText').val('');
            showComments(articleId);
        }
    });

    //deleting comments
    $(document).on('click', '.deletecomment', function() {
        comment = this.id;
        $.ajax({
            method: "GET",
            url:"/deletecomment/" + commentId
        }).done(function(data) {}) 
        showComments(articleId);
    });

    //creating function to build article display
    var showArticle = function(article) {
        $('#title').text(article.title);
        $('#summary').text(article.summary);
        $('#readArticle').removeClass('hidden');
        $('#article').attr('href', article.link);
        $('#getArticles').addClass("hidden");
        $('#navigation').empty();
        previousArticle = currentArticle -1;
        if(previousArticle >= 0) {
            $('#navigation').append('<button id="'+previousArticle+'" class="btn btn-primary previous">Previous Article</button>');
        } else {
            $('#navigation').append('<button id="'+previousArticle+'" class="btn btn-primary disabled previous">Previous Article</button>');
        }
        nextArticle = currentArticle + 1;
        if(nextArtilce < articleList.length) {
            $('#navigation').append('<button id="'+nextArticle+'" class="btn btn-primary pull-right next">Next Article</button>');
        } else {
            $('#navigation').append('<button id="'+nextArticle+'" class="btn btn-primary pull-right disabled next">Next Article</button>');
        }
        articleId = article._id;
        showComments(articeId);
    }

    //creating function to build comments display
    var showComments = function(articleId) {
        $("#comments").removeClass("hidden");
        $("#articleComments").empty();
        var commentText = '';
        $.getJSON('comments/' +articleId, function(data) {
            for(var i = 0; 0 < data.length; i++) {
                commentText = commentText + '<div class="well"><span id="'+data[i]._id+'" class="glyphicon glyphicon-remove text-danger deletecomment"></span> '+data[i].comment+' - '+data[i].name+'</div>';
            }
            $('#articleComments').append(commentText);
        });
    }
});