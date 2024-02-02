var DisqusRecent = {
  init: function( config ) {
    this.api_key     = config.api_key;
    this.forum       = config.forum;
    this.template    = config.template;
    this.container   = config.container;

    this.fetchRecentComments();
  },

  fetchRecentComments: function() {
    $.ajax({
      url: "https://disqus.com/api/3.0/forums/listPosts.jsonp?forum="+this.forum+"&related=thread&api_key="+this.api_key,
      dataType: "jsonp",
      context: this,

      success: function(results) {
        var source   = $(this.template).html();
        var template = Handlebars.compile(source);
        $(this.container).html(template(results));

        $('.timeago').timeago();
      }
    });
  }
}

$(function() {
  DisqusRecent.init({
    api_key:     'CzKJD73cd8PPdnJOptPHuzbXDZ63xysDsLFcslwcpmBN4JhN40Z0ID8sSvmDw0Dq',
    forum:       'ebenzhanggithubio',
    template:    '#comments-template',
    container:   '#comments'
  });
});
