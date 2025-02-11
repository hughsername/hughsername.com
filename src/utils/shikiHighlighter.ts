import * as shiki from 'shiki';

let highlighter: shiki.Highlighter | null = null;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await shiki.getHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['javascript']
    });
  }
  return highlighter;
}

export function disposeHighlighter() {
  if (highlighter) {
    highlighter.dispose();
    highlighter = null;
  }
}
