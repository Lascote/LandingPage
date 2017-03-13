var OrderAPI = {

    _baseUri: 'api/order.php',
    _ui: {
        fio: null,
        email: null,
        phone: null,

        locality: null,
        street: null,
        house: null,
        housing: null,
        apartment: null,

        note: null
    },
    titleElement: null,
    articleElement: null,
    messageElement: null,
    formElement: null,


    _isInit: false,
    _initElement: function (id) {
        var element = document.getElementById(id);
        if (element === null) {
            throw 'Element #' + id + ' not found.';
        }
        return element;
    },
    init: function () {
        // Инициализируем форму заказа
        $.each(OrderAPI._ui, function (key) {
            var element = OrderAPI._initElement('order_' + key);
            element.req = false;
            element.regex = null;
            OrderAPI._ui[key] = element;
        });

        OrderAPI.titleElement = OrderAPI._initElement('orderProduct');
        OrderAPI.articleElement = OrderAPI._initElement('orderArticle');
        OrderAPI.messageElement = OrderAPI._initElement('orderMessage');
        OrderAPI.formElement = OrderAPI._initElement('orderForm');
        OrderAPI.formElement.onsubmit = function () {
            OrderAPI.setFormEnabled(false);
            OrderAPI.sendOrder();
            return false;
        };

        // Обязательные поля
        OrderAPI._ui.fio.req = true;
        OrderAPI._ui.phone.req = true;
        OrderAPI._ui.locality.req = true;
        OrderAPI._ui.street.req = true;
        OrderAPI._ui.house.req = true;
        // Regex
        OrderAPI._ui.email.regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //OrderAPI._ui.phone.regex = /.*/;
        OrderAPI._ui.house.regex = /^\d*$/;
        OrderAPI._ui.apartment.regex = /^\d*$/;

        OrderAPI._isInit = true;
    },

    setFormEnabled: function (enabled) {
        if (OrderAPI._isInit === false) {
            throw 'OrderAPI is not initialized.';
        }

        if (enabled === true) {
            $(OrderAPI.formElement).find('input, textarea, button, select').removeAttr('disabled');
        } else {
            $(OrderAPI.formElement).find('input, textarea, button, select').attr('disabled', 'disabled');
        }
    },

    checkFields: function () {
        if (OrderAPI._isInit === false) {
            throw 'OrderAPI is not initialized.';
        }

        var isOkFill = true;
        var isOkRegex = true;
        OrderAPI.clearElementErrors();
        $.each(OrderAPI._ui, function (key, element) {
            if ( element.value === '' && element.req === true ) {
                element.classList.add('order-element-fill');
                isOkFill = false;
            } else if ( element.regex !== null && element.value !== '' ) {
                if (element.regex.test(element.value) === false) {
                    element.classList.add('order-element-regex');
                    isOkRegex = false;
                }
            }
        });

        var errorMessage = '';
        if (isOkFill === false) {
            errorMessage += 'Заполните обязательные поля (*)\n';
        }
        if (isOkRegex === false) {
            errorMessage += 'Заполните поля правильно\n';
        }
        return errorMessage;
    },

    clearElementErrors: function () {
        if (OrderAPI._isInit === false) {
            throw 'OrderAPI is not initialized.';
        }
        $.each(OrderAPI._ui, function (key, element) {
            element.classList.remove('order-element-fill');
            element.classList.remove('order-element-regex');
        });
    },

    sendOrder: function () {
        if (OrderAPI._isInit === false) {
            throw 'OrderAPI is not initialized.';
        }

        var errorMessage = OrderAPI.checkFields();
        if (errorMessage === '') {

            var uri = OrderAPI._baseUri + '?';
            uri += 'product=' + encodeURIComponent(OrderAPI.titleElement.innerText) + '&';
            uri += 'article=' + encodeURIComponent(OrderAPI.articleElement.innerText) + '&';
            console.log(OrderAPI.articleElement.innerText);

            $.each(OrderAPI._ui, function (key, element) {
                uri += key + '=' + encodeURIComponent(element.value) + '&';
            });

            $.get(uri, function (data, success, datatype) {
                OrderAPI.clearFields();
                OrderAPI.messageElement.classList.add('order-ok');
                OrderAPI.messageElement.classList.remove('order-error');
                OrderAPI.messageElement.innerText = '';
                OrderAPI.setFormEnabled(true);
                OrderWindow.close();
                InfoWindow.close();
                Message.show('Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время.')
            })
                .fail(function (data, error, type) {
                    OrderAPI.messageElement.classList.add('order-error');
                    OrderAPI.messageElement.classList.remove('order-ok');
                    OrderAPI.messageElement.innerText = 'Не получилось оставить заказ. Свяжитесь с нами по телефону. Ошибка ' + type ;
                    OrderAPI.setFormEnabled(true);
                });
        } else {
            OrderAPI.messageElement.classList.add('order-error');
            OrderAPI.messageElement.classList.remove('order-ok');
            OrderAPI.messageElement.innerText = errorMessage;
            OrderAPI.setFormEnabled(true);
        }
    },

    clearFields: function () {
        if (OrderAPI._isInit === false) {
            return;
        }

        $.each(OrderAPI._ui, function (key, element) {
            element.value = '';
        });
        OrderAPI.messageElement.innerText = '';
    }

};

