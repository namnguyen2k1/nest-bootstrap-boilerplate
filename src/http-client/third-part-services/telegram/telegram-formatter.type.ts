export enum TELEGRAM_PARSE_MODE {
  MARKDOWN_V2 = "markdownv2",
  MARKDOWN = "markdown",
  HTML = "html",
}

export type FormatterFn = (
  text: string,
  config?: { language?: string; url?: string; title?: string },
) => string;

type LinkOptions = { url: string };
type CodeBlockOptions = { language?: string };

export const telegramFormatter: Record<
  TELEGRAM_PARSE_MODE,
  {
    bold: (t: string) => string;
    italic: (t: string) => string;
    underline: (t: string) => string;
    strikethrough: (t: string) => string;
    spoiler: (t: string) => string;
    link: (t: string, opt: LinkOptions) => string;
    code: (t: string) => string;
    codeBlock: (t: string, opt?: CodeBlockOptions) => string;
  }
> = {
  [TELEGRAM_PARSE_MODE.MARKDOWN_V2]: {
    bold: (t) => t,
    italic: (t) => t,
    underline: (t) => t,
    strikethrough: (t) => `~${t}~`,
    spoiler: (t) => `||${t}||`,
    link: (t, { url }) => `[${t}](${url})`,
    code: (t) => `\`${t}\``,
    codeBlock: (t, { language = "python" } = {}) => `\`\`\`${language}\n${t}\`\`\``,
  },
  [TELEGRAM_PARSE_MODE.MARKDOWN]: {
    bold: (t) => `*${t}*`,
    italic: (t) => `_${t}_`,
    underline: (t) => t,
    strikethrough: (t) => t,
    spoiler: (t) => t,
    link: (t, { url }) => `[${t}](${url})`,
    code: (t) => `\`${t}\``,
    codeBlock: (t, { language = "python" } = {}) => `\`\`\`${language}\n${t}\`\`\``,
  },
  [TELEGRAM_PARSE_MODE.HTML]: {
    bold: (t) => `<b>${t}</b>`,
    italic: (t) => `<i>${t}</i>`,
    underline: (t) => `<u>${t}</u>`,
    strikethrough: (t) => `<s>${t}</s>`,
    spoiler: (t) => `<span class="tg-spoiler">${t}</span>`,
    link: (t, { url }) => `<a href="${url}">${t}</a>`,
    code: (t) => `<code>${t}</code>`,
    codeBlock: (t, { language = "python" } = {}) =>
      `<pre><code class="language-${language}">${t}</code></pre>`,
  },
};
