define(['plugins/dialog', 'knockout', '../config/helper'], function (dialog, ko, helper, validator, cookie) {

    var CustomModal = function () {
        this.name = ko.observable('');
        this.email = ko.observable('');
    };

    CustomModal.prototype.optout = function () {
        $.cookie('app', 'TAMIS', { expires: 60, path: '/' });
        dialog.close(this, this.email());
    };

    CustomModal.prototype.binding = function (view) {
        this.dialog = dialog;
        var that = this;
        this.form = $('#signupform').bootstrapValidator({
            onError: function(e) {
                console.log('bah');
            },
            onSuccess: function(e) {
                $.cookie('app', 'TAMIS', { expires: 60, path: '/' });
                $.cookie('name', that.name(), { expires: 60, path: '/' });
                that.dialog.close(that, that.email());
            },
            live: 'disabled',
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                name: {
                    message: 'The username is not valid',
                    validators: {
                        notEmpty: {
                            message: 'Name is required and cannot be empty'
                        },
                        stringLength: {
                            min: 3,
                            max: 30,
                            message: 'Name must be more than 2 and less than 30 characters long'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_ ]+$/,
                            message: 'The username can only consist of alphabetical, number and underscore'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: 'The email is required and cannot be empty'
                        },
                        emailAddress: {
                            message: 'The input is not a valid email address'
                        }
                    }
                }
            }
        })
    }

    CustomModal.show = function () {
        return dialog.show(new CustomModal());
    };

    return CustomModal;
});