import { createElement } from 'lwc';
import PortfolioContact from 'c/portfolioContact';
import submitMessage from '@salesforce/apex/PortfolioContactController.submitMessage';

jest.mock(
    '@salesforce/apex/PortfolioContactController.submitMessage',
    () => ({ default: jest.fn() }),
    { virtual: true }
);

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

function fill(root, name, value) {
    const field = root.querySelector(`[name="${name}"]`);
    field.value = value;
    field.dispatchEvent(new CustomEvent('input'));
}

describe('c-portfolio-contact', () => {
    let element;

    beforeEach(() => {
        element = createElement('c-portfolio-contact', { is: PortfolioContact });
        document.body.appendChild(element);
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('shows the email placeholder as plain text, not a mailto link', () => {
        const root = element.shadowRoot;
        expect(root.querySelector('a[href^="mailto:"]')).toBeNull();
        expect(root.querySelector('.channel .placeholder')).not.toBeNull();
    });

    it('sends all fields (including the honeypot) to Apex and shows success', async () => {
        submitMessage.mockResolvedValue({ success: true, message: 'Thanks!' });
        const root = element.shadowRoot;
        fill(root, 'senderName', 'Ada');
        fill(root, 'senderEmail', 'ada@example.com');
        fill(root, 'subject', 'Hello');
        fill(root, 'message', 'Nice site');

        root.querySelector('form').dispatchEvent(new CustomEvent('submit'));
        await flushPromises();

        expect(submitMessage).toHaveBeenCalledWith({
            senderName: 'Ada',
            senderEmail: 'ada@example.com',
            subject: 'Hello',
            message: 'Nice site',
            website: ''
        });
        const status = root.querySelector('.status');
        expect(status.textContent).toBe('Thanks!');
        expect(status.classList.contains('success')).toBe(true);
    });

    it('shows the server validation message on failure', async () => {
        submitMessage.mockResolvedValue({ success: false, message: 'Please enter a valid email address.' });
        const root = element.shadowRoot;
        root.querySelector('form').dispatchEvent(new CustomEvent('submit'));
        await flushPromises();
        const status = root.querySelector('.status');
        expect(status.textContent).toBe('Please enter a valid email address.');
        expect(status.classList.contains('error')).toBe(true);
    });

    it('shows a generic error when the Apex call throws, and re-enables the button', async () => {
        submitMessage.mockRejectedValue(new Error('boom'));
        const root = element.shadowRoot;
        root.querySelector('form').dispatchEvent(new CustomEvent('submit'));
        await flushPromises();
        expect(root.querySelector('.status.error')).not.toBeNull();
        expect(root.querySelector('button[type="submit"]').disabled).toBe(false);
    });
});
