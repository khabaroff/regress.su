;(function ($) {
    $(document).foundation()

    var countriesLikes = jQuery.get('countries-likes.json'),
        domReady = $.Deferred()

    jQuery(function () {
        domReady.resolve()
    })

    $.when(countriesLikes, domReady).done(function (countries) {
        if (countries && countries[0]) {
            countries = countries[0]
        }
        else {
            return
        }

        console.log(countries)
    })
})(jQuery)