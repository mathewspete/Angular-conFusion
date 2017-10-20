import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('link');
  }

  getParagraphText() {
    return element(by.css(selector)).getText();
  }
}
