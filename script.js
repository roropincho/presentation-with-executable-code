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
    document.querySelectorAll(".sourceCode .cb-console").forEach(function (elem) {
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
        
        var newBtn = document.createElement("p");
        var consoleBtn = document.createElement("button");

        newBtn.classList.add("close-btn");
        newBtn.innerHTML = "&Cross;";
        newBtn.onclick = function (e) {
            elem.classList.add("closed");
            consoleBtn.classList.add("console-btn-visible");
        };
        elem.appendChild(newBtn);

        consoleBtn.setAttribute("type", "button");
        consoleBtn.setAttribute("title", "show/hide console");
        consoleBtn.setAttribute("class", "btn btn-secondary cb-button open-btn");
        consoleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><g>'
                                + '<path d="M 10 20 L 10 236 L 246 236 L 246 20 Z" fill="none" stroke="black" stroke-width="15" />' // the window
                                + '<path d="M 10 20 L 10 70 L 246 70 L 246 20 Z" />' // the top bar
                                + '<path d="M 60 100 L 120 130 L 60 160" fill="none" stroke="black" stroke-width="15" />' // the 'cursor'
                                + '</g></svg>';
        consoleBtn.onclick = function (e) {
            elem.classList.toggle("closed");
            consoleBtn.classList.toggle("console-btn-visible");
        }
        elem.parentNode.querySelector(".cb-exec-controls .btn-group").appendChild(consoleBtn);
        elem.classList.add("closed");
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
            var block = document.querySelector(".sourceCode .cb-console[data-clicked=clicked]");
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
            document.querySelector(".sourceCode .cb-console[data-clicked=clicked]").removeAttribute("data-clicked");
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

function refreshCode() {
    document.querySelectorAll(".slide.present .CodeMirror").forEach(function (elem) {
        elem.CodeMirror.refresh();
        console.log(elem.CodeMirror);
    });
}

function addRefresh(isAdd) {
    document.querySelectorAll(".controls button").forEach(function (elem) {
        if (isAdd)
            elem.addEventListener("click", refreshCode);
        else
            elem.attachEvent("onclick", refreshCode);
    });
}

function processFontSize() {
    document.querySelectorAll("[data-cb-font-size]").forEach(function (elem) {
        elem.querySelector(".cb-editors").style.fontSize = elem.getAttribute("data-cb-font-size") + "px";
    });
}

if (window.addEventListener) {
    window.addEventListener("load", function () {
        addDragToConsole(true);
        addRefresh(true);
        processFontSize();
    });
}
else {
    window.attachEvent("onload", function () {
        addDragToConsole(false)
        addRefresh(false);
        processFontSize();
    });
}
