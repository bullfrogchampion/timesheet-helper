/**
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 */
var TasksModel = function() {

    // Quick check if localStorage is enabled
    this.canUseLocalStorage = (function() {
        try {
            localStorage.setItem('t', '');
            localStorage.removeItem('t');

            return true;
        } catch (e) {
            return false;
        }
    })();

    this.data = [];

    if (this.canUseLocalStorage && localStorage.getItem('time_data') !== null) {
        this.data = JSON.parse(localStorage.getItem('time_data'));
    } else {
        this.data.tasks = [];
        this.data.currentTask = false;
    }

    this.nextTask = ko.observable('');
    this.tasks = ko.observableArray(this.data.tasks);
    this.currentTask = ko.observable(this.data.currentTask);

    delete(this.data);

    this.addTask = function() {
        if (this.nextTask() != "") {
            if (this.currentTask()) {
                var task = this.currentTask();
                task.end = new Date().getTime();
                task.time = this.formatTime(task.end - task.start);

                this.tasks.push(task);
            }

            this.currentTask({
                number: this.tasks().length + 1,
                description: this.nextTask(),
                start: new Date().getTime()
            });

            this.nextTask("");

            this.saveData();
        }
    }.bind(this);

    this.clearTasks = function() {
        this.tasks([]);
        this.currentTask(false);

        this.saveData();
    }.bind(this);

    this.saveData = function() {
        // save data using localStorage, if available
        if (this.canUseLocalStorage) {
            var json = ko.toJS(this);

            // save some space in localStorage
            delete(json.canUseLocalStorage);
            delete(json.nextTask);

            localStorage.setItem('time_data', JSON.stringify(json));
        }
    };

    this.formatTime = function(timestamp) {
        var seconds = timestamp / 1000;
        if (seconds < 60) {
            seconds = Math.ceil(seconds);
            return seconds + " secs";
        }

        var minutes = seconds / 60;
        if (minutes < 60) {
            minutes = Math.ceil(minutes);
            return minutes + " mins";
        }

        var hours = minutes / 60;
        minutes = (hours - Math.floor(hours)) * 60;

        return Math.floor(hours) + ":" + Math.round(minutes);
    }.bind(this);
};

ko.applyBindings(new TasksModel());
