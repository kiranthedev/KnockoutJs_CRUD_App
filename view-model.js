
function init() {
    $.get("http://localhost:8080/users", function (data) {
        var admin = new AdminDashboard(data);
        ko.applyBindings(admin, $('.container')[0]);
    });
};

function User(data) {
    ko.mapping.fromJS(data, {
        'services': {
            create: function (options) {
                return new Service(options.data);
            }
        }
    }, this);
    this.edit = ko.observable(false);

}

function Service(data) {
    ko.mapping.fromJS(data, {}, this);
    this.edit = ko.observable(false);
    this.startEdit = function (data, event) {
        if (data.stopping) {
            clearTimeout(data.stopping);
        }
        data.edit(true);

        var element = event.target;
        switch (element.tagName) {
            case "SPAN":
                $(element).next().focus();
                break;
            case "INPUT":
                $(element).focus();
                break;
        }
    };
    this.stopEdit = function (data) {
        data.stopping = setTimeout(function () {
            data.edit(false);
        }, 200);
    }
}

function AdminDashboard(user) {
    this.user = ko.mapping.fromJS(user, {
        create: function (options) {
            return new User(options.data);
        }
    });

    this.selected = ko.observable(false);

    this.setSelected = function (user) {
        this.selected(user);
    };

    this.add = function () {
        var user = {
            name: ko.observable(''),
            emailAddress: ko.observable(''),
            age: ko.observable(0),
            bio: ko.observable('new User'),
            edit: ko.observable(true),
            services: ko.observableArray()
        };
        this.user.push(user);

    };

    this.delete = function (index) {
        this.user.splice(index(), 1);
        this.selected(false);
    };

    this.toggleEdit = function (user, edit) {
        user.edit(edit);
    }
    this.save = function () {
        $.ajax("http://localhost:8080/users", {
            data: ko.toJSON(this.user),
            type: "POST",
            contentType: "application/json",
            success: function (result) {
                toastr["success"]("Data saved successfully");
            }
        });
    }
};

ko.components.register('service-credits', {
    template: {
        element: 'service-credits-template'
    },
    viewModel: function (params) {
        this.user = params.user;
        this.serviceNames = ['Knockout template', 'Image App', 'Ui specific App'];
        this.addService = function () {
            console.log('Add Service');
            if (!this.user().services) {
                this.user().services = ko.observableArray();
            }
            this.user().services.push(new Service({
                "name": "",
                "credit": "1"
            }));
        };
    }
});
init();
