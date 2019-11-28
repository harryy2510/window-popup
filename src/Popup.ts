import './popup.css';

const getWindowSpecs = (invisible: boolean) => {
  const width = invisible ? 1 : 0.6 * window.outerWidth;
  const left = invisible ? 1 : 0.2 * window.outerWidth;
  const height = invisible ? 1 : 0.6 * window.outerHeight;
  const top = invisible ? 1 : 0.2 * window.outerHeight;
  return {
    height,
    left,
    status: 0,
    titlebar: 0,
    top,
    width
  };
};
const getLoadingElement = (message: string): HTMLElement => {
  const container = document.createElement('div');
  container.classList.add('window-loader');
  container.id = 'window-loader';
  const msg = document.createElement('div');
  msg.classList.add('window-loader-message');
  msg.innerHTML = message;
  container.appendChild(msg);
  return container;
};

export default class Popup {
  private message: string = 'Please wait...';
  private target: string = 'Ratting';
  private invisible: boolean = false;
  private url: string = 'about:blank';
  private popup: Window | null | undefined;
  private timer: any;

  constructor(params?: { target?: string, invisible?: boolean, url?: string, message?: string }) {
    if (params) {
      if (typeof params.invisible !== 'undefined') {
        this.invisible = params.invisible;
      }
      if (typeof params.target !== 'undefined') {
        this.target = params.target;
      }
      if (typeof params.url !== 'undefined') {
        this.url = params.url;
      }
      if (typeof params.message !== 'undefined') {
        this.message = params.message;
      }
    }
  }

  public onClose: () => void = () => undefined;

  public open(url?: string | null, message?: string | null, invisible?: boolean | null): Window {
    if (typeof url !== 'undefined' && url !== null) {
      this.url = url;
    }
    if (typeof invisible !== 'undefined' && invisible !== null) {
      this.invisible = invisible;
    }
    if (typeof message !== 'undefined' && message !== null) {
      this.message = message;
    }
    const specs = getWindowSpecs(this.invisible);
    const specsString = `width=${specs.width},height=${specs.height},left=${specs.left},top=${specs.top},status=${specs.status},titlebar=${specs.titlebar}`;
    this.popup = window.open(this.url || 'about:blank', this.target, specsString);
    this.popup!.moveTo(specs.left, specs.top);
    this.popup!.resizeTo(specs.width, specs.height);
    this.callback();
    return this.popup!;
  }

  private callback(): void {
    this.setLoading();
    this.timer = setInterval(() => {
      if (!this.popup || this.popup.closed) {
        clearInterval(this.timer);
        this.clearLoading();
        this.onClose();
      }
    }, 500);
  }

  private setLoading(): void {
    let el = document.getElementById('window-loader');
    if (!el) {
      el = getLoadingElement(this.message);
      document.body.appendChild(el);
    }
    setTimeout(() => {
      if (el) {
        el.classList.add('window-loader-visible');
      }
    }, 10);
  }

  private clearLoading(): void {
    const el = document.getElementById('window-loader');
    if (el) {
      el.classList.remove('window-loader-visible');
      setTimeout(() => {
        if (el) {
          el.remove();
        }
      }, 150);
    }
  }
};

