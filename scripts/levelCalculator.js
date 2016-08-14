var levelCalculator = (function () {
    var baseStars = 5,
        bonusStars = 2,
        starIncrement = 5;
    var controlID = "mainControlDiv";
    var rewardSet = [
        {
            text: "A Pet",
            requirement: 5
        }, {
            text: "Front Page Cooper Icon",
            requirement: 10
        }, {
            text: "Second Character & First Stage Evolution",
            requirement: 15
        }, {
            text: "Become a Mentor",
            requirement: 20
        }, {
            text: "New Move Slot & New Quarters",
            requirement: 25
        }, {
            text: "Mega Title Quest Unlocked & Last Stage Evolution",
            requirement: 30
        }, {
            text: "Third Character",
            requirement: 35
        }, {
            text: "New Quarters & Second Pet",
            requirement: 40
        }, {
            text: "New Move Slot",
            requirement: 50
        }, {
            text: "New SINGLE Quarters",
            requirement: 60
        }, {
            text: "Become a Teacher or High Guild Member",
            requirement: 70
        }, {
            text: "Create Your Own Guild",
            requirement: 80
        }, {
            text: "Own a Hideout For Your Guild",
            requirement: 90
        }, {
            text: "Magikarp Egg?",
            requirement: 100
        }
    ];

    function setup() {
        levelCalculator.containerDiv = document.getElementById("rowContainer");
        levelCalculator.levelDisplay = document.getElementById("levelDisplay");
        levelCalculator.levelExpDisplay = document.getElementById("levelExp");
        levelCalculator.expProgressDisplay = document.getElementById("expProgress");
    }

    function createElement(elementTag, elementClass, elementID, elementAttributes) {
        var newElement = document.createElement(elementTag);
        newElement.setAttribute("class", elementClass);
        newElement.id = elementID;
        for (var i = 0; i < elementAttributes.length; i++) {
            newElement.setAttribute(elementAttributes[i].attributeName, elementAttributes[i].attributeValue);
        }
        return newElement;
    }

    function addRowClicked() {
        var targetRowNum = levelCalculator.dataHolder.expList.length;
        var newRow = createElement("div", "expRow", "expRow" + targetRowNum, []);

        var linkInput = createElement("input", "linkInput", "linkInput" + targetRowNum, [
            {
                attributeName: "type",
                attributeValue: "text"
            }, {
                attributeName: "placeholder",
                attributeValue: "Exp Link"
            }, {
                attributeName: "onchange",
                attributeValue: "levelCalculator.linkChanged(this)"
            }
        ]);
        newRow.appendChild(linkInput);

        var nameInput = createElement("input", "nameInput", "nameInput" + targetRowNum, [
            {
                attributeName: "type",
                attributeValue: "text"
            }, {
                attributeName: "placeholder",
                attributeValue: "Exp Source Name"
            }, {
                attributeName: "onchange",
                attributeValue: "levelCalculator.titleChanged(this)"
            }
        ]);
        newRow.appendChild(nameInput);

        var expInput = createElement("input", "expInput", "expInput" + targetRowNum, [
            {
                attributeName: "type",
                attributeValue: "number"
            },
            {
                attributeName: "min",
                attributeValue: "0"
            }, {
                attributeName: "step",
                attributeValue: "1"
            }, {
                attributeName: "onchange",
                attributeValue: "levelCalculator.expChanged(this)"
            }
        ]);
        expInput.value = 0;
        newRow.appendChild(expInput);

        var delButton = createElement("button", "rowDeleteButton", "rowDeleteButton" + targetRowNum, [
            {
                attributeName: "onclick",
                attributeValue: "levelCalculator.deleteRowClicked(this)"
            }
        ]);
        delButton.innerHTML = "Delete";
        newRow.appendChild(delButton);
        levelCalculator.containerDiv.appendChild(newRow);

        levelCalculator.dataHolder.expList.push({
            link: "Exp Item",
            title: "",
            expValue: 0,
            active: true,
            counted: false
        });
    }

    function deleteRowClicked(target) {
        var targetNum = target.id.replace("rowDeleteButton", "");
        var targetRow = target.parentElement;
        levelCalculator.dataHolder.expList[targetNum].active = false;
        targetRow.parentElement.removeChild(targetRow);
    }

    function clearClicked() {
        var confirmClear = confirm("Are you sure you want to clear the calculator?\nOK for Yes, Cancel for No.");
        if (confirmClear == true) {
            while (levelCalculator.containerDiv.firstChild) {
                levelCalculator.containerDiv.removeChild(levelCalculator.containerDiv.firstChild);
            }
            levelCalculator.dataHolder = {
                currentLevel: 1,
                expTotal: 0,
                levelExp: 0,
                remainderExp: 0,
                expList: [],
                levelUpTracker: [
                    {
                        complete: false,
                        levelProgress: 0,
                        exp: []
                            }]
            };
        }
    }

    function clearLevelUpTracker() {
        levelCalculator.dataHolder.levelUpTracker = [
            {
                complete: false,
                levelProgress: 0,
                exp: []
                            }];
    }

    function calculateUpdate() {
        calculateTotals(levelCalculator.dataHolder);
        levelCalculator.updateDisplay();
    }

    function calculateTotals(targetDataHolder) {
        var total = 0;
        targetDataHolder.expTotal = total;
        var calculated = calculateTracker();
        targetDataHolder.currentLevel = calculated.level;
        targetDataHolder.remainderExp = calculated.levelProgress;
        targetDataHolder.levelExp = calculated.levelExp;
        targetDataHolder.expTotal = calculated.totalExp;
        return targetDataHolder;
    }

    function calculateLevelFromExp(exp) {
        var workingLevel = 1;
        var standardIncrement = 1000;
        var remainingExp = 0;
        var levelExp = 0;
        while (exp > 0) {
            if (workingLevel > 9) {
                if ((exp - standardIncrement) >= 0) {
                    exp -= standardIncrement;
                    levelExp += standardIncrement;
                    workingLevel += 1;
                } else {
                    remainingExp = exp;
                    exp = 0;
                }
            } else {
                if (exp - (workingLevel * 100) >= 0) {
                    var expDeduction = workingLevel * 100;
                    exp -= expDeduction;
                    levelExp += expDeduction;
                    workingLevel += 1;
                } else {
                    remainingExp = exp;
                    exp = 0;
                }
            }
        }

        var result = {
            level: workingLevel,
            totalExp: levelExp,
            remainder: remainingExp
        };

        return result;
    }

    function calculateExpFromLevel(level) {
        var workingTotal = 0;
        while (level > 0) {
            if (level > 9) {
                workingTotal += 1000;
            } else {
                workingTotal += (level - 1) * 100;
            }
            level--;
        }
        return workingTotal;
    }

    function calculateTracker() {
        clearLevelUpTracker();
        var workingLevel = 1;
        var levelIncrement = 0;
        var dataObject = levelCalculator.dataHolder;
        var levelProgress = 0;
        var totalExp = 0;

        for (var i = 0; i < dataObject.expList.length; i++) {
            var expItem = dataObject.expList[i];
            var processingItem = true;
            var currentItemValue = expItem.expValue;
            totalExp += currentItemValue;
            while (processingItem) {
                if (workingLevel > 9) {
                    levelIncrement = 1000;
                } else {
                    levelIncrement = workingLevel * 100;
                }

                if (levelProgress + currentItemValue <= levelIncrement) {
                    logExpItem("" + currentItemValue, i, workingLevel - 1);
                    levelProgress += currentItemValue;
                    if (levelProgress == levelIncrement) {
                        levelProgress = 0;
                        workingLevel++;
                        dataObject.levelUpTracker.push({
                            complete: false,
                            levelProgress: 0,
                            exp: []
                        });
                    }
                    processingItem = false;
                } else {
                    var difference = currentItemValue - (levelIncrement - levelProgress);
                    logExpItem(levelIncrement + "/" + currentItemValue, i, workingLevel - 1);
                    levelProgress = 0;
                    workingLevel++;
                    dataObject.levelUpTracker.push({
                        complete: false,
                        levelProgress: 0,
                        exp: []
                    });
                    currentItemValue = difference;
                }
            }
        }
        dataObject.levelUpTracker.levelProgress = levelProgress;

        var result = {
            level: workingLevel,
            totalExp: totalExp,
            levelProgress: levelProgress,
            levelExp: totalExp - levelProgress
        };

        return result;
    }

    function logExpItem(message, itemIndex, levelIndex) {
        levelCalculator.dataHolder.levelUpTracker[levelIndex].exp.push({
            message: message,
            itemIndex: itemIndex
        });
    }

    function exportLog() {
        document.getElementById("exportOverlay").setAttribute("class", "supremeOverlay");
        document.getElementById("exportText").value = formatExportText();
    }

    function formatExportText() {
        var exportText = "<b>Exp Progress</b><br/>";
        var levelTracker = levelCalculator.dataHolder.levelUpTracker;
        for (var i = 0; i < levelTracker.length; i++) {
            exportText += "<br/><b>Level " + (i + 1) + "</b><br/>"
            for (var j = 0; j < levelTracker[i].exp.length; j++) {
                var targetItem = levelTracker[i].exp[j];
                var linkText = "";
                var targetLink = levelCalculator.dataHolder.expList[targetItem.itemIndex].link;
                var targetTitle = levelCalculator.dataHolder.expList[targetItem.itemIndex].title;
                if (targetLink === "") {
                    exportText += targetItem.message + " from " + targetTitle + "<br/>";
                } else {
                    exportText += targetItem.message + ' from <a href="' + targetLink + '">' + targetTitle + '</a><br/>';
                }
            }
        }
        return exportText;
    }

    function closeExport() {
        document.getElementById("exportText").value = "";
        document.getElementById("exportOverlay").setAttribute("class", "deadOverlay");
    }

    return {
        containerDiv: {},
        levelDisplay: {},
        levelExpDisplay: {},
        expProgressDisplay: {},
        dataHolder: {},
        setup: function () {
            setup();
            this.dataHolder = {
                currentLevel: 1,
                expTotal: 0,
                levelExp: 0,
                remainderExp: 0,
                expList: [],
                levelUpTracker: [
                    {
                        complete: false,
                        levelProgress: 0,
                        exp: []
                            }]
            };
            this.updateDisplay();
            //            var dataHolderExample = {
            //                currentLevel: 1,
            //                expTotal: 0,
            //                remainderExp: 0,
            //                expList: [
            //                    {
            //                        link: "fav/somethingsomething",
            //                        title: "optional",
            //                        expValue: 1337,
            //                        active: true,
            //                        counted: true
            //                    }, {
            //                        link: "fav/somethingsomething",
            //                        title: "optional",
            //                        expValue: 1337,
            //                        active: true
            //                        counted: true
            //                    }, {
            //                        link: "fav/somethingsomething",
            //                        title: "optional",
            //                        expValue: 1337,
            //                        active: false
            //                        counted: false
            //                    }
            //                ]
        },
        updateDisplay: function () {
            this.levelDisplay.value = this.dataHolder.currentLevel;
            this.levelExpDisplay.value = this.dataHolder.levelExp;
            this.expProgressDisplay.value = this.dataHolder.remainderExp;
            var expMax = document.getElementById("progressMax");
            if (this.dataHolder.currentLevel < 10) {
                expMax.innerHTML = (this.dataHolder.currentLevel * 100);
            } else {
                expMax.innerHTML = 1000;
            }
        },
        setlevel: function (totalLevel) {
            this.dataHolder.currentLevel = totalLevel;
            this.dataHolder.levelExp = calculateExpFromLevel(totalLevel);
        },
        setlevelExp: function (totalExp) {
            this.dataHolder.levelExp = totalExp;
            var levelCalc = calculateLevelFromExp(totalExp);
            this.dataHolder.currentLevel = levelCalc.level;
            this.dataHoler.remainderExp = levelCalc.remainder;
        },
        handleLevelSet: function (e) {
            levelCalculator.setLevel(e.value);
        },
        handleExpSet: function (e) {
            levelCalculator.setlevelExp(e.value);
        },
        addRowClicked: function () {
            addRowClicked();
        },
        calculateClicked: function () {
            calculateUpdate();
        },
        exportClicked: function () {
            exportLog();
        },
        closeExportClicked: function () {
            closeExport();
        },
        clearClicked: function () {
            clearClicked();
        },
        deleteRowClicked: function (target) {
            deleteRowClicked(target);
        },
        linkChanged: function (target) {
            var targetNum = target.id.replace("linkInput", "");
            levelCalculator.dataHolder.expList[targetNum].link = target.value;
        },
        titleChanged: function (target) {
            var targetNum = target.id.replace("nameInput", "");
            levelCalculator.dataHolder.expList[targetNum].title = target.value;
        },
        expChanged: function (target) {
            var targetNum = target.id.replace("expInput", "");
            levelCalculator.dataHolder.expList[targetNum].expValue = parseInt(target.value);
        }
    }
})();

window.addEventListener("load", function () {
    levelCalculator.setup();
});


//var dataHolderExample = {
//    currentLevel: 1,
//    expTotal: 0,
//    remainderExp: 0,
//    expList: [
//        {
//            link: "fav/somethingsomething",
//            title: "optional",
//            expValue: 1337,
//            active: true,
//            counted: true
//        }, {
//            link: "fav/somethingsomething",
//            title: "optional",
//            expValue: 1337,
//            active: true
//            counted: true
//        }, {
//            link: "fav/somethingsomething",
//            title: "optional",
//            expValue: 1337,
//            active: false
//            counted: false
//        }
//    ]
//};