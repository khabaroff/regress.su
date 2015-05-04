;(function ($) {
    var eventSuffix = 'socialShare'

    var methods = {
        init: function(options){
            var settings = {
                callback: function($this){}
            }

            $.extend(settings, options);

            return $(this).on('click.' + eventSuffix, 'a.socialLink', function(e){

                e.preventDefault()

                var $this = $(this)

                var width = 650,
                    height = 450,
                    left = Math.floor(screen.width / 2 - width / 2),
                    top = Math.floor(screen.height / 2 - height / 2)

                var windowParams = 'height=' + height + ',width=' + width + ',left=' + left + ',top=' + top
                    + ',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no'

                var url = $this.attr('href'),
                    network = $this.data('network')

                window.open(url, $this.attr('title'), windowParams)

                settings.callback($this)

            })
        }
    }

    $.fn.socialShare = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.dateMiniChartControl');
        }
    }
})(jQuery);

;(function ($) {
    var countriesLikes = jQuery.get('countries-likes.json'),
        domReady = $.Deferred()

    jQuery(function () {
        domReady.resolve()

        $(document).foundation()

        $('body').socialShare()
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