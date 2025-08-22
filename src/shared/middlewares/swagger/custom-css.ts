import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

export function customCss() {
  const customThemeCss: string = new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DRACULA);
  const additionalCss = /*css*/ `
    :root {
      --all-bg-color: #202329;
      --get-method-color: #0077FB;
      --post-method-color: #00C853;
      --put-method-color: #FF833A;
      --delete-method-color: #FF0F00;
      --block-border-radius: 16px;
      --primary-text-color: #EDEFF2;
    }
    .swagger-ui h2 {
      color: lightgrey;
    }
    .swagger-ui .examples-select__section-label {
      color: orange;
    }
    .swagger-ui .example__section-header {
      color: orange;
    }
    .swagger-ui .opblock .opblock-section-header h4 {
      color: orange;
    }
    .swagger-ui .operation-servers h4.message {
      color: lightgrey;
    }
    .swagger-ui .responses-inner h4, .swagger-ui .responses-inner h5 {
      color: orange;
    }
    .swagger-ui input[type="text"], .swagger-ui textarea {
      background-color: #3e4349;
      outline: none !important;
      border: none !important;
    }
    .swagger-ui input[type="text"]::placeholder, .swagger-ui textarea::placeholder {
      color: lightgrey;
    }
    .swagger-ui input[type=text].invalid {
      color: black;
    }
    .swagger-ui .examples-select .examples-select-element:focus-visible,
    .swagger-ui .servers>label select:focus-visible {
      outline: none;
    }
    .swagger-ui .examples-select .examples-select-element:hover,
    .swagger-ui .servers>label select:hover {
      cursor: pointer;
    }
    .swagger-ui .opblock-tag:hover .nostyle {
      color: orange;
    }
    .opblock-summary {
      border: none !important;
    }
    .swagger-ui .opblock .opblock-summary:hover .opblock-summary-path .nostyle {
      color: orange;
    }
    .swagger-ui .opblock-body pre.microlight {
      background-color: #31363F !important;
    }
    .swagger-ui .info .title small pre {
      color: black;
    }
    .swagger-ui section h3 {
      color: lightgrey;
    }
  `;
  return `${customThemeCss}\n${additionalCss}`;
}
