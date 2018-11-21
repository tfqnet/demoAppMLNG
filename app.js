/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'demoApp.Application',

    name: 'demoApp',

    requires: [
        // This will automatically load all classes in the demoApp namespace
        // so that application classes do not need to require each other.
        'demoApp.*'
    ],

    // The name of the initial view to create.
    mainView: 'demoApp.view.main.Main'
});
