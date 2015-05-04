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

        var $countries = $('.countryItem'),
            countriesLikeSums = {},
            countryLikesMaxCount = 0,
            countryLikesMaxData = undefined

        $countries.each(function () {
            var $country = $(this),
                country = $country.data('slug')

            var likeSum = 0

            $country.find('.likesCount').each(function () {
                var $like = $(this),
                    likeNetwork = $like.data('social')

                var likes = countries[country] && countries[country][likeNetwork] || 0

                $like.text(likes)
                likeSum += likes
            })

            $country.find('.countryCounter').text(likeSum)
            countriesLikeSums[country] = likeSum

            if (likeSum > countryLikesMaxCount) {
                countryLikesMaxCount = likeSum
                countryLikesMaxData = {slug: country, $el: $country}
            }
        })

        if (countryLikesMaxCount && countryLikesMaxData) {
            $('.leaderName').text(countryLikesMaxData.$el.find('.countryName').text())
        }
    })
})(jQuery)