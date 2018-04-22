//////////
// GENERAL
function changeBackgroundOnScroll() {
    window.addEventListener("scroll", function() {
        let body = document.getElementsByTagName('body')[0];
        const scrollPast = 295;
        if (window.scrollY > scrollPast) {
            body.style.background = "linear-gradient(to right, rgb(29, 78, 144), rgb(12, 57, 87) 30%)";
        }
        if (window.scrollY < scrollPast) {
            body.style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
        }
    });
}


///////
// TABS
function setTabs() {
    let tabAbout = document.getElementById("tab-about");
    let tabConversion = document.getElementById("tab-conversion");
    let tabGift = document.getElementById("tab-gift");

    let contentAbout = document.getElementById("content-about");
    let contentConversion = document.getElementById("content-conversion");
    let contentGift = document.getElementById("content-gift");


    tabAbout.addEventListener("click", function() {
        setActiveClassToTab(this);

        contentAbout.style.display = "block";
        contentConversion.style.display = "none";
        contentGift.style.display = "none";
    })

    tabConversion.addEventListener("click", function() {
        setActiveClassToTab(this);

        contentConversion.style.display = "block";
        contentAbout.style.display = "none";
        contentGift.style.display = "none";
    })

    tabGift.addEventListener("click", function() {
        setActiveClassToTab(this);

        contentGift.style.display = "block";
        contentAbout.style.display = "none";
        contentConversion.style.display = "none";
    })
}


function setActiveClassToTab(element) {
    let ulTabs = document.getElementById("ul-tabs");

    for (let i = 0; i < ulTabs.children.length; i++) {
        let currentTab = ulTabs.children[i];
        currentTab.classList.remove("active");
    }

    element.classList.add("active");
}


////////
// GIFT
function expandGiftDrawer() {
    let giftCryptoExpand = document.getElementById("gift-crypto-expand");
    let giftCardCrypto = document.getElementById("gift-card-crypto");
    let giftCardDrawer = document.getElementById("gift-card-drawer");

    giftCryptoExpand.addEventListener("click", () => {
        if (giftCardCrypto.style.height == "450px") {
            giftCryptoExpand.innerHTML = "&#9660;";
            giftCardCrypto.style.height = "200px";
            giftCardDrawer.style.display = "none";
        } else {
            giftCryptoExpand.innerHTML = "&#9650;";
            giftCardCrypto.style.height = "450px";
            giftCardDrawer.style.display = "block";
            // window.scrollTo(0,document.body.scrollHeight);
        }
    });
}


function copyCryptosOnClick() {
    function copyBtcAdressOnClick() {
        let btc = document.getElementById("btc-address");
        let address = "1CKoEnMU3Hy1UiWfJVBTruVSmrLvhDkXd6"
        copyCryptoAddress(btc, address)
    }

    function copyEthAdressOnClick() {
        let eth = document.getElementById("eth-address");
        let address = "0x91936fc5A7e13ae96273E371fD3407B0F3ABc553"
        copyCryptoAddress(eth, address)
    }

    function copyBchAdressOnClick() {
        let bch = document.getElementById("bch-address");
        let address = "qrlar2grfap9n86gfrm6z69yw56ezv35zyts7ufxjv"
        copyCryptoAddress(bch, address)
    }

    function copyCryptoAddress(crypto, address) {
        crypto.addEventListener("click", () => {
            let range = document.createRange();
            range.selectNode(crypto);
            let selection = window.getSelection()
            selection.removeAllRanges();
            selection.addRange(range);

            try {  
                if (crypto.innerHTML == address) {
                    document.execCommand('copy');
                }
                crypto.innerHTML = `<span class="address-copy">address<br>copied</span>`;
                setTimeout(function() {
                    crypto.innerText = address;
                }, 2000);
            } catch(err) {
                crypto.innerHTML = `<span class="address-copy">address<br>couldn't be copied</span>`;
                setTimeout(function() {
                    crypto.innerText = address;
                }, 2000);
            }
            window.getSelection().removeAllRanges(); 
        });
    }

    copyBtcAdressOnClick();
    copyEthAdressOnClick();
    copyBchAdressOnClick();
}


