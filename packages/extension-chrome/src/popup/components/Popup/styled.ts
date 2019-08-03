import styled from 'styled-components';



export const StyledPopup = styled.div`
    h1 {
        font-size: 14px;
        font-weight: 400;
    }


    /* Title */
    #extTitle {
        text-align:center;
        padding: 0;
        margin: 15px 0px;
        margin-top: 20px;
    }


    /* Form */
    #form {
        text-align:center;
        margin: 10px 0px;
    }

    fieldset {
        border: none;
        margin: 0;
        padding: 0;
    }

    #extensionActive {
        margin: 0 auto;
        margin-top: 20px;
        margin-left: 109px;
        text-align: left;
    }

    #extensionActive input {
        margin-bottom: 7px;
    }

    label {
        position: absolute;
    }


    /* Underform */
    #underForm {
        color: hsl(0, 0%, 85%);
        line-height: 1;
        margin-top: 10px;
    }

    #underForm a {
        color: hsl(0, 0%, 85%);
        text-decoration: none;
    }

    #underForm a:hover {
        color: hsl(0, 0%, 65%);
    }

    #underFormTable {
        margin: 0 auto;
        margin-left: 83px;
    }

    .leftTable {
        text-align: right;
    }

    .rightTable {
        text-align: left;
    }


    /* Options */
    #adjustOptions {
        text-align: center;
        position: fixed;
        margin-left: 7px;
        bottom: 0;
        width: 100%;
    }

    #adjustOptions:hover {
        cursor: pointer;
        color: hsl(0, 0%, 65%);
    }


    /* Radio Buttons */
    input[type=checkbox]:not(old),
    input[type=radio]:not(old){
    opacity: 0;
    }

    .radioButton {
        display : inline-block;
        width: 0.875em;
        height: 0.875em;
        background: linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%);
        border-radius: 0.5em;
        border: 1px solid hsla(230, 40%, 20%, 0.5);
        margin-right: 5px;
    }
`;