var OrderWindow = {

    _background: null,
    _window: null,
    _product: null,
    _article: null,
    showParent: false,

    _isInit: false,
    init: function () {
        OrderWindow._background = $('#orderBackground');
        OrderWindow._window = $('#orderWindow');
        OrderWindow._product = $('#orderProduct');
        OrderWindow._article = $('#orderArticle');

        $('#orderClose').on('click', function () {
            OrderWindow.close();
        });
        OrderWindow._isInit = true;
    },

    close: function () {
        if (OrderWindow._isInit === false) {
            throw 'OrderWindow is not initialized.';
        }

        OrderWindow._window.hide();
        OrderWindow._background.hide();
        OrderAPI.clearElementErrors();

        if (OrderWindow.showParent === true) {
            InfoWindow.showHidden();
        }
    },

    show: function (product, article, showParent) {
        if (OrderWindow._isInit === false) {
            throw 'OrderWindow is not initialized.';
        }

        if (showParent == undefined) {
            showParent = false;
        }
        if (article == undefined) {
            article = '';
        }

        OrderWindow.showParent = showParent;

        OrderWindow._article.text(article);
        OrderWindow._product.text(product);
        OrderWindow._window.show();
        OrderWindow._background.show();
    }

};

var InfoWindow = {
    _background: null,
    _window: null,
    
    slider : {
        slideInterval: null,
        _slideElement: null,
        slides: [],
        current: 0,
        showSlide: function (n) {
            var slides = InfoWindow.slider.slides;
            if (slides.length === 0) {
                return;
            }
            if (slides.length === 1) {
                // Hide arrow
                $('#arrowNext').hide();
                $('#arrowPrev').hide();
            } else {
                // Show arrows
                $('#arrowNext').show();
                $('#arrowPrev').show();
            }

            var slideIndex = n;
            if (n >= slides.length) {slideIndex = 0}
            if (n < 0) {slideIndex = slides.length - 1}

            InfoWindow.slider.current = slideIndex;
            InfoWindow.slider._slideElement.attr('src', slides[slideIndex]);
        },
        init: function () {
            InfoWindow.slider._slideElement = $('#slide');
        }
    },
    timer: {
        _timer: null,
        _timerFunc: function (element) {
            if (InfoWindow.timer.countDownDate === null) {
                return;
            }
            var now = new Date().getTime();
            var distance = InfoWindow.timer.countDownDate - now;

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            element.text(days + "d " + hours + "h "
                + minutes + "m " + seconds + "s ");

            if (distance < 0) {
                element.text('');
            }
        },
        countDownDate: null,
        init: function (element) {
            InfoWindow.timer._timer = setInterval(InfoWindow.timer._timerFunc, 1000, element)
        }
    },

    _product: null,
    _ui: {
        product: null,
        article: null,
        priceStock: null,
        priceOld: null,
        timerDate: null,
        description: null
    },

    _isInit: false,
    init: function () {
        InfoWindow._background = $('#infoBackground');
        InfoWindow._window = $('#infoWindow');
        InfoWindow.slider.init();

        InfoWindow._product = $('#infoProduct');
        InfoWindow._ui.product = $('#info_product');
        InfoWindow._ui.article = $('#info_article');
        InfoWindow._ui.description = $('#info_description');
        InfoWindow._ui.priceStock = $('#info_priceStock');
        InfoWindow._ui.priceOld = $('#info_priceOld');
        InfoWindow._ui.timerDate = $('#info_timerDate');

        InfoWindow.timer.init(InfoWindow._ui.timerDate);

        $('#infoOrder').on('click', function () {
            OrderWindow.show(InfoWindow._product.text(), InfoWindow._ui.article.text(), true);
            InfoWindow.close();
        });
        $('#infoClose').on('click', function () {
            InfoWindow.close();
        });
        InfoWindow._isInit = true;
    },

    close: function () {
        if (InfoWindow._isInit === false) {
            throw 'InfoWindow is not initialized.';
        }

        InfoWindow._background.hide();
        InfoWindow._window.hide();
    },

    showHidden: function () {
        InfoWindow._background.show();
        InfoWindow._window.show();
    },

    show: function (product, article, description, priceStock, priceOld, timerDate, slides, slideInterval) {
        if (InfoWindow._isInit === false) {
            throw 'InfoWindow is not initialized.';
        }



        // Set Elements
        InfoWindow._product.html(product);
        InfoWindow._ui.product.html(product);
        InfoWindow._ui.article.html('Артикул: '+article);
        InfoWindow._ui.description.html(description);
        InfoWindow._ui.priceStock.html(priceStock);
        InfoWindow.timer.countDownDate = new Date(timerDate).getTime();

        if (priceOld === null || priceOld === '') {
            InfoWindow._ui.priceOld.hide();
        } else {
            InfoWindow._ui.priceOld.html(priceOld);
            InfoWindow._ui.priceOld.show();
        }

        InfoWindow.timer._timerFunc(InfoWindow._ui.timerDate);

        InfoWindow.slider.slides = slides;
        InfoWindow.slider.showSlide(0);
        if (InfoWindow.slider.slideInterval !== null) {
            clearInterval(InfoWindow.slider.slideInterval);
        }

        if (slideInterval !== null && slideInterval !== undefined && slides.length > 1) {
            InfoWindow.slider.slideInterval = setInterval(function () {
                InfoWindow.slider.showSlide(++InfoWindow.slider.current);
            }, slideInterval);
        }

        InfoWindow._background.show();
        InfoWindow._window.show();
    }
};

