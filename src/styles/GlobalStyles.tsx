import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: 'Gotham Pro';
        src: url('./fonts/gothampro.ttf');
    }

    body {
        margin: 0;
        padding: 0;

        min-width: 320px;
        min-height: 100vh;

        background: #353638;
    }

    * {
        box-sizing: border-box;

        font-family: 'Gotham Pro';
        font-style: normal;
        font-weight: 400;
    }
`;
