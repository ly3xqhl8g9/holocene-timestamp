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



/////////////////
// Function Calls
function init() {
    setTabs();
    expandGiftDrawer();
    copyCryptosOnClick();
}

init();



////////
// LOGIC
let year = document.getElementById("year-entry");
let yearRadios = document.querySelectorAll('input[name="year"]');
let radioBC = document.getElementById('radio-BC');
let radioAD = document.getElementById('radio-AD');
let HEyear = document.getElementById("he-year");
let contentFacts = document.getElementById('content-conversion-facts');
let yearMode = "AD";

currentYear = (new Date()).getFullYear();
//
year.value = currentYear;

// HEyear.innerHTML = parseInt(year.value) + 10000 + " HE";
setHeYear(year, yearMode, HEyear);
callFetchYear(year.value, contentFacts)

function setHeYear(year, yearMode, HEyear) {
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


for (var i = 0; i < yearRadios.length; i++) {
    if (yearRadios[i].checked) {
        yearMode = yearRadios[i].value;
    }

    yearRadios[i].onclick = function() {
        let inputYear = parseInt(year.value, 10);
        yearMode = this.value;
        setHeYear(year, yearMode, HEyear);
        callFetchYear(inputYear, contentFacts);
    }
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

    console.log(HEnumber);
    HEnumber = parseInt(HEnumber);        
    console.log(HEnumber);


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
        year.value = Math.abs(yearValue - 1);
    }

    if (HEnumber > 10000) {
        yearMode = 'AD';
        radioAD.checked = 'checked';
        year.value = yearValue;
    }

    let inputYear = parseInt(year.value, 10);
    callFetchYear(inputYear, contentFacts);
});


year.addEventListener("keyup", () => {
    setHeYear(year, yearMode, HEyear);
    let inputYear = parseInt(year.value, 10);

    callFetchYear(inputYear, contentFacts);
});



function callFetchYear(inputYear, contentFacts) {
    // let currentYear = (new Date()).getFullYear();

    if (isNaN(inputYear)
        || inputYear == 0
        || inputYear > currentYear
        || (inputYear > 730 && yearMode == 'BC')
        ) {
        contentFacts.style.display = "none";
    }

    if (!isNaN(inputYear) && inputYear != 0 && inputYear < currentYear) {
        if (yearMode == 'AD') {
            if (inputYear <= 100) {
                inputYear = 'AD_' + inputYear;
            }
            fetchYearFacts(inputYear);
            contentFacts.style.display = "block";
        }

        if (yearMode == 'BC' && inputYear <= 730) {
            inputYear = inputYear + '_BC';
            fetchYearFacts(inputYear);
            contentFacts.style.display = "block";
        }
    }
}



function fetchYearFacts(inputYear) {
    // let inputYear = '353_BC';
    // console.log(inputYear);

    // let url = 'https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=1453&prop=revisions&rvprop=content&format=json&formatversion=2';
    // let data = `origin=*&
    //             action=query&
    //             prop=revisions&
    //             rvprop=content&
    //             format=json&
    //             formatversion=2&
    //             titles=${inputYear}
    //             `;
    // https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=1453
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
    }).then( res => res.json())
    .catch(error => console.error('Error:', error))
    .then (response => setFacts(response, inputYear));


    function setFacts(response, inputYear) {
        let year = HEyear.value;
        let page = response['parse']['text']['*'];

        // TODO
        // remove citation needed
        // remove references numbers
        let editString = `<span class="mw\\-editsection"><span class="mw\\-editsection\\-bracket">\\[<\/span><a href="\/w\/index\\.php\\?title=${inputYear}\\&amp;action=edit\\&amp;section=[0-9]{1,}" title="Edit section: .{1,100}">edit<\/a><span class="mw\\-editsection\\-bracket">\\]<\/span><\/span>`;
        let rxEdit = new RegExp(`${editString}`, 'gim');
        let pageCleaned = page.replace(rxEdit, '');

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

        let events = rxGetEvents.exec(pageCleaned)[0];
        events = events.replace(rxReplaceEvents, '');
        events = events.replace(rxReplaceBirths, '');

        let births = rxGetBirths.exec(pageCleaned)[0];
        births = births.replace(rxReplaceBirths, '');
        births = births.replace(rxReplaceDeaths, '');

        let deaths = rxGetDeaths.exec(pageCleaned)[0];
        deaths = deaths.replace(rxReplaceDeaths, '');
        deaths = deaths.replace(rxReplaceReferences, '');


        let conversionEvents = document.getElementById("content-conversion-events");
        conversionEvents.innerHTML = `<h1 class="content-conversion-facts-title"
                                      id="content-conversion-events-title">
                                        Events in ${year}
                                      </h1>
                                      <hr>
                                      <div id="content-conversion-events-content">
                                        ${events}
                                      </div>`;

        let conversionBirths = document.getElementById("content-conversion-births");
        // conversionBirths.innerHTML = births;
        // let birthsIsEmpty = regexpEmpty.test(births);
        // // console.log(birthsIsEmpty);
        // if (!birthsIsEmpty) {
        //     births = setMarkup(births);
            conversionBirths.innerHTML = `<h1 class="content-conversion-facts-title"
                                          id="content-conversion-births-title">
                                            Births in ${year}
                                          </h1>
                                          <hr>
                                          <div id="content-conversion-births-content">
                                            ${births}
                                          </div>`;
        // } else {
        //     conversionBirths.innerHTML = '';
        // }


        let conversionDeaths = document.getElementById("content-conversion-deaths");
        conversionDeaths.innerHTML = deaths;
        // let deathsIsEmpty = regexpEmpty.test(deaths);
        // // console.log(deathsIsEmpty);
        // if (!deathsIsEmpty) {
        //     deaths = setMarkup(deaths);
            conversionDeaths.innerHTML = `<h1 class="content-conversion-facts-title"
                                          id="content-conversion-deaths-title">
                                            Deaths in ${year}
                                          </h1>
                                          <hr>
                                          <div id="content-conversion-deaths-content">
                                            ${deaths}
                                          </div>`;
        // } else {
        //     // console.log('a');
        //     conversionDeaths.innerHTML = '';
        // }



        let eventsTitle = document.getElementById('content-conversion-events-title');
        let eventsContent = document.getElementById('content-conversion-events-content');
        let birthsTitle = document.getElementById('content-conversion-births-title');
        let birthsContent = document.getElementById('content-conversion-births-content');
        let deathsTitle = document.getElementById('content-conversion-deaths-title');
        let deathsContent = document.getElementById('content-conversion-deaths-content');

        closeOpenFacts(eventsTitle, eventsContent);
        closeOpenFacts(birthsTitle, birthsContent);
        closeOpenFacts(deathsTitle, deathsContent);
        // console.log(HEyear);
        // console.log("page", page);
        // console.log("events", events);
        // console.log("births", births);
        // console.log("deaths", deaths);
        // console.log(response);
    }
}




function closeOpenFacts(title, content) {
    title.addEventListener('click', () => {
        if (content.style.display === "none") {
            // console.log("A");
            content.style.display = "block";
        } else {
            // console.log("B");
            content.style.display = "none";
        }
    });
}