var Message = {

    _background: null,
    _window: null,
    _text: null,

    _isInit: false,
    init: function () {
        Message._background = $('#messageBackground');
        Message._window = $('#messageWindow');
        Message._text = $('#messageText');



        $('#messageCloseButton').on('click', function () {
            Message.close();
        });
        $('#messageClose').on('click', function () {
            Message.close();
        });
        Message._isInit = true;
    },

    close: function () {
        if (Message._isInit === false) {
            throw 'Message is not initialized.';
        }

        Message._background.hide();
    },

    show: function (text) {
        if (Message._isInit === false) {
            throw 'Message is not initialized.';
        }

        Message._text.html(text);
        Message._background.show();
    }
};

function setElementTimer(id, countDownDate) {
    var element = document.getElementById(id);
    if (element === null) {
        return;
    }

    if (element.dateTimer !== undefined) {
        clearInterval(element.dateTimer);
    }

    element.dateTimer = setInterval(function (countDownDate, element) {
        if (countDownDate === null) {
            return;
        }
        var now = new Date().getTime();
        var distance = countDownDate - now;
        if (distance < 0) {
            distance = 0;
        }

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        for (var i = 0; i < element.children.length; i++) {
            var elem = element.children[i];
            if (elem.classList.contains('d-timer') === true) {
                elem.innerText = days;
            } else if (elem.classList.contains('h-timer') === true) {
                elem.innerText = hours;
            } else if (elem.classList.contains('m-timer') === true) {
                elem.innerText = minutes;
            } else if (elem.classList.contains('s-timer') === true) {
                elem.innerText = seconds;
            }
        }
    }, 1000, new Date(countDownDate).getTime(), element);

}


// Весь HTML документ загружен
$(function () {
    OrderAPI.init();
    OrderWindow.init();
    InfoWindow.init();
    Message.init();

    //setElementTimer('testTimer', '2017-03-30T00:00:00');

    $(window).on('click', function (event) {
        if (InfoWindow._background.is(event.target)) {
            InfoWindow.close();
        } else if (OrderWindow._background.is(event.target)) {
            OrderWindow.close();
        } else if (Message._background.is(event.target)) {
            Message.close();
        }
    });

    // Scroll Button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("topBtn").style.display = "block";
        } else {
            document.getElementById("topBtn").style.display = "none";
        }
    }
});

function goTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}