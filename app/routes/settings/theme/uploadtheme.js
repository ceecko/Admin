import AuthenticatedRoute from 'ghost-admin/routes/authenticated';
import {inject as service} from '@ember/service';

export default class UploadthemeRouter extends AuthenticatedRoute {
    @service limit;

    limitErrorMessage = null

    async model() {
        this.limit.limiter.errorIfWouldGoOverLimit('customThemes')
            .then(() => {
                this.limitErrorMessage = null;
            })
            .catch((error) => {
                if (error.errorType === 'HostLimitError') {
                    this.limitErrorMessage = error.message;
                }

                throw error;
            });

        return this.store.findAll('theme');
    }

    setupController(controller, model) {
        controller.set('themes', model);
        controller.set('limitErrorMessage', this.limitErrorMessage);
    }

    actions = {
        cancel() {
            this.transitionTo('settings.theme');
        }
    }
}