///////////////////
// CONVERSION LOGIC
function conversionLogic() {
    let year = document.getElementById("year-entry");
    let yearRadios = document.querySelectorAll('input[name="year"]');
    let radioBC = document.getElementById('radio-BC');
    let radioAD = document.getElementById('radio-AD');
    let HEyear = document.getElementById("he-year");
    let contentFacts = document.getElementById('content-conversion-facts');
    let yearMode = "AD";

    currentYear = (new Date()).getFullYear();
    year.value = currentYear;


    for (var i = 0; i < yearRadios.length; i++) {
        if (yearRadios[i].checked) {
            yearMode = yearRadios[i].value;
        }

        yearRadios[i].onclick = function() {
            let inputYear = parseInt(year.value, 10);
            yearMode = this.value;
            this.parentElement.classList.add("active-period-select");
            setHeYear(year, HEyear, yearMode);
            callFetchYear(inputYear, contentFacts, HEyear, yearMode);
        }

        radioBC.addEventListener('change', function() {
            radioAD.parentElement.classList.remove("active-period-select");
        });

        radioAD.addEventListener('change', function() {
            radioBC.parentElement.classList.remove("active-period-select");
        });
    }

    HEyear.addEventListener("keyup", () => {
        let currentValue = HEyear.value;

        if (!/HE/.test(currentValue) && !/H/.test(currentValue) && !/E/.test(currentValue)) {
            HEyear.value = currentValue + "HE";
        }

        let HEnumber = currentValue;
        HEnumber = HEnumber.replace("B", "");
        HEnumber = HEnumber.replace("H", "");
        HEnumber = HEnumber.replace("E", "");

        // console.log(HEnumber);
        HEnumber = parseInt(HEnumber);
        // console.log(HEnumber);

        // TODO input validation
        // if (HEnumber.match(/a-z/i)) {
        //     year.value = "only numbers";
        // } else {
        //     HEnumber = parseInt(HEnumber);
        // }
        let yearValue = HEnumber - 10000;
        if (yearValue < 0) {
            radioBC.checked = 'checked';
            yearMode = 'BC';
            radioAD.parentElement.classList.remove("active-period-select");
            radioBC.parentElement.classList.add("active-period-select");
            year.value = Math.abs(yearValue - 1);
        }

        if (HEnumber > 10000) {
            yearMode = 'AD';
            radioBC.parentElement.classList.remove("active-period-select");
            radioAD.parentElement.classList.add("active-period-select");
            radioAD.checked = 'checked';
            year.value = yearValue;
        }

        let inputYear = parseInt(year.value, 10);

        callFetchYear(inputYear, contentFacts, HEyear, yearMode);
    });

    year.addEventListener("keyup", () => {
        setHeYear(year, HEyear, yearMode);
        let inputYear = parseInt(year.value, 10);

        callFetchYear(inputYear, contentFacts, HEyear, yearMode);
    });

    setHeYear(year, HEyear, yearMode);
    callFetchYear(year.value, contentFacts, HEyear, yearMode);
}


function setHeYear(year, HEyear, yearMode) {
    if (!isNaN(year.value)) {
        if (yearMode == "BC") {
            if (year.value > 10000) {
                HEyear.value = Math.abs(10000 - parseInt(year.value)) + " BHE";
            } else {
                HEyear.value = 10001 - parseInt(year.value) + " HE";                    
            }
        }

        if (yearMode == "AD") {
            HEyear.value = parseInt(year.value) + 10000 + " HE";                    
        }
    }

    if (year.value == "" || year.value == "0") {
        HEyear.value = "insert an year";
    }

    if (year.value.match(/\D+/i)) {
        HEyear.value = "only numbers";
    }
}


function callFetchYear(inputYear, contentFacts, HEyear, yearMode) {
    if (isNaN(inputYear)
        || inputYear == 0
        || inputYear > currentYear
        || (inputYear > 730 && yearMode == 'BC')) 
    {
        contentFacts.style.display = "none";
    }

    if (!isNaN(inputYear) && inputYear != 0 && inputYear < currentYear) {
        if (yearMode == 'AD') {
            if (inputYear <= 100) {
                inputYear = 'AD_' + inputYear;
            }
            fetchYearFacts(inputYear, HEyear);
            contentFacts.style.display = "block";
        }

        if (yearMode == 'BC' && inputYear <= 730) {
            inputYear = inputYear + '_BC';
            fetchYearFacts(inputYear, HEyear);
            contentFacts.style.display = "block";
        }
    }
}


