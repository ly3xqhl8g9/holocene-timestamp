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







///



var year = document.getElementById("year-entry");
var yearRadios = document.querySelectorAll('input[name="year"]');
var HEyear = document.getElementById("he-year");
var yearMode = "";

currentYear = (new Date()).getFullYear();
year.value = currentYear;

HEyear.innerHTML = parseInt(year.value) + 10000 + " HE";

for (var i = 0; i < yearRadios.length; i++) {
    if (yearRadios[i].checked) {
        yearMode = yearRadios[i].value;
    }

    yearRadios[i].onclick = function() {
        yearMode = this.value;
    }
}

year.addEventListener("keyup", function() {
    if (!isNaN(year.value)) {
        if (yearMode == "BC") {
            if (year.value > 10000) {
                HEyear.innerHTML = Math.abs(10000 - parseInt(year.value)) + " BHE";
            } else {
                HEyear.innerHTML = 10001 - parseInt(year.value) + " HE";                    
            }
        }

        if (yearMode == "AD") {
            HEyear.innerHTML = parseInt(year.value) + 10000 + " HE";                    
        }
    }

    if (year.value == "") {
        HEyear.innerHTML = "insert an year";
    }

    if (year.value.match(/\D+/i)) {
        HEyear.innerHTML = "years have only numbers";
    }

});
