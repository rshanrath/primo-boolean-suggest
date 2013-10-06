
var PrimoBooleanSuggest = function (options){
  settings = jQuery.extend(
    {
      'afterSelector' : '#exlidHeaderSystemFeedback',
      'suggestLinkId' : 'BoolSuggestLink',
      'wrapperClass'  : 'BoolSuggest',
      'titleChars'    : [":", ".", ",", "?"],
      'titleWords'    : ["of", "by", "on", "the", "in", "an", "a"]
    },
    options
  );

  var getSearchQuery = function(){
    return $('#search_field').val().replace(/\+/g, " ");
  }

  var hasTitleChars = function(searchQuery){
    for (var i = 0; i < settings.titleChars.length; i++){
      if (searchQuery.indexOf(settings.titleChars[i]) >= 0){
        return true;
      }
    }
  }

  var isPageSuggestable = function(){
    // Only display Booelan Suggest if there isn't already another system feedback box (e.g. for DYM)
    if ($('.EXLSystemFeedback strong').length > 0){
      return false;
    }
    return true;
  }

  var getPageParams = function(){
    var params = {};
    var qs = window.location.search;
    qs = qs.substr(1, qs.length);
    qs = qs.split("&");
    for(var i = 0; i < qs.length; i++) {
      var pairs = qs[i].split("=");
      params[pairs[0]] = pairs[1];
    }
    return params;
  }

  var suggest = function(){
    var params = getPageParams();
    var dscnt = params.dscnt;
    //var rfnId = params.rfnId;
    //var pag = params.pag;
    var rfnId = "";
    var pag = "";

    // Try to only show Boolean Suggest if this is the first page of a new search
    if (dscnt < 1 && (pag != "prv" && pag != "nxt") && rfnId != "rfin0"){
      var foundTitleChar = false;
      var foundTitleWord = false;
      var foundBool = false;

      var searchQuery = getSearchQuery();
      
      foundTitleChar = hasTitleChars(searchQuery);

      var results = searchQuery.match(/("[^"]+"|[^"\s]+)/g);
      var reformat = [];

      for (var i = 0; i < results.length; i++){
        if (results[i].indexOf('""') > -1){
          reformat[i] = results[i];
        }else{
          if (results[i] == "or" || results[i] == "not" || results[i] == "and"){
            reformat[i] = results[i].toUpperCase();
            foundBool = true;
          }else{
            if ($.inArray(results[i], settings.titleWords) >= 0){
              foundTitleWord = true;
            }

            reformat[i] = results[i];
          }
        }
      }

      if (foundBool && ! foundTitleChar && ! foundTitleWord){
        var newPairs = new Array();
        for (var key in params){
          if (key == 'vl(freeText0)'){
            newPairs.push(key + "=" + reformat.join(' '));
          }else if (key == 'query'){
            var qPieces = key.split(",");
            newPairs.push(key + "=" + qPieces[0] + "," + qPieces[1] + "," + reformat.join(' '));
          }else{
            newPairs.push(key + "=" + params[key]);
          }          
        } 

        var newSearchURL = window.location.pathname + '?' + encodeURI(newPairs.join("&"));
        var newSearchText = reformat.join(' ');
        var suggestContainer = '<div class="boolhelp">+If you want to use Boolean operators like "and," "or," and "not", you\'ll need to capitalize them.' +
                               ' Try this search: <a id="' + settings.suggestLinkId + '" href="' + newSearchURL + '">' + newSearchText + '</a>.</div>';
        $(settings.afterSelector).after(suggestContainer);
      }
    }    
  }

  if (isPageSuggestable()){
    suggest();
  }
}
