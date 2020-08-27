function fixCodeBlocks() {
    var isNotRecentPandoc = false;

    document.querySelectorAll("pre code > a").forEach(function (oldLine) {
        isNotRecentPandoc = true;
        var newLine = document.createElement("span");
        newLine.id = oldLine.id;
        var newLink = document.createElement("a");
        newLink.href = "#" + oldLine.id;
        newLink.setAttribute("aria-hidden", "true");
        newLine.innerHTML = newLink.outerHTML + oldLine.innerHTML;
        oldLine.parentNode.replaceChild(newLine, oldLine);
    });
    document.querySelectorAll("pre code").forEach(function (block) {
        block.childNodes.forEach(function (child) {
            if (child.nodeName === "#text")
                child.textContent = "\n";
        });
    });

    if (isNotRecentPandoc) {
        document.querySelectorAll(".CodeMirror-code pre + pre").forEach(function (line) {
            line.classList.add("bad-version-of-pandoc");
        });
    }
}

function addDragToConsole(isAdd) {
    document.querySelectorAll(".sourceCode .cb-console .cb-repl-container, .sourceCode .cb-console .cb-drawing-window, .sourceCode .cb-console .cb-pixels-window").forEach(function (elem) {
        function down(e) {
            if (e.srcElement === elem) {
                if (e.buttons === 1) {// left click
                    elem.setAttribute("data-clicked", "clicked");
                    document.body.setAttribute("data-clicked", "clicked");
                    elem.setAttribute("data-page-x", e.pageX);
                    elem.setAttribute("data-page-y", e.pageY);
                }
            }
        }
        
        var partialClass = ["repl-container", "drawing-window", "pixels-window"];
        var partialSvg = ['<path class="stroke" d="M 10 20 L 10 236 L 246 236 L 246 20 Z" fill="none" stroke="black" stroke-width="20" />' // the window
                                + '<path class="fill" d="M 10 20 L 10 70 L 246 70 L 246 20 Z" />' // the top bar
                                + '<path class="stroke" d="M 60 100 L 120 130 L 60 160" fill="none" stroke="black" stroke-width="20" />' // the 'cursor
                            , '<path class="stroke" d="M 10 20 L 10 236 L 246 236 L 246 20 Z" fill="none" stroke="black" stroke-width="20" />' // the window
                                + '<circle class="fill" cx="175" cy="125" r="40" fill="black" />' // a filled square
                                + '<path class="stroke" d="M 100 100 L 100 200 L 200 200 L 200 100 Z" fill="none" stroke="black" stroke-width="20" />' // a square
                                + '<circle class="stroke" cx="100" cy="100" r="50" fill="none" stroke="black" stroke-width="20" />' // a drawing
                            , '<path class="stroke" d="M 10 20 L 10 236 L 246 236 L 246 20 Z" fill="none" stroke="black" stroke-width="20" />' // the window
                            ];
        var nbCol = 3;
        var nbRow = 3;
        var gutter = 20;
        var heightPixel = (226 - 30 - gutter * (nbRow + 1)) / nbRow;
        var widthPixel = (236 - 20 - gutter * (nbCol + 1)) / nbCol;

        for (var i = 0; i < nbRow; i++) {
            for (var j = 0; j < nbCol; j++) {
                var xStart = j * (widthPixel + gutter) + 20 + gutter;
                var yStart = i * (heightPixel + gutter) + 30 + gutter;
                var xEnd = xStart + widthPixel;
                var yEnd = yStart + heightPixel;
                partialSvg[2] += '<path class="fill" d="M ' + xStart + ' ' + yStart + ' L ' + xStart + ' ' + yEnd + ' L ' + xEnd + ' ' + yEnd + ' L ' + xEnd + ' ' + yStart + ' Z" fill="black" />';
            }
        }

        var partialTitle = ["repl", "drawing window", "pixels window"];
        var typeElem = elem.classList.contains("cb-repl-container")
                        ? 0
                        : elem.classList.contains("cb-drawing-window")
                            ? 1
                            : 2;
        var elemClass = "data-cb-show-" + partialClass[typeElem];
        var consoleBtn = document.createElement("button");

        consoleBtn.setAttribute("type", "button");
        consoleBtn.setAttribute("title", "show/hide " + partialTitle[typeElem]);
        consoleBtn.setAttribute("class", "btn btn-secondary cb-button open-btn btn-" + partialClass[typeElem]);
        consoleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><g>'
                                + partialSvg[typeElem]
                                + '</g></svg>';
        consoleBtn.onclick = function (e) {
            var vmTemp = elem.closest(".cb-vm");

            if (vmTemp.hasAttribute(elemClass))
                vmTemp.removeAttribute(elemClass);
            else
                vmTemp.setAttribute(elemClass, true);

            consoleBtn.classList.toggle("console-btn-visible");
        }
        elem.closest(".cb-vm").querySelector(".cb-exec-controls .btn-group").appendChild(consoleBtn);
        elem.setAttribute("data-dif-page-x", 0);
        elem.setAttribute("data-dif-page-y", 0);

        if (isAdd) {
            elem.addEventListener("mousedown", down);
        }
        else {
            elem.attachEvent("onmousedown", down);
        }
    });

    function move(e) {
        if (document.body.hasAttribute("data-clicked")) {
            var block = document.querySelector(".sourceCode [data-clicked=clicked]");
            var tempX = e.pageX;
            var tempY = e.pageY;
            var difX = tempX
                        - parseInt(block.getAttribute("data-page-x"))
                        + parseInt(block.getAttribute("data-dif-page-x"));
            var difY = tempY
                        - parseInt(block.getAttribute("data-page-y"))
                        + parseInt(block.getAttribute("data-dif-page-y"));
            block.setAttribute("data-dif-page-x", difX);
            block.setAttribute("data-dif-page-y", difY);
            block.setAttribute("data-page-x", tempX);
            block.setAttribute("data-page-y", tempY);
            block.style.transform = "translate(" + difX + "px, " + difY + "px)";
        }
    }
    function up(e) {
        if (document.body.hasAttribute("data-clicked")) {
            document.body.removeAttribute("data-clicked");
            document.querySelector(".sourceCode [data-clicked=clicked]").removeAttribute("data-clicked");
        }
    }

    if (isAdd) {
        document.body.addEventListener("mouseleave", up);
        document.body.addEventListener("mousemove", move);
        document.body.addEventListener("mouseup", up);
    }
    else {
        document.body.attachEvent("onmouseleave", up);
        document.body.attachEvent("onmousemove", move);
        document.body.attachEvent("onmouseup", up);
    }
}

function processFontSize() {
    document.querySelectorAll("[data-cb-font-size]").forEach(function (elem) {
        elem.classList.add("cb-font-size-" + elem.getAttribute("data-cb-font-size"));
    });
}

if (window.addEventListener) {
    window.addEventListener("load", function () {
        addDragToConsole(true);
        processFontSize();
    });
}
else {
    window.attachEvent("onload", function () {
        addDragToConsole(false);
        processFontSize();
    });
}
