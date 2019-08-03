import * as React from 'react';

import {
    StyledOptions,
} from './styled';



const Options: React.FC<any> = (properties) => {
    // chrome.runtime.sendMessage({greeting: "hello"}, function(response: any) {
    //     console.log(response.farewell);
    // });

    return (
        <StyledOptions>
            <div className="container">
                <div className="TopTextField">
                    <p>
                        Add the Holocene Epoch Timestamp before or after the timestamps read from the webpage (or replace them).
                    </p>

                    <p>
                        The Holocene Epoch sets the first year of the "recent" epoch 10,000 years before the first Anno Domini (1 AD) for a better grasping of the development of the human civilization. The proposal was advanced by Cesare Emiliani in 1993 (see more in the What is the Holocene Epoch? section below).
                    </p>

                    <p>
                        e.g.
                        <br/>
                        "1 Aug. 2019" can become "1 Aug. 2019 [12019 <a href="https://en.wikipedia.org/wiki/Holocene_calendar">HE</a>]";
                        <br />
                        "399 BC" can become "<i>/9602 HE/</i> 399 BC";
                        <br />
                        "10 Sep. 259 BC" can become "10 Sep. 9742 HE".
                    </p>
                </div>

                <hr />

                <form action="Options" id="OptionsForm">
                    <div className="OptionsField">
                        <h1>The Holocene Epoch Timestamp is</h1>

                        <fieldset id="activeOptionsForm">
                            <input type="radio" name="activeOptionsForm" value="onWiki" id="onWiki" />
                            <label htmlFor="onWiki">
                                active on Wikipedia. <span className="spanDefault">[default]</span>
                            </label>

                            <br />

                            <input type="radio" name="activeOptionsForm" value="onSite" id="onSite" />
                            <label htmlFor="onSite">active on every site.</label>

                            <br />

                            <input type="radio" name="activeOptionsForm" value="off" id="off" />
                            <label htmlFor="off">off.</label>
                            <br />
                        </fieldset>
                    </div>

                    <div className="OptionsField">
                        <h1>Insert the Holocene Epoch Timestamps</h1>

                        <fieldset id="insertBeforeAfterForm">
                            <input type="radio" name="insertBeforeAfterForm" value="after" id="after" />
                            <label htmlFor="after">
                                after the webpage timestamps. <span className="spanDefault">[default]</span>
                            </label>

                            <br />

                            <input type="radio" name="insertBeforeAfterForm" value="before" id="before" />
                            <label htmlFor="before">before the webpage timestamps.</label>

                            <br />
                        </fieldset>
                    </div>

                    <div className="OptionsField">
                        <h1>Insert the Holocene Epoch Timestamp between</h1>

                        <fieldset id="insertBetweenForm">
                            <input type="radio" name="insertBetweenForm" value="brackets" id="brackets" />
                            <label htmlFor="brackets">
                                [ ]. <span className="spanDefault">[default]</span>
                            </label>

                            <br/>

                            <input type="radio" name="insertBetweenForm" value="accolades" id="accolades" />
                            <label htmlFor="accolades">{ }.</label>

                            <br/>

                            <input type="radio" name="insertBetweenForm" value="slashes" id="slashes" />
                            <label htmlFor="slashes">/ /.</label>

                            <br />

                            <input type="radio" name="insertBetweenForm" value="nothing" id="nothing" />
                            <label htmlFor="nothing">nothing.</label>

                            <br />
                        </fieldset>
                    </div>

                    <div className="OptionsField">
                        <h1>Style of the Holocene Epoch Timestamp is</h1>

                        <fieldset id="holoceneStyleForm">
                            <input type="radio" name="holoceneStyleForm" value="regular" id="regular" />
                            <label htmlFor="regular">
                                regular. <span className="spanDefault">[default]</span>
                            </label>

                            <br />

                            <input type="radio" name="holoceneStyleForm" value="italic" id="italic" />
                            <label htmlFor="italic">italic.</label>

                            <br />
                        </fieldset>
                    </div>

                    <div className="OptionsField">
                        <h1>Make HE be a link to the <a href="https://en.wikipedia.org/wiki/Holocene_calendar">Holocene Calendar</a> Wikipedia Page?</h1>

                        <fieldset id="holoceneAnchorTag">
                            <input type="radio" name="holoceneAnchorTag" value="yesAnchor" id="yesAnchor" />
                            <label htmlFor="yesAnchor">
                                Yes. <span className="spanDefault">[default]</span>
                            </label>

                            <br />
                            <input type="radio" name="holoceneAnchorTag" value="noAnchor" id="noAnchor" />
                            <label htmlFor="noAnchor">No.</label>

                            <br />
                        </fieldset>
                    </div>

                    <div className="OptionsField">
                        <h1>Remove the HE accompanying the timestamp?</h1>

                        <fieldset id="holoceneHeRemove">
                            <input type="radio" name="holoceneHeRemove" value="noRemove" id="noRemove" />
                            <label htmlFor="noRemove">
                                No. <span className="spanDefault">[default]</span>
                            </label>

                            <br />

                            <input type="radio" name="holoceneHeRemove" value="yesRemove" id="yesRemove" />
                            <label htmlFor="yesRemove">Yes.</label>

                            <br />
                        </fieldset>
                    </div>

                    <div className="OptionsField">
                        <h1>Replace the webpage timestamps with the Holocene Epoch Timestamps?</h1>

                        <fieldset id="holoceneReplaceForm">
                            <input type="radio" name="holoceneReplaceForm" value="noReplace" id="noReplace" />
                            <label htmlFor="noReplace">
                                No. <span className="spanDefault">[default]</span>
                            </label>

                            <br />

                            <input type="radio" name="holoceneReplaceForm" value="yesReplace" id="yesReplace" />
                            <label htmlFor="yesReplace">
                                Yes.
                            </label>

                            <br />
                        </fieldset>
                    </div>
                </form>

                <div id="status-save">
                </div>

                <button type="reset" className="button" id="btn-save" form="OptionsForm">
                    Save Options
                </button>

                <button type="reset" className="button" id="btn-reset" form="OptionsForm">
                    Reset to Default
                </button>

                <div id="status-default">
                </div>

                <hr />

                <div className="BottomTextField">
                    <h1>What is the Holocene Epoch?</h1>
                    <p>
                        <a href="https://en.wikipedia.org/wiki/Holocene" target="_blank">
                            Holocene Epoch Wiki
                        </a>
                    </p>

                    <p>
                        <a href="https://en.wikipedia.org/wiki/Holocene_calendar" target="_blank">
                            Holocene Calendar Wiki
                        </a>
                    </p>

                    <p>
                        <a href="emiliani/emilianisproposal.pdf" target="_blank">
                            Emiliani’s Proposal
                        </a>
                    </p>

                    <p>
                        <a href="https://www.youtube.com/watch?v=czgOWmtGVGs" target="_blank">
                            Kurzgesagt’s Summary
                        </a>
                    </p>
                </div>
            </div>
        </StyledOptions>
    );
}


export default Options;
