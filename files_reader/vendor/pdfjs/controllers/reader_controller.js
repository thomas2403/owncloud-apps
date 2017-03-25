PDFJS.reader.ReaderController = function(book) {
    var $main = $("#main"),
        $viewer = $("#viewer"),
        $divider = $("#divider"),
        $loader = $("#loader"),
        $next = $("#next"),
        $prev = $("#prev"),
        $sidebarReflow = $('#sidebarReflow'),
        $metainfo = $("#metainfo"),
        $use_custom_colors = $("#use_custom_colors"),
        $container = $("#container"),
        $fullscreen = $("#fullscreen"),
        $bookmark = $("#bookmark"),
        $note = $("#note"),
        $rotate_left = $("#rotate_left"),
        $rotate_right = $("#rotate_right");

    var reader = this,
        book = this.book,
        settings = reader.settings;

    var slideIn = function() {
        if (reader.viewerResized) {
            var currentPosition = book.getCurrentLocationCfi();
            reader.viewerResized = false;
            $main.removeClass('single');
            $main.one("transitionend", function(){
                book.gotoCfi(currentPosition);
            });
        }
    };

    var slideOut = function() {
        var currentPosition = book.getCurrentLocationCfi();
        reader.viewerResized = true;
        $main.addClass('single');
        $main.one("transitionend", function(){
            book.gotoCfi(currentPosition);
        });
    };

    var showLoader = function() {
        $loader.show();
        hideDivider();
    };

    var hideLoader = function() {
        $loader.hide();

        //-- If the book is using spreads, show the divider
        // if(book.settings.spreads) {
            // 	showDivider();
            // }
    };

    var showDivider = function() {
        $divider.addClass("show");
    };

    var hideDivider = function() {
        $divider.removeClass("show");
    };

    var keylock = false;

    var showActive = function (obj) {
        keylock = true;
        obj.addClass("active");	
        setTimeout(function () {
            keylock = false;
            obj.removeClass("active");
        }, 100);
    };

    var keyCommands = function(e) {

        var page_no = false;

        switch (settings.keyboard[e.keyCode]) {
            case 'previous':
                $prev.click();
                break;
            case 'next':
                $next.click();
                break;
            case 'first':
                page_no = 1;
                break;
            case 'last':
                page_no = reader.settings.numPages;
                break;
            case 'annotate':
                $note.click();
                break;
            case 'bookmark':
                $bookmark.click();
                break;
            case 'toggleTitlebar':
                reader.ControlsController.toggle();
                break;
            case 'toggleSidebar':
                reader.SidebarController.toggle();
                break;
            case 'closeSidebar':
                reader.SidebarController.hide();
                break;
            case 'toggleFullscreen':
                $fullscreen.click();
                break;
            case 'toggleNight':
                $metainfo.click();
                break;
            case 'toggleDay':
                $use_custom_colors.click();
                break;
            case 'rotateLeft':
                $rotate_left.click();
                break;
            case 'rotateRight':
                $rotate_right.click();
                break;
            case 'toggleZoom':
                // TODO
                break;
            default:
                console.log("unsupported keyCode: " + e.keyCode);
        }

        if (page_no) {
            reader.queuePage(page_no);
        }
    }

    document.addEventListener('keydown', keyCommands, false);

    $next.on("click", function(e){

        //if(book.metadata.direction === "rtl") {
        //    reader.prevPage();
        //} else {
            reader.nextPage();
        //}

        showActive($next);

        e.preventDefault();
    });

    $prev.on("click", function(e){

        //if(book.metadata.direction === "rtl") {
        //    reader.nextPage();
        //} else {
            reader.prevPage();
        //}

        showActive($prev);

        e.preventDefault();
    });

    /*
    book.on("renderer:spreads", function(bool){
        if(bool) {
            showDivider();
        } else {
            hideDivider();
        }
    });
    */

    // book.on("book:atStart", function(){
        // 	$prev.addClass("disabled");
        // });
    // 
    // book.on("book:atEnd", function(){
        // 	$next.addClass("disabled");	
        // });

    return {
        "slideOut" : slideOut,
        "slideIn"  : slideIn,
        "showLoader" : showLoader,
        "hideLoader" : hideLoader,
        "showDivider" : showDivider,
        "hideDivider" : hideDivider,
        "keyCommands" : keyCommands
    };
};
