import * as React from 'react';

import {
    StyledPopup,
} from './styled';



const Popup: React.FC<any> = (properties) => {
    // const openOptions = () => {
    //     chrome.runtime.openOptionsPage();
    // }

    // chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {
    //         console.log(request);

    //         console.log(sender.tab ?
    //                     "from a content script:" + sender.tab.url :
    //                     "from the extension");
    //         if (request.greeting == "hello") {
    //             sendResponse({farewell: "goodbye"});
    //         }
    //     }
    // );

    return (
        <StyledPopup>
            <div id="extTitle">
                <h1 id="popupTitle">The Holocene Epoch is active</h1>
            </div>

            <div id="form">
                <fieldset id="extensionActive">
                    <input type="radio" name="activation" value="extensionOnWiki" id="extensionOnWiki" />
                    <span className="radioButton" id="radioButtonOnWiki"></span>
                    <label htmlFor="extensionOnWiki">on Wikipedia</label>

                    <br />

                    <input type="radio" name="activation" value="extensionOnSite" id="extensionOnSite" />
                    <span className="radioButton" id="radioButtonOnSite" />
                    <label htmlFor="extensionOnSite">on every site</label>

                    <br />

                    <input type="radio" name="activation" value="extensionOff" id="extensionOff" />
                    <span className="radioButton" id="radioButtonOff" />
                    <label htmlFor="extensionOff">off</label>

                    <br/>
                </fieldset>
            </div>

            <div id="underForm">
                <table id="underFormTable">
                    <tbody>
                        <tr>
                            <td className="leftTable">2019</td>
                            <td className="centerTable">becomes</td>
                            <td className="rightTable"><span id="firstHE"></span></td>
                        </tr>
                        <tr>
                            <td className="leftTable">399 BC</td>
                            <td className="centerTable">becomes</td>
                            <td className="rightTable"><span id="secondHE"></span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="adjustOptions">
                <p>adjust from options</p>
            </div>
        </StyledPopup>
    );
}


export default Popup;
