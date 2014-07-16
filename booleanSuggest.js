
var PrimoBooleanSuggest = function (options){
  settings = jQuery.extend(
    {
      'afterSelector' : '#exlidHeaderSystemFeedback',
      'suggestLinkId' : 'BoolSuggestLink',
      'wrapperClass'  : 'BoolSuggest',
      'titleChars'    : [":", ".", ",", "?"],
      'titleWords'    : ["of", "by", "on", "the", "in", "an", "a", "with", 
                         "to", "for", "what", "it", "it's"],
      'termsToOperatorsThreshold' : 6 // max ratio of terms to operators to make suggestions
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
    return false;
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

  var isPageSuggestable = function(){
    // Only display Booelan Suggest if the page contains results,
    //  if there isn't already another system feedback box (e.g. for DYM),
    //  if there are no facets selected
    if ($('#exlidResultsTable').length < 1 || 
       $('.EXLSystemFeedback strong').length > 0 ||
       $('.EXLRefinementsList').length > 0 ||
       $('#exlidSearchTile').length < 1){
      return false;
    }
    var params = getPageParams();
    var dscnt = params.dscnt;
    var rfnId = params.rfnId;
    var pag = params.pag;

    // Try to only show Boolean Suggest if this is the first page of a new search
    if (! (typeof dscnt == 'undefined' || dscnt < 1) ||
        ! (typeof pag == 'undefined' || (pag != "prv" && pag != "nxt")) ||
        ! (typeof rfnId == 'undefined' ||  rfnId != "rfin0")){
      return false;
    }
    return true;
  }

  var suggest = function(){
    var params = getPageParams();

    var searchQuery = getSearchQuery();

    var foundTitleWord = false;
    var foundBool = false;
    var foundTitleChar = hasTitleChars(searchQuery);

    var countBool = 0;
    var countTerms = 0;

    var results = searchQuery.match(/("[^"]+"|[^"\s]+)/g);
    var reformat = [];

    for (var i = 0; i < results.length; i++){
      if (results[i].indexOf('""') > -1){
        reformat[i] = results[i];
      }else{
        if (results[i] == "or" || results[i] == "not" || results[i] == "and"){
          reformat[i] = results[i].toUpperCase();
          foundBool = true;
          countBool++
        }else{
          if ($.inArray(results[i].toLowerCase(), settings.titleWords) >= 0){
            foundTitleWord = true;
          }

          reformat[i] = results[i];
          countTerms++;
        }
      }
    }

    var termsToOperators = 1;
    if (countBool > 0){
      termsToOperators = countTerms / countBool;
    }

    if (foundBool && ! foundTitleChar && ! foundTitleWord && termsToOperators <= settings.termsToOperatorsThreshold){
      var newPairs = new Array();
      for (var key in params){
        if (key == 'vl%28freeText0%29'){
          newPairs.push(key + "=" + encodeURI(reformat.join(' ')));
        }else if (key == 'query'){
          var qPieces = params[key].split(",");
          newPairs.push(key + "=" + encodeURI(qPieces[0] + "," + qPieces[1] + "," + reformat.join(' ')));
        }else{
          newPairs.push(key + "=" + params[key]);
        }          
      } 

      var newSearchURL = window.location.pathname + '?' + newPairs.join("&");
      var newSearchText = reformat.join(' ');
      var suggestContainer = '<div class="boolhelp">To use Boolean operators like "and," "or," and "not", you\'ll need to capitalize them.' +
                             ' Try this search: <a id="' + settings.suggestLinkId + '" href="' + newSearchURL + '">' + newSearchText + '</a>.</div>';
      $(settings.afterSelector).after(suggestContainer);
    }
   
  }

  if (isPageSuggestable()){
    suggest();
  }
}
