
const { chromium, firefox, webkit, devices } = require('playwright');
const helpers = require('./lib/helpers');

// Extra headers from environment variables (if configured)
const __extraHeaders = helpers.getExtraHeadersFromEnv();

/**
 * Utility to merge environment headers into context options.
 * Use when creating contexts with raw Playwright API instead of helpers.createContext().
 * @param {Object} options - Context options
 * @returns {Object} Options with extraHTTPHeaders merged in
 */
function getContextOptionsWithHeaders(options = {}) {
  if (!__extraHeaders) return options;
  return {
    ...options,
    extraHTTPHeaders: {
      ...__extraHeaders,
      ...(options.extraHTTPHeaders || {})
    }
  };
}

(async () => {
  try {
    const browser=await chromium.launch({headless:false}); const page=await browser.newPage({viewport:{width:1600,height:980}}); await page.goto('https://www.kdocs.cn/l/cdfDZTmSxxw2',{waitUntil:'commit',timeout:120000}); await page.waitForTimeout(5000); const info=await page.evaluate(()=>{ const nodes=[...document.querySelectorAll('button,[role=button],div,span,a')].filter(el=>/修订|上一条|下一条|审阅|立即登录/.test((el.innerText||'').trim())).slice(0,60).map(el=>({text:(el.innerText||'').trim().replace(/\s+/g,' '), cls:el.className||'', disabled:!!el.disabled, aria:el.getAttribute('aria-disabled')})); return {title:document.title, url:location.href, nodes};}); console.log(JSON.stringify(info,null,2)); await browser.close();
  } catch (error) {
    console.error('❌ Automation error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
})();
