import { LightningElement } from 'lwc';
import submitMessage from '@salesforce/apex/PortfolioContactController.submitMessage';
import ERROR_MESSAGE from '@salesforce/label/c.Portfolio_Contact_Error';
import { profile, contact } from 'c/portfolioData';
import { isEmail } from 'c/portfolioUtils';

export default class PortfolioContact extends LightningElement {
    intro = contact.intro;
    githubUrl = profile.githubUrl;
    linkedinUrl = profile.linkedinUrl;
    emailText = profile.email;

    senderName = '';
    senderEmail = '';
    subject = '';
    message = '';
    website = ''; // honeypot, hidden from people
    isSubmitting = false;
    status;

    get hasEmail() {
        return isEmail(profile.email);
    }

    get emailHref() {
        return this.hasEmail ? `mailto:${profile.email.trim()}` : null;
    }

    get submitLabel() {
        return this.isSubmitting ? 'Sending…' : 'Send message';
    }

    get statusClass() {
        return this.status && this.status.success ? 'status success' : 'status error';
    }

    handleInput(event) {
        const { name, value } = event.target;
        this[name] = value;
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.isSubmitting) {
            return;
        }
        this.status = undefined;
        this.isSubmitting = true;
        try {
            const result = await submitMessage({
                senderName: this.senderName,
                senderEmail: this.senderEmail,
                subject: this.subject,
                message: this.message,
                website: this.website
            });
            this.status = { success: result.success, message: result.message };
            if (result.success) {
                this.resetForm();
            }
        } catch (error) {
            this.status = { success: false, message: ERROR_MESSAGE };
        } finally {
            this.isSubmitting = false;
        }
    }

    resetForm() {
        this.senderName = '';
        this.senderEmail = '';
        this.subject = '';
        this.message = '';
        this.website = '';
        const form = this.template.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}
