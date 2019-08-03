import styled from 'styled-components';



export const StyledOptions = styled.div`
    html {
        margin: auto;
        width: 500px;
    }

    html, body {
        padding: 5px;
    }

    hr {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .container {
        width: 100%;
    }

    h1 {
        font-size: 16px;
        line-height: 130%;
        padding: 5px 0;
        margin: 0;
    }

    .OptionsField {
        padding-bottom: 15px;
        font-size: 12px;
        line-height: 200%;
    }

    .OptionsField label {
        padding-left: 5px;
    }

    .TopTextField p {
        margin-top: 0px;
        text-align: justify;
    }

    .BottomTextField {
        padding-top: 5px;
    }

    .spanDefault {
        color: hsl(240, 30%, 70%);
    }

    fieldset {
        border: none;
        margin: 0;
        padding: 0;
    }

    p {
        line-height: 150%;
        margin-bottom: 5px;
        font-size: 12px;
    }

    a {
        color: hsl(240, 40%, 85%);
    }

    a:link {
        text-decoration: none;
        font-style: italic;
    }

    a:hover {
        text-decoration: underline;
    }

    .button {
        margin-top: 5px;
        margin-bottom: 5px;
        border: none;
        width: 100%;
        padding: 7px;
        font-size: 12px;
    }

    #status-save,
    #status-default {
        text-align: center;
    }
`;