function fetchYearFacts(inputYear, HEyear) {
    let data = `origin=*&
                action=parse&
                format=json&
                page=${inputYear}`;

    let url = 'https://en.wikipedia.org/w/api.php?' + data;

    fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => setFacts(response, inputYear, HEyear));


    function setFacts(response, inputYear, HEyear) {
        let page = response['parse']['text']['*'];
        let year = HEyear.value;

        let pageCleaned = page.replace(/\[[0-9]{1,}\]/g, '');
        pageCleaned = pageCleaned.replace(/citation needed/g, '');
        pageCleaned = pageCleaned.replace(/clarification needed/g, '');
        pageCleaned = pageCleaned.replace(/\[<i>/g, '');
        pageCleaned = pageCleaned.replace(/<\/i>\]/g, '');


        let editString = `<span class="mw\\-editsection"><span class="mw\\-editsection\\-bracket">\\[<\/span><a href="\/w\/index\\.php\\?title=${inputYear}\\&amp;action=edit\\&amp;section=[0-9]{1,}" title="Edit section: .{1,100}">edit<\/a><span class="mw\\-editsection\\-bracket">\\]<\/span><\/span>`;
        let rxEdit = new RegExp(`${editString}`, 'gim');
        pageCleaned = pageCleaned.replace(rxEdit, '');

        let anchorStringReplace = `<a target="_blank" href="https://en.wikipedia.org/wiki`;
        pageCleaned = pageCleaned.replace(/<a href="\/wiki/g, anchorStringReplace);

        let stringEventsTitle = `<h2><span class="mw\\-headline" id="Events">Events<\/span><\/h2>`;
        let stringBirthsTitle = `<h2><span class="mw\\-headline" id="Births">Births<\/span><\/h2>`;
        let stringDeathsTitle = `<h2><span class="mw\\-headline" id="Deaths">Deaths<\/span><\/h2>`;
        let stringReferencesTitle = `<h2><span class="mw\\-headline" id="References">References<\/span><\/h2>`;

        let rxGetEvents = new RegExp(`${stringEventsTitle}[^]+${stringBirthsTitle}`, 'gim');
        let rxGetBirths = new RegExp(`${stringBirthsTitle}[^]+${stringDeathsTitle}`, 'gim');
        let rxGetDeaths = new RegExp(`${stringDeathsTitle}[^]+${stringReferencesTitle}`, 'gim');
        let rxReplaceEvents = new RegExp(`${stringEventsTitle}`);
        let rxReplaceBirths = new RegExp(`${stringBirthsTitle}`);
        let rxReplaceDeaths = new RegExp(`${stringDeathsTitle}`);
        let rxReplaceReferences = new RegExp(`${stringReferencesTitle}`);

        // BUG console error when searching for 13 and 14 AD
        let events = rxGetEvents.exec(pageCleaned)[0];
        events = events.replace(rxReplaceEvents, '');
        events = events.replace(rxReplaceBirths, '');

        let births = rxGetBirths.exec(pageCleaned)[0];
        births = births.replace(rxReplaceBirths, '');
        births = births.replace(rxReplaceDeaths, '');
        births = setHoloceneYears(births);

        let deaths = rxGetDeaths.exec(pageCleaned)[0];
        deaths = deaths.replace(rxReplaceDeaths, '');
        deaths = deaths.replace(rxReplaceReferences, '');
        deaths = setHoloceneYears(deaths);

        setConversionFact('events', events, year);
        setConversionFact('births', births, year);
        setConversionFact('deaths', deaths, year);
    }
}


function setHoloceneYears(text) {
    text = text.replace(/>(\d{1,3}) BC</g, function (match, capture) {
        let year = 10001 - parseInt(capture);
        let HEyear = '>' + year + ' HE<';
        return HEyear;
    }); 

    text = text.replace(/>BC (\d{1,3})</g, function (match, capture) {
        let year = 10001 - parseInt(capture);
        let HEyear = '>' + year + ' HE<';
        return HEyear;
    });

    text = text.replace(/>(\d{1,3}) AD</g, function (match, capture) {
        let year = 10000 + parseInt(capture);
        let HEyear = '>' + year + ' HE<';
        return HEyear;
    });

    text = text.replace(/>AD (\d{1,3})</g, function (match, capture) {
        let year = 10000 + parseInt(capture);
        let HEyear = '>' + year + ' HE<';
        return HEyear;
    });

    text = text.replace(/>(\d{3,4})</g, function (match, capture) {
        let year = 10000 + parseInt(capture);
        let HEyear = '>' + year + ' HE<';
        return HEyear;
    });

    return text;
}


function setConversionFact(factString, factText, year) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    let conversionFactStringCap = capitalizeFirstLetter(factString);

    let conversionFactString = `content-conversion-${factString}`;
    let conversionFact = document.getElementById(conversionFactString);
    let factIsEmpty = checkEmpty(factText);
    if (!factIsEmpty) {
        conversionFact.innerHTML = `<h1 class="content-conversion-facts-title"
                                      id="content-conversion-${factString}-title">
                                        ${conversionFactStringCap} in ${year}
                                      </h1>
                                      <hr>
                                      <div id="content-conversion-${factString}-content">
                                        ${factText}
                                      </div>`;
        setCloseOpen(factString);
    } else {
        conversionFact.innerHTML = '';
    }
}


function checkEmpty(text) {
    let regexpEmpty1 = new RegExp('This section is empty.');
    let textIsEmpty1 = regexpEmpty1.test(text);
    let regexpEmpty2 = new RegExp(`<li class="mw\-empty\-elt"><\/li>`);
    let textIsEmpty2 = regexpEmpty2.test(text);

    if (textIsEmpty1 || textIsEmpty2) {
        return true;
    } else {
        return false;
    }
}


function setCloseOpen(fact) {
    let factTitle = `content-conversion-${fact}-title`;
    let factContent = `content-conversion-${fact}-content`;
    let factTitleDiv = document.getElementById(factTitle);
    let factContentDiv = document.getElementById(factContent);
    closeOpenFacts(factTitleDiv, factContentDiv);
}


function closeOpenFacts(title, content) {
    title.addEventListener('click', () => {
        if (content.style.display === "none") {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    });
}



/////////////////
// Function Calls
function init() {
    changeBackgroundOnScroll();
    setTabs();
    expandGiftDrawer();
    copyCryptosOnClick();
    conversionLogic()
}

init();
