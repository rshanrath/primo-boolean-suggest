# Primo Boolean Suggest

Primo Boolean Suggest is an add-on for Ex Libris' Primo library discovery system.

Primo requires that operators in Boolean searches be capitalized. Users who may wish to use Boolean operators in their searches are often unfamiliar with this requirement. The Boolean Suggest add-on tries to determine if the query looks like an intended Boolean search and, if so, provides a suggestion box with a link that performs a new search with the Boolean operators capitalized.

The add-on attempts to determine if "Did you mean" or another systems notice is already present on the page and will not provide a Boolean suggestion in those cases.  Likewise, suggestions will only be added the first time the first page of results is viewed.

Known item searches for titles are likely to contain terms that are the same as, but not intended to be, Boolean operators. The add-on uses crude methods based on to guess whether or not the query is a search for a title and will not offer suggestions in such cases.  These include: the presence of special characters; the presence of certain terms, especially prepositions or articles; and a check against a maximum threshold for the ratio of query terms to boolean operators. The title characters, title words, and ratio of terms to operators used to make this determination may be customized by passing in custom lists as parameters when calling the PrimoBooleanSuggest function.

## Installation

The booleanSuggest.js file needs to be included in the page and the PrimoBooleanSuggest function should be called when the page is loaded (e.g., via a jQuery document ready function).

Alternatively, the booleanSuggestTile.html may be installed as a custom tile in the Primo Back Office views configuration. (Be sure to supply the path to the booleanSuggest.js file).
