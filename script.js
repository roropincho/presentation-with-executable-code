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

function docClickFunc(event, isAdd) {
    var target = event.srcElement;
    var isSource = target.classList.contains("sourceCode");
    var isFocusedSource = isSource && target.querySelector(".want-to-exec.is-focused-code") != null;
    var parentSource = target.closest(".sourceCode");
    var isInSource = parentSource != null;
    var isInFocusedSource = isInSource && parentSource.querySelector(".want-to-exec.is-focused-code") != null;

    if (!isFocusedSource && !isInFocusedSource) {
        document.querySelectorAll(".want-to-exec.is-focused-code").forEach(function (elem) {
            elem.classList.remove("want-to-exec", "is-focused-code");
            var parent = elem.closest(".sourceCode");
            var clickFunction = window[parent.getAttribute("data-cb-custom-click-func")];

            if (isAdd)
                parent.addEventListener("click", clickFunction, true);
            else
                parent.attachEvent("onclick", clickFunction);
        });

        var toModify = null;

        if (isSource)
            toModify = target.querySelector(".cb-vm");
        else if (isInSource)
            toModify = parentSource.querySelector(".cb-vm");

        if (toModify !== null)
            toModify.classList.add("is-focused-code");
    }
}

function addVMClick(isAdd) {
    var cb = new CodeBoot();

    if (cb !== undefined && cb.vms !== null) {
        var nbVM = document.querySelectorAll(".cb-vm").length;
        var vmList = [];

        for (var i = 1; i <= nbVM; i++)
            vmList.push(cb.vms["#cb-vm-" + i]);

        vmList.forEach(function (vm) {
            var isFirstClick = true;

            function onClickFunc() {
                var parent = document.getElementById(vm.root.parentNode.id);
                vm.root.classList.add("want-to-exec");

                if (isFirstClick) {
                    vm.root.removeAttribute("data-cb-show-playground");
                    vm.root.removeAttribute("data-cb-show-repl-container");
                    vm.trackEditorFocus(vm.fs.fem.editors[0].editor, null, true);
                }

                if (isAdd)
                    vm.root.parentNode.removeEventListener("click", onClickFunc);
                else
                    vm.root.parentNode.detachEvent("onclick", onClickFunc);

                isFirstClick = false;
            }


            var globalFuncName = "onClickFunccbvm" + i;
            window[globalFuncName] = onClickFunc;
            vm.root.parentNode.setAttribute("data-cb-custom-click-func", globalFuncName);

            if (isAdd)
                vm.root.parentNode.addEventListener("click", onClickFunc, true);
            else
                vm.root.parentNode.attachEvent("onclick", onClickFunc);
        });
    }
}

if (window.addEventListener) {
    window.addEventListener("load", function () {
        window.addEventListener("click", function (e) {
            docClickFunc(e, true);
        });

        addDragToConsole(true);
        addVMClick(true);
        processFontSize();
    });
}
else {
    window.attachEvent("onload", function () {
        window.attachEvent("onclick", function (e) {
            docClickFunc(e, false);
        });

        addDragToConsole(false);
        addVMClick(false);
        processFontSize();
    });
}
