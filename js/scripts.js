(function () {

    "use strict";
    /*global $, document, window */

    var lastY = 0,
        navLinks,
        header,
        sideNav,
        menuBar,
        subnavShowY,
        activeSubnav;

    function onJSTopNavLinkEvent(obj) {
        var event = obj.event,
            element = event.target || event.srcElement,
            parent = $(element).parent();
        if (element.tagName === "A" && $(parent).children("ul").length > 0) {
            event.preventDefault();
            if ($($(parent).children("ul")[0]).css("top") === "9999px") {
                $($(parent).children("ul")[0]).css("top", subnavShowY);
            } else {
                $($(parent).children("ul")[0]).css("top", "9999px");
            }
            return false;
        }
    }

    function hideAllSubNav(target) {
        $("#top_nav > ul").children("li").each(function () {
            if (this !== target) {
                if ($(this).children("ul").length > 0) {
                    $(this).children("ul").css("top", "9999px");
                }
            }
        });
    }

    function enableJSTopNavLink(target) {
        $(target).children("ul").css({"display": "block"});
        subnavShowY = $($(target).children("ul")[0]).css("top");
        $(target).children("ul").css({"top": "9999px"});
        $($(target).children("a")).bind("click", function (event) {
            activeSubnav = this;
            hideAllSubNav($(this).parents("li")[0]);
            if ($("#top_nav").parents("#header").length > 0) {
                onJSTopNavLinkEvent({target: this, event: event});
            }
        });
    }

    function enableJSTopNav() {
        $("#top_nav > ul").children("li").each(function () {
            if ($(this).children("ul").length > 0) {
                enableJSTopNavLink($(this));
            }
        });
    }

    function stickNav() {
        var windowPosition = parseInt($(window).scrollTop(), 10),
            headerHeight = ($("#header").is(":visible")) ? parseInt($("#header").css("height"), 10) : 0;
        if (windowPosition >= headerHeight) {
            if ($("#top_nav").parents("#side_nav").length > 0) {
                if (windowPosition > 100) {
                    $("#mobile_top").show();
                } else {
                    $("#mobile_top").hide();
                }
            }
        }
    }

    function checkSize() {
        var i, numItems, children, ulChildren, ulChild, divChildren;
        if ($("#side_nav").is(":visible")) {
            if ($("#top_nav").parents("#header").length > 0) {
                header.removeChild(navLinks);
                sideNav.appendChild(navLinks);
            }
            if (parseInt($("#side_nav").css("left"), 10) === 0) {
                $("#wrapper").hide();
                $("#menu_bar").hide();
            }
        } else {
            if ($("#top_nav").parents("#side_nav").length > 0) {
                sideNav.removeChild(navLinks);
                header.appendChild(navLinks);
                $("#menu_bar").removeAttr("style");
                children = $("#top_nav ul > li").not("#top_nav ul li ul li");
                numItems = children.length;
                for (i = 0; i < numItems; i += 1) {
                    ulChildren = $(children[i]).children("ul");
                    divChildren = $(children[i]).children("div");
                    if (ulChildren.length > 0) {
                        ulChild = ulChildren[0];
                        $(ulChild).removeAttr("style");
                    }
                    if (divChildren.length > 0) {
                        $(divChildren[0]).attr("class", "contracted");
                    }
                }
            }
            $("#wrapper").show();
        }
        stickNav();
    }

    function toggleMenu() {
        if ($("#wrapper").is(":visible")) {
            $("#wrapper").hide();
            $("#menu_bar").hide();
            $("#side_nav").css({"left": "0px"});
        } else {
            $("#wrapper").show();
            $("#menu_bar").show();
            $("#side_nav").css({"left": "-9999px"});
            window.scrollTo(0, lastY);
        }
        stickNav();
    }

    function enableMobileMenuItem(item) {
        var li, div, className, ulChildren, ulChild;
        li = item;
        ulChildren = $(li).children("ul");
        if (ulChildren.length > 0) {
            ulChild = ulChildren[0];
            div = document.createElement("div");
            $(li).prepend(div);
            $(div).addClass("contracted");
            $(div).click(function () {
                className = $(div).attr("class");
                if (className.indexOf("expanded") !== -1) {
                    $(div).removeClass("expanded");
                    $(div).addClass("contracted");
                    $(ulChild).hide();
                } else {
                    $(div).removeClass("contracted");
                    $(div).addClass("expanded");
                    $(ulChild).show();
                }
            });
        }
    }

    function enableMobileMenuExpansion() {
        var i, numItems, children;
        children = $("#top_nav ul > li").not("#top_nav ul li ul li");
        numItems = children.length;
        for (i = 0; i < numItems; i += 1) {
            enableMobileMenuItem(children[i]);
        }
    }

    function scrollToTop() {
        window.scrollTo(0, 0);
    }

    function init() {
        navLinks = document.getElementById("top_nav");
        header = document.getElementById("header");
        sideNav = document.getElementById("side_nav");
        menuBar = document.getElementById("menu_bar");
        $(window).scroll(function () {
            stickNav();
        });
        $(window).resize(function () {
            checkSize();
        });
        $("#mobile_menu").click(function () {
            if ($(navLinks).parents(sideNav).length > 0) {
                lastY = parseInt($(window).scrollTop(), 10);
                scrollToTop();
                toggleMenu();
            }
        });
        $("#mobile_top").click(function () {
            if ($(navLinks).parents(sideNav).length > 0) {
                scrollToTop();
            }
        });
        if (document.addEventListener) {
            document.addEventListener("touchmove", function () {
                stickNav();
            });
        }
        $("#side_nav_close").click(function () {
            toggleMenu();
        });
        if (document.hasOwnProperty && document.hasOwnProperty("ontouchmove") && $(header).is(":visible")) {
            enableJSTopNav();
        }
        enableMobileMenuExpansion();
        checkSize();
        stickNav();
    }

    $(document).ready(function () {
        init();
    });

}());